"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"

// Implementação correta do padrão singleton para o cliente Supabase
let supabaseClient: ReturnType<typeof createClientComponentClient<Database>> | null = null

export function getSupabaseClient() {
  if (typeof window === "undefined") {
    // Retorna um cliente mock para SSR para evitar erros
    return {} as ReturnType<typeof createClientComponentClient<Database>>
  }

  if (!supabaseClient) {
    // Criamos apenas uma instância do cliente
    supabaseClient = createClientComponentClient<Database>()
  }

  return supabaseClient
}
