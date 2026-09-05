import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CalendarClock, ExternalLink, MapPin, MoreHorizontal, Trash2 } from "lucide-react"
import * as L from "leaflet"
import { MapContainer, Marker, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import Button from "./ui/Button"
import Modal from "./ui/Modal"
import { useData } from "../context/DataContext"
import { useToast } from "../context/ToastContext"
import type { Property } from "../types"
import { cn, formatDate, relativeDeadline, statusLabel } from "../lib/utils"

/* City → [lat, lng] lookup — mirrors the Dashboard Portfolio Map so every mini
   map centers on the same coordinates. Kept here so the card stays self-contained. */
const CITY_COORDS: Record<string, [number, number]> = {
  "San Francisco": [37.77, -122.42],
  Boston: [42.36, -71.06],
  Chicago: [41.88, -87.63],
  Denver: [39.74, -104.99],
  Seattle: [47.61, -122.33],
  Islampur: [25.21, 85.9],
}
const FALLBACK_COORDS: [number, number] = [39.5, -98.35]

function coordsFor(property: Property): [number, number] {
  return CITY_COORDS[property.city] ?? FALLBACK_COORDS
}

/* Leaflet's default marker images are missing under bundlers; point them at the
   CDN copies so pins render correctly. */
const mapPinIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

/* Soft glass tint keyed to the property's health status. */
const GLASS_PILL: Record<string, string> = {
  excellent: "border-emerald-200 bg-emerald-500/25",
  good: "border-emerald-200 bg-emerald-500/25",
  fair: "border-amber-200 bg-amber-500/25",
  attention: "border-red-200 bg-red-500/25",
}

function PropertyMiniMap({ property }: { property: Property }) {
  const position = coordsFor(property)
  return (
    <MapContainer
      center={position}
      zoom={13}
      dragging={false}
      scrollWheelZoom={false}
      zoomControl={false}
      doubleClickZoom={false}
      className="z-0"
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={mapPinIcon} />
    </MapContainer>
  )
}

export default function PropertyCard({ property }: { property: Property }) {
  const navigate = useNavigate()
  const { deleteProperty } = useData()
  const { toast } = useToast()
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const open = () => navigate(`/app/properties/${property.id}`)
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${property.address}, ${property.city}, ${property.state}`,
  )}`

  function handleDelete() {
    setConfirmOpen(false)
    setMenuOpen(false)
    deleteProperty(property.id)
    toast({
      variant: "success",
      title: "Property deleted",
      description: `${property.address} was removed along with its documents, tasks, and alerts.`,
    })
  }

  const score = property.healthScore
  const barGradient =
    score >= 85
      ? "from-emerald-400 to-teal-500"
      : score >= 70
        ? "from-amber-400 to-orange-500"
        : "from-red-400 to-rose-500"

  return (
    <>
    <div
      role="link"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          open()
        }
      }}
      className="card-3d group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
    >
      {/* Non-interactive mini Leaflet map */}
      <div className="relative h-24 shrink-0 overflow-hidden">
        <PropertyMiniMap property={property} />
        {/* Soft vignette so the pills stay legible */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/35 via-slate-950/5 to-transparent" />
        {/* Click catcher keeps leaflet's DOM events from hijacking card navigation */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          onClick={(e) => {
            e.stopPropagation()
            open()
          }}
        />
        <span
          className={cn(
            "absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium text-white shadow-sm backdrop-blur-md",
            GLASS_PILL[property.status] ?? "border-slate-200 bg-slate-500/25",
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
          {statusLabel(property.status)}
        </span>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Open ${property.address} in Google Maps`}
          className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-gray-800 shadow-md backdrop-blur transition-colors hover:bg-white"
        >
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
          Maps
        </a>
      </div>
      {/* Details */}
      <div className="relative p-4 sm:p-5">
        {/* Card menu — Delete property */}
        <div
          className="absolute right-3 top-3 z-10"
          onMouseLeave={() => setMenuOpen(false)}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen((v) => !v)
            }}
            aria-label={`Actions for ${property.address}`}
            aria-expanded={menuOpen}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white/70 text-gray-400 shadow-sm backdrop-blur transition-colors hover:bg-white hover:text-gray-600"
          >
            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-9 z-20 w-44 animate-scale-in rounded-xl border border-gray-200 bg-white p-1 shadow-pop">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setMenuOpen(false)
                  setConfirmOpen(true)
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete property
              </button>
            </div>
          )}
        </div>

        <p className="font-semibold text-gray-900 transition-colors group-hover:text-primary-700">
          {property.address}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {property.city}, {property.state}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-base font-bold tracking-tight text-transparent">
              {score}
            </span>
            <div className="h-1.5 w-20 shrink-0 overflow-hidden rounded-full bg-gray-100">
              <div
                className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", barGradient)}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
          <span className="shrink-0 text-xs text-gray-400">
            {property.units} unit{property.units === 1 ? "" : "s"}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-1.5 border-t border-gray-100 pt-3 text-xs text-gray-500">
          <CalendarClock className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden="true" />
          {property.nextDeadline ? (
            <span className="truncate">
              Next deadline:{" "}
              <span className="font-medium text-gray-700">{formatDate(property.nextDeadline)}</span>{" "}
              <span className="text-gray-400">· {relativeDeadline(property.nextDeadline)}</span>
            </span>
          ) : (
            "No upcoming deadline"
          )}
        </div>
      </div>
      </div>

      {/* Confirm delete */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete property?"
        subtitle={property.address}
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-gray-600">
          Delete this property? Its documents, tasks, and alerts will also be removed.
        </p>
      </Modal>
    </>
  )
}