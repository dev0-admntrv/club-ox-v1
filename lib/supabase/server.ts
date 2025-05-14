import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/database.types"

// Não podemos usar um singleton global para o servidor devido à natureza
// das requisições HTTP e ao isolamento entre elas.
// No entanto, podemos garantir que usamos o mesmo cliente dentro de uma única requisição.
export const getSupabaseServer = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
    options: {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    },
  })
}
