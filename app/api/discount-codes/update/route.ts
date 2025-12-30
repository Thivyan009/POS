import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, active, discountPercent, description } = body

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      )
    }

    if (discountPercent !== undefined && (discountPercent < 0 || discountPercent > 100)) {
      return NextResponse.json(
        { error: "Discount percent must be between 0 and 100" },
        { status: 400 }
      )
    }

    // Create server-side Supabase client with service role key (bypasses RLS)
    const supabase = createServerClient()

    const updateData: any = {}
    if (active !== undefined) updateData.active = active
    if (discountPercent !== undefined) updateData.discount_percent = discountPercent
    if (description !== undefined) updateData.description = description?.trim() || null

    // Update discount code
    const { data: updated, error } = await supabase
      .from("discount_codes")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating discount code:", error)
      return NextResponse.json(
        { error: "Failed to update discount code", details: error.message },
        { status: 500 }
      )
    }

    // Return updated discount code data
    return NextResponse.json({
      id: updated.id,
      code: updated.code,
      discountPercent: Number(updated.discount_percent),
      description: updated.description,
      active: updated.active,
      createdAt: updated.created_at,
    })
  } catch (error: any) {
    console.error("Update discount code error:", error)
    
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




