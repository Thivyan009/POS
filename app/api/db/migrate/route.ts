import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

/**
 * Database Migration API
 * Automatically adds missing columns to existing tables
 */
export async function POST(request: NextRequest) {
  try {
    const results: string[] = []
    const errors: string[] = []

    // Check if users table exists and has email column
    try {
      const { data: columns, error: columnError } = await supabase.rpc('exec_sql', {
        sql: `
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'users' 
          AND column_name = 'email'
        `
      })

      // If RPC doesn't work, try direct query to check table structure
      const { data: userTest, error: userError } = await supabase
        .from('users')
        .select('id')
        .limit(1)

      if (userError && userError.message.includes('column') && userError.message.includes('email')) {
        // Email column doesn't exist, add it
        results.push('Email column missing in users table - will be added via SQL migration')
        errors.push('Please run the migration SQL in Supabase SQL Editor')
      } else {
        // Try to query email to see if it exists
        const { data: emailTest, error: emailTestError } = await supabase
          .from('users')
          .select('email')
          .limit(1)

        if (emailTestError && emailTestError.message.includes('column') && emailTestError.message.includes('email')) {
          results.push('Email column missing - migration needed')
        } else {
          results.push('Email column exists ✓')
        }
      }
    } catch (error: any) {
      errors.push(`Error checking users table: ${error.message}`)
    }

    // Test database connection
    try {
      const { data, error } = await supabase.from('menu_categories').select('id').limit(1)
      if (error) {
        errors.push(`Database connection error: ${error.message}`)
      } else {
        results.push('Database connection successful ✓')
      }
    } catch (error: any) {
      errors.push(`Connection test failed: ${error.message}`)
    }

    // Check all required tables exist
    const tables = ['menu_categories', 'menu_items', 'users', 'bills', 'bill_items', 'discount_codes']
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('id').limit(1)
        if (error) {
          errors.push(`Table ${table} may not exist: ${error.message}`)
        } else {
          results.push(`Table ${table} exists ✓`)
        }
      } catch (error: any) {
        errors.push(`Error checking table ${table}: ${error.message}`)
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      results,
      errors,
      message: errors.length > 0 
        ? 'Some issues found. Please run the migration SQL in Supabase SQL Editor.'
        : 'Database is up to date!'
    })
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        message: 'Migration check failed. Please verify your database connection.'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return POST(new NextRequest('http://localhost/api/db/migrate', { method: 'POST' }))
}








