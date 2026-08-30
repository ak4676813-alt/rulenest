import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowRight, Check, MapPin, ShieldCheck } from "lucide-react"
import SectionHeading from "../../../components/SectionHeading"
import Button from "../../../components/ui/Button"
import { CITIES } from "../../../data/cities"
import { getGuide, GUIDE_LINKS } from "./guideData"
import { usePageMeta } from "../../../hooks/usePageMeta"

export default function GuidePage() {
  const { slug } = useParams<{ slug: string }>()
  const guide = getGuide(slug ?? "")

  usePageMeta(
    guide ? `${guide.title} | RuleNest` : "Guide not found | RuleNest",
    guide ? `${guide.description} Requirements by city, deadlines, and what landlords must track.` : undefined,
  )

  useEffect(() => {
    if (!guide) return
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.id = "guide-faq-jsonld"
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    })
    document.head.appendChild(script)
    return () => {
      document.getElementById("guide-faq-jsonld")?.remove()
    }
  }, [guide])

  if (!guide) {
    return (
      <div className="container-site py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Guide not found</h1>
        <p className="mt-3 text-gray-600">That guide doesn't exist yet.</p>
        <div className="mt-5">
          <Link to="/resources">
            <Button variant="outline">Back to resources</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <section className="border-b border-gray-100 bg-gradient-to-b from-primary-50/50 to-white py-16 sm:py-20">
        <div className="container-site">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <Link to="/resources" className="font-medium text-primary-600 transition-colors hover:text-primary-700">
                Resources
              </Link>
              <span>/</span>
              <span className="text-gray-900">Guides</span>
            </div>
            <SectionHeading
              align="left"
              eyebrow={guide.eyebrow}
              title={guide.title}
              description={guide.description}
            />
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="container-site">
          <article className="mx-auto max-w-3xl">
            {guide.intro.map((p, i) => (
              <p key={i} className="mb-4 leading-relaxed text-gray-700">
                {p}
              </p>
            ))}

            {guide.sections.map((section) => (
              <div key={section.heading} className="mt-10">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">{section.heading}</h2>
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="mt-4 leading-relaxed text-gray-700">
                    {p}
                  </p>
                ))}
                {section.list && (
                  <ul className="mt-5 space-y-2.5">
                    {section.list.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white">
                          <Check className="h-3 w-3 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
                        </span>
                        <span className="text-sm leading-relaxed text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Requirements by city */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Requirements by city</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                How this obligation works in the cities we cover. Click a city for the full breakdown.
              </p>
              <div className="mt-6 divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card">
                {guide.cityRows.map((row) => {
                  const exists = CITIES.some((c) => c.slug === row.slug)
                  return (
                    <div key={row.slug} className="flex items-center justify-between gap-4 px-5 py-3.5">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{row.city}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="h-3 w-3 shrink-0 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
                          {row.summary}
                        </p>
                      </div>
                      {exists ? (
                        <Link
                          to={`/compliance/${row.slug}`}
                          className="shrink-0 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
                        >
                          City page
                          <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                        </Link>
                      ) : (
                        <span className="shrink-0 text-xs text-gray-400">Coming soon</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* FAQ */}
            <div className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Frequently asked questions</h2>
              <div className="mt-6 space-y-3">
                {guide.faq.map((f) => (
                  <details key={f.q} className="group rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-card">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <span className="text-gray-400 transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>

            {/* Other guides */}
            <div className="mt-14">
              <h2 className="text-lg font-semibold text-gray-900">More guides</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {GUIDE_LINKS.filter((g) => g.slug !== guide.slug).map((g) => (
                  <Link
                    key={g.slug}
                    to={`/guides/${g.slug}`}
                    className="group rounded-xl border border-gray-200 bg-white p-4 shadow-card transition-colors hover:border-primary-200"
                  >
                    <p className="text-sm font-medium text-gray-900 group-hover:text-primary-700">{g.title}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-14 rounded-2xl bg-gray-950 p-8 text-center sm:p-10">
              <h2 className="text-xl font-bold text-white sm:text-2xl">Never let a renewal slip again</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-gray-400">
                RuleNest tracks registration, inspections, detectors, and certificates for every
                property — with reminders 90, 60, and 30 days ahead.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/signup">
                  <Button size="lg">
                    Try RuleNest free
                    <ArrowRight className="h-4 w-4 text-white" strokeWidth={1.5} aria-hidden="true" />
                  </Button>
                </Link>
                <Link to="/features">
                  <Button size="lg" variant="outline">
                    See the features
                  </Button>
                </Link>
              </div>
              <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-gray-500">
                <ShieldCheck className="h-3.5 w-3.5 text-neutral-400" strokeWidth={1.5} aria-hidden="true" />
                RuleNest provides compliance information, not legal advice.
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}