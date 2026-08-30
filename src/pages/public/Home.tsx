import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertTriangle,
  Archive,
  ArrowRight,
  Bell,
  Building2,
  CalendarClock,
  Check,
  ChevronDown,
  Eye,
  FileCheck2,
  FileSearch,
  FileText,
  Inbox,
  LayoutDashboard,
  Link2,
  ListChecks,
  MapPin,
  MapPinned,
  MessageSquare,
  Play,
  Radar,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react"
import SectionHeading from "../../components/SectionHeading"
import { LogoMark } from "../../components/Logo"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"
import { cn } from "../../lib/utils"

export default function Home() {
  // Inject FAQPage structured data for search engines (People-Also-Ask style).
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.id = "faq-page-jsonld"
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    })
    document.head.appendChild(script)
    return () => {
      document.getElementById("faq-page-jsonld")?.remove()
    }
  }, [])

  return (
    <div>
      <Hero />
      <TrustStrip />
      <FeaturesSection />
      <HowItWorksSection />
      <PropertyDnaSection />
      <RadarSection />
      <DocumentsSection />
      <AiSection />
      <PricingPreview />
      <FaqSection />
      <FinalCta />
    </div>
  )
}

/* ---------------------------------- Hero --------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-primary-50/60 via-white to-white"
        aria-hidden="true"
      />
      <div className="container-site relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:gap-10 lg:py-24">
        <div className="max-w-xl">
          <Badge variant="purple" className="px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
            Compliance intelligence for self-managing landlords
          </Badge>
          <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-gray-900 sm:text-5xl xl:text-6xl">
            Know what your property needs.{" "}
            <span className="relative inline-block text-primary-600">
              Before the city asks.
              <svg
                className="absolute -bottom-2 left-0 h-3 w-full"
                viewBox="0 0 300 12"
                fill="none"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 9C60 3 180 2 298 7"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="text-primary-200"
                />
              </svg>
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            RuleNest monitors local rental regulations, tracks deadlines, and keeps your compliance
            proof ready—so you can rent with confidence.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Check My Property Free
                <ArrowRight className="h-4 w-4 text-white" strokeWidth={1.5} aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
                icon={<Play className="h-4 w-4 text-neutral-900" strokeWidth={1.5} />}
              >
                See How It Works
              </Button>
            </Link>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
            {["No credit card required", "Setup in 90 seconds", "Cancel anytime"].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <DashboardPreview />
      </div>
    </section>
  )
}

/* A realistic product preview — built from real UI primitives, not a graphic.
   It auto-cycles through the demo tabs every 3.5s; clicking a tab focuses it
   and rotation continues from there. */
const DEMO_TABS = ["Overview", "Compliance Radar", "Properties", "Tasks", "Documents"] as const
type DemoTab = (typeof DEMO_TABS)[number]

interface DemoPropertyRow {
  name: string
  meta: string
  score: number
  status: string
  bar: string
  pill: string
  chip: string
}

interface RadarChange {
  title: string
  affected: string
  beforeAfter: Array<{ label: string; before: string; after: string }>
}

interface TaskRow {
  title: string
  due: string
  status: string
  pill: string
}

interface DocRow {
  name: string
  meta: string
  status: string
  pill: string
}

