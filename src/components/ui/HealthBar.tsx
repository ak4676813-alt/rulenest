import { cn } from "../../lib/utils"

export function healthBarColor(score: number): string {
  if (score >= 85) return "bg-emerald-500"
  if (score >= 70) return "bg-amber-500"
  return "bg-red-500"
}

export function healthTextColor(score: number): string {
  if (score >= 85) return "text-emerald-600"
  if (score >= 70) return "text-amber-600"
  return "text-red-600"
}

interface HealthBarProps {
  score: number
  showValue?: boolean
  barWidth?: string
}

export default function HealthBar({ score, showValue = true, barWidth = "w-20" }: HealthBarProps) {
  return (
    <div className="flex items-center gap-2.5">
      {showValue && (
        <span className={cn("w-7 text-right text-sm font-semibold", healthTextColor(score))}>
          {score}
        </span>
      )}
      <div className={cn("h-1.5 overflow-hidden rounded-full bg-gray-100", barWidth)}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", healthBarColor(score))}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}