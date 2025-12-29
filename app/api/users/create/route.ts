import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, role } = body

    // Validation
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, password, and role are required" },
        { status: 400 }
      )
    }

    if (!["admin", "biller"].includes(role)) {
      return NextResponse.json(
        { error: "Role must be either 'admin' or 'biller'" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    // Create server-side Supabase client with service role key (bypasses RLS)
    const supabase = createServerClient()

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Create user
    const { data: newUser, error } = await supabase
      .from("users")
      .insert([
        {
          email: email.toLowerCase().trim(),
          password_hash: passwordHash,
          role: role,
          enabled: true,
        },
      ])
      .select("id, email, role, enabled, created_at")
      .single()

    if (error) {
      console.error("Error creating user:", error)
      return NextResponse.json(
        { error: "Failed to create user", details: error.message },
        { status: 500 }
      )
    }

    // Return user data (without password hash)
    return NextResponse.json({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      enabled: newUser.enabled,
      created_at: newUser.created_at,
    })
  } catch (error: any) {
    console.error("Create user error:", error)
    
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

