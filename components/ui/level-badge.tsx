import { cn } from "@/lib/utils"

interface LevelBadgeProps {
  level: string
  className?: string
}

export function LevelBadge({ level, className }: LevelBadgeProps) {
  return (
    <div
      className={cn(
        "px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r from-stone-800 to-stone-950",
        className,
      )}
    >
      {level}
    </div>
  )
}
