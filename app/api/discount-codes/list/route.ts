import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    // Create server-side Supabase client with service role key (bypasses RLS)
    const supabase = createServerClient()

    // Get all discount codes
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching discount codes:", error)
      return NextResponse.json(
        { error: "Failed to fetch discount codes", details: error.message },
        { status: 500 }
      )
    }

    // Transform to camelCase
    const codes = (data || []).map((code) => ({
      id: code.id,
      code: code.code,
      discountPercent: Number(code.discount_percent),
      description: code.description,
      active: code.active,
      createdAt: code.created_at,
    }))

    return NextResponse.json(codes)
  } catch (error: any) {
    console.error("List discount codes error:", error)
    
    if (error.message && error.message.includes("SUPABASE_SERVICE_ROLE_KEY")) {
      return NextResponse.json(
        { 
          error: "Server configuration error",
          details: "SUPABASE_SERVICE_ROLE_KEY is not set. Please add it to your .env.local file"
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: "Internal server error", details: error.message || "Unknown error" },
      { status: 500 }
    )
  }
}





