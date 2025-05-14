import { getSupabaseClient } from "@/lib/supabase/client"
import type { SupabaseClient } from "@supabase/supabase-js"

export class BaseService {
  protected supabase: SupabaseClient

  constructor() {
    this.supabase = getSupabaseClient()
  }

  protected handleError(error: any, context: string): never {
    console.error(`Error in ${context}:`, error)
    throw error
  }

  protected async getCurrentUserId(): Promise<string> {
    const { data, error } = await this.supabase.auth.getSession()

    if (error || !data.session) {
      throw new Error("User not authenticated")
    }

    return data.session.user.id
  }

  protected formatDate(date: Date | string): string {
    if (typeof date === "string") {
      return date
    }
    return date.toISOString()
  }
}
