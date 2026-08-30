import { cn, initials } from "../../lib/utils"

interface AvatarProps {
  name: string
  size?: "sm" | "md" | "lg"
  colorClass?: string
}

const sizes = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-sm",
}

export default function Avatar({ name, size = "md", colorClass = "bg-primary-600" }: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        sizes[size],
        colorClass,
      )}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}