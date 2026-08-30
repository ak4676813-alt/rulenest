import { Link } from "react-router-dom"
import { ArrowRight, Compass, FileCheck2, Lock, Mail, ShieldCheck } from "lucide-react"
import SectionHeading from "../../components/SectionHeading"
import Button from "../../components/ui/Button"

const VALUES = [
  {
    icon: Compass,
    title: "Clarity over jargon",
    text: "Municipal code is written for lawyers. RuleNest translates it into plain English a working landlord can act on.",
  },
  {
    icon: ShieldCheck,
    title: "Property-specific, never generic",
    text: "A 1975 four-unit in Boston and a 2001 condo in Chicago share almost no obligations. Our answers reflect that.",
  },
  {
    icon: FileCheck2,
    title: "Proof, not promises",
    text: "Compliance you can't evidence is compliance you can't use. Every requirement ends in an artifact you can hand over.",
  },
]

export default function About() {
  return (
    <div>
      <section className="border-b border-gray-100 bg-gradient-to-b from-primary-50/50 to-white py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="About us"
            title="Compliance shouldn't require a lawyer on retainer"
            description="RuleNest is built for the millions of self-managing landlords who are one missed deadline away from a fine — and who deserve tooling as good as the institutions they deal with."
          />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site">
          <div className="mx-auto max-w-3xl space-y-5 text-base leading-relaxed text-gray-600">
            <p>
              Most rental-compliance failures aren't deliberate — they're invisible. A registration
              renewal buried on a city portal. An inspection cycle that quietly changed. A
              certificate that expired three months before anyone noticed.
            </p>
            <p>
              RuleNest exists to make those obligations visible. We map each property's
              characteristics — its Property DNA — against city, county, state, and federal rules,
              then keep watch: tracking deadlines, monitoring regulatory changes, and keeping
              evidence organized so proof is always one click away.
            </p>
            <p>
              We're focused deliberately. RuleNest is not a property manager — no rent collection,
              no tenant screening, no maintenance tickets. Just compliance intelligence, done
              properly.
            </p>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
                  <v.icon className="h-5 w-5 text-primary-600" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-gray-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 sm:py-20" id="contact">
        <div className="container-site grid gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
                <Mail className="h-5 w-5 text-primary-600" aria-hidden="true" />
              </span>
              <h3 className="text-base font-semibold text-gray-900">Contact</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Questions, coverage requests, or partnership ideas — we'd love to hear from you.
            </p>
            <a
              href="mailto:hello@rulenest.com"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              hello@rulenest.com
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <p className="mt-2 text-xs text-gray-400">We reply within one business day.</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card" id="security">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
                <Lock className="h-5 w-5 text-primary-600" aria-hidden="true" />
              </span>
              <h3 className="text-base font-semibold text-gray-900">Security</h3>
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-gray-600">
              <li>• Encryption in transit and at rest</li>
              <li>• Least-privilege access to customer data</li>
              <li>• Your documents are never sold or shared</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
                <FileCheck2 className="h-5 w-5 text-primary-600" aria-hidden="true" />
              </span>
              <h3 className="text-base font-semibold text-gray-900">Privacy & Terms</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-600" id="privacy">
              We collect only what's needed to run the product, never sell personal data, and honor
              deletion requests.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600" id="terms">
              By using RuleNest you agree that the product provides compliance information and
              workflow assistance — not legal advice.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-gray-900">
            Know what your property needs. Before the city asks.
          </h2>
          <Link to="/signup">
            <Button size="lg" className="mt-8">
              Check My Property Free
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}