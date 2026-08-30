import { Link } from "react-router-dom"
import { FileCheck2, Lock, ShieldCheck } from "lucide-react"
import SectionHeading from "../../components/SectionHeading"
import { usePageMeta } from "../../hooks/usePageMeta"

const PILLARS = [
  {
    icon: Lock,
    title: "Encryption in transit",
    text: "All traffic to and from RuleNest is encrypted with TLS (HTTPS). Your data is never sent over an unencrypted connection.",
  },
  {
    icon: FileCheck2,
    title: "Demo data stays in your browser",
    text: "In this prototype, your accounts, properties, documents, and tasks live only in your browser's localStorage. Nothing is uploaded to a server, and clearing site data removes it permanently.",
  },
  {
    icon: ShieldCheck,
    title: "Responsible disclosure",
    text: "Found a security issue? Tell us at security@getrulenest.com and we'll respond promptly. We're grateful to researchers who report responsibly.",
  },
]

export default function Security() {
  usePageMeta(
    "Security — RuleNest",
    "How RuleNest protects your data: encryption in transit, demo data stored only in your browser, and a responsible disclosure program at security@getrulenest.com.",
  )

  return (
    <div>
      <section className="border-b border-gray-100 bg-gradient-to-b from-primary-50/50 to-white py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="Security"
            title="Your data, protected"
            description="RuleNest is built with security in mind — from encrypted connections to keeping your demo data entirely in your own browser."
          />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site">
          <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-3">
            {PILLARS.map((p) => (
              <div key={p.title} className="flex flex-col items-start rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white">
                  <p.icon className="h-5 w-5 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-base font-semibold text-gray-900">{p.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{p.text}</p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-12 max-w-xl text-center text-sm leading-relaxed text-gray-600">
            Have a vulnerability to report? Email{" "}
            <a
              href="mailto:security@getrulenest.com"
              className="font-semibold text-primary-600 transition-colors hover:text-primary-700"
            >
              security@getrulenest.com
            </a>
            . Please include reproduction steps if you have them.
          </p>

          <p className="mx-auto mt-6 max-w-xl text-center text-xs text-gray-500">
            Want to know how we handle your information? Read our{" "}
            <Link
              to="/privacy"
              className="font-semibold text-primary-600 transition-colors hover:text-primary-700"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  )
}