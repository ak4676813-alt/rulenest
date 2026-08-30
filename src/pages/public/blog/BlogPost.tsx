import { useEffect, type ReactNode } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowRight, CalendarDays, Check, Clock, ShieldCheck, User } from "lucide-react"
import Badge from "../../../components/ui/Badge"
import Button from "../../../components/ui/Button"
import { BLOG_POSTS, BLOG_AUTHOR, BLOG_AUTHOR_BIO } from "./blogData"

/** Render paragraphs that may contain [label](/path) inline link syntax. */
function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g)
  return parts.map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (m) {
      return (
        <Link
          key={i}
          to={m[2]}
          className="font-medium text-primary-600 underline decoration-primary-200 underline-offset-2 transition-colors hover:text-primary-700"
        >
          {m[1]}
        </Link>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = BLOG_POSTS.find((p) => p.slug === slug)

  useEffect(() => {
    document.title = post ? `${post.title} — RuleNest` : "Blog — RuleNest"
    return () => {
      document.title = "RuleNest — Rental Property Compliance Software for Landlords"
    }
  }, [post])

  // BlogPosting structured data for long-tail SEO.
  useEffect(() => {
    if (!post) return
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.id = "blogpost-jsonld"
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      datePublished: post.date,
      author: {
        "@type": "Person",
        name: post.author ?? BLOG_AUTHOR,
      },
      publisher: {
        "@type": "Organization",
        name: "RuleNest",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://getrulenest.com/blog/${post.slug}`,
      },
      description: post.excerpt,
    })
    document.head.appendChild(script)
    return () => {
      document.getElementById("blogpost-jsonld")?.remove()
    }
  }, [post])

  if (!post) {
    return (
      <div className="container-site py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Article not found</h1>
        <p className="mt-3 text-gray-600">The article you're looking for doesn't exist or was moved.</p>
        <div className="mt-6">
          <Link to="/blog">
            <Button variant="outline" icon={<ArrowRight className="h-4 w-4" strokeWidth={1.5} />}>
              Back to the blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="container-site relative mx-auto max-w-3xl py-14 sm:py-16">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/blog"
              className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
            >
              Blog
            </Link>
            <span className="text-gray-300">/</span>
            <Badge variant="outline">Landlord Guide</Badge>
          </div>
          <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
              {post.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
              {post.readTime}
            </span>
          </div>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">{post.excerpt}</p>

          {/* Author bio (EEAT) */}
          <div className="mt-8 flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-card">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-600">
              <User className="h-5 w-5 text-white" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900">{post.author ?? BLOG_AUTHOR}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{BLOG_AUTHOR_BIO}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 py-12">
        <div className="container-site mx-auto max-w-3xl">
          <article>
            {post.sections.map((section) => (
              <div key={section.heading} className="mb-9">
                <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph, i) => (
                  <p key={i} className="mt-4 leading-relaxed text-gray-600">
                    {renderInline(paragraph)}
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
          </article>

          {post.relatedLinks && post.relatedLinks.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-semibold text-gray-900">Keep reading</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {post.relatedLinks.map((link) => (
                  <Link
                    key={link.to + link.label}
                    to={link.to}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-card transition-colors hover:border-primary-200"
                  >
                    <span className="text-sm font-medium text-gray-900 group-hover:text-primary-700">
                      {link.label}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-gray-950 p-8 text-center sm:p-10">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Stop tracking deadlines by hand
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-gray-400">
              RuleNest tracks registration, inspections, detector certificates, and local rule changes
              for every property you own — and reminds you before deadlines slip.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Try RuleNest free
                  <ArrowRight className="h-4 w-4 text-white" strokeWidth={1.5} aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  See the features
                </Button>
              </Link>
            </div>
            <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-gray-500">
              <ShieldCheck className="h-3.5 w-3.5 text-neutral-400" strokeWidth={1.5} aria-hidden="true" />
              RuleNest provides compliance information, not legal advice.
            </p>
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-gray-100 pt-6">
            <Link to="/blog" className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700">
              ← All articles
            </Link>
            <Link
              to="/signup"
              className="text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
            >
              Get started free
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
