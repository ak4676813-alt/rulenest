import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeftRight,
  ArrowRight,
  Bell,
  Building2,
  CalendarClock,
  ChevronDown,
  ExternalLink,
  Landmark,
  MapPin,
  Radar,
  type LucideIcon,
} from "lucide-react"
import Button from "../../components/ui/Button"
import EmptyState from "../../components/ui/EmptyState"
import { useData } from "../../context/DataContext"
import { useToast } from "../../context/ToastContext"
import { cn, formatDate, statusLabel, timeAgo } from "../../lib/utils"
import type { RegulatoryChange } from "../../types"

export default function ComplianceRadar() {
  const { changes, properties, markChangeRead, addTask } = useData()
  const { toast } = useToast()
  const [filter, setFilter] = useState<SeverityFilter>("all")

  const unreadCount = changes.filter((c) => !c.read).length
  const affectedCount = new Set(changes.flatMap((c) => c.affectedPropertyIds)).size

  const filtered = useMemo(() => {
    if (filter === "all") return changes
    return changes.filter(
      (c) => c.severity === filter || (filter === "high" && c.severity === "critical"),
    )
  }, [changes, filter])

  function handleMarkRead(change: RegulatoryChange) {
    if (!change.read) markChangeRead(change.id)
  }

  function createTask(change: RegulatoryChange) {
    const propertyId = change.affectedPropertyIds[0] ?? ""
    const property = properties.find((p) => p.id === propertyId)
    addTask({
      title: `Review change: ${change.title}`,
      propertyId,
      dueDate: change.effectiveDate,
      priority: change.severity === "critical" || change.severity === "high" ? "high" : "medium",
      requirement: change.title,
    })
    toast({
      variant: "success",
      title: "Task created",
      description: property ? `Linked to ${property.address}.` : "Added to your task list.",
    })
  }

  return (
    <div className="relative isolate">
      {/* Subtle radial/mesh backdrop, same depth treatment as the dashboard */}
      <div aria-hidden="true" className="dashboard-mesh pointer-events-none absolute inset-0 -z-10" />

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Compliance Radar</h1>
          <p className="mt-1 text-sm text-gray-500">
            Regulatory change monitoring across your jurisdictions
          </p>
        </div>

        {/* Top explain strip for first-time users */}
        <ExplainStrip />

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={Radar}
            iconBoxClasses="from-blue-500 to-indigo-600 shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_10px_24px_-8px_rgb(37_99_235/0.5)]"
            label="Changes detected"
            count={changes.length}
          />
          <StatCard
            icon={Bell}
            iconBoxClasses="from-amber-500 to-orange-500 shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_10px_24px_-8px_rgb(245_158_11/0.55)]"
            label="Unread alerts"
            count={unreadCount}
          />
          <StatCard
            icon={Building2}
            iconBoxClasses="from-violet-500 to-purple-600 shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_10px_24px_-8px_rgb(139_92_246/0.55)]"
            label="Properties affected"
            count={affectedCount}
          />
        </div>

        {/* Severity filter */}
        <div className="flex flex-wrap items-center gap-2">
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              aria-pressed={filter === option.value}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200",
                filter === option.value
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_8px_20px_-6px_rgba(37,99,235,0.6)]"
                  : "border border-gray-200 bg-white/70 text-gray-600 hover:border-primary-200 hover:text-primary-700",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Alert feed as a vertical timeline */}
        {filtered.length === 0 ? (
          changes.length === 0 ? (
            <EmptyState
              icon={Radar}
              title="No rule changes detected yet — your cities are quiet."
              description="When a rule changes in one of your jurisdictions, it will appear here with a before/after comparison and the actions you need."
            />
          ) : (
            <EmptyState
              icon={Radar}
              title="No changes match this filter"
              description="Try switching to All or a different severity to see the full alert timeline."
            />
          )
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div
              aria-hidden="true"
              className="absolute bottom-6 left-2 top-6 w-[2px] rounded-full bg-gradient-to-b from-slate-200 via-slate-200 to-transparent"
            />
            <div className="space-y-5">
              {filtered.map((change) => (
                <div key={change.id} className="relative pl-8 sm:pl-10">
                  {/* Severity-glow dot on the timeline */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-2 top-6 h-3.5 w-3.5 -translate-x-1/2 rounded-full",
                      severityVisual(change.severity).dot,
                    )}
                  />
                  <ChangeCard
                    change={change}
                    onMarkRead={handleMarkRead}
                    onCreateTask={createTask}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------ Types & config ----------------------------- */

type SeverityFilter = "all" | "high" | "medium" | "low"

const FILTER_OPTIONS: Array<{ value: SeverityFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

/* Glowing dot / pill / left-edge accent per severity. The colored text tints rely
   on the dashboard dark-mode pass (`.dark .card-3d .text-red-600` etc.) to stay
   readable on the dark glass surface. */
const SEVERITY_VISUAL: Record<
  RegulatoryChange["severity"],
  { dot: string; pill: string; accent: string }
> = {
  critical: {
    dot: "bg-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.2),0_0_16px_rgba(239,68,68,0.8)]",
    pill: "bg-red-500/15 text-red-600 shadow-[0_0_14px_-2px_rgba(239,68,68,0.6)] ring-1 ring-red-500/30",
    accent: "bg-gradient-to-b from-red-500 to-rose-600 shadow-[0_0_12px_rgba(239,68,68,0.8)]",
  },
  high: {
    dot: "bg-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.2),0_0_16px_rgba(239,68,68,0.8)]",
    pill: "bg-red-500/15 text-red-600 shadow-[0_0_14px_-2px_rgba(239,68,68,0.6)] ring-1 ring-red-500/30",
    accent: "bg-gradient-to-b from-red-500 to-rose-600 shadow-[0_0_12px_rgba(239,68,68,0.8)]",
  },
  medium: {
    dot: "bg-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.2),0_0_16px_rgba(245,158,11,0.7)]",
    pill: "bg-amber-500/15 text-amber-600 shadow-[0_0_14px_-2px_rgba(245,158,11,0.55)] ring-1 ring-amber-500/30",
    accent: "bg-gradient-to-b from-amber-500 to-orange-500 shadow-[0_0_12px_rgba(245,158,11,0.75)]",
  },
  low: {
    dot: "bg-slate-400 shadow-[0_0_0_4px_rgba(148,163,184,0.25),0_0_14px_rgba(148,163,184,0.6)]",
    pill: "bg-slate-500/15 text-slate-600 shadow-[0_0_14px_-2px_rgba(148,163,184,0.45)] ring-1 ring-slate-400/40",
    accent: "bg-gradient-to-b from-slate-400 to-slate-500 shadow-[0_0_12px_rgba(148,163,184,0.6)]",
  },
}

function severityVisual(severity: RegulatoryChange["severity"]) {
  return SEVERITY_VISUAL[severity] ?? SEVERITY_VISUAL.low
}

/* ------------------------------ Change card ------------------------------ */

function ChangeCard({
  change,
  onMarkRead,
  onCreateTask,
}: {
  change: RegulatoryChange
  onMarkRead: (change: RegulatoryChange) => void
  onCreateTask: (change: RegulatoryChange) => void
}) {
  const { properties } = useData()
  const affected = properties.filter((p) => change.affectedPropertyIds.includes(p.id))
  const [open, setOpen] = useState(false)
  const visual = severityVisual(change.severity)

  function toggleOpen() {
    if (!open && !change.read) onMarkRead(change)
    setOpen((v) => !v)
  }

  return (
    <div className="card-3d relative p-5 transition-all duration-300 hover:-translate-y-1 sm:p-6">
      {/* Glowing severity accent along the left edge */}
      <span
        aria-hidden="true"
        className={cn("absolute bottom-5 left-0 top-5 w-1 rounded-r-full", visual.accent)}
      />
      {/* Top row: glowing severity pill + pulsing New badge */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
            visual.pill,
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
          {statusLabel(change.severity)}
        </span>
        {!change.read && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-[0_4px_14px_-4px_rgba(139,92,246,0.6)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            New
          </span>
        )}
      </div>

      <h3 className="mt-3 text-base font-semibold text-gray-900">{change.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-gray-600">{change.summary}</p>

      {/* Facts: city, detected date, effective date */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
          <span className="font-medium text-gray-700">{change.jurisdiction}</span>
        </span>
        <span className="inline-flex items-center gap-1.5">Detected {timeAgo(change.detectedAt)}</span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarClock className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
          Effective {formatDate(change.effectiveDate)}
        </span>
      </div>

      {/* Chips: official source + affected properties */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
          {change.source}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
          <Building2 className="h-3 w-3" aria-hidden="true" />
          {affected.length} affected
        </span>
        {affected.slice(0, 2).map((p) => (
          <Link
            key={p.id}
            to={`/app/properties/${p.id}`}
            className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-gray-700 transition-colors hover:border-primary-300"
          >
            {p.address}
          </Link>
        ))}
        {affected.length > 2 && (
          <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">
            +{affected.length - 2} more
          </span>
        )}
      </div>

      {/* Expand toggle */}
      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={open}
        className={cn(
          "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors",
          open
            ? "border-primary-200 bg-primary-50 text-primary-700"
            : "border-gray-200 bg-gray-50/50 text-gray-700 hover:bg-gray-100",
        )}
      >
        <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
        {open ? "Hide What Changed" : "Show What Changed"}
        <ChevronDown
          className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {/* Before / After panel (smooth expand) */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-500 ease-in-out",
          open ? "mt-4 max-h-[900px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Before — muted */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                Before · {change.before.label}
              </span>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{change.before.text}</p>
            </div>
            {/* After — highlighted */}
            <div className="rounded-xl border border-primary-200 bg-primary-50 p-4">
              <span className="inline-flex rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-[0_4px_12px_-4px_rgba(37,99,235,0.7)]">
                After · {change.after.label}
              </span>
              <p className="mt-2 text-sm leading-relaxed text-gray-800">{change.after.text}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-gray-500">
              <span className="font-semibold text-gray-700">Action:</span> {change.requiredAction}
            </p>
            <Button
              size="sm"
              icon={<ArrowLeftRight className="h-4 w-4" />}
              onClick={() => onCreateTask(change)}
              className="shrink-0"
            >
              Create task
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
/* ------------------------------ Subcomponents ----------------------------- */

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
}: {
  icon: LucideIcon
  iconBoxClasses: string
  label: string
  count: number
}) {
  const value = useCountUp(count)

  return (
    <div className="card-3d h-full px-5 py-4 transition-all duration-300 hover:-translate-y-1 sm:px-6 sm:py-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-gray-500 sm:text-sm">{label}</p>
          <p className="mt-1 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            {value.toLocaleString()}
          </p>
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

/* Glass intro banner + 3-step explanation for first-time users. */
function ExplainStrip() {
  return (
    <div className="card-3d relative overflow-hidden p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_10px_24px_-8px_rgb(37_99_235/0.5)]">
          <Radar className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-snug text-gray-900">
            Compliance Radar watches rental rule changes in your cities and warns you before fines
            happen.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <MiniStep icon={Landmark} label="Monitors city rules" />
            <ArrowRight className="hidden h-4 w-4 shrink-0 text-gray-300 sm:block" aria-hidden="true" />
            <MiniStep icon={Radar} label="Detects changes" />
            <ArrowRight className="hidden h-4 w-4 shrink-0 text-gray-300 sm:block" aria-hidden="true" />
            <MiniStep icon={Bell} label="Alerts you with actions" />
          </div>
        </div>
      </div>
    </div>
  )
}

function MiniStep({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-gray-700">
      <Icon className="h-3.5 w-3.5 text-primary-600" aria-hidden="true" />
      {label}
    </span>
  )
}