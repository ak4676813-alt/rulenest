import { useMemo, useRef, useState } from "react"
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
import StatusBadge from "../../components/StatusBadge"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"
import Dropdown, { DropdownItem } from "../../components/ui/Dropdown"
import EmptyState from "../../components/ui/EmptyState"
import Modal from "../../components/ui/Modal"
import { Field, Input, Select } from "../../components/ui/Input"
import { useData } from "../../context/DataContext"
import { useToast } from "../../context/ToastContext"
import { cn, daysUntil, formatDate, relativeDeadline } from "../../lib/utils"
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

function prettySize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

const PIPELINE_STEPS = ["Reading document", "Extracting information", "Matching to requirement"]

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Documents</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your Evidence Vault — {documents.length} documents, organized and tracked
          </p>
        </div>
        <Button icon={<Upload className="h-4 w-4" />} onClick={() => setUploadOpen(true)}>
          Upload Document
        </Button>
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

      {/* Category chips */}
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
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "border-primary-600 bg-primary-50 text-primary-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
              )}
            >
              {c}
              <span className={cn("rounded-full px-1.5 text-[10px]", active ? "bg-primary-100" : "bg-gray-100")}>
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
            <Button size="sm" icon={<Upload className="h-4 w-4" />} onClick={() => setUploadOpen(true)}>
              Upload Document
            </Button>
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card md:block">
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
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                <FileText className="h-5 w-5 text-primary-600" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{uploadState.fileName}</p>
                <p className="text-xs text-gray-400">{prettySize(uploadState.size)}</p>
              </div>
              {uploadState.step === 3 ? (
                <StatusBadge status="verified" />
              ) : (
                <Badge variant="blue" dot>
                  Processing
                </Badge>
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
  )
}

/* ------------------------------ Row variants ----------------------------- */

function expirationText(d: DocumentItem) {
  if (!d.expiresAt) return <span className="text-gray-400">—</span>
  const days = daysUntil(d.expiresAt)
  return (
    <span
      className={cn(
        "font-medium",
        days !== null && days < 0
          ? "text-red-600"
          : days !== null && days <= 60
            ? "text-amber-600"
            : "text-gray-600",
      )}
    >
      {formatDate(d.expiresAt)}
      <span className="block text-[11px] font-normal text-gray-400">{relativeDeadline(d.expiresAt)}</span>
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
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50">
            <FileText className="h-4 w-4 text-primary-600" aria-hidden="true" />
          </span>
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
        <StatusBadge status={doc.status} />
      </td>
      <td className="px-4 py-3.5">{expirationText(doc)}</td>
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
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-card">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50">
          <FileText className="h-4 w-4 text-primary-600" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">{doc.name}</p>
          <p className="text-xs text-gray-400">
            {property?.address ?? "—"} · {doc.category}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={doc.status} />
            {doc.expiresAt && (
              <span className="text-xs text-gray-500">Expires {formatDate(doc.expiresAt)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}