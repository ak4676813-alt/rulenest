import { useMemo, useRef, useState, type ReactNode } from "react"
import {
  CheckCircle2,
  Download,
  Eye,
  FileText,
  MoreHorizontal,
  Search,
  Trash2,
  Upload,
} from "lucide-react"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"
import Dropdown, { DropdownItem } from "../../components/ui/Dropdown"
import EmptyState from "../../components/ui/EmptyState"
import Modal from "../../components/ui/Modal"
import { Field, Input, Select } from "../../components/ui/Input"
import { useData } from "../../context/DataContext"
import { useToast } from "../../context/ToastContext"
import { cn, daysUntil, formatDate, relativeDeadline, statusLabel } from "../../lib/utils"
import type { DocumentCategory, DocumentItem, DocumentStatus } from "../../types"

const CATEGORIES: Array<"All" | DocumentCategory> = [
  "All",
  "Certificates",
  "Registrations",
  "Inspections",
  "Insurance",
  "Disclosures",
  "Other",
]

/* Gradient + colored glow for document category icon tiles (see DocIconTile). */
const CATEGORY_TILE: Record<DocumentCategory, string> = {
  Registrations:
    "from-blue-400 via-blue-500 to-blue-600 shadow-[0_6px_16px_-4px_rgba(59,130,246,0.55)]",
  Certificates:
    "from-teal-400 via-teal-500 to-cyan-600 shadow-[0_6px_16px_-4px_rgba(20,184,166,0.55)]",
  Inspections:
    "from-indigo-400 via-indigo-500 to-indigo-600 shadow-[0_6px_16px_-4px_rgba(99,102,241,0.55)]",
  Insurance:
    "from-amber-400 via-amber-500 to-orange-500 shadow-[0_6px_16px_-4px_rgba(245,158,11,0.55)]",
  Disclosures:
    "from-violet-400 via-purple-500 to-violet-600 shadow-[0_6px_16px_-4px_rgba(139,92,246,0.55)]",
  Other: "from-slate-400 via-slate-500 to-slate-600 shadow-[0_6px_16px_-4px_rgba(100,116,139,0.45)]",
}

/* Soft glass status pill — Verified emerald with a static glowing dot, Pending
   amber with a subtle pulsing dot. */
function statusPill(status: DocumentStatus): { className: string; dotClass: string } {
  const base = "doc-pill inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
  switch (status) {
    case "verified":
      return {
        className:
          base + " bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/30 shadow-[0_0_12px_-2px_rgba(16,185,129,0.45)]",
        dotClass: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]",
      }
    case "pending":
      return {
        className:
          base + " bg-amber-500/15 text-amber-700 ring-1 ring-amber-500/30 shadow-[0_0_12px_-2px_rgba(245,158,11,0.45)]",
        dotClass: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.9)] animate-pulse",
      }
    case "expiring-soon":
      return {
        className: base + " bg-orange-500/10 text-orange-700 ring-1 ring-orange-500/25",
        dotClass: "bg-orange-500",
      }
    case "expired":
      return {
        className: base + " bg-red-500/10 text-red-700 ring-1 ring-red-500/25",
        dotClass: "bg-red-500",
      }
    case "processing":
      return {
        className: base + " bg-blue-500/10 text-blue-700 ring-1 ring-blue-500/25",
        dotClass: "bg-blue-500",
      }
  }
}

function categoryTile(category: DocumentCategory): string {
  return CATEGORY_TILE[category] ?? CATEGORY_TILE.Other
}

type StatusFilter = "all" | DocumentStatus
type SortKey = "newest" | "expiring" | "name"

interface UploadState {
  fileName: string
  size: number
  step: number
  issued: string
  expires: string
}

