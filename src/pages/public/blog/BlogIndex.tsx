import { Link } from "react-router-dom"
import { ArrowRight, Clock, FileText } from "lucide-react"
import SectionHeading from "../../../components/SectionHeading"
import { BLOG_POSTS } from "./blogData"

export default function BlogIndex() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="container-site relative py-16 sm:py-20">
          <SectionHeading
            eyebrow="Blog"
            title="Landlord compliance, explained"
            description="Practical guides on rental registration, inspections, detector laws, and deadlines — written for self-managing landlords."
          />
          <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-pop"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white transition-colors group-hover:bg-neutral-100">
                  <FileText className="h-5 w-5 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-lg font-semibold leading-snug text-gray-900">{post.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-xs text-gray-400">
                    {post.date} · {post.readTime}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors group-hover:text-primary-700">
                    Read
                    <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 flex items-center justify-center gap-2 text-xs text-gray-500">
            <Clock className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            New guides added regularly. RuleNest provides compliance information, not legal advice.
          </div>
        </div>
      </section>
    </div>
  )
}
