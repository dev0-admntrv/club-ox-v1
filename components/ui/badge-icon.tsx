import type React from "react"
import { cn } from "@/lib/utils"

interface BadgeIconProps {
  icon: React.ReactNode
  label: string
  unlocked?: boolean
  className?: string
}

export function BadgeIcon({ icon, label, unlocked = false, className }: BadgeIconProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center",
          unlocked ? "bg-primary/10 text-primary border border-primary/20" : "bg-muted text-muted-foreground",
        )}
      >
        {icon}
      </div>
      <span className={cn("text-xs text-center", unlocked ? "font-medium" : "text-muted-foreground")}>{label}</span>
    </div>
  )
}
