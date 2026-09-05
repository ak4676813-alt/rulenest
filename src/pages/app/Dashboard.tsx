import { useEffect, useMemo, useState, type ReactNode } from "react"
import { Link, useNavigate } from "react-router-dom"
import * as L from "leaflet"
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import {
  Activity as ActivityIcon,
  AlertTriangle,
  Building2,
  CalendarClock,
  ClipboardCheck,
  FileBarChart,
  FileText,
  Landmark,
  ListChecks,
  MapPin,
  Radar,
  type LucideIcon,
} from "lucide-react"
import AIAssistant from "../../components/AIAssistant"
import StatusBadge from "../../components/StatusBadge"
import Badge from "../../components/ui/Badge"
import Card from "../../components/ui/Card"
import HealthBar from "../../components/ui/HealthBar"
import { useData } from "../../context/DataContext"
import { cn, daysUntil, formatDate, relativeDeadline, timeAgo } from "../../lib/utils"
import type { ActivityItem, Property, RegulatoryChange } from "../../types"

/* Mini 3D icon tiles for list/table rows — hue, gradient and colored outer glow
   per activity type (see MiniTile). Rows stay calm: no float, just depth. */
const ACTIVITY_ICONS: Record<ActivityItem["type"], { icon: LucideIcon; tileClasses: string }> = {
  task: {
    icon: ListChecks,
    tileClasses: "from-indigo-400 via-indigo-500 to-indigo-600 shadow-[0_6px_16px_-4px_rgba(99,102,241,0.5)]",
  },
  document: {
    icon: FileText,
    tileClasses: "from-violet-400 via-purple-500 to-violet-600 shadow-[0_6px_16px_-4px_rgba(139,92,246,0.55)]",
  },
  inspection: {
    icon: ClipboardCheck,
    tileClasses: "from-teal-400 via-teal-500 to-cyan-600 shadow-[0_6px_16px_-4px_rgba(20,184,166,0.55)]",
  },
  regulation: {
    icon: Landmark,
    tileClasses: "from-blue-400 via-blue-500 to-blue-600 shadow-[0_6px_16px_-4px_rgba(59,130,246,0.5)]",
  },
  property: {
    icon: Building2,
    tileClasses: "from-slate-400 via-slate-500 to-slate-600 shadow-[0_6px_16px_-4px_rgba(100,116,139,0.45)]",
  },
  report: {
    icon: FileBarChart,
    tileClasses: "from-rose-400 via-pink-500 to-rose-600 shadow-[0_6px_16px_-4px_rgba(244,63,94,0.5)]",
  },
}

/* Small city → [lat, lng] lookup for the Portfolio Map pins. */
const CITY_COORDS: Record<string, [number, number]> = {
  "San Francisco": [37.77, -122.42],
  Boston: [42.36, -71.06],
  Chicago: [41.88, -87.63],
  Denver: [39.74, -104.99],
  Seattle: [47.61, -122.33],
  Islampur: [25.21, 85.9],
}
const FALLBACK_COORDS: [number, number] = [39.5, -98.35]

function coordsFor(property: Property): [number, number] {
  return CITY_COORDS[property.city] ?? FALLBACK_COORDS
}

/* Leaflet's default marker images are missing under bundlers; point them at the
   CDN copies so pins render correctly. */
const mapPinIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function deadlineTone(iso: string): string {
  const days = daysUntil(iso)
  if (days === null) return "text-gray-400"
  if (days < 0 || days <= 15) return "text-red-600"
  if (days <= 45) return "text-amber-600"
  return "text-gray-500"
}

/* Colored outer glow to match a property's `imageGradient` hue. */
function propertyGlow(gradient: string): string {
  if (gradient.includes("slate") || gradient.includes("gray"))
    return "shadow-[0_6px_16px_-4px_rgba(100,116,139,0.45)]"
  if (gradient.includes("violet") || gradient.includes("purple") || gradient.includes("fuchsia"))
    return "shadow-[0_6px_16px_-4px_rgba(139,92,246,0.55)]"
  if (gradient.includes("cyan") || gradient.includes("teal") || gradient.includes("sky"))
    return "shadow-[0_6px_16px_-4px_rgba(14,165,233,0.55)]"
  return "shadow-[0_6px_16px_-4px_rgba(59,130,246,0.5)]"
}

