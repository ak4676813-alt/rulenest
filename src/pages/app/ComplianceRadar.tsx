import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeftRight,
  Building2,
  CalendarClock,
  Landmark,
  MapPin,
  Radar,
} from "lucide-react"
import StatusBadge from "../../components/StatusBadge"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import EmptyState from "../../components/ui/EmptyState"
import Modal from "../../components/ui/Modal"
import { useData } from "../../context/DataContext"
import { useToast } from "../../context/ToastContext"
import { formatDate, statusLabel, timeAgo } from "../../lib/utils"
import type { RegulatoryChange } from "../../types"

export default function ComplianceRadar() {
  const { changes, properties, markChangeRead, addTask } = useData()
  const { toast } = useToast()
  const [selected, setSelected] = useState<RegulatoryChange | null>(null)

  const unreadCount = changes.filter((c) => !c.read).length
  const affectedCount = new Set(changes.flatMap((c) => c.affectedPropertyIds)).size

  function openChange(change: RegulatoryChange) {
    setSelected(change)
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

  const affectedSelected = selected
    ? properties.filter((p) => selected.affectedPropertyIds.includes(p.id))
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Compliance Radar</h1>
        <p className="mt-1 text-sm text-gray-500">
          Regulatory change monitoring across your jurisdictions
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50">
              <Radar className="h-4 w-4 text-primary-600" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xl font-bold text-gray-900">{changes.length}</p>
              <p className="text-xs text-gray-500">Changes detected</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50">
              <ArrowLeftRight className="h-4 w-4 text-amber-600" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xl font-bold text-gray-900">{unreadCount}</p>
              <p className="text-xs text-gray-500">Unread alerts</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50">
              <Building2 className="h-4 w-4 text-red-600" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xl font-bold text-gray-900">{affectedCount}</p>
              <p className="text-xs text-gray-500">Properties affected</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Change feed */}
      {changes.length === 0 ? (
        <EmptyState
          icon={Radar}
          title="No regulatory changes"
          description="When a rule changes in one of your jurisdictions, it will show up here with a before/after comparison."
        />
      ) : (
        <div className="space-y-4">
          {changes.map((change) => (
            <ChangeCard key={change.id} change={change} onOpen={openChange} />
          ))}
        </div>
      )}

      {/* Before / After comparison */}
      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.title}
        subtitle={
          selected
            ? `${selected.jurisdiction} · Effective ${formatDate(selected.effectiveDate)}`
            : undefined
        }
        maxWidth="max-w-2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (selected) createTask(selected)
                setSelected(null)
              }}
            >
              Create task for this change
            </Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  {selected.before.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{selected.before.text}</p>
              </div>
              <div className="rounded-xl border border-primary-200 bg-primary-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-500">
                  {selected.after.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-800">{selected.after.text}</p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-semibold text-amber-800">Next best action</p>
              <p className="mt-1 text-sm leading-relaxed text-amber-900">{selected.requiredAction}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Affected properties
              </p>
              <ul className="mt-2 space-y-2">
                {affectedSelected.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/app/properties/${p.id}`}
                      onClick={() => setSelected(null)}
                      className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-2.5 text-sm transition-colors hover:border-primary-200 hover:bg-primary-50/50"
                    >
                      <span className="font-medium text-gray-900">{p.address}</span>
                      <span className="text-xs text-gray-500">
                        {p.city}, {p.state}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs leading-relaxed text-gray-400">
              Source: {selected.source}. RuleNest provides compliance information and workflow
              assistance — verify changes with the official authority.
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}

/* ------------------------------ Change card ------------------------------ */

function ChangeCard({
  change,
  onOpen,
}: {
  change: RegulatoryChange
  onOpen: (change: RegulatoryChange) => void
}) {
  const { properties } = useData()
  const affected = properties.filter((p) => change.affectedPropertyIds.includes(p.id))

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card transition-shadow duration-200 hover:shadow-pop sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={change.severity} label={`${statusLabel(change.severity)} severity`} />
        {!change.read && (
          <Badge variant="amber" dot>
            New
          </Badge>
        )}
        <span className="text-xs text-gray-400">Detected {timeAgo(change.detectedAt)}</span>
      </div>
      <h3 className="mt-3 text-base font-semibold text-gray-900">{change.title}</h3>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
        {change.jurisdiction}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">{change.summary}</p>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <CalendarClock className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
          Effective {formatDate(change.effectiveDate)}
        </span>
        <span className="flex items-center gap-1.5">
          <Landmark className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
          {change.source}
        </span>
        <span className="flex items-center gap-1.5 font-medium text-red-600">
          <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
          Affected: {affected.length} propert{affected.length === 1 ? "y" : "ies"}
        </span>
      </div>
      <div className="mt-4">
        <Button size="sm" icon={<ArrowLeftRight className="h-4 w-4" />} onClick={() => onOpen(change)}>
          Show What Changed
        </Button>
      </div>
    </div>
  )
}