/** Filename-based heuristic used by the simulated Document AI pipeline. */
function guessFromName(name: string): { category: DocumentCategory; docType: string; requirement: string } {
  const n = name.toLowerCase()
  if (n.includes("smoke") || n.includes("co"))
    return { category: "Certificates", docType: "Smoke/CO Certificate", requirement: "Smoke/CO Certification" }
  if (n.includes("insur"))
    return { category: "Insurance", docType: "Insurance Certificate", requirement: "Landlord Insurance" }
  if (n.includes("regist") || n.includes("licen"))
    return { category: "Registrations", docType: "Rental Registration", requirement: "Rental Registration" }
  if (n.includes("inspect"))
    return { category: "Inspections", docType: "Inspection Report", requirement: "Annual Inspection" }
  if (n.includes("lead") || n.includes("disclos"))
    return { category: "Disclosures", docType: "Lead Paint Disclosure", requirement: "Lead Paint Disclosure" }
  return { category: "Other", docType: "Compliance Document", requirement: "General filing" }
}

/** Mini 3D icon tile for document rows — gradient, colored glow, glass shine,
    inner bottom shadow + sparkle. Calm (no float) for table rows; optional size. */
function DocIconTile({
  category,
  className,
}: {
  category: DocumentCategory
  className?: string
}) {
  return (
    <span
      className={cn(
        "doc-tile relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white",
        "transition-transform duration-300 ease-out hover:scale-105",
        categoryTile(category),
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0.5 top-0.5 h-1.5 rounded-full bg-gradient-to-b from-white/40 via-white/15 to-transparent blur-[2px]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2.5 rounded-b-[inherit] bg-gradient-to-t from-black/30 to-transparent"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0.5 top-0.5 h-[3px] w-[3px] rounded-full bg-white/70 blur-[0.5px]"
      />
      <FileText
        className="relative h-4 w-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </span>
  )
}

const PIPELINE_STEPS = ["Reading document", "Extracting information", "Matching to requirement"]

function prettySize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

/* Premium 3D gradient button (blue → indigo) with outer glow + top shine. */
function UploadButton({
  onClick,
  size = "md",
  icon,
  children,
}: {
  onClick: () => void
  size?: "sm" | "md"
  icon?: ReactNode
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 text-white",
        "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-8px_rgba(59,130,246,0.65)]",
        "shadow-[0_10px_25px_-6px_rgba(37,99,235,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
        size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 text-sm",
      )}
    >
      {/* Glass top shine */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-2 rounded-t-xl bg-gradient-to-b from-white/40 to-transparent"
      />
      {/* Bottom depth */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5 rounded-b-xl bg-gradient-to-t from-black/25 to-transparent"
      />
      {icon}
      {children}
    </button>
  )
}

export default function Documents() {
  const { documents, properties, addDocument, deleteDocument, getProperty } = useData()
  const { toast } = useToast()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<"All" | DocumentCategory>("All")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [sort, setSort] = useState<SortKey>("newest")
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadState, setUploadState] = useState<UploadState | null>(null)
  const [targetProperty, setTargetProperty] = useState(() => properties[0]?.id ?? "")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const timersRef = useRef<number[]>([])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = documents.filter((d) => {
      const property = getProperty(d.propertyId)
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        (property?.address.toLowerCase().includes(q) ?? false)
      const matchesCategory = category === "All" || d.category === category
      const matchesStatus = statusFilter === "all" || d.status === statusFilter
      return matchesQuery && matchesCategory && matchesStatus
    })
    return [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name)
      if (sort === "expiring") {
        return (daysUntil(a.expiresAt) ?? 9999) - (daysUntil(b.expiresAt) ?? 9999)
      }
      return +new Date(b.uploadedAt) - +new Date(a.uploadedAt)
    })
  }, [documents, query, category, statusFilter, sort, getProperty])

  function clearTimers() {
    timersRef.current.forEach((t) => window.clearTimeout(t))
    timersRef.current = []
  }

  function closeUpload() {
    clearTimers()
    setUploadOpen(false)
    setUploadState(null)
  }

  function handleFile(file: File) {
    clearTimers()
    setUploadState({
      fileName: file.name,
      size: file.size,
      step: 0,
      issued: new Date(Date.now() - 7 * 86_400_000).toISOString(),
      expires: new Date(Date.now() + 365 * 86_400_000).toISOString(),
    })
    // Simulated Document AI pipeline (prototype — no real processing).
    timersRef.current = [
      window.setTimeout(() => setUploadState((s) => (s ? { ...s, step: 1 } : s)), 800),
      window.setTimeout(() => setUploadState((s) => (s ? { ...s, step: 2 } : s)), 1700),
      window.setTimeout(() => setUploadState((s) => (s ? { ...s, step: 3 } : s)), 2600),
    ]
  }

  function saveDocument() {
    if (!uploadState) return
    const guess = guessFromName(uploadState.fileName)
    addDocument({
      name: uploadState.fileName,
      propertyId: targetProperty,
      category: guess.category,
      status: "verified",
      size: prettySize(uploadState.size),
      expiresAt: uploadState.expires,
      matchedRequirement: guess.requirement,
      confidence: 95 + Math.floor(Math.random() * 4),
    })
    const property = getProperty(targetProperty)
    toast({
      variant: "success",
      title: "Document verified",
      description: `Matched to ${guess.requirement}${property ? ` · ${property.address}` : ""}.`,
    })
    closeUpload()
  }

  const guess = uploadState ? guessFromName(uploadState.fileName) : null

  return (
    <div className="relative isolate">
      {/* Subtle radial/mesh backdrop, same depth treatment as the dashboard */}
      <div aria-hidden="true" className="dashboard-mesh pointer-events-none absolute inset-0 -z-10" />

      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Documents</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your Evidence Vault — {documents.length} documents, organized and tracked
          </p>
        </div>
        <UploadButton icon={<Upload className="h-4 w-4" />} onClick={() => setUploadOpen(true)}>
          Upload Document
        </UploadButton>
      </div>

      {/* Hidden file picker (real browser picker) */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
        aria-label="Choose a document to upload"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ""
        }}
      />

      {/* Category chips — glass pills; active = blue gradient with glow */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => {
          const count = c === "All" ? documents.length : documents.filter((d) => d.category === c).length
          const active = category === c
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={active}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold backdrop-blur transition-all duration-200",
                active
                  ? "border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_8px_20px_-6px_rgba(37,99,235,0.6)]"
                  : "border-gray-200 bg-white/70 text-gray-600 hover:border-primary-200 hover:text-primary-700",
              )}
            >
              {c}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500",
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input
            icon={<Search className="h-4 w-4" />}
            placeholder="Search documents or properties..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search documents"
          />
        </div>
        <div className="flex gap-2">
          <div className="w-40">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              options={[
                { value: "all", label: "All statuses" },
                { value: "verified", label: "Verified" },
                { value: "pending", label: "Pending" },
                { value: "expiring-soon", label: "Expiring soon" },
                { value: "expired", label: "Expired" },
              ]}
              aria-label="Filter by status"
            />
          </div>
          <div className="w-40">
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              options={[
                { value: "newest", label: "Newest first" },
                { value: "expiring", label: "Expiring soonest" },
                { value: "name", label: "Name A–Z" },
              ]}
              aria-label="Sort documents"
            />
          </div>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents match"
          description="Try a different search or filter — or upload a new document."
          action={
            <UploadButton size="sm" icon={<Upload className="h-4 w-4" />} onClick={() => setUploadOpen(true)}>
              Upload Document
            </UploadButton>
          }
        />
      ) : (
        <>
          {/* Desktop table — glass card with layered shadows */}
          <div className="card-3d hidden overflow-hidden md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                  <th className="px-6 py-3 font-medium">Document</th>
                  <th className="px-4 py-3 font-medium">Property</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Expiration</th>
                  <th className="px-4 py-3 font-medium">Last updated</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <DocumentRow key={d.id} doc={d} />
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {filtered.map((d) => (
              <DocumentCardMobile key={d.id} doc={d} />
            ))}
          </div>
        </>
      )}

      {/* Upload + Document AI pipeline modal */}
      <Modal
        open={uploadOpen}
        onClose={closeUpload}
        title="Upload document"
        subtitle="Document AI extracts the details and matches the file to the right requirement. Prototype — analysis is simulated in your browser."
        maxWidth="max-w-xl"
      >
        {!uploadState ? (
          <div className="space-y-4">
            <Field label="Attach to property" htmlFor="doc-property">
              <Select
                id="doc-property"
                value={targetProperty}
                onChange={(e) => setTargetProperty(e.target.value)}
                options={properties.map((p) => ({
                  value: p.id,
                  label: `${p.address} — ${p.city}, ${p.state}`,
                }))}
              />
            </Field>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 px-6 py-10 text-center transition-colors hover:border-primary-300 hover:bg-primary-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-card ring-1 ring-gray-200">
                <Upload className="h-5 w-5 text-primary-600" aria-hidden="true" />
              </span>
              <span className="mt-3 text-sm font-semibold text-gray-900">Choose a file to upload</span>
              <span className="mt-1 text-xs text-gray-500">PDF, PNG, JPG or DOC up to 10 MB</span>
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* File row */}
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-3.5">
              <DocIconTile category={uploadState ? guess?.category ?? "Other" : "Other"} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{uploadState.fileName}</p>
                <p className="text-xs text-gray-400">{prettySize(uploadState.size)}</p>
              </div>
              {uploadState.step === 3 ? (
                <span className={statusPill("verified").className}>
                  <span
                    className={cn("h-1.5 w-1.5 rounded-full", statusPill("verified").dotClass)}
                    aria-hidden="true"
                  />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-500/25">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" aria-hidden="true" />
                  Processing
                </span>
              )}
            </div>

            {/* Pipeline steps */}
            <ol className="space-y-3">
              {PIPELINE_STEPS.map((label, i) => (
                <li key={label} className="flex items-center gap-3">
                  {uploadState.step > i ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                  ) : uploadState.step === i ? (
                    <span
                      className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-primary-600"
                      aria-hidden="true"
                    />
                  ) : (
                    <span className="h-5 w-5 rounded-full border-2 border-gray-200" aria-hidden="true" />
                  )}
                  <span
                    className={cn(
                      "text-sm",
                      uploadState.step >= i ? "font-medium text-gray-900" : "text-gray-400",
                    )}
                  >
                    {label}
                    {uploadState.step === i && (
                      <span className="font-normal text-gray-400"> — analyzing...</span>
                    )}
                  </span>
                </li>
              ))}
            </ol>

            {/* Extracted fields */}
            {uploadState.step >= 1 && guess && (
              <dl className="animate-fade-in rounded-xl bg-gray-50 p-4">
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <div>
                    <dt className="text-xs text-gray-400">Document type</dt>
                    <dd className="mt-0.5 font-medium text-gray-900">{guess.docType}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-400">Property</dt>
                    <dd className="mt-0.5 font-medium text-gray-900">
                      {getProperty(targetProperty)?.address ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-400">Issued</dt>
                    <dd className="mt-0.5 font-medium text-gray-900">{formatDate(uploadState.issued)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-400">Expires</dt>
                    <dd className="mt-0.5 font-medium text-gray-900">{formatDate(uploadState.expires)}</dd>
                  </div>
                </div>
                {uploadState.step >= 2 && (
                  <div className="mt-3 flex animate-fade-in items-center justify-between border-t border-gray-200 pt-3 text-sm">
                    <div>
                      <dt className="text-xs text-gray-400">Matched requirement</dt>
                      <dd className="mt-0.5 font-medium text-primary-700">{guess.requirement}</dd>
                    </div>
                    <Badge variant="green" dot>
                      Confidence 98%
                    </Badge>
                  </div>
                )}
              </dl>
            )}

            {uploadState.step === 3 && (
              <div className="flex animate-fade-in flex-col gap-2 sm:flex-row sm:justify-end">
                <Button variant="outline" onClick={closeUpload}>
                  Discard
                </Button>
                <Button onClick={saveDocument}>Save to Evidence Vault</Button>
              </div>
            )}
          </div>
        )}
      </Modal>
      </div>
    </div>
  )
}

