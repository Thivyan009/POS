import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name } = body

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      )
    }

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      )
    }

    // Create server-side Supabase client with service role key (bypasses RLS)
    const supabase = createServerClient()

    // Update menu category
    const { data: updatedCategory, error } = await supabase
      .from("menu_categories")
      .update({ name: name.trim() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating menu category:", error)
      // Check for unique constraint violation
      if (error.code === "23505" || error.message?.includes("unique")) {
        return NextResponse.json(
          { error: "A category with this name already exists" },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: "Failed to update menu category", details: error.message },
        { status: 500 }
      )
    }

    if (!updatedCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: updatedCategory.id,
      name: updatedCategory.name,
    })
  } catch (error: any) {
    console.error("Update menu category error:", error)
    
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





