import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Building2, ChevronRight, LayoutGrid, List, Plus, Search } from "lucide-react"
import AddPropertyModal from "../../components/AddPropertyModal"
import PropertyCard from "../../components/PropertyCard"
import StatusBadge from "../../components/StatusBadge"
import Button from "../../components/ui/Button"
import EmptyState from "../../components/ui/EmptyState"
import HealthBar from "../../components/ui/HealthBar"
import { Input, Select } from "../../components/ui/Input"
import { useData } from "../../context/DataContext"
import { cn, formatDate } from "../../lib/utils"

type StatusFilter = "all" | "excellent" | "good" | "fair" | "attention"
type SortKey = "attention" | "score" | "name"
type ViewMode = "grid" | "list"

export default function Properties() {
  const { properties } = useData()
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<StatusFilter>("all")
  const [sort, setSort] = useState<SortKey>("attention")
  const [view, setView] = useState<ViewMode>("grid")
  const [addOpen, setAddOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = properties.filter(
      (p) =>
        (!q || `${p.address} ${p.city} ${p.state}`.toLowerCase().includes(q)) &&
        (status === "all" || p.status === status),
    )
    return [...list].sort((a, b) => {
      if (sort === "attention") return a.healthScore - b.healthScore
      if (sort === "score") return b.healthScore - a.healthScore
      return a.address.localeCompare(b.address)
    })
  }, [properties, query, status, sort])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Properties</h1>
          <p className="mt-1 text-sm text-gray-500">
            {properties.length} propert{properties.length === 1 ? "y" : "ies"} ·{" "}
            {new Set(properties.map((p) => p.city)).size} cities
          </p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setAddOpen(true)}>
          Add Property
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            icon={<Search className="h-4 w-4" />}
            placeholder="Search properties..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search properties"
          />
        </div>
        <div className="flex gap-2">
          <div className="w-36">
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
              options={[
                { value: "all", label: "All statuses" },
                { value: "excellent", label: "Excellent" },
                { value: "good", label: "Good" },
                { value: "fair", label: "Fair" },
                { value: "attention", label: "Needs attention" },
              ]}
              aria-label="Filter by status"
            />
          </div>
          <div className="w-40">
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              options={[
                { value: "attention", label: "Needs attention" },
                { value: "score", label: "Highest score" },
                { value: "name", label: "Address A–Z" },
              ]}
              aria-label="Sort properties"
            />
          </div>
          <div className="hidden rounded-lg border border-gray-200 bg-white p-0.5 sm:flex">
            {(
              [
                { key: "grid", icon: LayoutGrid, label: "Grid view" },
                { key: "list", icon: List, label: "List view" },
              ] as const
            ).map((v) => (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                aria-label={v.label}
                aria-pressed={view === v.key}
                className={cn(
                  "rounded-md p-2 transition-colors",
                  view === v.key ? "bg-primary-50 text-primary-700" : "text-gray-400 hover:text-gray-600",
                )}
              >
                <v.icon className="h-4 w-4" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No properties match"
          description="Try a different search or filter — or add a new property."
          action={
            <Button size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => setAddOpen(true)}>
              Add Property
            </Button>
          }
        />
      ) : view === "grid" ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                  <th className="px-6 py-3 font-medium">Property</th>
                  <th className="px-4 py-3 font-medium">City</th>
                  <th className="px-4 py-3 font-medium">Units</th>
                  <th className="px-4 py-3 font-medium">Health</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Next deadline</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => navigate(`/app/properties/${p.id}`)}
                    className="cursor-pointer border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50/70"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br",
                            p.imageGradient,
                          )}
                        >
                          <Building2 className="h-4 w-4 text-white" aria-hidden="true" />
                        </span>
                        <span className="font-medium text-gray-900">{p.address}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">
                      {p.city}, {p.state}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">{p.units}</td>
                    <td className="px-4 py-3.5">
                      <HealthBar score={p.healthScore} />
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">
                      {p.nextDeadline ? formatDate(p.nextDeadline) : "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <ChevronRight className="h-4 w-4 text-gray-300" aria-hidden="true" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile falls back to cards */}
          <div className="grid gap-4 md:hidden">
            {filtered.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </>
      )}

      <AddPropertyModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}