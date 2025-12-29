import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, price, categoryId, tax, available, imageUrl } = body

    // Validation
    if (!name || price === undefined || !categoryId) {
      return NextResponse.json(
        { error: "Name, price, and categoryId are required" },
        { status: 400 }
      )
    }

    if (typeof price !== "number" || price < 0) {
      return NextResponse.json(
        { error: "Price must be a non-negative number" },
        { status: 400 }
      )
    }

    // Create server-side Supabase client with service role key (bypasses RLS)
    const supabase = createServerClient()

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

    // Create menu item
    const { data: newItem, error } = await supabase
      .from("menu_items")
      .insert([
        {
          name: name.trim(),
          price: price,
          category_id: categoryId,
          tax: tax ?? true,
          available: available ?? true,
          image_url: imageUrl || null,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating menu item:", error)
      return NextResponse.json(
        { error: "Failed to create menu item", details: error.message },
        { status: 500 }
      )
    }

    // Transform to camelCase for frontend
    return NextResponse.json({
      id: newItem.id,
      name: newItem.name,
      price: Number(newItem.price),
      categoryId: newItem.category_id,
      tax: newItem.tax,
      available: newItem.available,
      imageUrl: newItem.image_url || null,
    })
  } catch (error: any) {
    console.error("Create menu item error:", error)
    
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

