"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"
import { useAuth } from "@/contexts/auth-context"

export function useLoyaltyTheme() {
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()

  useEffect(() => {
    if (!user?.loyalty_level?.name) return

    // Mapear o nível de fidelidade para o tema correspondente
    const levelThemeMap: Record<string, string> = {
      Bronze: "bronze",
      Prata: "silver",
      Ouro: "gold",
      Diamante: "diamond",
      "Mestre da Carne": "diamond", // Caso exista este nível
    }

    const loyaltyLevel = user.loyalty_level.name
    const themeClass = levelThemeMap[loyaltyLevel] || "bronze"

    // Aplicar a classe do tema baseada no nível
    document.documentElement.classList.remove("theme-bronze", "theme-silver", "theme-gold", "theme-diamond")
    document.documentElement.classList.add(`theme-${themeClass}`)

    // Garantir que o tema dark esteja ativado
    if (theme !== "dark") {
      setTheme("dark")
    }
  }, [user?.loyalty_level?.name, theme, setTheme])

  return { theme, setTheme }
}
