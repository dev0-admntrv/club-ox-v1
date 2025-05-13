"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"

// Variável global para armazenar a instância do cliente
let supabaseClientInstance: ReturnType<typeof createClientComponentClient<Database>> | null = null

// Função para obter o cliente Supabase (singleton)
export function getSupabaseClient() {
  // Verificar se estamos no lado do cliente
  if (typeof window === "undefined") {
    // No lado do servidor, sempre criar uma nova instância
    return createClientComponentClient<Database>()
  }

  // No lado do cliente, usar o padrão singleton
  if (!supabaseClientInstance) {
    supabaseClientInstance = createClientComponentClient<Database>()
  }

  return supabaseClientInstance
}
