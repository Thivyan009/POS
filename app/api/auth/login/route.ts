import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Fetch user by email
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, password_hash, role, enabled")
      .eq("email", email.toLowerCase().trim())
      .single()

    if (error) {
      console.error("Database error during login:", error)
      // Check if it's a column missing error (PostgreSQL error code 42703 = undefined_column)
      const isColumnMissing = 
        error.code === '42703' || 
        (error.message && error.message.includes("column") && error.message.includes("email")) ||
        (error.message && error.message.includes("does not exist"))
      
      if (isColumnMissing) {
        return NextResponse.json(
          { 
            error: "Database migration required. Email column is missing.",
            migrationNeeded: true,
            details: "Please run the migration SQL in Supabase SQL Editor. See supabase/migrations/001_add_email_column.sql",
            migrationUrl: "/admin/setup"
          },
          { status: 500 }
        )
      }
      return NextResponse.json(
        { error: "Invalid email or password", details: error.message },
        { status: 401 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Check if user is enabled
    if (!user.enabled) {
      return NextResponse.json(
        { error: "Account is disabled" },
        { status: 403 }
      )
    }

    // Verify password
    if (!user.password_hash) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Return user data (without password hash)
    return NextResponse.json({
      id: user.id,
      email: user.email,
      role: user.role,
      enabled: user.enabled,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

