/**
 * Database Connection Check Script
 * Tests the database connection and checks for missing columns
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabase() {
  console.log('🔍 Checking database connection...\n')

  try {
    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('menu_categories')
      .select('id')
      .limit(1)

    if (testError) {
      console.error('❌ Database connection failed:', testError.message)
      return false
    }

    console.log('✅ Database connection successful!\n')

    // Check all tables
    const tables = [
      'menu_categories',
      'menu_items',
      'users',
      'bills',
      'bill_items',
      'discount_codes'
    ]

    console.log('📊 Checking tables...')
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('id').limit(1)
        if (error) {
          console.log(`  ❌ Table "${table}": ${error.message}`)
        } else {
          console.log(`  ✅ Table "${table}" exists`)
        }
      } catch (err) {
        console.log(`  ❌ Table "${table}": ${err.message}`)
      }
    }

    // Check users table structure
    console.log('\n👤 Checking users table structure...')
    try {
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('id, email, role')
        .limit(1)

      if (userError) {
        if (userError.message.includes('email')) {
          console.log('  ⚠️  Email column missing in users table!')
          console.log('  📝 Run the migration: supabase/migrations/001_add_email_column.sql')
        } else {
          console.log(`  ❌ Error: ${userError.message}`)
        }
      } else {
        console.log('  ✅ Users table structure looks good')
        if (users && users.length > 0 && users[0].email) {
          console.log(`  ✅ Email column exists`)
        }
      }
    } catch (err) {
      console.log(`  ❌ Error checking users table: ${err.message}`)
    }

    // Check for default admin user
    console.log('\n🔐 Checking default admin user...')
    try {
      const { data: admin, error: adminError } = await supabase
        .from('users')
        .select('id, email, role, enabled')
        .eq('email', 'paruthimunaitech@gmail.com')
        .single()

      if (adminError || !admin) {
        console.log('  ⚠️  Default admin user not found!')
        console.log('  📝 Run the migration: supabase/migrations/002_remove_username_column.sql')
      } else {
        console.log('  ✅ Default admin user exists')
        console.log(`     Email: ${admin.email}`)
        console.log(`     Role: ${admin.role}`)
        console.log(`     Enabled: ${admin.enabled}`)
      }
    } catch (err) {
      console.log(`  ❌ Error checking admin user: ${err.message}`)
    }

    console.log('\n✅ Database check complete!')
    return true
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    return false
  }
}

checkDatabase()
  .then((success) => {
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })

