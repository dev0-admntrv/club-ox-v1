"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import type { SupabaseClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"

type SupabaseContextType = {
  supabase: SupabaseClient<Database>
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => getSupabaseClient())

  useEffect(() => {
    // Verificar se há múltiplas instâncias (apenas em desenvolvimento)
    if (process.env.NODE_ENV === "development") {
      const globalWithSupabase = global as typeof global & {
        supabaseInstanceCount?: number
      }

      globalWithSupabase.supabaseInstanceCount = (globalWithSupabase.supabaseInstanceCount || 0) + 1

      if (globalWithSupabase.supabaseInstanceCount > 1) {
        console.warn("Múltiplas instâncias do SupabaseProvider detectadas. Isso pode causar problemas de autenticação.")
      }

      return () => {
        globalWithSupabase.supabaseInstanceCount = (globalWithSupabase.supabaseInstanceCount || 0) - 1
      }
    }
  }, [])

  return <SupabaseContext.Provider value={{ supabase }}>{children}</SupabaseContext.Provider>
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error("useSupabase deve ser usado dentro de um SupabaseProvider")
  }
  return context
}
