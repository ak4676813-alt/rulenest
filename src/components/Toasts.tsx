import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react"
import { useToast, type ToastVariant } from "../context/ToastContext"
import { cn } from "../lib/utils"

const icons: Record<ToastVariant, typeof Info> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
}

const iconColors: Record<ToastVariant, string> = {
  success: "text-emerald-500",
  info: "text-blue-500",
  warning: "text-amber-500",
  error: "text-red-500",
}

const borders: Record<ToastVariant, string> = {
  success: "border-emerald-200",
  info: "border-blue-200",
  warning: "border-amber-200",
  error: "border-red-200",
}

export default function Toasts() {
  const { toasts, dismiss } = useToast()

  return (
    <div
      className="pointer-events-none fixed bottom-16 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 px-4 sm:bottom-4 sm:px-0"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const Icon = icons[t.variant]
        return (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex animate-slide-in-right items-start gap-3 rounded-xl border bg-white p-4 shadow-pop",
              borders[t.variant],
            )}
          >
            <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", iconColors[t.variant])} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">{t.title}</p>
              {t.description && <p className="mt-0.5 text-xs text-gray-500">{t.description}</p>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="rounded p-0.5 text-gray-400 transition-colors hover:text-gray-600"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}