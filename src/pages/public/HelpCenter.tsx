import { useState } from "react"
import { Link } from "react-router-dom"
import { ChevronDown, Mail, Sparkles } from "lucide-react"
import SectionHeading from "../../components/SectionHeading"
import Button from "../../components/ui/Button"
import { cn } from "../../lib/utils"
import { usePageMeta } from "../../hooks/usePageMeta"

const FAQS = [
  {
    q: "How do I get started with RuleNest?",
    a: "Sign up for a free account, then add your first property with its address, unit count, year built, and rental type. RuleNest builds your Property DNA and maps the registration, inspection, and disclosure rules that may apply in about ninety seconds.",
  },
  {
    q: "How do I add more properties?",
    a: "Open the Properties page and click 'Add Property'. Enter the address and details for each new property — it gets its own compliance profile, deadlines, and documents. The free tier covers one property; paid plans add more.",
  },
  {
    q: "How do I upload and organize documents?",
    a: "Go to the Documents page (the Evidence Vault) and upload a PDF, PNG, JPG, or DOC up to 10 MB. RuleNest's document AI reads the file, guesses the document type, and matches it to the right property and requirement automatically.",
  },
  {
    q: "What is the Compliance Radar and how does it alert me?",
    a: "The Compliance Radar monitors official sources for regulatory changes that affect your properties — new ordinances, fee changes, and enforcement updates. Unread changes appear in your notifications and on the Dashboard until you review them.",
  },
  {
    q: "How do the deadlines and reminders work?",
    a: "Each property's requirements carry deadlines (registration renewals, inspections, certificate expirations). RuleNest groups them under Upcoming Deadlines and can remind you ahead of time so nothing lapses.",
  },
  {
    q: "What counts as 'proof' or evidence for a requirement?",
    a: "A registration certificate, inspection report, detector certificate, or disclosure with a date and your property's details. Upload it to the Evidence Vault and it's matched to the requirement; the Proof Pack exports everything into one file.",
  },
  {
    q: "Where is my account and data stored?",
    a: "In this prototype, all of your data — accounts, properties, documents, and tasks — lives in your browser's localStorage. Nothing is uploaded to a server. Clearing browser data resets the demo.",
  },
  {
    q: "How do I reset the demo data?",
    a: "Open Settings → Data and click 'Reset demo data'. This restores the original sample portfolio. You can also clear your browser's site data to start completely fresh.",
  },
  {
    q: "Can I change my profile or password?",
    a: "Profile name, phone, and company are editable in Settings → Profile. Because the prototype stores accounts locally, there is no server-side password reset; you can delete the local account to start over.",
  },
  {
    q: "Is RuleNest a substitute for legal advice?",
    a: "No. RuleNest provides compliance information and workflow assistance, not legal advice. Always verify requirements with the relevant official authority and, when in doubt, consult a qualified attorney.",
  },
]
export default function HelpCenter() {
  const [open, setOpen] = useState<number | null>(0)
  usePageMeta(
    "Help Center — RuleNest",
    "Answers to the most common RuleNest questions: getting started, adding properties, documents, radar alerts, account and data, and resetting the demo.",
  )

  return (
    <div>
      <section className="border-b border-gray-100 bg-gradient-to-b from-primary-50/50 to-white py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="Help center"
            title="How can we help?"
            description="Quick answers to the questions we hear most. Can't find what you need? We reply to every email within 24 hours."
          />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site">
          <div className="mx-auto max-w-3xl space-y-3">
            {FAQS.map((item, i) => (
              <div
                key={item.q}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card"
              >
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-gray-900 sm:text-base">{item.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-neutral-900 transition-transform duration-200",
                      open === i && "rotate-180",
                    )}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </button>
                {open === i && (
                  <div className="border-t border-gray-100 px-5 pb-5 pt-4">
                    <p className="text-sm leading-relaxed text-gray-600">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white">
              <Sparkles className="h-5 w-5 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">Still stuck?</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-600">
              Contact our team and we'll reply within 24 hours.
            </p>
            <div className="mt-5 flex justify-center">
              <Link to="/contact">
                <Button icon={<Mail className="h-4 w-4 text-white" strokeWidth={1.5} />}>
                  Contact support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}