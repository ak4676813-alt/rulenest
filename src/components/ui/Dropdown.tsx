import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "../../lib/utils"

interface DropdownProps {
  trigger: ReactNode
  children: (close: () => void) => ReactNode
  align?: "left" | "right"
  width?: string
  label?: string
}

export default function Dropdown({
  trigger,
  children,
  align = "right",
  width = "w-64",
  label,
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <div
        role="button"
        tabIndex={0}
        aria-label={label ?? "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setOpen((v) => !v)
          }
        }}
      >
        {trigger}
      </div>
      {open && (
        <div
          className={cn(
            "absolute z-40 mt-2 origin-top animate-scale-in overflow-hidden rounded-xl border border-gray-200 bg-white shadow-pop",
            align === "right" ? "right-0" : "left-0",
            width,
          )}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}

export function DropdownItem({
  onClick,
  icon,
  children,
  danger,
}: {
  onClick?: () => void
  icon?: ReactNode
  children: ReactNode
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm transition-colors",
        danger ? "text-red-600 hover:bg-red-50" : "text-gray-700 hover:bg-gray-50",
      )}
    >
      {icon}
      {children}
    </button>
  )
}