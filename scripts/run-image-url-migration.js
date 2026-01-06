/**
 * Run Migration: Add image_url column to menu_items
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(
  supabaseUrl,
  serviceRoleKey || supabaseKey
)

async function runMigration() {
  console.log('🚀 Starting migration: Add image_url to menu_items...\n')

  try {
    // Read migration SQL file
    const migrationPath = path.join(__dirname, '../supabase/migrations/003_add_image_url_to_menu_items.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

    console.log('📄 Migration SQL loaded\n')

    // Try to verify if column already exists
    console.log('🔍 Checking if image_url column exists...')
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('image_url')
        .limit(1)

      if (error && error.message.includes('column') && error.message.includes('image_url')) {
        console.log('  ⚠️  image_url column does not exist - migration needed\n')
      } else if (!error) {
        console.log('  ✅ image_url column already exists!\n')
        console.log('  ℹ️  Migration may have already been run.')
        console.log('  ℹ️  If you want to re-run it, execute the SQL manually in Supabase SQL Editor.\n')
        return
      }
    } catch (error) {
      console.log('  ⚠️  Could not verify column status\n')
    }

    // Try to execute via REST API if service role key is available
    if (serviceRoleKey) {
      console.log('✅ Service role key found - attempting to execute via REST API...\n')
      
      try {
        // Try using the Supabase REST API to execute SQL
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`
          },
          body: JSON.stringify({ sql: migrationSQL })
        })

        if (response.ok) {
          console.log('✅ Migration executed successfully via REST API!\n')
          await verifyMigration()
          return
        } else {
          const errorText = await response.text()
          console.log('⚠️  REST API execution failed:', errorText)
          console.log('📝 Falling back to manual execution instructions...\n')
        }
      } catch (error) {
        console.log('⚠️  REST API method not available:', error.message)
        console.log('📝 Using manual execution method...\n')
      }
    }

    // Since we can't execute ALTER TABLE via JS client, show instructions
    console.log('='.repeat(70))
    console.log('📋 MIGRATION SQL - COPY AND RUN IN SUPABASE SQL EDITOR:')
    console.log('='.repeat(70))
    console.log('\n' + migrationSQL)
    console.log('\n' + '='.repeat(70))
    console.log('\n📍 Steps to run manually:')
    console.log('1. Go to: https://supabase.com/dashboard')
    console.log('2. Select your project')
    console.log('3. Click "SQL Editor" → "New query"')
    console.log('4. Paste the SQL above')
    console.log('5. Click "Run" (or press Cmd/Ctrl + Enter)')
    console.log('6. Wait for "Success" message\n')

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.log('\n📋 Please run the migration manually using the SQL in:')
    console.log('   supabase/migrations/003_add_image_url_to_menu_items.sql\n')
    process.exit(1)
  }
}

async function verifyMigration() {
  console.log('🔍 Verifying migration...\n')
  
  try {
    // Try to query the image_url column
    const { data, error } = await supabase
      .from('menu_items')
      .select('id, name, image_url')
      .limit(5)

    if (error) {
      if (error.message.includes('column') && error.message.includes('image_url')) {
        console.log('⚠️  Migration verification failed - image_url column not found')
        console.log('   Please run the migration SQL manually in Supabase SQL Editor\n')
      } else {
        console.log('⚠️  Could not verify migration:', error.message)
      }
    } else {
      console.log('✅ Migration verified successfully!')
      console.log(`   Found ${data?.length || 0} menu item(s)`)
      console.log('   image_url column is now available\n')
    }
  } catch (error) {
    console.log('⚠️  Could not verify migration:', error.message)
  }
}

runMigration()
  .then(() => {
    console.log('✅ Migration process completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })








