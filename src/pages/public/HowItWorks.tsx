import { Link } from "react-router-dom"
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import SectionHeading from "../../components/SectionHeading"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"

const STEPS = [
  {
    n: "01",
    icon: MapPin,
    title: "Enter your property",
    text: "Tell us the address and basic property details — units, build year, rental type. Ninety seconds, no paperwork.",
    points: ["Address and unit count", "Build year and property type", "Rental type and occupancy"],
  },
  {
    n: "02",
    icon: Sparkles,
    title: "We build your Property DNA",
    text: "RuleNest maps your property's characteristics against city, county, state, and federal rental rules to identify the regulations that may apply.",
    points: ["Location-driven rule matching", "Applicability explained in plain English", "An official source for every rule"],
  },
  {
    n: "03",
    icon: ClipboardCheck,
    title: "Fix your compliance gaps",
    text: "The Gap Scanner shows missing documents, upcoming deadlines, and required actions — each with a clear next best action.",
    points: ["Missing evidence, surfaced", "Deadlines with smart reminders", "One-click tasks from any alert"],
  },
  {
    n: "04",
    icon: ShieldCheck,
    title: "Stay protected",
    text: "Compliance Radar watches for regulatory changes while your Evidence Vault stays organized — and Proof Pack keeps you audit-ready.",
    points: ["Before/after change alerts", "Expiration tracking", "Audit-ready reports in one click"],
  },
]

export default function HowItWorks() {
  return (
    <div>
      <section className="border-b border-gray-100 bg-gradient-to-b from-primary-50/50 to-white py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="How it works"
            title="From address to audit-ready"
            description="Four steps. No spreadsheets, no guesswork, no digging through municipal code."
          />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site space-y-14">
          {STEPS.map((step, i) => (
            <div
              key={step.n}
              className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-primary-600">{step.n}</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50">
                    <step.icon className="h-5 w-5 text-primary-600" aria-hidden="true" />
                  </span>
                </div>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {step.title}
                </h2>
                <p className="mt-3 leading-relaxed text-gray-600">{step.text}</p>
                <ul className="mt-5 space-y-2.5">
                  {step.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                        <Check className="h-3 w-3 text-emerald-600" aria-hidden="true" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <StepVisual index={i} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="container-site">
          <div className="rounded-3xl border border-primary-100 bg-primary-50 px-6 py-14 text-center sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-gray-900">
              Ready when you are
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-600">
              Add your first property and watch the Property DNA build itself.
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

/* Compact, realistic UI vignettes for each step. */
function StepVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-pop">
        <p className="text-sm font-semibold text-gray-900">Add property</p>
        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700">
            123 Main Street
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700">Boston</div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700">MA</div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700">02118</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700">4 units</div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700">Built 1975</div>
          </div>
          <div className="rounded-lg bg-primary-600 px-3 py-2.5 text-center text-sm font-medium text-white">
            Add property
          </div>
        </div>
      </div>
    )
  }
  if (index === 1) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-pop">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">Property DNA</p>
          <Badge variant="purple">Building…</Badge>
        </div>
        <div className="mt-4 space-y-2.5">
          {[
            { label: "Location rules mapped", done: true },
            { label: "Applicability scored", done: true },
            { label: "9 potential obligations identified", done: true },
            { label: "Evidence checklist drafted", done: false },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-2.5 rounded-lg border border-gray-100 px-3 py-2">
              <span
                className={
                  row.done
                    ? "flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500"
                    : "h-4 w-4 rounded-full border-2 border-gray-200 border-t-primary-500 animate-spin"
                }
              >
                {row.done && <Check className="h-2.5 w-2.5 text-white" aria-hidden="true" />}
              </span>
              <p className="text-sm text-gray-700">{row.label}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (index === 2) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-pop">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">Compliance Gap Scanner</p>
          <Badge variant="red" dot>2 gaps</Badge>
        </div>
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-3 py-2.5">
            <div>
              <p className="text-sm font-medium text-gray-900">Smoke/CO Certification</p>
              <p className="text-xs text-red-600">Missing evidence</p>
            </div>
            <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-primary-700 shadow-sm">
              Upload certificate
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50 px-3 py-2.5">
            <div>
              <p className="text-sm font-medium text-gray-900">Annual Inspection</p>
              <p className="text-xs text-amber-600">Due in 31 days</p>
            </div>
            <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-primary-700 shadow-sm">
              Schedule inspection
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5">
            <div>
              <p className="text-sm font-medium text-gray-900">Rental Registration</p>
              <p className="text-xs text-gray-400">Current · renews Jun 2027</p>
            </div>
            <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-pop">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">Proof Pack</p>
        <Badge variant="green" dot>Audit-ready</Badge>
      </div>
      <div className="mt-4 space-y-2.5">
        {[
          "Requirements & applicability (9)",
          "Evidence documents (12)",
          "Verification history (24 entries)",
          "Open items & next best actions (2)",
        ].map((row) => (
          <div key={row} className="flex items-center gap-2.5 rounded-lg border border-gray-100 px-3 py-2">
            <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" />
            <p className="text-sm text-gray-700">{row}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-primary-600 px-3 py-2.5 text-center text-sm font-medium text-white">
        Generate report
      </div>
    </div>
  )
}