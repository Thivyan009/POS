import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import fs from "fs"
import path from "path"

/**
 * Run Database Migration API
 * Executes the migration SQL step by step
 */
export async function POST() {
  try {
    const results: string[] = []
    const errors: string[] = []

    // Step 1: Check if email column exists, try to add it via operations
    results.push("Step 1: Checking email column...")
    
    try {
      const { error: emailCheck } = await supabase
        .from("users")
        .select("email")
        .limit(1)

      if (emailCheck && emailCheck.message.includes("column") && emailCheck.message.includes("email")) {
        errors.push("Email column missing - SQL migration required")
        results.push("⚠️ Email column does not exist")
      } else {
        results.push("✅ Email column exists")
      }
    } catch (error: any) {
      errors.push(`Error checking email: ${error.message}`)
    }

    // Step 2: Delete all users (if we can)
    results.push("\nStep 2: Deleting existing users...")
    try {
      // Get all user IDs first
      const { data: allUsers } = await supabase
        .from("users")
        .select("id")

      if (allUsers && allUsers.length > 0) {
        // Delete all users
        const { error: deleteError } = await supabase
          .from("users")
          .delete()
          .in("id", allUsers.map(u => u.id))

        if (deleteError) {
          errors.push(`Could not delete users: ${deleteError.message}`)
          results.push("⚠️ Could not delete users (may need SQL migration)")
        } else {
          results.push(`✅ Deleted ${allUsers.length} user(s)`)
        }
      } else {
        results.push("✅ No users to delete")
      }
    } catch (error: any) {
      errors.push(`Error deleting users: ${error.message}`)
    }

    // Step 3: Try to insert admin user
    results.push("\nStep 3: Creating admin user...")
    try {
      const { data, error: insertError } = await supabase
        .from("users")
        .upsert({
          id: "00000000-0000-0000-0000-000000000001",
          email: "paruthimunaitech@gmail.com",
          password_hash: "$2b$10$hl9JnxG307QqlN3zGG2NfuC21DuAhKFhnZilhagKhyKTMaqpNeVXO",
          role: "admin",
          enabled: true,
        }, {
          onConflict: "id"
        })
        .select()

      if (insertError) {
        if (insertError.message.includes("column") && insertError.message.includes("username")) {
          errors.push("Username column still exists - full SQL migration required")
          results.push("⚠️ Cannot insert - username column needs to be removed via SQL")
        } else if (insertError.message.includes("column") && insertError.message.includes("email")) {
          errors.push("Email column missing - SQL migration required")
          results.push("⚠️ Cannot insert - email column missing")
        } else {
          errors.push(`Insert error: ${insertError.message}`)
          results.push(`⚠️ ${insertError.message}`)
        }
      } else {
        results.push("✅ Admin user created/updated")
      }
    } catch (error: any) {
      errors.push(`Error inserting admin: ${error.message}`)
    }

    // Read migration SQL for reference
    let migrationSQL = ""
    try {
      const migrationPath = path.join(process.cwd(), "supabase/migrations/002_remove_username_column.sql")
      migrationSQL = fs.readFileSync(migrationPath, "utf-8")
    } catch {
      // Migration file not found, that's okay
    }

    const needsSQLMigration = errors.some(e => 
      e.includes("SQL migration required") || 
      e.includes("column") && (e.includes("username") || e.includes("email"))
    )

    return NextResponse.json({
      success: errors.length === 0 && !needsSQLMigration,
      results,
      errors,
      needsSQLMigration,
      migrationSQL: needsSQLMigration ? migrationSQL : undefined,
      message: needsSQLMigration
        ? "SQL migration required - column structure changes need to be done via SQL Editor"
        : errors.length > 0
        ? "Some operations failed - check errors"
        : "Migration completed successfully!"
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: "Migration check failed"
      },
      { status: 500 }
    )
  }
}





