"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLoyaltyTheme } from "@/hooks/use-loyalty-theme"
import { useAuth } from "@/contexts/auth-context"

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()

  // Usar o hook personalizado para aplicar o tema baseado no nível
  useLoyaltyTheme()

  // Evitar hidratação incorreta
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full">
          {theme === "light" ? (
            <Sun className="h-5 w-5" />
          ) : theme === "dark" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Laptop className="h-5 w-5" />
          )}
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Claro</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Escuro</span>
          {user?.loyalty_level?.name && <span className="ml-2 text-xs opacity-70">({user.loyalty_level.name})</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Laptop className="mr-2 h-4 w-4" />
          <span>Sistema</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
