import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Archive as ArchiveIcon,
  ClipboardCheck,
  Inbox as InboxIcon,
  Landmark,
  Link2,
  ListPlus,
  Radar,
  Sparkles,
  type LucideIcon,
} from "lucide-react"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"
import EmptyState from "../../components/ui/EmptyState"
import Modal from "../../components/ui/Modal"
import { useData } from "../../context/DataContext"
import { useToast } from "../../context/ToastContext"
import { cn, formatDate, statusLabel, timeAgo } from "../../lib/utils"
import type { InboxItem } from "../../types"

const KIND_ICONS: Record<InboxItem["kind"], { icon: LucideIcon; classes: string }> = {
  "city-notice": { icon: Landmark, classes: "bg-primary-50 text-primary-600" },
  inspection: { icon: ClipboardCheck, classes: "bg-amber-50 text-amber-600" },
  regulation: { icon: Radar, classes: "bg-blue-50 text-blue-600" },
  system: { icon: Sparkles, classes: "bg-violet-50 text-violet-600" },
}

export default function Inbox() {
  const {
    inbox,
    getProperty,
    markInboxRead,
    markAllInboxRead,
    archiveInboxItem,
    createTaskFromInbox,
  } = useData()
  const { toast } = useToast()
  const [filter, setFilter] = useState<"all" | "unread">("all")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false)

  const visible = inbox.filter((i) => !i.archived && (filter === "all" || !i.read))
  const selected = visible.find((i) => i.id === selectedId) ?? visible[0] ?? null

  function openItem(item: InboxItem, mobile: boolean) {
    setSelectedId(item.id)
    if (!item.read) markInboxRead(item.id)
    if (mobile) setMobileDetailOpen(true)
  }

  function handleCreateTask(item: InboxItem) {
    createTaskFromInbox(item)
    toast({ variant: "success", title: "Task created", description: item.detectedRequirement ?? item.title })
  }

  function handleAttach(item: InboxItem) {
    markInboxRead(item.id)
    const property = item.detectedPropertyId ? getProperty(item.detectedPropertyId) : undefined
    toast({
      variant: "info",
      title: "Notice attached",
      description: property ? `Linked to ${property.address}.` : "Linked to your records.",
    })
  }

  function handleArchive(item: InboxItem) {
    archiveInboxItem(item.id)
    setMobileDetailOpen(false)
    setSelectedId(null)
    toast({ variant: "success", title: "Archived", description: item.title })
  }

  const detail = selected ? (
    <InboxDetail
      item={selected}
      onCreateTask={handleCreateTask}
      onAttach={handleAttach}
      onArchive={handleArchive}
    />
  ) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Inbox</h1>
          <p className="mt-1 text-sm text-gray-500">
            Notices and bulletins, parsed into properties, requirements, and deadlines
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-gray-200 bg-white p-0.5">
            {(["all", "unread"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                  filter === f ? "bg-primary-50 text-primary-700" : "text-gray-500 hover:text-gray-700",
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={markAllInboxRead}>
            Mark all read
          </Button>
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={InboxIcon}
          title="Inbox zero"
          description={filter === "unread" ? "No unread notices." : "No notices yet — city mail and bulletins will land here."}
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-5">
          {/* List */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card lg:col-span-2">
            <ul className="divide-y divide-gray-50">
              {visible.map((item) => {
                const kind = KIND_ICONS[item.kind]
                const active = selected?.id === item.id
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => openItem(item, window.innerWidth < 1024)}
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors sm:px-5",
                        active ? "bg-primary-50/60" : "hover:bg-gray-50",
                      )}
                    >
                      <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", kind.classes)}>
                        <kind.icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          {!item.read && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-primary-500" aria-label="Unread" />
                          )}
                          <span
                            className={cn(
                              "truncate text-sm",
                              item.read ? "font-medium text-gray-700" : "font-semibold text-gray-900",
                            )}
                          >
                            {item.title}
                          </span>
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-gray-500">{item.preview}</span>
                        <span className="mt-1 block text-[11px] text-gray-400">
                          {item.jurisdiction} · {timeAgo(item.receivedAt)}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Detail — desktop */}
          <div className="hidden lg:col-span-3 lg:block">
            {selected ? (
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">{detail}</div>
            ) : (
              <EmptyState icon={InboxIcon} title="Select a notice" description="Choose an item to see detected details and actions." />
            )}
          </div>
        </div>
      )}

      {/* Detail — mobile modal */}
      <Modal open={mobileDetailOpen && selected !== null} onClose={() => setMobileDetailOpen(false)} title={selected?.title} maxWidth="max-w-xl">
        {detail}
      </Modal>
    </div>
  )
}

/* ------------------------------- Detail ----------------------------------- */

function InboxDetail({
  item,
  onCreateTask,
  onAttach,
  onArchive,
}: {
  item: InboxItem
  onCreateTask: (item: InboxItem) => void
  onAttach: (item: InboxItem) => void
  onArchive: (item: InboxItem) => void
}) {
  const { getProperty } = useData()
  const property = item.detectedPropertyId ? getProperty(item.detectedPropertyId) : undefined

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="purple">{statusLabel(item.kind)}</Badge>
        <Badge variant="outline">{item.jurisdiction}</Badge>
        <span className="text-xs text-gray-400">
          {formatDate(item.receivedAt)} · {timeAgo(item.receivedAt)}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-gray-700">{item.body}</p>

      {/* Detected fields */}
      {(property || item.detectedRequirement || item.detectedDeadline) && (
        <div className="rounded-xl border border-primary-100 bg-primary-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
            Detected by RuleNest
          </p>
          <dl className="mt-3 space-y-2 text-sm">
            {property && (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-gray-500">Property</dt>
                <dd>
                  <Link
                    to={`/app/properties/${property.id}`}
                    className="font-medium text-primary-700 hover:text-primary-800"
                  >
                    {property.address}
                  </Link>
                </dd>
              </div>
            )}
            {item.detectedRequirement && (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-gray-500">Requirement</dt>
                <dd className="font-medium text-gray-900">{item.detectedRequirement}</dd>
              </div>
            )}
            {item.detectedDeadline && (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-gray-500">Deadline</dt>
                <dd className="font-medium text-gray-900">{formatDate(item.detectedDeadline)}</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button size="sm" icon={<ListPlus className="h-4 w-4" />} onClick={() => onCreateTask(item)}>
          Create task
        </Button>
        {property && (
          <Button size="sm" variant="outline" icon={<Link2 className="h-4 w-4" />} onClick={() => onAttach(item)}>
            Attach to property
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          icon={<ArchiveIcon className="h-4 w-4" />}
          onClick={() => onArchive(item)}
          className="sm:ml-auto"
        >
          Archive
        </Button>
      </div>
    </div>
  )
}