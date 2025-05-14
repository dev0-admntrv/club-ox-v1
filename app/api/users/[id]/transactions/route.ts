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
      .from("points_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("transaction_date", { ascending: false })

    if (error) {
      console.error("Error fetching user transactions:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in transactions route handler:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
