"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"

// Implementação do padrão singleton para o cliente Supabase
// Usando uma variável global para garantir que apenas uma instância seja criada
// mesmo com hot-reloading durante o desenvolvimento
const globalForSupabase = globalThis as unknown as {
  supabase: ReturnType<typeof createClientComponentClient<Database>> | undefined
}

export function getSupabaseClient() {
  if (!globalForSupabase.supabase) {
    globalForSupabase.supabase = createClientComponentClient<Database>({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      options: {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      },
    })
  }
  return globalForSupabase.supabase
}
