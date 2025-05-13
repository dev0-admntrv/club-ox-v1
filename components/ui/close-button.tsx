"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CloseButtonProps {
  onClick: () => void
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function CloseButton({ onClick, className, variant = "ghost", size = "icon" }: CloseButtonProps) {
  return (
    <Button variant={variant} size={size} onClick={onClick} className={cn("", className)} aria-label="Fechar">
      <X className="h-5 w-5" />
    </Button>
  )
}
