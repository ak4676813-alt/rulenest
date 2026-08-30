import Badge, { type BadgeVariant } from "./ui/Badge"
import { statusLabel } from "../lib/utils"

/** Maps every domain status to a consistent, theme-driven badge color. */
const statusVariants: Record<string, BadgeVariant> = {
  // property health
  excellent: "green",
  good: "green",
  fair: "amber",
  attention: "red",
  // requirements
  verified: "green",
  current: "blue",
  "due-soon": "amber",
  "expiring-soon": "amber",
  "missing-evidence": "red",
  overdue: "red",
  // documents
  pending: "amber",
  expired: "red",
  processing: "blue",
  // tasks
  open: "blue",
  completed: "green",
  snoozed: "gray",
  // priorities & severity
  high: "red",
  medium: "amber",
  low: "gray",
  critical: "red",
}

export default function StatusBadge({ status, label }: { status: string; label?: string }) {
  return (
    <Badge variant={statusVariants[status] ?? "gray"} dot>
      {label ?? statusLabel(status)}
    </Badge>
  )
}