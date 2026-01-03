import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, price, categoryId, tax, available, imageUrl } = body

    if (!id) {
      return NextResponse.json(
        { error: "Menu item ID is required" },
        { status: 400 }
      )
    }

    // Create server-side Supabase client with service role key (bypasses RLS)
    const supabase = createServerClient()

    // Build update object
    const updateData: any = {}
    if (name !== undefined) updateData.name = name.trim()
    if (price !== undefined) {
      if (typeof price !== "number" || price < 0) {
        return NextResponse.json(
          { error: "Price must be a non-negative number" },
          { status: 400 }
        )
      }
      updateData.price = price
    }
    if (categoryId !== undefined) {
      // Verify category exists
      const { data: category, error: categoryError } = await supabase
        .from("menu_categories")
        .select("id")
        .eq("id", categoryId)
        .single()

      if (categoryError || !category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        )
      }
      updateData.category_id = categoryId
    }
    if (tax !== undefined) updateData.tax = tax
    if (available !== undefined) updateData.available = available
    if (imageUrl !== undefined) updateData.image_url = imageUrl || null

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      )
    }

    // Update menu item
    const { data: updatedItem, error } = await supabase
      .from("menu_items")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating menu item:", error)
      return NextResponse.json(
        { error: "Failed to update menu item", details: error.message },
        { status: 500 }
      )
    }

    if (!updatedItem) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      )
    }

    // Transform to camelCase for frontend
    return NextResponse.json({
      id: updatedItem.id,
      name: updatedItem.name,
      price: Number(updatedItem.price),
      categoryId: updatedItem.category_id,
      tax: updatedItem.tax,
      available: updatedItem.available,
      imageUrl: updatedItem.image_url || null,
    })
  } catch (error: any) {
    console.error("Update menu item error:", error)
    
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





