import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

/**
 * Test Database Connection API
 * Helps diagnose connection and schema issues
 */
export async function GET() {
  try {
    const results: any = {
      connection: false,
      tables: {},
      usersTable: {},
      adminUser: null,
      errors: []
    }

    // Test basic connection
    try {
      const { data, error } = await supabase.from('menu_categories').select('id').limit(1)
      if (error) {
        results.errors.push(`Connection error: ${error.message}`)
      } else {
        results.connection = true
      }
    } catch (error: any) {
      results.errors.push(`Connection failed: ${error.message}`)
    }

    // Check all tables
    const tables = ['menu_categories', 'menu_items', 'users', 'bills', 'bill_items', 'discount_codes']
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('id').limit(1)
        results.tables[table] = error ? { exists: false, error: error.message } : { exists: true }
      } catch (error: any) {
        results.tables[table] = { exists: false, error: error.message }
      }
    }

    // Check users table structure
    try {
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('*')
        .limit(1)

      if (userError) {
        if (userError.message.includes('column') && userError.message.includes('email')) {
          results.usersTable = {
            exists: true,
            hasEmailColumn: false,
            error: 'Email column is missing. Run migration: supabase/migrations/001_add_email_column.sql'
          }
        } else {
          results.usersTable = {
            exists: true,
            error: userError.message
          }
        }
      } else {
        // Try to check if email column exists by querying it
        const { data: emailTest, error: emailError } = await supabase
          .from('users')
          .select('email')
          .limit(1)

        if (emailError && emailError.message.includes('column') && emailError.message.includes('email')) {
          results.usersTable = {
            exists: true,
            hasEmailColumn: false,
            error: 'Email column is missing'
          }
        } else {
          results.usersTable = {
            exists: true,
            hasEmailColumn: true,
            sampleUser: users && users.length > 0 ? users[0] : null
          }
        }
      }
    } catch (error: any) {
      results.usersTable = { error: error.message }
    }

    // Check for admin user
    try {
      const { data: admin, error: adminError } = await supabase
        .from('users')
        .select('id, email, role, enabled')
        .eq('email', 'paruthimunaitech@gmail.com')
        .single()

      if (adminError) {
        if (adminError.message.includes('column') && adminError.message.includes('email')) {
          results.adminUser = { error: 'Email column missing - cannot check admin user' }
        } else if (adminError.code === 'PGRST116') {
          results.adminUser = { error: 'Admin user not found' }
        } else {
          results.adminUser = { error: adminError.message }
        }
      } else {
        results.adminUser = admin
      }
    } catch (error: any) {
      results.adminUser = { error: error.message }
    }

    return NextResponse.json({
      success: results.connection && results.usersTable.hasEmailColumn,
      ...results
    })
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false,
        error: error.message 
      },
      { status: 500 }
    )
  }
}

