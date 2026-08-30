import { useState } from "react"
import {
  Building2,
  CalendarClock,
  FileCheck2,
  FileText,
  Printer,
  Radar,
  Target,
  type LucideIcon,
} from "lucide-react"
import { LogoMark } from "../../components/Logo"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import Modal from "../../components/ui/Modal"
import { useData } from "../../context/DataContext"
import { useToast } from "../../context/ToastContext"
import { formatDate, relativeDeadline, statusLabel } from "../../lib/utils"
import type { AppData } from "../../types"

const REPORT_TYPES: Array<{ type: string; icon: LucideIcon; description: string }> = [
  {
    type: "Property Compliance Report",
    icon: Building2,
    description: "Full compliance profile for a property — requirements, evidence, and verification history.",
  },
  {
    type: "Compliance Gap Report",
    icon: Target,
    description: "Every missing document, expired certificate, and overdue obligation across the portfolio.",
  },
  {
    type: "Inspection Evidence Pack",
    icon: FileCheck2,
    description: "An audit-ready bundle of certificates, inspections, and disclosures for one property.",
  },
  {
    type: "Document Expiration Report",
    icon: CalendarClock,
    description: "All documents with expiration dates, sorted by urgency.",
  },
  {
    type: "Regulatory Change Report",
    icon: Radar,
    description: "Recent regulatory changes, affected properties, and required actions.",
  },
]

interface ReportContent {
  title: string
  sections: Array<{ heading: string; rows: Array<[string, string]> }>
}

function buildReportContent(type: string, data: AppData): ReportContent {
  const main = data.properties.find((p) => p.id === "prop_main") ?? data.properties[0]

  if (type === "Compliance Gap Report") {
    const gaps = data.requirements.filter(
      (r) => r.status === "missing-evidence" || r.status === "overdue",
    )
    return {
      title: "Compliance Gap Report — Portfolio",
      sections: [
        {
          heading: "Summary",
          rows: [
            ["Properties", String(data.properties.length)],
            ["Open gaps", String(gaps.length)],
          ],
        },
        {
          heading: "Gaps & next best actions",
          rows: gaps.map((g) => {
            const p = data.properties.find((pp) => pp.id === g.propertyId)
            return [
              g.name,
              `${p?.address ?? "—"} — ${statusLabel(g.status)} · Next: ${g.action}`,
            ] as [string, string]
          }),
        },
      ],
    }
  }

  if (type === "Document Expiration Report") {
    const expiring = data.documents
      .filter((d) => d.expiresAt)
      .sort((a, b) => +new Date(a.expiresAt ?? 0) - +new Date(b.expiresAt ?? 0))
    return {
      title: "Document Expiration Report",
      sections: [
        {
          heading: "Expirations",
          rows: expiring
            .slice(0, 12)
            .map(
              (d) =>
                [d.name, `${formatDate(d.expiresAt)} — ${relativeDeadline(d.expiresAt)}`] as [
                  string,
                  string,
                ],
            ),
        },
      ],
    }
  }

  if (type === "Regulatory Change Report") {
    return {
      title: "Regulatory Change Report",
      sections: [
        {
          heading: "Recent changes",
          rows: data.changes.map(
            (c) =>
              [
                c.jurisdiction,
                `${c.title} — effective ${formatDate(c.effectiveDate)} · ${c.requiredAction}`,
              ] as [string, string],
          ),
        },
      ],
    }
  }

  // Property-scoped reports use the primary property as the demo subject.
  if (!main) {
    return { title: type, sections: [{ heading: "Summary", rows: [["Properties", "0"]] }] }
  }
  const reqs = data.requirements.filter((r) => r.propertyId === main.id)
  const docs = data.documents.filter((d) => d.propertyId === main.id)

  if (type === "Inspection Evidence Pack") {
    return {
      title: `Inspection Evidence Pack — ${main.address}`,
      sections: [
        {
          heading: "Property",
          rows: [
            ["Address", `${main.address}, ${main.city}, ${main.state} ${main.zip}`],
            ["Compliance health", `${main.healthScore}/100`],
          ],
        },
        {
          heading: "Evidence documents",
          rows: docs.slice(0, 10).map(
            (d) =>
              [
                d.name,
                `${d.category} · ${statusLabel(d.status)}${d.expiresAt ? ` · Expires ${formatDate(d.expiresAt)}` : ""}`,
              ] as [string, string],
          ),
        },
      ],
    }
  }

  return {
    title: `Property Compliance Report — ${main.address}`,
    sections: [
      {
        heading: "Property summary",
        rows: [
          ["Address", `${main.address}, ${main.city}, ${main.state} ${main.zip}`],
          ["Units", String(main.units)],
          ["Compliance health", `${main.healthScore}/100`],
          ["Status", statusLabel(main.status)],
        ],
      },
      {
        heading: "Requirements",
        rows: reqs.map((r) => [r.name, statusLabel(r.status)] as [string, string]),
      },
      {
        heading: "Evidence on file",
        rows: [
          ["Documents", String(docs.length)],
          ["Verified", String(docs.filter((d) => d.status === "verified").length)],
          ["Expiring soon", String(docs.filter((d) => d.status === "expiring-soon").length)],
        ],
      },
    ],
  }
}

