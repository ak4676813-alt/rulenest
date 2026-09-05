import { useEffect, useMemo, useState, type ReactNode } from "react"
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import {
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  FileText,
  Inbox,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Moon,
  Plus,
  Radar,
  Search,
  Settings,
  Sun,
  User as UserIcon,
  X,
  type LucideIcon,
} from "lucide-react"
import AddPropertyModal from "../components/AddPropertyModal"
import Logo from "../components/Logo"
import Toasts from "../components/Toasts"
import Avatar from "../components/ui/Avatar"
import Button from "../components/ui/Button"
import Dropdown, { DropdownItem } from "../components/ui/Dropdown"
import { useAuth } from "../context/AuthContext"
import { useData } from "../context/DataContext"
import { cn, timeAgo } from "../lib/utils"

const NAV_ITEMS: Array<{ label: string; to: string; icon: LucideIcon; badge?: boolean }> = [
  { label: "Dashboard", to: "/app/dashboard", icon: LayoutDashboard },
  { label: "Properties", to: "/app/properties", icon: Building2 },
  { label: "Compliance Radar", to: "/app/compliance-radar", icon: Radar },
  { label: "Documents", to: "/app/documents", icon: FileText },
  { label: "Tasks", to: "/app/tasks", icon: ListChecks },
  { label: "Inbox", to: "/app/inbox", icon: Inbox, badge: true },
  { label: "Reports", to: "/app/reports", icon: BarChart3 },
  { label: "Settings", to: "/app/settings", icon: Settings },
]

const BOTTOM_NAV = [
  { label: "Home", to: "/app/dashboard", icon: LayoutDashboard },
  { label: "Properties", to: "/app/properties", icon: Building2 },
  { label: "Radar", to: "/app/compliance-radar", icon: Radar },
  { label: "Tasks", to: "/app/tasks", icon: ListChecks },
  { label: "Inbox", to: "/app/inbox", icon: Inbox },
]

function SearchGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="py-1">
      <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      {children}
    </div>
  )
}

function SearchResult({
  title,
  detail,
  onClick,
}: {
  title: string
  detail: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-gray-50"
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-gray-900">{title}</span>
        <span className="block truncate text-xs text-gray-500">{detail}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-gray-300" aria-hidden="true" />
    </button>
  )
}

