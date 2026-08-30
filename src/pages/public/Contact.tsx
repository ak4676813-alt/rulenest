import { Link } from "react-router-dom"
import { Mail, MessageSquare, Sparkles } from "lucide-react"
import SectionHeading from "../../components/SectionHeading"
import Button from "../../components/ui/Button"
import { usePageMeta } from "../../hooks/usePageMeta"

export default function Contact() {
  usePageMeta(
    "Contact — RuleNest",
    "Contact the RuleNest team. We reply to every message within 24 hours. Email support@getrulenest.com or visit the Help Center.",
  )

  return (
    <div>
      <section className="border-b border-gray-100 bg-gradient-to-b from-primary-50/50 to-white py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="Contact"
            title="Talk to a real person"
            description="Questions about your account, your property, or what RuleNest can do? Drop us a note — we reply within 24 hours."
          />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site">
          <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
            <div className="flex flex-col items-start rounded-2xl border border-gray-200 bg-white p-8 shadow-card">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white">
                <Mail className="h-5 w-5 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-gray-900">Email support</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                The fastest way to reach us. We reply to every message within 24 hours.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href="mailto:support@getrulenest.com">
                  <Button icon={<Mail className="h-4 w-4 text-white" strokeWidth={1.5} />}>
                    support@getrulenest.com
                  </Button>
                </a>
              </div>
              <p className="mt-4 text-xs text-gray-400">Mon–Fri, 9am–6pm ET</p>
            </div>

            <div className="flex flex-col items-start rounded-2xl border border-gray-200 bg-white p-8 shadow-card">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white">
                <MessageSquare className="h-5 w-5 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-gray-900">Help Center</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Browsing our guides is often the fastest fix. Covering getting started, properties,
                documents, radar alerts, and account data.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/help">
                  <Button variant="outline" icon={<Sparkles className="h-4 w-4 text-neutral-900" strokeWidth={1.5} />}>
                    Open Help Center
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-xs text-gray-400">Self-serve answers, available anytime</p>
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-xl text-center text-xs text-gray-500">
            RuleNest provides compliance information and workflow assistance and does not provide
            legal advice. For legal questions, consult a qualified attorney.
          </p>
        </div>
      </section>
    </div>
  )
}