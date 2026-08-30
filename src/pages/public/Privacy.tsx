import { Link } from "react-router-dom"
import SectionHeading from "../../components/SectionHeading"
import { usePageMeta } from "../../hooks/usePageMeta"

export default function Privacy() {
  usePageMeta(
    "Privacy Policy — RuleNest",
    "RuleNest's privacy policy: what we collect, that we never sell your data, how cookies and localStorage are used, and how to reach us.",
  )

  return (
    <div>
      <section className="border-b border-gray-100 bg-gradient-to-b from-primary-50/50 to-white py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="Privacy"
            title="Privacy Policy"
            description="Effective date: January 2026. This policy is short on purpose — because we hold very little of your data."
          />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site">
          <div className="mx-auto max-w-3xl space-y-10">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900">What we collect</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                In this prototype, your account details (name, email, password hash), property
                information, documents, and tasks are stored entirely in your own browser using
                localStorage. We do not maintain a server-side database of your data.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900">We never sell your data</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                We do not sell, rent, or trade your personal information. Because your data lives in
                your browser, we have nothing to share in the first place.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900">Cookies and localStorage</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                RuleNest uses localStorage to persist your session, theme preference, and demo data.
                We do not use third-party ad trackers. You can clear this data at any time from your
                browser settings, which fully resets the demo.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900">Contact</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Questions about this policy? Email{" "}
                <a
                  href="mailto:support@getrulenest.com"
                  className="font-semibold text-primary-600 transition-colors hover:text-primary-700"
                >
                  support@getrulenest.com
                </a>
                . For security matters, use{" "}
                <a
                  href="mailto:security@getrulenest.com"
                  className="font-semibold text-primary-600 transition-colors hover:text-primary-700"
                >
                  security@getrulenest.com
                </a>
                .
              </p>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">
              See also our{" "}
              <Link
                to="/terms"
                className="font-semibold text-primary-600 transition-colors hover:text-primary-700"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/security"
                className="font-semibold text-primary-600 transition-colors hover:text-primary-700"
              >
                Security
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}