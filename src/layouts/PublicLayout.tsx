import { useEffect, useState } from "react"
import { Link, NavLink, Outlet, useLocation } from "react-router-dom"
import { ArrowRight, Menu, X } from "lucide-react"
import Logo from "../components/Logo"
import Button from "../components/ui/Button"
import { useAuth } from "../context/AuthContext"
import { cn } from "../lib/utils"

const NAV = [
  { label: "Features", to: "/features" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Pricing", to: "/pricing" },
  { label: "Resources", to: "/resources" },
  { label: "Blog", to: "/blog" },
  { label: "About Us", to: "/about" },
]

const FOOTER_PRODUCT = [
  { label: "Features", to: "/features" },
  { label: "Pricing", to: "/pricing" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Compliance Radar", to: "/features" },
  { label: "Property DNA", to: "/features" },
]

const FOOTER_RESOURCES = [
  { label: "Compliance Guides", to: "/resources" },
  { label: "Landlord Resources", to: "/resources" },
  { label: "Blog", to: "/blog" },
  { label: "Help Center", to: "/help" },
]

const FOOTER_COMPANY = [
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Security", to: "/security" },
  { label: "Privacy", to: "/privacy" },
  { label: "Terms", to: "/terms" },
]

export default function PublicLayout() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-white/90 backdrop-blur transition-shadow",
          scrolled ? "border-gray-200 shadow-sm" : "border-transparent",
        )}
      >
        <div className="container-site flex h-16 items-center justify-between gap-4">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <Link to="/app/dashboard">
                <Button size="sm" icon={<ArrowRight className="h-4 w-4" />}>
                  Open dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" icon={<ArrowRight className="h-4 w-4" />}>
                    Start Free
                  </Button>
                </Link>
              </>
            )}
          </div>
          <button
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="animate-fade-in border-t border-gray-100 bg-white px-4 pb-6 pt-2 md:hidden">
            <nav className="flex flex-col" aria-label="Mobile">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "rounded-lg px-3 py-2.5 text-sm font-medium",
                      isActive ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-50",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-2">
              {user ? (
                <Link to="/app/dashboard">
                  <Button className="w-full">Open dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="w-full">Start Free</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="container-site py-14">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Logo />
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-600">
                Compliance intelligence for self-managing landlords. Know what your property needs —
                before the city asks.
              </p>
            </div>
            <FooterCol title="Product" items={FOOTER_PRODUCT} />
            <FooterCol title="Resources" items={FOOTER_RESOURCES} />
            <FooterCol title="Company" items={FOOTER_COMPANY} />
          </div>
          <div className="mt-12 flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} RuleNest. All rights reserved.
            </p>
            <p className="max-w-xl text-xs leading-relaxed text-gray-500">
              RuleNest provides compliance information and workflow assistance and does not provide
              legal advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FooterCol({ title, items }: { title: string; items: Array<{ label: string; to: string }> }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              to={item.to}
              className="text-sm text-gray-600 transition-colors hover:text-primary-700"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}