/* Gradient + glow for Upcoming Deadlines, keyed by urgency. */
function deadlineTile(iso: string): string {
  const days = daysUntil(iso)
  if (days === null)
    return "from-slate-400 via-slate-500 to-slate-600 shadow-[0_6px_16px_-4px_rgba(100,116,139,0.45)]"
  if (days < 0)
    return "from-red-400 via-red-500 to-orange-500 shadow-[0_6px_16px_-4px_rgba(239,68,68,0.55)]"
  if (days <= 15)
    return "from-amber-400 via-amber-500 to-orange-500 shadow-[0_6px_16px_-4px_rgba(245,158,11,0.55)]"
  return "from-emerald-400 via-emerald-500 to-teal-600 shadow-[0_6px_16px_-4px_rgba(16,185,129,0.5)]"
}

/* Gradient + glow for the Compliance Radar preview rows, keyed by severity. */
function radarSeverityTile(severity: RegulatoryChange["severity"]): string {
  if (severity === "critical" || severity === "high")
    return "from-red-400 via-red-500 to-rose-600 shadow-[0_6px_16px_-4px_rgba(239,68,68,0.55)]"
  if (severity === "medium")
    return "from-amber-400 via-amber-500 to-orange-500 shadow-[0_6px_16px_-4px_rgba(245,158,11,0.55)]"
  return "from-slate-400 via-slate-500 to-slate-600 shadow-[0_6px_16px_-4px_rgba(100,116,139,0.45)]"
}

