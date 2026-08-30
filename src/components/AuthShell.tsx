import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { FileCheck2, Radar, ShieldCheck } from "lucide-react"
import Logo from "./Logo"

const highlights = [
  {
    icon: ShieldCheck,
    title: "Compliance intelligence",
    text: "Property-specific requirements, deadlines, and evidence — organized automatically.",
  },
  {
    icon: Radar,
    title: "Compliance Radar",
    text: "We watch official sources and alert you when local rules change.",
  },
  {
    icon: FileCheck2,
    title: "Audit-ready proof",
    text: "Generate a complete Proof Pack for any property in one click.",
  },
]

interface AuthShellProps {
  title: string
  subtitle: string
  children: ReactNode
}

export default function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Brand panel */}
      <aside className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-gray-950 p-12 lg:flex">
        <div
          className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary-600/25 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative">
          <Logo dark />
        </div>
        <div className="relative space-y-8">
          <h2 className="max-w-md text-3xl font-bold leading-tight tracking-tight text-white">
            Know what your property needs.{" "}
            <span className="text-primary-300">Before the city asks.</span>
          </h2>
          <ul className="space-y-6">
            {highlights.map((h) => (
              <li key={h.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                  <h.icon className="h-5 w-5 text-primary-300" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{h.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-400">{h.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs leading-relaxed text-gray-500">
          RuleNest provides compliance information and workflow assistance and does not provide
          legal advice.
        </p>
      </aside>

      {/* Form panel */}
      <div className="flex flex-1 flex-col px-4 py-6 sm:px-8 lg:px-16">
        <div className="flex items-center justify-between">
          <div className="lg:hidden">
            <Logo />
          </div>
          <Link
            to="/"
            className="ml-auto text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            ← Back to site
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md animate-fade-in-up">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
            <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}