import { Link, useParams } from "react-router-dom"
import { ArrowRight, Building2, ExternalLink, FileCheck2, MapPin, Radar, ShieldCheck } from "lucide-react"
import SectionHeading from "../../../components/SectionHeading"
import Button from "../../../components/ui/Button"
import { cityBySlug, VERIFY_NOTE } from "../../../data/cities"
import { GUIDE_LINKS } from "../guides/guideData"
import { usePageMeta } from "../../../hooks/usePageMeta"

const RELATED_BLOG: Array<{ title: string; slug: string }> = [
  { title: "Rental Registration Fines in 10 US Cities (And How to Avoid Them)", slug: "rental-registration-fines-10-cities" },
  { title: "The 27-Point Rental Compliance Checklist for Self-Managing Landlords", slug: "27-point-rental-compliance-checklist" },
]

export default function CityPage() {
  const { slug } = useParams<{ slug: string }>()
  const city = cityBySlug(slug ?? "")

  usePageMeta(
    city
      ? `Rental Compliance Rules in ${city.name}, ${city.state} | RuleNest`
      : "City Compliance Guide | RuleNest",
    city
      ? `Rental registration, inspections, fees, and detector rules for landlords in ${city.name}, ${city.state}. Verify deadlines with official sources and track them with RuleNest.`
      : "City compliance guide not found.",
  )

  if (!city) {
    return (
      <div className="container-site py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">City guide not found</h1>
        <p className="mt-3 text-gray-600">We don't have a page for that city yet.</p>
      </div>
    )
  }

  const facts = [
    {
      icon: Building2,
      title: `${city.name} rental registration`,
      body: city.registration,
    },
    {
      icon: ShieldCheck,
      title: "Inspections",
      body: city.inspection,
    },
    {
      icon: FileCheck2,
      title: "Fees and deadlines",
      body: city.fees,
    },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-b from-primary-50/50 to-white py-16 sm:py-20">
        <div className="container-site">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <Link to="/resources" className="font-medium text-primary-600 transition-colors hover:text-primary-700">
              Resources
            </Link>
            <span>/</span>
            <Link to="/resources" className="font-medium text-primary-600 transition-colors hover:text-primary-700">
              City guides
            </Link>
            <span>/</span>
            <span className="text-gray-900">{city.name}</span>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white">
              <MapPin className="h-5 w-5 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Rental compliance in {city.name}, {city.state}
              </h1>
              <p className="mt-1 text-sm text-gray-500">Registration, inspections, fees, and detector rules for landlords.</p>
            </div>
          </div>
        </div>
      </section>
{/* Overview */}
      <section className="py-14 sm:py-16">
        <div className="container-site">
          <div className="mx-auto max-w-3xl">
            <p className="text-lg leading-relaxed text-gray-600">
              If you rent property in {city.name}, {city.state}, a handful of recurring obligations
              determine most of your compliance risk: registration or licensing, periodic housing
              inspections, smoke and CO detector certificates, and — for older buildings — lead paint
              disclosure. This guide summarizes the shape of those rules so you know what to verify.
            </p>
            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
              {VERIFY_NOTE}
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {facts.map((f) => (
                <div key={f.title} className="rounded-xl border border-gray-200 bg-white p-5 shadow-card">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white">
                    <f.icon className="h-4 w-4 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h2 className="mt-3 text-sm font-semibold text-gray-900">{f.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Official sources (EEAT) */}
      <section className="border-t border-gray-100 py-14">
        <div className="container-site">
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              align="left"
              eyebrow="Official sources"
              title={`Verify ${city.name} rules with the city`}
              description="The summaries above are directional. These official pages are the source of truth for fees, deadlines, and code text."
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {city.officials.map((o) => (
                <a
                  key={o.url}
                  href={o.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-card transition-colors hover:border-primary-200"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {city.name} — {o.label}
                  </span>
                  <ExternalLink className="h-4 w-4 shrink-0 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related guides */}
      <section className="border-t border-gray-100 py-14">
        <div className="container-site">
          <div className="mx-auto max-w-3xl">
            <SectionHeading align="left" eyebrow="Deep dives" title={`Landlord guides for ${city.name}`} />
            <div className="mt-8 grid gap-3">
              {GUIDE_LINKS.map((g) => (
                <Link
                  key={g.slug}
                  to={`/guides/${g.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-card transition-colors hover:border-primary-200"
                >
                  <span className="text-sm font-medium text-gray-900">{g.title}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related blog */}
      <section className="border-t border-gray-100 py-14">
        <div className="container-site">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-lg font-semibold text-gray-900">Related reading</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {RELATED_BLOG.map((b) => (
                <Link
                  key={b.slug}
                  to={`/blog/${b.slug}`}
                  className="group rounded-xl border border-gray-200 bg-white p-4 shadow-card transition-colors hover:border-primary-200"
                >
                  <p className="text-sm font-medium text-gray-900 group-hover:text-primary-700">{b.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 pt-4">
        <div className="container-site">
          <div className="relative overflow-hidden rounded-3xl bg-gray-950 px-6 py-12 text-center sm:px-16">
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Track {city.name} deadlines without the spreadsheet
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-400">
                RuleNest maps registration, inspection, and certificate deadlines for each property —
                and reminds you 90, 60, and 30 days ahead.
              </p>
              <div className="mt-6 flex justify-center">
                <Link to="/signup">
                  <Button size="lg" icon={<Radar className="h-4 w-4 text-white" strokeWidth={1.5} />}>
                    Try RuleNest free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}