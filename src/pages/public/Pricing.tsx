import { Link } from "react-router-dom"
import { Check, Lock, ShieldCheck, Sparkles } from "lucide-react"
import SectionHeading from "../../components/SectionHeading"
import Button from "../../components/ui/Button"
import { usePageMeta } from "../../hooks/usePageMeta"

const EARLY_ACCESS_FEATURES = [
  "Unlimited properties during beta",
  "Compliance Radar alerts",
  "Document AI extraction",
  "Proof Pack exports",
  "Priority email support",
]

const PLANS = [
  {
    name: "Solo",
    price: "$12",
    period: "/month",
    tagline: "For landlords with a few units.",
    features: ["Up to 3 properties", "Compliance Radar alerts", "Document AI extraction", "Smart email reminders", "Ask My Property"],
  },
  {
    name: "Portfolio",
    price: "$29",
    period: "/month",
    tagline: "For growing portfolios.",
    features: ["Up to 10 properties", "Everything in Solo", "Proof Pack exports", "Compliance Inbox parsing", "SMS reminders"],
  },
  {
    name: "Pro",
    price: "$79",
    period: "/month",
    tagline: "For professional operators.",
    features: ["Unlimited properties", "Everything in Portfolio", "Team members", "API access", "Priority support"],
  },
]

const FAQ = [
  {
    q: "Is RuleNest really free right now?",
    a: "Yes. During Early Access every feature is unlocked at no cost — no credit card, no trial timer. When paid plans launch, early users keep generous free benefits forever.",
  },
  {
    q: "Is RuleNest legal advice?",
    a: "No. RuleNest provides compliance information and workflow assistance and does not provide legal advice. Always verify requirements with the relevant official authority or a qualified professional.",
  },
  {
    q: "Which cities are covered?",
    a: "Coverage expands continuously. The free tier surfaces core federal and state requirements; city-level monitoring is added jurisdiction by jurisdiction.",
  },
  {
    q: "How are my documents stored?",
    a: "In this prototype your documents are stored in your browser's localStorage. When the hosted service launches, documents will be encrypted in transit and at rest. See Security for details.",
  },
]

export default function Pricing() {
  usePageMeta(
    "RuleNest Pricing — Free During Early Access",
    "RuleNest is 100% free during Early Access. Unlimited properties, Compliance Radar, Document AI, and Proof Pack exports — no credit card required. Early users lock in generous free benefits forever.",
  )

  return (
    <div>
      <section className="border-b border-gray-100 bg-gradient-to-b from-primary-50/50 to-white py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="Pricing"
            title="Everything is free while we're in Early Access."
            description="No credit card. No trials. Every feature unlocked for early landlords. When paid plans launch, early users keep generous free benefits forever."
          />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site">
          {/* Early Access — highlighted card */}
          <div className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl border border-primary-600 bg-white p-8 shadow-card ring-1 ring-primary-600 sm:p-10">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary-100/60 blur-3xl"
              aria-hidden="true"
            />
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-3 py-1 text-[11px] font-semibold text-white">
              Early Access
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Sparkles className="h-5 w-5 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
              <h2 className="text-xl font-bold tracking-tight text-gray-900">Early Access — $0</h2>
            </div>
            <p className="mt-2 text-sm text-gray-600">Every feature unlocked. Free while we build.</p>
            <ul className="mt-6 space-y-3">
              {EARLY_ACCESS_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white">
                    <Check className="h-3 w-3 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="mt-8 block">
              <Button size="lg" className="w-full">
                Claim Free Access
                <Check className="h-4 w-4 text-white" strokeWidth={1.5} aria-hidden="true" />
              </Button>
            </Link>
            <p className="mt-4 text-center text-xs text-gray-500">
              Be one of the first self-managing landlords on RuleNest.
            </p>
          </div>

          {/* Coming after Early Access — muted preview cards */}
          <div className="mt-20">
            <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
              Coming after Early Access
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-gray-600">
              These plans are not live yet. Early Access users lock in 6 months free when paid plans
              launch.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className="relative flex flex-col rounded-2xl border border-gray-200 bg-gray-50/60 p-6 opacity-80"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white">
                    <Lock className="h-4 w-4 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <p className="mt-4 text-sm font-semibold text-gray-900">{plan.name}</p>
                  <p className="mt-2">
                    <span className="text-2xl font-bold tracking-tight text-gray-900">{plan.price}</span>
                    <span className="text-sm text-gray-500"> {plan.period}</span>
                  </p>
                  <p className="mt-1 text-xs text-gray-500">{plan.tagline}</p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-gray-500">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                          <Check className="h-3.5 w-3.5 text-gray-400" strokeWidth={1.5} aria-hidden="true" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-6 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-center text-xs font-medium text-gray-400">
                    Locked — coming soon
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mx-auto mt-20 max-w-3xl">
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
            Frequently asked questions
          </h2>
          <div className="mt-8 space-y-3">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-card"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="text-gray-400 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-5">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-gray-600">
              RuleNest provides compliance information and workflow assistance and does not provide
              legal advice. Always verify requirements with the relevant official authority.
            </p>
          </div>
        </div>
        </div>
      </section>
    </div>
  )
}