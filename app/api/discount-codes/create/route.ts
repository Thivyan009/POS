import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, discountPercent, description } = body

    // Validation
    if (!code || discountPercent === undefined) {
      return NextResponse.json(
        { error: "Code and discountPercent are required" },
        { status: 400 }
      )
    }

    if (discountPercent < 0 || discountPercent > 100) {
      return NextResponse.json(
        { error: "Discount percent must be between 0 and 100" },
        { status: 400 }
      )
    }

    // Create server-side Supabase client with service role key (bypasses RLS)
    const supabase = createServerClient()

    // Create discount code
    const { data: newCode, error } = await supabase
      .from("discount_codes")
      .insert([
        {
          code: code.trim().toUpperCase(),
          discount_percent: discountPercent,
          description: description?.trim() || null,
          active: true,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating discount code:", error)
      return NextResponse.json(
        { error: "Failed to create discount code", details: error.message },
        { status: 500 }
      )
    }

    // Return discount code data
    return NextResponse.json({
      id: newCode.id,
      code: newCode.code,
      discountPercent: Number(newCode.discount_percent),
      description: newCode.description,
      active: newCode.active,
      createdAt: newCode.created_at,
    })
  } catch (error: any) {
    console.error("Create discount code error:", error)
    
    // Check if it's a missing service role key error
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












