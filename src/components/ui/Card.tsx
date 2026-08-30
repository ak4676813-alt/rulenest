import type { HTMLAttributes, ReactNode } from "react"
import { cn } from "../../lib/utils"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  action?: ReactNode
  noPadding?: boolean
}

export default function Card({
  title,
  subtitle,
  action,
  noPadding,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn("rounded-xl border border-gray-200 bg-white shadow-card", className)}
      {...rest}
    >
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            {title && <h3 className="truncate text-sm font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={cn(!noPadding && "p-5 sm:p-6")}>{children}</div>
    </div>
  )
}