/* ------------------------------ Row variants ----------------------------- */

/* Expiration → color-coded chip with status + "In X days" subtext. */
function expirationChip(d: DocumentItem) {
  if (!d.expiresAt) return <span className="text-gray-400">—</span>
  const days = daysUntil(d.expiresAt)
  const tone =
    days !== null && days < 0
      ? {
          className: "bg-red-500/15 text-red-700 ring-1 ring-red-500/30",
          dotClass: "bg-red-500",
        }
      : days !== null && days <= 60
        ? {
            className: "bg-amber-500/15 text-amber-700 ring-1 ring-amber-500/30",
            dotClass: "bg-amber-500 animate-pulse",
          }
        : {
            className: "bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/30",
            dotClass: "bg-emerald-500",
          }
  return (
    <span
      className={cn(
        "doc-pill inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        tone.className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", tone.dotClass)} aria-hidden="true" />
      <span className="rounded-[3px] bg-black/5 px-1">{formatDate(d.expiresAt)}</span>
      <span className="opacity-80">{relativeDeadline(d.expiresAt)}</span>
    </span>
  )
}

function DocumentRow({ doc }: { doc: DocumentItem }) {
  const { getProperty, deleteDocument } = useData()
  const { toast } = useToast()
  const property = getProperty(doc.propertyId)

  return (
    <tr className="border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50/70">
      <td className="px-6 py-3.5">
        <div className="flex items-center gap-3">
          <DocIconTile category={doc.category} />
          <div className="min-w-0">
            <p className="max-w-[220px] truncate font-medium text-gray-900">{doc.name}</p>
            <p className="text-xs text-gray-400">
              {doc.size}
              {doc.matchedRequirement ? ` · ${doc.matchedRequirement}` : ""}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5 text-gray-600">{property?.address ?? "—"}</td>
      <td className="px-4 py-3.5 text-gray-600">{doc.category}</td>
      <td className="px-4 py-3.5">
        <span className={statusPill(doc.status).className}>
          <span
            className={cn("h-1.5 w-1.5 rounded-full", statusPill(doc.status).dotClass)}
            aria-hidden="true"
          />
          {statusLabel(doc.status)}
        </span>
      </td>
      <td className="px-4 py-3.5">{expirationChip(doc)}</td>
      <td className="px-4 py-3.5 text-gray-600">{formatDate(doc.uploadedAt)}</td>
      <td className="px-4 py-3.5">
        <Dropdown
          label={`Actions for ${doc.name}`}
          width="w-44"
          trigger={
            <div className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
              <MoreHorizontal className="h-4 w-4" />
            </div>
          }
        >
          {(close) => (
            <div className="py-1">
              <DropdownItem
                icon={<Eye className="h-4 w-4" />}
                onClick={() => {
                  close()
                  toast({ variant: "info", title: "Preview", description: "Document preview is simulated in this prototype." })
                }}
              >
                View details
              </DropdownItem>
              <DropdownItem
                icon={<Download className="h-4 w-4" />}
                onClick={() => {
                  close()
                  toast({ variant: "info", title: "Download", description: "Downloads are simulated in this prototype." })
                }}
              >
                Download
              </DropdownItem>
              <DropdownItem
                icon={<Trash2 className="h-4 w-4" />}
                danger
                onClick={() => {
                  close()
                  deleteDocument(doc.id)
                  toast({ variant: "success", title: "Document deleted", description: doc.name })
                }}
              >
                Delete
              </DropdownItem>
            </div>
          )}
        </Dropdown>
      </td>
    </tr>
  )
}

function DocumentCardMobile({ doc }: { doc: DocumentItem }) {
  const { getProperty } = useData()
  const property = getProperty(doc.propertyId)
  return (
    <div className="card-3d p-4">
      <div className="flex items-start gap-3">
        <DocIconTile category={doc.category} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">{doc.name}</p>
          <p className="text-xs text-gray-400">
            {property?.address ?? "—"} · {doc.category}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={statusPill(doc.status).className}>
              <span
                className={cn("h-1.5 w-1.5 rounded-full", statusPill(doc.status).dotClass)}
                aria-hidden="true"
              />
              {statusLabel(doc.status)}
            </span>
            {doc.expiresAt && (
              <span className="text-xs text-gray-500">Expires {formatDate(doc.expiresAt)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}