import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Menu item ID is required" },
        { status: 400 }
      )
    }

    // Create server-side Supabase client with service role key (bypasses RLS)
    const supabase = createServerClient()

    // Check if menu item exists
    const { data: item, error: checkError } = await supabase
      .from("menu_items")
      .select("id")
      .eq("id", id)
      .single()

    if (checkError || !item) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      )
    }

    // Delete menu item
    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting menu item:", error)
      return NextResponse.json(
        { error: "Failed to delete menu item", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Delete menu item error:", error)
    
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