export default function AppLayout() {
  const { user, signOut } = useAuth()
  const data = useData()
  const navigate = useNavigate()
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    localStorage.getItem("rn_theme") === "dark" ? "dark" : "light",
  )

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem("rn_theme", theme)
  }, [theme])

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  const notifications = useMemo(() => {
    const changeNotes = data.changes
      .filter((c) => !c.read)
      .map((c) => ({
        id: c.id,
        title: c.title,
        detail: c.jurisdiction,
        at: c.detectedAt,
        to: "/app/compliance-radar",
      }))
    const inboxNotes = data.inbox
      .filter((i) => !i.read && !i.archived)
      .map((i) => ({
        id: i.id,
        title: i.title,
        detail: i.jurisdiction,
        at: i.receivedAt,
        to: "/app/inbox",
      }))
    return [...changeNotes, ...inboxNotes]
      .sort((a, b) => +new Date(b.at) - +new Date(a.at))
      .slice(0, 6)
  }, [data.changes, data.inbox])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return null
    return {
      properties: data.properties
        .filter((p) => `${p.address} ${p.city} ${p.state}`.toLowerCase().includes(q))
        .slice(0, 4),
      documents: data.documents.filter((d) => d.name.toLowerCase().includes(q)).slice(0, 4),
      tasks: data.tasks.filter((t) => t.title.toLowerCase().includes(q)).slice(0, 4),
    }
  }, [query, data.properties, data.documents, data.tasks])

  function handleLogout() {
    signOut()
    navigate("/login")
  }

  function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-gray-100 px-5">
          <Logo to="/app/dashboard" />
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Application">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )
              }
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && data.unreadInboxCount > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-semibold text-white">
                  {data.unreadInboxCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        {user && (
          <div className="border-t border-gray-100 p-3">
            <Dropdown
              align="left"
              width="w-full"
              label="Account menu"
              trigger={
                <div className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-gray-50">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt=""
                      className="h-8 w-8 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <Avatar name={user.name} colorClass={user.avatarColor} />
                  )}
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="truncate text-xs text-gray-500">{user.role}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
              }
            >
              {(close) => (
                <div className="py-1">
                  <DropdownItem
                    icon={<UserIcon className="h-4 w-4" />}
                    onClick={() => {
                      close()
                      navigate("/app/settings")
                    }}
                  >
                    Profile & settings
                  </DropdownItem>
                  <DropdownItem
                    icon={<LogOut className="h-4 w-4" />}
                    danger
                    onClick={() => {
                      close()
                      handleLogout()
                    }}
                  >
                    Log out
                  </DropdownItem>
                </div>
              )}
            </Dropdown>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/70">
      {/* Desktop sidebar — fixed and persistent */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-gray-200 bg-white lg:block">
        <SidebarNav />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 animate-fade-in bg-gray-950/40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] animate-fade-in bg-white shadow-pop">
            <div className="absolute right-3 top-4 z-10">
              <button
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarNav onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-col lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-gray-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 lg:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Global search */}
          <div className="relative max-w-md flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anything..."
              className="h-10 w-full rounded-lg border border-transparent bg-gray-100/80 pl-9 pr-3 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
              aria-label="Search properties, documents and tasks"
            />
            {results && (
              <div className="absolute left-0 right-0 top-12 z-40 max-h-96 animate-scale-in overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-pop">
                {results.properties.length + results.documents.length + results.tasks.length === 0 ? (
                  <p className="px-3 py-4 text-center text-sm text-gray-500">
                    No results for "{query}"
                  </p>
                ) : (
                  <>
                    {results.properties.length > 0 && (
                      <SearchGroup label="Properties">
                        {results.properties.map((p) => (
                          <SearchResult
                            key={p.id}
                            title={p.address}
                            detail={`${p.city}, ${p.state} · ${p.units} unit${p.units === 1 ? "" : "s"}`}
                            onClick={() => {
                              setQuery("")
                              navigate(`/app/properties/${p.id}`)
                            }}
                          />
                        ))}
                      </SearchGroup>
                    )}
                    {results.documents.length > 0 && (
                      <SearchGroup label="Documents">
                        {results.documents.map((d) => (
                          <SearchResult
                            key={d.id}
                            title={d.name}
                            detail={d.category}
                            onClick={() => {
                              setQuery("")
                              navigate("/app/documents")
                            }}
                          />
                        ))}
                      </SearchGroup>
                    )}
                    {results.tasks.length > 0 && (
                      <SearchGroup label="Tasks">
                        {results.tasks.map((t) => (
                          <SearchResult
                            key={t.id}
                            title={t.title}
                            detail="Task"
                            onClick={() => {
                              setQuery("")
                              navigate("/app/tasks")
                            }}
                          />
                        ))}
                      </SearchGroup>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              )}
            </button>

            {/* Notifications */}
            <Dropdown
              label="Notifications"
              width="w-80"
              trigger={
                <div className="relative cursor-pointer rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span
                      className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"
                      aria-label={`${notifications.length} unread notifications`}
                    />
                  )}
                </div>
              }
            >
              {(close) => (
                <div>
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">Notifications</p>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-gray-500">
                      You're all caught up.
                    </p>
                  ) : (
                    <ul className="max-h-80 overflow-y-auto py-1">
                      {notifications.map((n) => (
                        <li key={n.id}>
                          <button
                            className="w-full px-4 py-2.5 text-left transition-colors hover:bg-gray-50"
                            onClick={() => {
                              close()
                              navigate(n.to)
                            }}
                          >
                            <p className="text-sm font-medium text-gray-900">{n.title}</p>
                            <p className="mt-0.5 text-xs text-gray-500">
                              {n.detail} · {timeAgo(n.at)}
                            </p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </Dropdown>

            {/* Add property */}
            <Button
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => setAddOpen(true)}
              className="hidden sm:inline-flex"
            >
              Add Property
            </Button>
            <button
              className="rounded-lg bg-primary-600 p-2 text-white shadow-sm transition-colors hover:bg-primary-700 sm:hidden"
              onClick={() => setAddOpen(true)}
              aria-label="Add property"
            >
              <Plus className="h-4 w-4" />
            </button>

            {/* User menu */}
            {user && (
              <Dropdown
                label="Account menu"
                trigger={
                  <div className="flex cursor-pointer items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-gray-100">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt=""
                        className="h-7 w-7 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <Avatar name={user.name} size="sm" colorClass={user.avatarColor} />
                    )}
                    <ChevronDown className="hidden h-4 w-4 text-gray-400 sm:block" aria-hidden="true" />
                  </div>
                }
              >
                {(close) => (
                  <div className="py-1">
                    <div className="border-b border-gray-100 px-3.5 py-2.5">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <DropdownItem
                      icon={<UserIcon className="h-4 w-4" />}
                      onClick={() => {
                        close()
                        navigate("/app/settings")
                      }}
                    >
                      Settings
                    </DropdownItem>
                    <DropdownItem
                      icon={<LogOut className="h-4 w-4" />}
                      danger
                      onClick={() => {
                        close()
                        handleLogout()
                      }}
                    >
                      Log out
                    </DropdownItem>
                  </div>
                )}
              </Dropdown>
            )}
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav
        className="sticky bottom-0 z-20 flex items-center justify-around border-t border-gray-200 bg-white py-2 lg:hidden"
        aria-label="Quick navigation"
      >
        {BOTTOM_NAV.map((item) => {
          const active = location.pathname.startsWith(item.to)
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors",
                active ? "text-primary-700" : "text-gray-500 hover:text-gray-700",
              )}
            >
              <span className="relative">
                <item.icon className="h-5 w-5" aria-hidden="true" />
                {item.to === "/app/inbox" && data.unreadInboxCount > 0 && (
                  <span className="absolute -right-1.5 -top-1 h-2 w-2 rounded-full bg-red-500" />
                )}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <AddPropertyModal open={addOpen} onClose={() => setAddOpen(false)} />
      <Toasts />
    </div>
  )
}