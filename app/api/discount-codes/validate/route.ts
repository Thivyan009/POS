import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    if (!code) {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      )
    }

    // Create server-side Supabase client with service role key (bypasses RLS)
    const supabase = createServerClient()

    // Validate discount code
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("code", code.trim().toUpperCase())
      .eq("active", true)
      .single()

    if (error || !data) {
      // Not found or not active
      return NextResponse.json(null)
    }

    // Return discount code data
    return NextResponse.json({
      id: data.id,
      code: data.code,
      discountPercent: Number(data.discount_percent),
      description: data.description,
      active: data.active,
      createdAt: data.created_at,
    })
  } catch (error: any) {
    console.error("Validate discount code error:", error)
    return NextResponse.json(null)
  }
}