export default function Reports() {
  const data = useData()
  const { addReport, reports } = data
  const { toast } = useToast()
  const [generating, setGenerating] = useState<string | null>(null)
  const [preview, setPreview] = useState<ReportContent | null>(null)

  function generate(type: string) {
    setGenerating(type)
    // Simulate report assembly; content is built from live local data.
    window.setTimeout(() => {
      const content = buildReportContent(type, data)
      addReport({ type, title: content.title })
      setPreview(content)
      setGenerating(null)
      toast({ variant: "success", title: "Report generated", description: content.title })
    }, 900)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Reports</h1>
        <p className="mt-1 text-sm text-gray-500">
          Audit-ready reports and Proof Packs, generated from your live compliance data
        </p>
      </div>

      {/* Report types */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {REPORT_TYPES.map((r) => (
          <div
            key={r.type}
            className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-pop"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 transition-colors group-hover:bg-primary-100">
              <r.icon className="h-5 w-5 text-primary-600" aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-base font-semibold text-gray-900">{r.type}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{r.description}</p>
            <Button
              className="mt-6"
              variant="outline"
              loading={generating === r.type}
              onClick={() => generate(r.type)}
            >
              {generating === r.type ? "Generating…" : "Generate Report"}
            </Button>
          </div>
        ))}
      </div>

      {/* History */}
      <Card title="Report history" subtitle="Previously generated reports" noPadding>
        <ul className="divide-y divide-gray-50">
          {reports.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5 sm:px-6">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <FileText className="h-4 w-4 text-gray-500" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{r.title}</p>
                <p className="text-xs text-gray-400">
                  {r.type} · Generated {formatDate(r.createdAt)}
                </p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => generate(r.type)}>
                View
              </Button>
            </li>
          ))}
        </ul>
      </Card>

      {/* Printable preview */}
      <Modal
        open={preview !== null}
        onClose={() => setPreview(null)}
        title="Report preview"
        subtitle="Prototype preview — generated from your current data."
        maxWidth="max-w-3xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setPreview(null)}>
              Close
            </Button>
            <Button icon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>
              Print / Save PDF
            </Button>
          </>
        }
      >
        {preview && (
          <div className="print-area overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <LogoMark className="h-7 w-7 rounded-md" />
                  <span className="text-sm font-bold text-gray-900">RuleNest</span>
                </div>
                <span className="text-xs text-gray-400">
                  Generated {formatDate(new Date().toISOString())}
                </span>
              </div>
              <h2 className="mt-4 text-xl font-bold tracking-tight text-gray-900">{preview.title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                RuleNest provides compliance information and workflow assistance and does not
                provide legal advice. Always verify requirements with the relevant official
                authority.
              </p>
            </div>
            {preview.sections.map((s) => (
              <div key={s.heading} className="border-b border-gray-100 px-6 py-5 last:border-0">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {s.heading}
                </h3>
                <dl className="mt-3 divide-y divide-gray-50">
                  {s.rows.map(([k, v]) => (
                    <div key={k} className="flex items-start justify-between gap-6 py-2 text-sm">
                      <dt className="shrink-0 font-medium text-gray-700">{k}</dt>
                      <dd className="text-right text-gray-600">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}