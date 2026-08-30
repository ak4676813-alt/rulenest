import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, BookOpen, ExternalLink, HelpCircle, Search } from "lucide-react"
import SectionHeading from "../../components/SectionHeading"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"
import Modal from "../../components/ui/Modal"
import { Input } from "../../components/ui/Input"

/* Demo content: in-product sample resources. */
const GUIDES = [
  {
    id: "g_registration",
    tag: "Guide",
    minutes: 6,
    title: "Rental registration basics for small landlords",
    excerpt: "Which cities require registration, what information you'll need, and how renewals usually work.",
    body: "Many U.S. cities require rental properties to be registered or licensed annually. Registration typically asks for the property address, unit count, owner contact, and a local agent if you live out of state. Fees are usually per unit. Renewals are annual in most jurisdictions, and missing them can trigger fines or block evictions. RuleNest tracks the registration requirement for each property and reminds you before renewals open.",
  },
  {
    id: "g_smoke",
    tag: "Guide",
    minutes: 4,
    title: "Smoke & CO certificates: what counts as evidence",
    excerpt: "What inspectors look for, which documents prove compliance, and how long they stay valid.",
    body: "Most states require working smoke alarms in every bedroom, outside sleeping areas, and on every level. Carbon monoxide alarms are required where fuel-burning appliances or attached garages exist. Evidence usually means a fire-department certificate or dated photos plus a signed self-certification. Validity windows range from one year to the length of a tenancy. Store the certificate in your Evidence Vault so expiration is tracked automatically.",
  },
  {
    id: "g_inspection",
    tag: "Checklist",
    minutes: 8,
    title: "How rental inspections work (and how to prepare)",
    excerpt: "The common inspection points — egress, alarms, heating, sanitation — and a prep routine that avoids re-inspections.",
    body: "Rental inspections commonly check smoke/CO alarms, safe egress, heating, hot water, sanitary conditions, and visible hazards. Prepare by testing alarms, clearing exits, servicing heating systems, and having registration and certificates on site. Document the result the same day — upload the signed report so the requirement closes and the next cycle is scheduled.",
  },
  {
    id: "g_deposit",
    tag: "Reference",
    minutes: 10,
    title: "Security deposit rules: what to watch",
    excerpt: "Limits, holding accounts, interest, receipts, and return deadlines vary widely — here's the shape of the rules.",
    body: "States and cities differ on maximum deposit amounts, whether deposits must be held in separate accounts, whether interest is owed, what receipts are required, and how quickly deposits must be returned with itemized deductions. Keep the deposit receipt and statement of condition as evidence — they're among the first documents requested in disputes.",
  },
  {
    id: "g_vault",
    tag: "Guide",
    minutes: 5,
    title: "Keeping proof: building an audit-ready evidence vault",
    excerpt: "A simple filing discipline that turns scattered PDFs into proof you can hand over in minutes.",
    body: "Every requirement should map to at least one current document: certificates, registrations, inspection reports, disclosures, and insurance declarations. Name files consistently, keep the latest version on top, and track expiration dates. RuleNest's Evidence Vault does this automatically — upload once and documents are matched to the right requirement.",
  },
  {
    id: "g_notice",
    tag: "Playbook",
    minutes: 7,
    title: "What to do when a city notice arrives",
    excerpt: "Triage the notice, map it to a requirement and deadline, and convert it into a tracked task.",
    body: "When a notice arrives, capture three things immediately: the property it concerns, the requirement it references, and the deadline. Then decide the action — schedule, upload, renew — and track it to completion. RuleNest's Compliance Inbox detects all three automatically and can create the task for you.",
  },
]

const OFFICIAL = [
  { name: "EPA — Lead-based paint disclosure", url: "https://www.epa.gov/lead" },
  { name: "HUD — Rental housing resources", url: "https://www.hud.gov" },
]

export default function Resources() {
  const [openId, setOpenId] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const open = GUIDES.find((g) => g.id === openId) ?? null
  const filtered = GUIDES.filter(
    (g) =>
      g.title.toLowerCase().includes(query.toLowerCase()) ||
      g.excerpt.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div>
      <section className="border-b border-gray-100 bg-gradient-to-b from-primary-50/50 to-white py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="Resources"
            title="Compliance guides for self-managing landlords"
            description="Practical, plain-English references — the same knowledge RuleNest encodes into your property's requirements."
          />
          <div className="mx-auto mt-8 max-w-md">
            <Input
              icon={<Search className="h-4 w-4" />}
              placeholder="Search guides..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search guides"
            />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((g) => (
              <button
                key={g.id}
                onClick={() => setOpenId(g.id)}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-pop focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="purple">{g.tag}</Badge>
                  <span className="text-xs text-gray-400">{g.minutes} min read</span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900 group-hover:text-primary-700">
                  {g.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{g.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600">
                  Read guide
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </button>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-gray-500">No guides match "{query}".</p>
          )}

          {/* Official sources */}
          <div className="mt-16 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
                  <BookOpen className="h-5 w-5 text-primary-600" aria-hidden="true" />
                </span>
                <h3 className="text-base font-semibold text-gray-900">Official starting points</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Always verify requirements at the source. These official portals are good places to
                start:
              </p>
              <ul className="mt-4 space-y-2.5">
                {OFFICIAL.map((o) => (
                  <li key={o.name}>
                    <a
                      href={o.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-primary-200 hover:text-primary-700"
                    >
                      {o.name}
                      <ExternalLink className="h-4 w-4 text-gray-400" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card" id="help">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
                  <HelpCircle className="h-5 w-5 text-primary-600" aria-hidden="true" />
                </span>
                <h3 className="text-base font-semibold text-gray-900">Help Center</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Questions about your account, billing, or how RuleNest works? The fastest path is
                inside the app.
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Link to="/signup">
                  <Button className="w-full sm:w-auto">Open RuleNest</Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Contact us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guide reader modal (demo content) */}
      <Modal open={open !== null} onClose={() => setOpenId(null)} title={open?.title} maxWidth="max-w-2xl">
        <div className="flex items-center gap-3">
          <Badge variant="purple">{open?.tag}</Badge>
          <span className="text-xs text-gray-400">{open?.minutes} min read · demo content</span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-gray-700">{open?.body}</p>
        <p className="mt-6 rounded-xl bg-gray-50 p-4 text-xs leading-relaxed text-gray-500">
          RuleNest provides compliance information and workflow assistance and does not provide
          legal advice. Always verify requirements with the relevant official authority.
        </p>
      </Modal>
    </div>
  )
}