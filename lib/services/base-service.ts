"use client"

import { getSupabaseClient } from "@/lib/supabase/client"
import type { SupabaseClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"

export class BaseService {
  protected supabase: SupabaseClient<Database>

  constructor() {
    this.supabase = getSupabaseClient()
  }

  protected handleError(error: unknown, methodName: string): never {
    console.error(`Erro em ${this.constructor.name}.${methodName}:`, error)
    throw error
  }
}
