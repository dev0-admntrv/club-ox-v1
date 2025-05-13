import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface BadgeIconProps {
  icon: ReactNode
  label: string
  unlocked?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function BadgeIcon({ icon, label, unlocked = false, size = "md", className }: BadgeIconProps) {
  const sizeClasses = {
    sm: {
      container: "w-12 h-12",
      icon: "h-5 w-5",
      label: "text-xs",
    },
    md: {
      container: "w-16 h-16",
      icon: "h-7 w-7",
      label: "text-sm",
    },
    lg: {
      container: "w-20 h-20",
      icon: "h-9 w-9",
      label: "text-base",
    },
  }

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        className={cn(
          sizeClasses[size].container,
          "rounded-full flex items-center justify-center relative",
          unlocked ? "bg-gradient-to-br from-primary/80 to-primary shadow-lg" : "bg-muted text-muted-foreground",
        )}
      >
        {unlocked && (
          <div
            className="absolute inset-0 rounded-full bg-primary/20 animate-pulse"
            style={{ animationDuration: "3s" }}
          ></div>
        )}
        <div
          className={cn(
            "relative z-10",
            unlocked ? "text-primary-foreground" : "text-muted-foreground",
            sizeClasses[size].icon,
          )}
        >
          {icon}
        </div>
        {unlocked && (
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-sm"></div>
        )}
      </div>
      <span className={cn("font-medium text-center", sizeClasses[size].label)}>{label}</span>
    </div>
  )
}
