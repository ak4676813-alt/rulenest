import { Link } from "react-router-dom"
import { cn } from "../lib/utils"

/** RuleNest logo — house outline + compliance check. Pure SVG, no assets. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 shadow-sm",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M5 10.5 12 4.5l7 6V19a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8.5Z"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="m9 13.5 2.2 2.2L15.5 11"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

interface LogoProps {
  to?: string
  dark?: boolean
  size?: "sm" | "md"
}

export default function Logo({ to = "/", dark, size = "md" }: LogoProps) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      aria-label="RuleNest home"
    >
      <LogoMark className={size === "sm" ? "h-7 w-7 rounded-md" : undefined} />
      <span
        className={cn(
          "font-bold tracking-tight",
          dark ? "text-white" : "text-gray-900",
          size === "sm" ? "text-base" : "text-lg",
        )}
      >
        RuleNest
      </span>
    </Link>
  )
}