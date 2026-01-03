import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("image") as File

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      )
    }

    // Create server-side Supabase client with service role key
    const supabase = createServerClient()

    // Generate unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `menu-items/${fileName}`

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("Menu Images")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error("Error uploading image:", error)
      return NextResponse.json(
        { error: "Failed to upload image", details: error.message },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("Menu Images")
      .getPublicUrl(filePath)

    if (!urlData?.publicUrl) {
      return NextResponse.json(
        { error: "Failed to get image URL" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      url: urlData.publicUrl,
      path: filePath,
    })
  } catch (error: any) {
    console.error("Upload image error:", error)
    
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

// DELETE endpoint to remove images
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imagePath = searchParams.get("path")

    if (!imagePath) {
      return NextResponse.json(
        { error: "Image path is required" },
        { status: 400 }
      )
    }

    // Create server-side Supabase client
    const supabase = createServerClient()

    // Delete from Supabase Storage
    const { error } = await supabase.storage
      .from("Menu Images")
      .remove([imagePath])

    if (error) {
      console.error("Error deleting image:", error)
      return NextResponse.json(
        { error: "Failed to delete image", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Delete image error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error.message || "Unknown error" },
      { status: 500 }
    )
  }
}

