import { Link } from "react-router-dom"
import SectionHeading from "../../components/SectionHeading"
import { usePageMeta } from "../../hooks/usePageMeta"

export default function Terms() {
  usePageMeta(
    "Terms of Service — RuleNest",
    "RuleNest's terms of service: what the service does, the 'not legal advice' disclaimer, acceptable use, and our limitation of liability.",
  )

  return (
    <div>
      <section className="border-b border-gray-100 bg-gradient-to-b from-primary-50/50 to-white py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="Terms"
            title="Terms of Service"
            description="Effective date: January 2026. Please read these terms carefully — they govern your use of RuleNest."
          />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site">
          <div className="mx-auto max-w-3xl space-y-10">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900">The service</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                RuleNest is a compliance-intelligence workflow tool for self-managing landlords. It
                helps track rental registration, inspections, document evidence, and regulatory
                changes. This is a prototype demonstration.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900">Not legal advice</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                RuleNest provides compliance information and workflow assistance. It does not provide
                legal advice, legal opinions, or a substitute for consultation with a qualified
                attorney. Always verify requirements with the relevant official authority.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900">Acceptable use</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                You agree to use RuleNest lawfully and not to misuse it — including attempting to
                disrupt the service, probe for vulnerabilities without authorization, or use it to
                store unlawful content.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900">Limitation of liability</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                RuleNest is provided "as is," without warranties of any kind. To the maximum extent
                permitted by law, RuleNest and its operators are not liable for any indirect,
                incidental, or consequential damages arising from your use of the service, including
                missed compliance deadlines or fines.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900">Contact</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Questions about these terms? Email{" "}
                <a
                  href="mailto:support@getrulenest.com"
                  className="font-semibold text-primary-600 transition-colors hover:text-primary-700"
                >
                  support@getrulenest.com
                </a>
                .
              </p>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">
              See also our{" "}
              <Link
                to="/privacy"
                className="font-semibold text-primary-600 transition-colors hover:text-primary-700"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}