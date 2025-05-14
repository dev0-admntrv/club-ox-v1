import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/database.types"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const userId = params.id

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })

    // Verify the user is requesting their own data
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session || session.user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("challenges")
      .select(`
        id,
        name,
        description,
        points_reward,
        is_active,
        start_date,
        end_date,
        created_at,
        updated_at,
        user_challenges:user_challenges!inner(
          id,
          status,
          progress_details,
          created_at,
          updated_at,
          completed_at
        )
      `)
      .eq("is_active", true)
      .eq("user_challenges.user_id", userId)
      .eq("user_challenges.status", "in_progress")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching active challenges:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in active challenges route handler:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