function DashboardPreview() {
  const [activeDemoTab, setActiveDemoTab] = useState<DemoTab>("Overview")
  const [displayTab, setDisplayTab] = useState<DemoTab>("Overview")
  const [fading, setFading] = useState(false)

  // Auto-rotate through the demo tabs every 3.5 seconds.
  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveDemoTab((prev) => {
        const idx = DEMO_TABS.indexOf(prev)
        return DEMO_TABS[(idx + 1) % DEMO_TABS.length]
      })
    }, 3500)
    return () => window.clearInterval(id)
  }, [])

  // Two-phase crossfade: fade out, swap content, fade back in.
  useEffect(() => {
    if (activeDemoTab === displayTab) return
    setFading(true)
    const t = window.setTimeout(() => {
      setDisplayTab(activeDemoTab)
      setFading(false)
    }, 150)
    return () => window.clearTimeout(t)
  }, [activeDemoTab, displayTab])

  const sidebar = [
    { icon: LayoutDashboard, label: "Overview" },
    { icon: Radar, label: "Compliance Radar" },
    { icon: Building2, label: "Properties" },
    { icon: ListChecks, label: "Tasks" },
    { icon: FileText, label: "Documents" },
    { icon: Inbox, label: "Inbox" },
  ]
  const demoRows: DemoPropertyRow[] = [
    { name: "123 Main Street", meta: "Boston, MA · 4 Units", score: 92, status: "Good", bar: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-700", chip: "from-indigo-400 to-blue-400" },
    { name: "56 Oak Avenue", meta: "Chicago, IL · 2 Units", score: 78, status: "Fair", bar: "bg-amber-500", pill: "bg-amber-50 text-amber-700", chip: "from-violet-400 to-indigo-400" },
    { name: "789 Pine Road", meta: "Denver, CO · 1 Unit", score: 68, status: "Needs Attention", bar: "bg-red-500", pill: "bg-red-50 text-red-700", chip: "from-amber-400 to-orange-400" },
    { name: "22 Birch Lane", meta: "Seattle, WA · 3 Units", score: 88, status: "Good", bar: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-700", chip: "from-emerald-400 to-teal-400" },
  ]
  const radarChanges: RadarChange[] = [
    {
      title: "Boston, MA — Rent increase cap updated",
      affected: "Affects 1 property · 123 Main Street",
      beforeAfter: [
        { label: "Max annual increase", before: "4.2%", after: "5.5%" },
        { label: "Notice window", before: "30 days", after: "60 days" },
      ],
    },
    {
      title: "Chicago, IL — Detector cert rule change",
      affected: "Affects 2 properties",
      beforeAfter: [
        { label: "Cert validity", before: "1 year", after: "2 years" },
        { label: "Reinspection fee", before: "$50", after: "$75" },
      ],
    },
  ]
  const taskRows: TaskRow[] = [
    { title: "Renew smoke detector certificate", due: "Nov 12", status: "Overdue", pill: "bg-red-50 text-red-700" },
    { title: "Submit Boston registration renewal", due: "Dec 3", status: "Due Soon", pill: "bg-amber-50 text-amber-700" },
    { title: "Upload lead paint disclosure", due: "Jan 8", status: "Upcoming", pill: "bg-gray-100 text-gray-600" },
    { title: "Schedule biennial inspection", due: "Jan 21", status: "Upcoming", pill: "bg-gray-100 text-gray-600" },
  ]
  const docRows: DocRow[] = [
    { name: "Smoke Detector Certificate", meta: "Certificate · Expires Nov 12", status: "Verified", pill: "bg-emerald-50 text-emerald-700" },
    { name: "Boston Registration 2026", meta: "Registration · Expires Dec 31", status: "Verified", pill: "bg-emerald-50 text-emerald-700" },
    { name: "Inspection Report — 123 Main", meta: "Report · High confidence match", status: "Analyzing", pill: "bg-blue-50 text-blue-700" },
    { name: "Lead Paint Disclosure", meta: "Disclosure · High confidence match", status: "Verified", pill: "bg-emerald-50 text-emerald-700" },
  ]

  return (
    <div className="relative">
      <div
        className="absolute -inset-8 rounded-[2rem] bg-gradient-to-tr from-primary-100 via-indigo-50 to-transparent blur-2xl"
        aria-hidden="true"
      />
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-preview">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <div className="ml-3 flex h-6 flex-1 items-center rounded-md bg-gray-100 px-2.5 text-[10px] text-gray-400">
            app.rulenest.com/{displayTab.toLowerCase().replace(/\s+/g, "-")}
          </div>
        </div>
        <div className="flex">
          {/* Mini sidebar */}
          <div className="hidden w-36 shrink-0 border-r border-gray-100 bg-gray-50/60 p-3 sm:block">
            <div className="flex items-center gap-2 px-1 pb-3">
              <LogoMark className="h-6 w-6 rounded-md" />
              <span className="text-xs font-bold text-gray-900">RuleNest</span>
            </div>
            <div className="space-y-1">
              {sidebar.map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-[10px] font-medium",
                    item.label === displayTab ? "bg-primary-50 text-primary-700" : "text-gray-500",
                  )}
                >
                  <item.icon className="h-3 w-3 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
          {/* Main panel */}
          <div className="min-w-0 flex-1 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 rounded-md border border-gray-200 px-2 py-1 text-[11px] font-medium text-gray-700">
                123 Main Street, Boston, MA
                <ChevronDown className="h-3 w-3 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <div className="flex items-center gap-2">
                <Bell className="h-3.5 w-3.5 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[9px] font-semibold text-white">
                  JA
                </span>
              </div>
            </div>
            <p className="mt-3 text-[13px] font-semibold text-gray-900">{displayTab}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {DEMO_TABS.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveDemoTab(label)}
                  aria-pressed={activeDemoTab === label}
                  className={cn(
                    "rounded-full px-2 py-1 text-[9px] font-medium transition-colors",
                    activeDemoTab === label
                      ? "bg-primary-600 text-white"
                      : "border border-gray-200 bg-white text-gray-500 hover:text-gray-700",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <div
              className={cn(
                "mt-3 min-h-[280px] transition-all duration-300 ease-out",
                fading ? "-translate-y-1 opacity-0" : "translate-y-0 opacity-100",
              )}
            >
              {displayTab === "Overview" && <DemoOverview rows={demoRows.slice(0, 3)} />}
              {displayTab === "Compliance Radar" && <DemoRadar changes={radarChanges} />}
              {displayTab === "Properties" && <DemoProperties rows={demoRows} />}
              {displayTab === "Tasks" && <DemoTasks rows={taskRows} />}
              {displayTab === "Documents" && <DemoDocuments rows={docRows} />}
            </div>
          </div>
        </div>
      </div>
      {/* Floating radar alert */}
      <div
        className="absolute -right-3 -top-4 hidden animate-fade-in-up rounded-xl border border-gray-200 bg-white p-3 shadow-pop md:block"
        style={{ animationDelay: "0.25s" }}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md border border-neutral-200 bg-white">
            <AlertTriangle className="h-3.5 w-3.5 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <div>
            <p className="text-[10px] font-semibold text-gray-900">2 Regulatory Changes Detected</p>
            <p className="text-[9px] text-gray-500">Boston, MA · Chicago, IL</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------- Demo preview panels ---------------------------- */

function PropertyRowItem({ p }: { p: DemoPropertyRow }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-gray-100 p-2">
      <span className={cn("h-6 w-6 shrink-0 rounded bg-gradient-to-br", p.chip)} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-medium text-gray-900">{p.name}</p>
        <p className="text-[8px] text-gray-400">{p.meta}</p>
      </div>
      <div className="hidden w-14 sm:block">
        <div className="h-1 rounded-full bg-gray-100">
          <div className={cn("h-1 rounded-full", p.bar)} style={{ width: `${p.score}%` }} />
        </div>
      </div>
      <span className={cn("rounded-full px-1.5 py-0.5 text-[8px] font-medium", p.pill)}>{p.status}</span>
    </div>
  )
}

function DemoOverview({ rows }: { rows: DemoPropertyRow[] }) {
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-gray-100 p-2.5">
          <p className="text-[9px] font-medium text-gray-500">Compliance Health</p>
          <p className="mt-1 text-lg font-bold leading-none text-emerald-600">
            87<span className="text-[9px] font-normal text-gray-400">/100</span>
          </p>
          <p className="mt-1 text-[8px] font-medium text-emerald-600">↑ 7 pts this month</p>
        </div>
        <div className="rounded-lg border border-gray-100 p-2.5">
          <p className="text-[9px] font-medium text-gray-500">Action Required</p>
          <p className="mt-1 text-lg font-bold leading-none text-red-600">
            3<span className="text-[9px] font-normal text-gray-400"> items</span>
          </p>
          <p className="mt-1 text-[8px] text-gray-400">2 Overdue · 1 Due Soon</p>
        </div>
        <div className="rounded-lg border border-gray-100 p-2.5">
          <p className="text-[9px] font-medium text-gray-500">Upcoming Deadlines</p>
          <p className="mt-1 text-lg font-bold leading-none text-gray-900">5</p>
          <p className="mt-1 text-[8px] text-gray-400">In next 45 days</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        <p className="text-[10px] font-semibold text-gray-900">Your Properties</p>
        <span className="text-[8px] text-gray-400">Health across your portfolio</span>
      </div>
      <div className="mt-1.5 space-y-1.5">
        {rows.map((p) => (
          <PropertyRowItem key={p.name} p={p} />
        ))}
      </div>
    </>
  )
}

function DemoRadar({ changes }: { changes: RadarChange[] }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Radar className="h-3 w-3 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
        <p className="text-[10px] font-semibold text-gray-900">Recent Regulatory Changes</p>
      </div>
      {changes.map((c) => (
        <div key={c.title} className="rounded-lg border border-gray-100 p-2">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[10px] font-semibold text-gray-900">{c.title}</p>
            <span className="shrink-0 rounded-full bg-red-50 px-1.5 py-0.5 text-[8px] font-medium text-red-700">
              New
            </span>
          </div>
          <p className="mt-0.5 text-[8px] text-gray-400">{c.affected}</p>
          <div className="mt-1.5 space-y-1 rounded-md bg-gray-50 p-1.5">
            {c.beforeAfter.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-2 text-[8px]">
                <span className="text-gray-400">{row.label}</span>
                <span className="flex min-w-0 items-center gap-1">
                  <span className="text-gray-400 line-through">{row.before}</span>
                  <ArrowRight
                    className="h-2.5 w-2.5 shrink-0 text-neutral-900"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="font-semibold text-emerald-600">{row.after}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function DemoProperties({ rows }: { rows: DemoPropertyRow[] }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold text-gray-900">Properties</p>
        <span className="text-[8px] text-gray-400">{rows.length} properties · 4 cities</span>
      </div>
      {rows.map((p) => (
        <PropertyRowItem key={p.name} p={p} />
      ))}
    </div>
  )
}

function DemoTasks({ rows }: { rows: TaskRow[] }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold text-gray-900">Tasks</p>
        <span className="text-[8px] text-gray-400">{rows.length} pending</span>
      </div>
      {rows.map((t) => (
        <div key={t.title} className="flex items-center gap-2.5 rounded-lg border border-gray-100 p-2">
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-gray-300 bg-white">
            <Check className="h-2.5 w-2.5 text-transparent" strokeWidth={2.5} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-medium text-gray-900">{t.title}</p>
            <p className="text-[8px] text-gray-400">Due {t.due}</p>
          </div>
          <span className={cn("shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-medium", t.pill)}>
            {t.status}
          </span>
        </div>
      ))}
    </div>
  )
}

function DemoDocuments({ rows }: { rows: DocRow[] }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold text-gray-900">Evidence Vault</p>
        <span className="text-[8px] text-gray-400">AI matched · {rows.length} docs</span>
      </div>
      {rows.map((d) => (
        <div key={d.name} className="flex items-center gap-2.5 rounded-lg border border-gray-100 p-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-white">
            <FileText className="h-3 w-3 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-medium text-gray-900">{d.name}</p>
            <p className="truncate text-[8px] text-gray-400">{d.meta}</p>
          </div>
          <span className={cn("shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-medium", d.pill)}>
            {d.status}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------- Trust strip ------------------------------ */

const TRUST = [
  { icon: ShieldCheck, title: "Official Source Verified", text: "Always up-to-date" },
  { icon: Eye, title: "Change Monitoring", text: "We watch for you" },
  { icon: FileSearch, title: "Document AI", text: "Extracts. Matches. Alerts." },
  { icon: FileCheck2, title: "Audit Ready", text: "Proof when you need it" },
]

function TrustStrip() {
  return (
    <section className="border-y border-gray-100 bg-white">
      <div className="container-site grid grid-cols-1 gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST.map((t) => (
          <div key={t.title} className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white">
              <t.icon className="h-5 w-5 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{t.title}</p>
              <p className="text-sm text-gray-500">{t.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* -------------------------------- Features -------------------------------- */

const FEATURES = [
  { icon: MapPinned, title: "Property Compliance Map", text: "See all requirements that apply to your property in one place." },
  { icon: Radar, title: "Compliance Radar", text: "Get alerts when local laws change and affect you." },
  { icon: Archive, title: "Evidence Vault", text: "Upload once. We organize, match, and track for you." },
  { icon: CalendarClock, title: "Smart Deadlines", text: "Never miss a compliance deadline with intelligent reminders." },
  { icon: FileCheck2, title: "Reports & Proof Pack", text: "Generate audit-ready compliance reports in one click." },
  { icon: MessageSquare, title: "Ask My Property", text: "Ask questions and get answers specific to your property." },
]

function FeaturesSection() {
  return (
    <section className="py-20 sm:py-24" id="features">
      <div className="container-site">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to stay compliant"
          description="One workspace for requirements, deadlines, evidence, and regulatory change — built for owners of 1 to 20 units."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-pop"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white transition-colors group-hover:bg-neutral-100">
                <f.icon className="h-5 w-5 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------- How it works ----------------------------- */

const STEPS = [
  { n: "01", title: "Enter your property", text: "Tell us the address and basic property details." },
  { n: "02", title: "We build your Property DNA", text: "RuleNest identifies the regulations that may apply." },
  { n: "03", title: "Fix your compliance gaps", text: "See missing documents, upcoming deadlines and required actions." },
  { n: "04", title: "Stay protected", text: "RuleNest watches for regulatory changes and keeps your records organized." },
]

function HowItWorksSection() {
  return (
    <section className="bg-gray-50 py-20 sm:py-24">
      <div className="container-site">
        <SectionHeading eyebrow="How it works" title="From address to audit-ready in four steps" />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.n} className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
              <span className="text-sm font-bold text-primary-600">{s.n}</span>
              <h3 className="mt-3 text-base font-semibold text-gray-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.text}</p>
              {i < STEPS.length - 1 && (
                <ArrowRight
                  className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-neutral-900 lg:block"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/how-it-works">
            <Button variant="outline">See the full walkthrough</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------- Property DNA ----------------------------- */

function PropertyDnaSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Property DNA"
            title="Your property has a compliance profile."
            description="Regulations don't apply to every property in the same way. RuleNest uses your property's characteristics to identify the requirements that may apply."
          />
          <ul className="mt-8 space-y-3">
            {[
              "Location, type, units and build year drive which rules apply",
              "Every requirement explains why it applies — no guesswork",
              "The Compliance Graph links rules → requirements → evidence → tasks",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white">
                  <Check className="h-3 w-3 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <Link
            to="/signup"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
          >
            Build my Property DNA
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </div>

        {/* Property DNA card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-pop">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-bold text-gray-900">123 Main Street</p>
              <p className="text-sm text-gray-500">Boston, MA</p>
            </div>
            <Badge variant="purple">Property DNA</Badge>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Units", value: "4" },
              { label: "Built", value: "1975" },
              { label: "Rental type", value: "Long-term" },
              { label: "Owner occupied", value: "No" },
            ].map((d) => (
              <div key={d.label} className="rounded-xl bg-gray-50 p-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">{d.label}</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{d.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-3 border-t border-gray-100 pt-5">
            {[
              { label: "9 potential obligations identified", color: "bg-primary-500", w: "90%" },
              { label: "2 documents missing", color: "bg-red-400", w: "22%" },
              { label: "1 deadline approaching", color: "bg-amber-400", w: "12%" },
            ].map((row) => (
              <div key={row.label}>
                <p className="text-xs font-medium text-gray-700">{row.label}</p>
                <div className="mt-1 h-1.5 rounded-full bg-gray-100">
                  <div className={cn("h-1.5 rounded-full", row.color)} style={{ width: row.w }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- Compliance Radar --------------------------- */

function RadarSection() {
  return (
    <section className="bg-gray-50 py-20 sm:py-24">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2">
        {/* Alert UI */}
        <div className="order-2 lg:order-1">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-pop">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <Radar className="h-4 w-4 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
                <p className="text-sm font-semibold text-gray-900">Compliance Radar</p>
              </div>
              <Badge variant="amber" dot>
                2 changes
              </Badge>
            </div>
            <div className="p-5">
              <div className="rounded-xl bg-emerald-50 px-4 py-3">
                <p className="text-sm font-semibold text-emerald-800">2 Regulatory Changes Detected</p>
                <p className="text-xs text-emerald-600">Since your last visit</p>
              </div>
              <div className="mt-3 space-y-3">
                {[
                  { city: "Boston, MA", title: "Rental registration requirement changed", affected: "Affected: 2 properties" },
                  { city: "Chicago, IL", title: "Inspection requirement updated", affected: "Affected: 1 property" },
                ].map((c) => (
                  <div
                    key={c.city}
                    className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 p-4"
                  >
                    <div className="flex gap-3">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white">
                        <MapPin className="h-3.5 w-3.5 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{c.city}</p>
                        <p className="mt-0.5 text-xs text-gray-500">{c.title}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-red-600">{c.affected}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <SectionHeading
            align="left"
            eyebrow="Compliance Radar"
            title="Don't wait for the regulation to find you."
            description="RuleNest watches official city and state sources. When a rule changes and touches one of your properties, you get a plain-English alert with the exact before/after — and the next best action."
          />
          <Link
            to="/features"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
          >
            See how Compliance Radar works
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ Evidence Vault ---------------------------- */

const PIPELINE = [
  { icon: Upload, label: "Upload document" },
  { icon: Sparkles, label: "AI extracts information" },
  { icon: Link2, label: "Matches document to requirement" },
  { icon: CalendarClock, label: "Tracks expiration" },
  { icon: Archive, label: "Stores evidence" },
]

function DocumentsSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Evidence Vault"
            title="Upload once. We handle the rest."
            description="Drop in a certificate or notice — Document AI extracts the details, matches it to the right requirement, tracks the expiration, and files it as audit-ready evidence."
          />
          <ol className="mt-8">
            {PIPELINE.map((step, i) => (
              <li key={step.label} className="relative flex gap-4 pb-6 last:pb-0">
                {i < PIPELINE.length - 1 && (
                  <span
                    className="absolute left-5 top-11 h-[calc(100%-2.75rem)] w-px bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white shadow-card">
                  <step.icon className="h-4 w-4 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <p className="pt-2.5 text-sm font-semibold text-gray-900">{step.label}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Example extracted document */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-pop">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white">
                <FileText className="h-5 w-5 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Smoke/CO Certificate</p>
                <p className="text-xs text-gray-500">Smoke_CO_Certificate.pdf</p>
              </div>
            </div>
            <Badge variant="green" dot>
              Verified
            </Badge>
          </div>
          <dl className="mt-6 space-y-3">
            {[
              { label: "Property", value: "123 Main Street" },
              { label: "Issued", value: "Sep 20, 2025" },
              { label: "Expires", value: "Sep 20, 2026" },
              { label: "Matched requirement", value: "Smoke/CO Certification" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <dt className="text-gray-500">{row.label}</dt>
                <dd className="font-medium text-gray-900">{row.value}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between text-sm">
              <dt className="text-gray-500">Extraction confidence</dt>
              <dd className="font-medium text-emerald-600">98%</dd>
            </div>
          </dl>
          <div className="mt-6 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Validity window</span>
              <span>Expires in 12 months</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-gray-100">
              <div className="h-1.5 w-[88%] rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ Ask My Property --------------------------- */

function AiSection() {
  return (
    <section className="bg-gray-50 py-20 sm:py-24">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Ask My Property"
            title="Ask about your property. Not generic landlord law."
            description="Ask questions in plain English and get answers drawn from your property's structured compliance profile — requirements, evidence, and deadlines."
          />
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              "Can I rent this property next month?",
              "What documents am I missing?",
              "What compliance deadlines are coming up?",
            ].map((q) => (
              <span
                key={q}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600"
              >
                {q}
              </span>
            ))}
          </div>
          <p className="mt-6 flex items-start gap-2 text-sm text-gray-500">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
            RuleNest AI explains your structured compliance data — it never invents legal answers and
            does not provide legal advice.
          </p>
        </div>

        {/* Chat mock */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-pop">
          <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white">
              <Sparkles className="h-4 w-4 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <p className="text-sm font-semibold text-gray-900">Ask My Property</p>
            <Badge variant="purple">AI</Badge>
          </div>
          <div className="space-y-3 px-5 py-4">
            <div className="flex justify-end">
              <p className="max-w-[85%] rounded-2xl bg-primary-600 px-3.5 py-2.5 text-sm text-white">
                Can I rent this property next month?
              </p>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl bg-gray-100 px-3.5 py-2.5 text-sm leading-relaxed text-gray-800">
                <p>Based on the current profile for 123 Main Street, there are 2 items you should address before renting:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Smoke/CO Certification — upload certificate</li>
                  <li>• Annual Inspection — schedule inspection</li>
                </ul>
                <p className="mt-2 text-xs text-gray-500">
                  From your RuleNest compliance data — informational only, not legal advice.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-gray-100 px-4 py-3">
            <div className="h-10 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3.5 pt-2.5 text-sm text-gray-400">
              Ask about your property compliance...
            </div>
            <Button size="sm" className="h-10 px-4">
              Ask
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ Pricing preview --------------------------- */

const EARLY_ACCESS_FEATURES = [
  "Unlimited properties during beta",
  "Compliance Radar alerts",
  "Document AI extraction",
  "Proof Pack exports",
  "Priority email support",
]

function PricingPreview() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-site">
        <SectionHeading
          eyebrow="Pricing"
          title="Everything is free while we're in Early Access."
          description="No credit card. No trials. Every feature unlocked for early landlords. When paid plans launch, early users keep generous free benefits forever."
        />
        <div className="relative mx-auto mt-14 max-w-2xl overflow-hidden rounded-2xl border border-primary-600 bg-white p-8 shadow-card ring-1 ring-primary-600 sm:p-10">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary-100/60 blur-3xl"
            aria-hidden="true"
          />
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-3 py-1 text-[11px] font-semibold text-white">
            Early Access
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Sparkles className="h-5 w-5 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
            <h3 className="text-xl font-bold tracking-tight text-gray-900">Early Access — $0</h3>
          </div>
          <p className="mt-2 text-sm text-gray-600">Every feature unlocked. Free while we build.</p>
          <ul className="mt-6 space-y-3">
            {EARLY_ACCESS_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white">
                  <Check className="h-3 w-3 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
                </span>
                {f}
              </li>
            ))}
          </ul>
          <Link to="/signup" className="mt-8 block">
            <Button size="lg" className="w-full">
              Claim Free Access
              <Check className="h-4 w-4 text-white" strokeWidth={1.5} aria-hidden="true" />
            </Button>
          </Link>
          <p className="mt-4 text-center text-xs text-gray-500">
            Be one of the first self-managing landlords on RuleNest.
          </p>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Paid plans (Solo $12 · Portfolio $29 · Pro $79) launch after Early Access — early users
            lock in 6 months free.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ FAQ ------------------------------ */

const FAQ_ITEMS = [
  {
    q: "Do I need a rental license or registration for my property?",
    a: "It varies by city and state — while some cities require annual registration, others license by building or unit, and a few don't require anything up front. RuleNest checks the per-city rules for each of your properties and tracks exactly what applies to you.",
  },
  {
    q: "How often are rental property inspections required?",
    a: "Inspection frequency varies by location — many cities inspect annually or biennially, while others only inspect after a complaint, change of tenancy, or registration renewal. RuleNest tracks the cycle per property and reminds you before each one is due.",
  },
  {
    q: "What happens if I miss a rental registration deadline?",
    a: "Missed deadlines typically mean fines of $100–$500 per unit, and late renewals can sometimes delay new tenancies or lead to enforcement actions. RuleNest reminds you 90, 60, and 30 days ahead so you never lose track.",
  },
  {
    q: "Is lead paint disclosure required for my building?",
    a: "Federal law requires landlords to disclose known lead-based paint hazards for buildings built before 1978 and to provide the EPA pamphlet before renting. RuleNest flags these requirements automatically based on your property's year built.",
  },
  {
    q: "Do smoke and CO detector certificates expire?",
    a: "Yes — in many cities smoke and carbon monoxide detector certificates are valid for a set period and must be renewed to stay compliant. RuleNest tracks them in your Documents vault and reminds you when they're about to expire.",
  },
  {
    q: "How do I know when my city changes a rental rule?",
    a: "RuleNest's Compliance Radar monitors official sources and flags new ordinances, fee changes, and enforcement updates that affect your properties — so you're notified when a rule you rely on changes.",
  },
  {
    q: "What documents do I need for a compliance audit?",
    a: "A standard audit looks for registration certificates, inspection reports, smoke/CO certificates, and required disclosures. RuleNest's Proof Pack exports all of your requested documents into one organized file you can hand over in minutes.",
  },
  {
    q: "Is RuleNest free for small landlords?",
    a: "Yes — the free tier covers one property with core compliance tracking. Paid plans add more properties and features like Radar alerts and Proof Pack exports for growing portfolios.",
  },
]

function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="py-20 sm:py-24">
      <div className="container-site">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Quick answers for self-managing landlords. Have a question about your own property? RuleNest checks the rules that actually apply to it."
        />
        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-gray-900 sm:text-base">{item.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-neutral-900 transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-gray-100 px-5 pb-5 pt-4">
                    <p className="text-sm leading-relaxed text-gray-600">{item.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------- Final CTA ------------------------------- */

function FinalCta() {
  return (
    <section className="pb-20 pt-4 sm:pb-24">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-3xl bg-gray-950 px-6 py-16 text-center sm:px-16 sm:py-20">
          <div
            className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary-600/30 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-violet-600/25 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Know your property's rules. Stay ahead of them.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-400">
              Start free and see your property's compliance profile in 90 seconds.
            </p>
            <Link to="/signup">
              <Button size="lg" className="mt-8">
                Check My Property Free
                <ArrowRight className="h-4 w-4 text-white" strokeWidth={1.5} aria-hidden="true" />
              </Button>
            </Link>
            <p className="mt-4 text-xs text-gray-500">No credit card required · Cancel anytime</p>
          </div>
        </div>
      </div>
    </section>
  )
}