export default function Dashboard() {
  const { properties, requirements, tasks, documents, changes, activity } = useData()
  const navigate = useNavigate()

  const stats = useMemo(() => {
    const totalProperties = properties.length
    const cityCount = new Set(properties.map((p) => p.city)).size
    const portfolioHealth =
      totalProperties === 0
        ? 0
        : Math.round(properties.reduce((s, p) => s + p.healthScore, 0) / totalProperties)
    // Compliance Gap Scanner: requirements missing evidence or past due.
    const gapCount = requirements.filter(
      (r) => r.status === "missing-evidence" || r.status === "overdue",
    ).length
    const overdueTasks = tasks.filter(
      (t) => t.status !== "completed" && (daysUntil(t.dueDate) ?? 0) < 0,
    ).length
    const expiringSoon = documents.filter((d) => {
      const days = daysUntil(d.expiresAt)
      return days !== null && days >= 0 && days <= 60
    }).length
    return { totalProperties, cityCount, portfolioHealth, gapCount, overdueTasks, expiringSoon }
  }, [properties, requirements, tasks, documents])

  const overviewRows = properties.slice(0, 5)
  const unreadChanges = changes.filter((c) => !c.read)
  const radarItems = (unreadChanges.length > 0 ? unreadChanges : changes).slice(0, 3)
  const deadlines = useMemo(
    () =>
      tasks
        .filter((t) => t.status !== "completed")
        .sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate))
        .slice(0, 4),
    [tasks],
  )

  return (
    <div className="relative isolate">
      {/* Subtle radial/mesh backdrop behind the grid, shown through the frosted 3D cards */}
      <div aria-hidden="true" className="dashboard-mesh pointer-events-none absolute inset-0 -z-10" />

      <div className="space-y-6">
        {/* Header — the global "Add Property" button lives in the top bar */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Overview of your property compliance</p>
        </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Building2}
          tileClasses="from-sky-400 via-blue-500 to-indigo-600"
          glowClasses="shadow-[0_10px_25px_-5px_rgba(59,130,246,0.5)]"
          floatDelay="0s"
          label="Total Properties"
          count={stats.totalProperties}
          sub={`${stats.cityCount} Cities`}
        />
        <StatCard
          icon={ActivityIcon}
          tileClasses="from-emerald-400 via-green-500 to-teal-600"
          glowClasses="shadow-[0_10px_25px_-5px_rgba(16,185,129,0.5)]"
          floatDelay="0.4s"
          label="Compliance Health"
          count={stats.portfolioHealth}
          suffix={<span className="text-base font-medium text-gray-400">/100</span>}
          sub="↑ 7 points this month"
          subClasses="text-emerald-600"
        />
        <StatCard
          icon={AlertTriangle}
          tileClasses="from-amber-400 via-orange-500 to-red-500"
          glowClasses="shadow-[0_10px_25px_-5px_rgba(249,115,22,0.5)]"
          floatDelay="0.8s"
          label="Action Required"
          count={stats.gapCount}
          sub={`${stats.overdueTasks} Overdue`}
          subClasses={stats.overdueTasks > 0 ? "text-red-600" : "text-gray-400"}
        />
        <StatCard
          icon={FileText}
          tileClasses="from-fuchsia-400 via-purple-500 to-violet-600"
          glowClasses="shadow-[0_10px_25px_-5px_rgba(168,85,247,0.5)]"
          floatDelay="1.2s"
          label="Documents"
          count={documents.length}
          sub={`${stats.expiringSoon} Expiring Soon`}
          subClasses={stats.expiringSoon > 0 ? "text-amber-600" : "text-gray-400"}
        />
      </div>

      {/* Portfolio Map */}
      <Card
        className="card-3d"
        title="Portfolio Map"
        subtitle={`${properties.length} propert${properties.length === 1 ? "y" : "ies"} across ${
          stats.cityCount
        } cit${stats.cityCount === 1 ? "y" : "ies"}`}
      >
        <PortfolioMap properties={properties} />
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-5 lg:col-span-2">
          {/* Compliance Overview */}
          <Card
            className="card-3d"
            title="Compliance Overview"
            subtitle="Health across your portfolio"
            noPadding
            action={
              <Link
                to="/app/properties"
                className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
              >
                View All
              </Link>
            }
          >
            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                    <th className="px-6 py-3 font-medium">Property</th>
                    <th className="px-4 py-3 font-medium">City</th>
                    <th className="px-4 py-3 font-medium">Health Score</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {overviewRows.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => navigate(`/app/properties/${p.id}`)}
                      className="cursor-pointer border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50/70"
                    >
                      <td className="px-6 py-3.5">
                        <PropertyCell property={p} />
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">
                        {p.city}, {p.state}
                      </td>
                      <td className="px-4 py-3.5">
                        <HealthBar score={p.healthScore} />
                      </td>
                      <td className="px-6 py-3.5">
                        <StatusBadge status={p.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="divide-y divide-gray-100 md:hidden">
              {overviewRows.map((p) => (
                <Link
                  key={p.id}
                  to={`/app/properties/${p.id}`}
                  className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-gray-50"
                >
                  <MiniTile
                    icon={Building2}
                    tileClasses={cn(p.imageGradient, propertyGlow(p.imageGradient))}
                    size="h-10 w-10 rounded-xl"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{p.address}</p>
                    <p className="text-xs text-gray-500">
                      {p.city}, {p.state} · {p.units} unit{p.units === 1 ? "" : "s"}
                    </p>
                    <div className="mt-1.5">
                      <HealthBar score={p.healthScore} barWidth="w-24" />
                    </div>
                  </div>
                  <StatusBadge status={p.status} />
                </Link>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="card-3d" title="Recent Activity" noPadding>
            <ul className="divide-y divide-gray-50">
              {activity.slice(0, 6).map((item) => {
                const config = ACTIVITY_ICONS[item.type]
                return (
                  <li key={item.id} className="flex items-center gap-3.5 px-5 py-3.5 sm:px-6">
                    <MiniTile icon={config.icon} tileClasses={config.tileClasses} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{item.text}</p>
                      <p className="text-xs text-gray-400">{timeAgo(item.at)}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Compliance Radar */}
          <Card
            className="card-3d"
            title="Compliance Radar"
            noPadding
            action={
              <Link
                to="/app/compliance-radar"
                className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
              >
                View All
              </Link>
            }
          >
            <div className="p-5">
              <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-emerald-800">
                    {unreadChanges.length > 0 ? unreadChanges.length : radarItems.length} Regulatory{" "}
                    {(unreadChanges.length > 0 ? unreadChanges.length : radarItems.length) === 1
                      ? "Change"
                      : "Changes"}{" "}
                    Detected
                  </p>
                  <p className="text-xs text-emerald-600">
                    {unreadChanges.length > 0 ? "Since your last visit" : "Across your jurisdictions"}
                  </p>
                </div>
                <Radar className="h-5 w-5 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div className="mt-3 space-y-3">
                {radarItems.map((c) => (
                  <div key={c.id} className="rounded-xl border border-gray-100 p-4">
                    <div className="flex items-start gap-3">
                      <MiniTile
                        icon={MapPin}
                        tileClasses={radarSeverityTile(c.severity)}
                        size="mt-0.5 h-7 w-7 rounded-lg"
                        iconSize="h-3.5 w-3.5"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-900">{c.jurisdiction}</p>
                          {!c.read && <Badge variant="amber">New</Badge>}
                        </div>
                        <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{c.title}</p>
                        <p className="mt-1.5 text-xs font-medium text-red-600">
                          Affected: {c.affectedPropertyIds.length} propert
                          {c.affectedPropertyIds.length === 1 ? "y" : "ies"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Upcoming Deadlines */}
          <Card
            className="card-3d"
            title="Upcoming Deadlines"
            noPadding
            action={
              <Link
                to="/app/tasks"
                className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
              >
                View All
              </Link>
            }
          >
            <ul className="divide-y divide-gray-50">
              {deadlines.map((t) => {
                const property = properties.find((p) => p.id === t.propertyId)
                return (
                  <li key={t.id} className="flex items-center gap-3.5 px-5 py-3.5">
                    <MiniTile icon={CalendarClock} tileClasses={deadlineTile(t.dueDate)} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{t.title}</p>
                      <p className="truncate text-xs text-gray-400">
                        {property ? `${property.address}, ${property.city}` : "General"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={cn("text-xs font-semibold", deadlineTone(t.dueDate))}>
                        {relativeDeadline(t.dueDate)}
                      </p>
                      <p className="text-[11px] text-gray-400">{formatDate(t.dueDate)}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </Card>

          {/* Ask My Property */}
          <AIAssistant />
        </div>
      </div>

      </div>
    </div>
  )
}

/* ------------------------------ Subcomponents ---------------------------- */

/** Ease-out count-up for the stat numbers (~800ms, requestAnimationFrame). */
function useCountUp(target: number, duration = 800): number {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic
      setValue(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return value
}

/* Handcrafted 3D icon tile — layered gradient, glass shine, inner bottom
   shadow, tilt + hover lift. The outer span carries the gentle float while
   the inner span owns the rotate/scale so the two transforms compose. */
function IconTile({
  icon: Icon,
  tileClasses,
  glowClasses,
  floatDelay,
}: {
  icon: LucideIcon
  tileClasses: string
  glowClasses: string
  floatDelay: string
}) {
  return (
    <span className="icon-tile shrink-0" style={{ animationDelay: floatDelay }}>
      <span
        className={cn(
          "relative flex h-14 w-14 rotate-[-3deg] items-center justify-center rounded-2xl bg-gradient-to-br text-white",
          "transition-transform duration-300 ease-out group-hover:rotate-0 group-hover:scale-110",
          tileClasses,
          glowClasses,
        )}
      >
        {/* Glass shine — blurred highlight along the top edge */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-1 top-1 h-2.5 rounded-full bg-gradient-to-b from-white/40 via-white/15 to-transparent blur-[3px]"
        />
        {/* Bottom inner shadow for depth */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-3.5 rounded-b-2xl bg-gradient-to-t from-black/30 to-transparent"
        />
        {/* Tiny handcrafted sparkle dot at the top-right */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-1 top-1 h-1 w-1 rounded-full bg-white/70 blur-[1px]"
        />
        <Icon
          className="relative h-6 w-6 drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </span>
    </span>
  )
}

/** Compact 3D icon tile for table/list rows — same handcrafted depth as the stat
    tiles (gradient, colored glow, glass shine, bottom inner shadow, sparkle) but
    smaller and calm: no float, just a subtle hover scale. */
function MiniTile({
  icon: Icon,
  tileClasses,
  size = "h-9 w-9 rounded-xl",
  iconSize = "h-4 w-4",
}: {
  icon: LucideIcon
  tileClasses: string
  size?: string
  iconSize?: string
}) {
  return (
    <span
      className={cn(
        "mini-tile relative flex shrink-0 items-center justify-center bg-gradient-to-br text-white",
        "transition-transform duration-300 ease-out hover:scale-105",
        size,
        tileClasses,
      )}
    >
      {/* Glass shine — blurred white highlight along the top edge */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0.5 top-0.5 h-1.5 rounded-full bg-gradient-to-b from-white/40 via-white/15 to-transparent blur-[2px]"
      />
      {/* Bottom inner shadow for depth */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2.5 rounded-b-[inherit] bg-gradient-to-t from-black/30 to-transparent"
      />
      {/* Tiny handcrafted sparkle dot at the top-right */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0.5 top-0.5 h-[3px] w-[3px] rounded-full bg-white/70 blur-[0.5px]"
      />
      <Icon
        className={cn("relative drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]", iconSize)}
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </span>
  )
}

function StatCard({
  icon: Icon,
  tileClasses,
  glowClasses,
  floatDelay,
  label,
  count,
  suffix,
  sub,
  subClasses,
}: {
  icon: LucideIcon
  tileClasses: string
  glowClasses: string
  floatDelay: string
  label: string
  count: number
  suffix?: ReactNode
  sub: string
  subClasses?: string
}) {
  const value = useCountUp(count)

  return (
    <div className="card-3d group h-full px-5 py-4 transition-all duration-300 hover:-translate-y-1 sm:px-6 sm:py-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {value.toLocaleString()}
            </span>
            {suffix}
          </p>
          <p className={cn("mt-1 text-xs", subClasses ?? "text-gray-400")}>{sub}</p>
        </div>
        <IconTile
          icon={Icon}
          tileClasses={tileClasses}
          glowClasses={glowClasses}
          floatDelay={floatDelay}
        />
      </div>
    </div>
  )
}

function PropertyCell({ property }: { property: Property }) {
  return (
    <div className="flex items-center gap-3">
      <MiniTile
        icon={Building2}
        tileClasses={cn(property.imageGradient, propertyGlow(property.imageGradient))}
        size="h-9 w-9 rounded-xl"
      />
      <div className="min-w-0">
        <p className="truncate font-medium text-gray-900">{property.address}</p>
        <p className="text-xs text-gray-400">
          {property.units} unit{property.units === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  )
}

/* ------------------------------ Portfolio Map ----------------------------- */

function FitBounds({ positions }: { positions: Array<[number, number]> }) {
  const map = useMap()
  useEffect(() => {
    if (positions.length === 0) return
    map.fitBounds(positions, { padding: [24, 24] })
  }, [map, positions])
  return null
}

function PortfolioMap({ properties }: { properties: Property[] }) {
  const navigate = useNavigate()
  const positions = properties.map(coordsFor)

  return (
    <div className="overflow-hidden rounded-xl">
      <MapContainer
        center={positions[0] ?? FALLBACK_COORDS}
        zoom={4}
        scrollWheelZoom={false}
        style={{ width: "100%", height: 260 }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds positions={positions} />
        {properties.map((property) => {
          const position = coordsFor(property)
          return (
            <Marker key={property.id} position={position} icon={mapPinIcon}>
              <Popup>
                <div className="min-w-[180px] text-sm">
                  <p className="font-semibold text-gray-900">{property.address}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {property.city}, {property.state}
                  </p>
                  <p className="mt-1 text-xs text-gray-600">Health score: {property.healthScore}/100</p>
                  <button
                    type="button"
                    onClick={() => navigate(`/app/properties/${property.id}`)}
                    className="mt-2 inline-flex items-center text-xs font-semibold text-primary-600 transition-colors hover:text-primary-700"
                  >
                    View property →
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}