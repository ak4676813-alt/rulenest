import { Link } from "react-router-dom"
import {
  Archive,
  ArrowRight,
  BellRing,
  Compass,
  FileCheck2,
  Fingerprint,
  HelpCircle,
  MessageSquare,
  Network,
  Radar,
  Target,
} from "lucide-react"
import SectionHeading from "../../components/SectionHeading"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"

/* The ten capabilities that make RuleNest compliance intelligence —
   not a generic property manager. */
const DIFFERENTIATORS = [
  { icon: Fingerprint, title: "Property DNA", text: "Every property gets a structured profile — location, type, units, build year, occupancy — that drives everything else." },
  { icon: Network, title: "Compliance Graph", text: "Rules, requirements, evidence, deadlines and tasks stay linked — change one node and everything stays in sync." },
  { icon: Radar, title: "Compliance Radar", text: "Continuous monitoring of official sources, filtered down to what actually affects your properties." },
  { icon: HelpCircle, title: "Why This Applies", text: "Every requirement carries a plain-English explanation tied to your Property DNA. No unexplained checklists." },
  { icon: Archive, title: "Evidence Vault", text: "Documents are extracted, matched to requirements, and tracked for expiration automatically." },
  { icon: Target, title: "Compliance Gap Scanner", text: "Instantly surfaces missing evidence, expired documents, and unmet obligations across your portfolio." },
  { icon: Compass, title: "Next Best Action", text: "Every alert and requirement ends with the single most useful thing to do next." },
  { icon: MessageSquare, title: "Ask My Property", text: "Ask in plain English; answers come from your structured compliance data — never generic legal content." },
  { icon: FileCheck2, title: "Proof Pack", text: "One click exports an audit-ready bundle: requirements, evidence, and verification history." },
  { icon: BellRing, title: "Regulatory Change Monitoring", text: "Before/after comparisons of rule changes, with effective dates and affected properties." },
]

export default function Features() {
  return (
    <div>
      <section className="border-b border-gray-100 bg-gradient-to-b from-primary-50/50 to-white py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="Features"
            title="Compliance intelligence, not another property manager"
            description="RuleNest is purpose-built for one job: knowing what your rental property needs to stay compliant — and proving it. No rent collection, no tenant screening, no maintenance tickets."
          />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DIFFERENTIATORS.map((d) => (
              <div
                key={d.title}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-pop"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 transition-colors group-hover:bg-primary-100">
                  <d.icon className="h-5 w-5 text-primary-600" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-gray-900">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep dive: Compliance Radar */}
      <section className="bg-gray-50 py-16 sm:py-20" id="radar">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Compliance Radar"
              title="See exactly what changed — before it costs you"
              description="Every radar alert ships with a plain-English before/after comparison, the effective date, the official source, the properties affected, and the next best action."
            />
            <Link to="/signup">
              <Button className="mt-8">
                Turn on Radar for my properties
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-pop">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Radar className="h-4 w-4 text-primary-600" aria-hidden="true" />
                <p className="text-sm font-semibold text-gray-900">Boston Rental Registration</p>
              </div>
              <Badge variant="amber" dot>
                Requirement updated
              </Badge>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Before</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">
                  $25 per-unit fee · renewals open 60 days before expiration.
                </p>
              </div>
              <div className="rounded-xl border border-primary-200 bg-primary-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-500">
                  After · effective Jan 1, 2027
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-800">
                  $35 per-unit fee · proof of insurance required at registration · renewals open 90
                  days ahead.
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500">
              <span className="font-medium text-red-600">Affected: 2 properties</span>
              <span>Source: City of Boston — Rental Registration Portal</span>
            </div>
          </div>
        </div>
      </section>

      {/* Deep dive: Property DNA */}
      <section className="py-16 sm:py-20" id="property-dna">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-pop lg:order-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-bold text-gray-900">123 Main Street</p>
                <p className="text-sm text-gray-500">Boston, MA</p>
              </div>
              <Badge variant="purple">Property DNA</Badge>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Units", value: "4" },
                { label: "Built", value: "1975" },
                { label: "Rental type", value: "Long-term" },
                { label: "Owner occupied", value: "No" },
              ].map((d) => (
                <div key={d.label} className="rounded-xl bg-gray-50 p-3">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    {d.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{d.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl bg-primary-50 p-4">
              <p className="text-xs font-semibold text-primary-800">Why this applies — example</p>
              <p className="mt-1 text-sm leading-relaxed text-primary-900">
                Built in 1975 — before 1978 — so federal law requires a lead-based paint disclosure
                to tenants at lease signing.
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeading
              align="left"
              eyebrow="Property DNA"
              title="Requirements that explain themselves"
              description="RuleNest never hands you a bare checklist. Every requirement is attached to the property characteristics that trigger it — so you always know why it applies and what proves it."
            />
            <Link to="/signup">
              <Button variant="outline" className="mt-8">
                Build my Property DNA
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 sm:pb-24">
        <div className="container-site">
          <div className="rounded-3xl border border-primary-100 bg-primary-50 px-6 py-14 text-center sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-gray-900">
              See your property's compliance profile in 90 seconds
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-600">
              Free plan, no credit card. Add an address and RuleNest does the rest.
            </p>
            <Link to="/signup">
              <Button size="lg" className="mt-8">
                Check My Property Free
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}