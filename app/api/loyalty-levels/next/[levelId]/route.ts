import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/database.types"

export async function GET(request: Request, { params }: { params: { levelId: string } }) {
  const levelId = params.levelId

  if (!levelId) {
    return NextResponse.json({ error: "Level ID is required" }, { status: 400 })
  }

  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })

    // Get current level to find min_points_required
    const { data: currentLevel, error: currentLevelError } = await supabase
      .from("loyalty_levels")
      .select("min_points_required")
      .eq("id", levelId)
      .single()

    if (currentLevelError) {
      console.error("Error fetching current loyalty level:", currentLevelError)
      return NextResponse.json({ error: currentLevelError.message }, { status: 500 })
    }

    // Get next level based on min_points_required
    const { data: nextLevel, error: nextLevelError } = await supabase
      .from("loyalty_levels")
      .select("*")
      .gt("min_points_required", currentLevel.min_points_required)
      .order("min_points_required", { ascending: true })
      .limit(1)
      .single()

    if (nextLevelError && nextLevelError.code !== "PGRST116") {
      // PGRST116 is the error code for no rows returned
      console.error("Error fetching next loyalty level:", nextLevelError)
      return NextResponse.json({ error: nextLevelError.message }, { status: 500 })
    }

    return NextResponse.json(nextLevel || null)
  } catch (error) {
    console.error("Error in next loyalty level route handler:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
