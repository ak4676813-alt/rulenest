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
import type { ActivityItem, Property } from "../../types"

const ACTIVITY_ICONS: Record<ActivityItem["type"], { icon: LucideIcon; classes: string }> = {
  inspection: { icon: ClipboardCheck, classes: "border border-neutral-200 bg-white text-neutral-900" },
  regulation: { icon: Landmark, classes: "border border-neutral-200 bg-white text-neutral-900" },
  document: { icon: FileText, classes: "border border-neutral-200 bg-white text-neutral-900" },
  task: { icon: ListChecks, classes: "border border-neutral-200 bg-white text-neutral-900" },
  property: { icon: Building2, classes: "border border-neutral-200 bg-white text-neutral-900" },
  report: { icon: FileBarChart, classes: "border border-neutral-200 bg-white text-neutral-900" },
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
          iconBoxClasses="from-blue-500 to-indigo-600 shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_10px_24px_-8px_rgb(37_99_235/0.5)]"
          label="Total Properties"
          count={stats.totalProperties}
          sub={`${stats.cityCount} Cities`}
        />
        <StatCard
          icon={ActivityIcon}
          iconBoxClasses="from-emerald-500 to-teal-600 shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_10px_24px_-8px_rgb(16_185_129/0.5)]"
          label="Compliance Health"
          count={stats.portfolioHealth}
          suffix={<span className="text-base font-medium text-gray-400">/100</span>}
          sub="↑ 7 points this month"
          subClasses="text-emerald-600"
        />
        <StatCard
          icon={AlertTriangle}
          iconBoxClasses="from-amber-500 to-orange-600 shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_10px_24px_-8px_rgb(245_158_11/0.55)]"
          label="Action Required"
          count={stats.gapCount}
          sub={`${stats.overdueTasks} Overdue`}
          subClasses={stats.overdueTasks > 0 ? "text-red-600" : "text-gray-400"}
        />
        <StatCard
          icon={FileText}
          iconBoxClasses="from-violet-500 to-purple-600 shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_10px_24px_-8px_rgb(139_92_246/0.55)]"
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
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br",
                      p.imageGradient,
                    )}
                  >
                    <Building2 className="h-4 w-4 text-white" strokeWidth={1.5} aria-hidden="true" />
                  </span>
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
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        config.classes,
                      )}
                    >
                      <config.icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                    </span>
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
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white">
                        <MapPin className="h-3.5 w-3.5 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
                      </span>
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
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white">
                      <CalendarClock className="h-4 w-4 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
                    </span>
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

function StatCard({
  icon: Icon,
  iconBoxClasses,
  label,
  count,
  suffix,
  sub,
  subClasses,
}: {
  icon: LucideIcon
  iconBoxClasses: string
  label: string
  count: number
  suffix?: ReactNode
  sub: string
  subClasses?: string
}) {
  const value = useCountUp(count)

  return (
    <div className="card-3d h-full px-5 py-4 transition-all duration-300 hover:-translate-y-1 sm:px-6 sm:py-5">
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
        <span
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white ring-1 ring-white/20",
            iconBoxClasses,
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
        </span>
      </div>
    </div>
  )
}

function PropertyCell({ property }: { property: Property }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br",
          property.imageGradient,
        )}
      >
        <Building2 className="h-4 w-4 text-white" strokeWidth={1.5} aria-hidden="true" />
      </span>
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