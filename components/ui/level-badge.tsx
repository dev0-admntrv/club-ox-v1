import { cn } from "@/lib/utils"

interface LevelBadgeProps {
  level: string
  className?: string
}

const levelColors = {
  Bronze: "bg-amber-700",
  Prata: "bg-gray-400",
  Ouro: "bg-yellow-500",
  Diamante: "bg-blue-400",
  "Mestre da Carne": "bg-red-600",
}

export function LevelBadge({ level, className }: LevelBadgeProps) {
  const bgColor = levelColors[level as keyof typeof levelColors] || "bg-muted"

  return <div className={cn("px-3 py-1 rounded-full text-xs font-medium text-white", bgColor, className)}>{level}</div>
}
