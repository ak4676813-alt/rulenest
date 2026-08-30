import { useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  FileText,
  HelpCircle,
  Landmark,
  MapPin,
  ShieldCheck,
} from "lucide-react"
import AIAssistant from "../../components/AIAssistant"
import StatusBadge from "../../components/StatusBadge"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import EmptyState from "../../components/ui/EmptyState"
import { useData } from "../../context/DataContext"
import { useToast } from "../../context/ToastContext"
import { cn, daysUntil, formatDate, relativeDeadline, timeAgo } from "../../lib/utils"
import type { Requirement } from "../../types"

const TABS = ["Overview", "Requirements", "Documents", "Deadlines", "Activity"] as const
type Tab = (typeof TABS)[number]

function deadlineTone(iso: string): string {
  const days = daysUntil(iso)
  if (days === null) return "text-gray-400"
  if (days < 0 || days <= 15) return "text-red-600"
  if (days <= 45) return "text-amber-600"
  return "text-gray-500"
}

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>()
  const data = useData()
  const property = data.properties.find((p) => p.id === id)
  const [tab, setTab] = useState<Tab>("Overview")

  const reqs = useMemo(
    () => data.requirements.filter((r) => r.propertyId === id),
    [data.requirements, id],
  )
  const docs = useMemo(
    () => data.documents.filter((d) => d.propertyId === id),
    [data.documents, id],
  )
  const propTasks = useMemo(
    () => data.tasks.filter((t) => t.propertyId === id),
    [data.tasks, id],
  )
  const propActivity = useMemo(
    () => data.activity.filter((a) => a.propertyId === id),
    [data.activity, id],
  )

  const deadlineRows = useMemo(() => {
    const rows: Array<{ id: string; title: string; date: string; kind: "Task" | "Requirement" }> = []
    for (const t of propTasks) {
      if (t.status !== "completed") {
        rows.push({ id: `d_${t.id}`, title: t.title, date: t.dueDate, kind: "Task" })
      }
    }
    for (const r of reqs) {
      if (r.deadline) rows.push({ id: `d_${r.id}`, title: r.name, date: r.deadline, kind: "Requirement" })
    }
    return rows.sort((a, b) => +new Date(a.date) - +new Date(b.date))
  }, [propTasks, reqs])

  if (!property) {
    return (
      <EmptyState
        icon={Building2}
        title="Property not found"
        description="This property may have been removed."
        action={
          <Link to="/app/properties">
            <Button size="sm">Back to properties</Button>
          </Link>
        }
      />
    )
  }

  const missing = reqs.filter((r) => r.status === "missing-evidence" || r.status === "overdue")

  return (
    <div className="space-y-6">
      <Link
        to="/app/properties"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All properties
      </Link>

      {/* Banner */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 sm:p-8",
          property.imageGradient,
        )}
      >
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={property.status} />
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
                {property.units} unit{property.units === 1 ? "" : "s"}
              </span>
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
                {property.dna.rentalType}
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {property.address}
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-white/85">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {property.city}, {property.state} {property.zip}
            </p>
          </div>
          <div className="rounded-xl bg-white/10 px-5 py-4 ring-1 ring-white/25">
            <p className="text-xs font-medium text-white/75">Compliance Health</p>
            <p className="mt-1 text-3xl font-bold text-white">
              {property.healthScore}
              <span className="text-base font-medium text-white/60">/100</span>
            </p>
            <div className="mt-2 h-1.5 w-36 overflow-hidden rounded-full bg-white/25">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${property.healthScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Location map — interactive (pan/zoom) */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-card">
        <iframe
          title={`Map of ${property.address}, ${property.city}`}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(
            `${property.address}, ${property.city}, ${property.state}`,
          )}&z=15&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-[300px] w-full"
          style={{ border: 0 }}
        />
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1 shadow-card"
        role="tablist"
        aria-label="Property sections"
      >
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              tab === t
                ? "bg-primary-50 text-primary-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            )}
          >
            {t}
            {t === "Requirements" && <span className="ml-1.5 text-xs text-gray-400">{reqs.length}</span>}
            {t === "Documents" && <span className="ml-1.5 text-xs text-gray-400">{docs.length}</span>}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "Overview" && (
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <Card title="Property DNA" subtitle="The characteristics that determine which rules apply">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                {[
                  { label: "Location", value: `${property.city}, ${property.state} ${property.zip}` },
                  { label: "Property type", value: property.dna.propertyType },
                  { label: "Units", value: String(property.dna.units) },
                  { label: "Year built", value: String(property.dna.yearBuilt) },
                  { label: "Rental type", value: property.dna.rentalType },
                  { label: "Occupancy", value: property.dna.occupancy },
                  { label: "Owner occupied", value: property.dna.ownerOccupied ? "Yes" : "No" },
                  { label: "Floors", value: String(property.dna.floors) },
                  { label: "Living area", value: `${property.dna.sqft.toLocaleString()} sq ft` },
                  { label: "Parking", value: property.dna.parking },
                  {
                    label: "Amenities",
                    value: property.dna.amenities.length > 0 ? property.dna.amenities.join(", ") : "—",
                  },
                  { label: "Added", value: formatDate(property.createdAt) },
                ].map((row) => (
                  <div key={row.label}>
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      {row.label}
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <Card>
                <p className="text-xs font-medium text-gray-500">Obligations identified</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{reqs.length}</p>
              </Card>
              <Card>
                <p className="text-xs font-medium text-gray-500">Evidence gaps</p>
                <p
                  className={cn(
                    "mt-2 text-2xl font-bold",
                    missing.length > 0 ? "text-red-600" : "text-emerald-600",
                  )}
                >
                  {missing.length}
                </p>
              </Card>
              <Card>
                <p className="text-xs font-medium text-gray-500">Next deadline</p>
                <p className="mt-2 text-sm font-bold text-gray-900 sm:text-base">
                  {property.nextDeadline ? formatDate(property.nextDeadline) : "—"}
                </p>
                {property.nextDeadline && (
                  <p className="text-xs text-gray-400">{relativeDeadline(property.nextDeadline)}</p>
                )}
              </Card>
            </div>
          </div>

          <AIAssistant propertyId={property.id} />
        </div>
      )}

      {/* Requirements */}
      {tab === "Requirements" && (
        <div className="space-y-3">
          {reqs.length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              title="No requirements yet"
              description="Requirements appear once the Property DNA is complete."
            />
          ) : (
            reqs.map((req) => <RequirementCard key={req.id} req={req} />)
          )}
        </div>
      )}

      {/* Documents */}
      {tab === "Documents" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              {docs.length} document{docs.length === 1 ? "" : "s"} in the Evidence Vault
            </p>
            <Link to="/app/documents">
              <Button size="sm" variant="outline">
                Manage documents
              </Button>
            </Link>
          </div>
          {docs.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No documents yet"
              description="Upload evidence and it will be matched to this property's requirements."
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card">
              <ul className="divide-y divide-gray-50">
                {docs.map((d) => (
                  <li key={d.id} className="flex items-center gap-3.5 px-5 py-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                      <FileText className="h-4 w-4 text-primary-600" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{d.name}</p>
                      <p className="text-xs text-gray-400">
                        {d.category}
                        {d.expiresAt && <> · Expires {formatDate(d.expiresAt)}</>}
                      </p>
                    </div>
                    <StatusBadge status={d.status} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Deadlines */}
      {tab === "Deadlines" && (
        <div className="space-y-3">
          {deadlineRows.length === 0 ? (
            <EmptyState
              icon={CalendarClock}
              title="No upcoming deadlines"
              description="Everything for this property is on track."
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card">
              <ul className="divide-y divide-gray-50">
                {deadlineRows.map((row) => (
                  <li key={row.id} className="flex items-center gap-3.5 px-5 py-3.5">
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        row.kind === "Task" ? "bg-primary-50" : "bg-gray-100",
                      )}
                    >
                      {row.kind === "Task" ? (
                        <CheckCircle2 className="h-4 w-4 text-primary-600" aria-hidden="true" />
                      ) : (
                        <Landmark className="h-4 w-4 text-gray-500" aria-hidden="true" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{row.title}</p>
                      <p className="text-xs text-gray-400">{row.kind}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn("text-xs font-semibold", deadlineTone(row.date))}>
                        {relativeDeadline(row.date)}
                      </p>
                      <p className="text-[11px] text-gray-400">{formatDate(row.date)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Activity */}
      {tab === "Activity" && (
        <>
          {propActivity.length === 0 ? (
            <EmptyState
              icon={CalendarClock}
              title="No activity yet"
              description="Actions on this property will show up here."
            />
          ) : (
            <Card title="Activity" subtitle="What happened on this property" noPadding>
              <ul className="divide-y divide-gray-50">
                {propActivity.map((item) => (
                  <li key={item.id} className="flex items-center gap-3.5 px-5 py-3.5 sm:px-6">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary-400" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.text}</p>
                      <p className="text-xs text-gray-400">{timeAgo(item.at)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

/* --------------------------- Requirement card ---------------------------- */

function RequirementCard({ req }: { req: Requirement }) {
  const [open, setOpen] = useState(false)
  const { addTask } = useData()
  const { toast } = useToast()

  function handleAction() {
    addTask({
      title: `${req.action}: ${req.name}`,
      propertyId: req.propertyId,
      dueDate: req.deadline ?? new Date(Date.now() + 14 * 86_400_000).toISOString(),
      priority: req.status === "overdue" || req.status === "missing-evidence" ? "high" : "medium",
      requirement: req.name,
    })
    toast({
      variant: "success",
      title: "Task created",
      description: `${req.action} — added to your task list.`,
    })
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card">
      <button
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-gray-900">{req.name}</p>
            <StatusBadge status={req.status} />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {req.category}
            {req.deadline && (
              <>
                {" "}
                · Due {formatDate(req.deadline)} · {relativeDeadline(req.deadline)}
              </>
            )}
          </p>
        </div>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-gray-400 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="animate-fade-in border-t border-gray-100 px-5 py-5">
          <dl className="space-y-4">
            <div>
              <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Why this applies
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-gray-700">{req.whyItApplies}</dd>
            </div>
            {req.requiredEvidence.length > 0 && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Required evidence
                </dt>
                <dd className="mt-1.5 flex flex-wrap gap-2">
                  {req.requiredEvidence.map((e) => (
                    <Badge key={e} variant="outline">
                      {e}
                    </Badge>
                  ))}
                </dd>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Official source
                </dt>
                <dd className="mt-1.5 text-sm text-gray-700">{req.officialSource}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Last verified
                </dt>
                <dd className="mt-1.5 text-sm text-gray-700">
                  {req.lastVerified ? formatDate(req.lastVerified) : "Never"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Deadline
                </dt>
                <dd className="mt-1.5 text-sm text-gray-700">
                  {req.deadline ? formatDate(req.deadline) : "—"}
                </dd>
              </div>
            </div>
          </dl>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button size="sm" onClick={handleAction}>
              {req.action}
            </Button>
            <Link to="/app/documents">
              <Button size="sm" variant="outline" className="w-full sm:w-auto">
                Open Evidence Vault
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}