import { Link } from "react-router-dom"
import { Building2, CalendarClock, MapPin } from "lucide-react"
import type { Property } from "../types"
import HealthBar from "./ui/HealthBar"
import StatusBadge from "./StatusBadge"
import { cn, formatDate, relativeDeadline } from "../lib/utils"

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      to={`/app/properties/${property.id}`}
      className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-pop focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
    >
      <div className="relative h-24 overflow-hidden bg-gradient-to-br">
        <div className={cn("absolute inset-0 bg-gradient-to-br", property.imageGradient)} aria-hidden="true" />
        <iframe
          title="Property location map"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(
            `${property.address}, ${property.city}, ${property.state}`,
          )}&z=14&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ pointerEvents: "none", width: "100%", height: "100%" }}
          className="absolute inset-0"
          frameBorder="0"
          aria-hidden="true"
        />
        <span className="absolute bottom-3 left-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 ring-1 ring-white/40">
          <Building2 className="h-4 w-4 text-white" aria-hidden="true" />
        </span>
        <span className="absolute right-3 top-3">
          <StatusBadge status={property.status} />
        </span>
      </div>
      <div className="p-4 sm:p-5">
        <p className="font-semibold text-gray-900 transition-colors group-hover:text-primary-700">
          {property.address}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {property.city}, {property.state}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <HealthBar score={property.healthScore} />
          <span className="text-xs text-gray-400">
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
    </Link>
  )
}