"use client"

import type { ReactNode } from "react"
import { useSessionTimeout } from "@/lib/session-timeout"

interface SessionProviderProps {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  // Aplicar o timeout de sessão
  useSessionTimeout()

  return <>{children}</>
}
