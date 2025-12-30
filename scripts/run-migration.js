/**
 * Automated Migration Script
 * Attempts to run the migration SQL via Supabase
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

// Use service role key if available, otherwise use anon key
const supabase = createClient(
  supabaseUrl,
  serviceRoleKey || supabaseKey
)

async function runMigration() {
  console.log('🚀 Starting database migration...\n')

  try {
    // Read migration SQL file
    const migrationPath = path.join(__dirname, '../supabase/migrations/002_remove_username_column.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

    console.log('📄 Migration SQL loaded\n')

    // Note: Supabase JS client doesn't support executing raw SQL directly
    // We need to use the REST API or SQL Editor
    console.log('⚠️  Direct SQL execution via JS client is not supported for security reasons.')
    console.log('📋 However, I can help you run it automatically!\n')

    // Try to execute via RPC if we have a function, otherwise provide instructions
    if (serviceRoleKey) {
      console.log('✅ Service role key found - attempting to execute via REST API...\n')
      
      // Try to execute via Supabase REST API
      try {
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
          console.log('✅ Migration executed successfully!\n')
          await verifyMigration()
          return
        }
      } catch (error) {
        console.log('⚠️  REST API method not available, using alternative approach...\n')
      }
    }

    // Alternative: Execute step by step using Supabase client operations
    console.log('🔄 Executing migration step by step...\n')

    // Step 1: Check if email column exists, if not add it
    console.log('Step 1: Ensuring email column exists...')
    try {
      // Try to query email column
      const { error: emailError } = await supabase
        .from('users')
        .select('email')
        .limit(1)

      if (emailError && emailError.message.includes('column') && emailError.message.includes('email')) {
        console.log('  ⚠️  Email column missing - cannot add via client API')
        console.log('  📝 Please run the SQL migration manually in Supabase SQL Editor\n')
        showInstructions(migrationSQL)
        return
      }
      console.log('  ✅ Email column exists\n')
    } catch (error) {
      console.log('  ⚠️  Could not verify email column\n')
    }

    // Step 2: Delete all users
    console.log('Step 2: Deleting all existing users...')
    try {
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

      if (deleteError) {
        console.log(`  ⚠️  Error: ${deleteError.message}`)
        console.log('  📝 This step requires manual execution\n')
      } else {
        console.log('  ✅ All users deleted\n')
      }
    } catch (error) {
      console.log(`  ⚠️  Error: ${error.message}\n`)
    }

    // Step 3: Insert admin user
    console.log('Step 3: Inserting default admin user...')
    try {
      const { data, error: insertError } = await supabase
        .from('users')
        .upsert({
          id: '00000000-0000-0000-0000-000000000001',
          email: 'paruthimunaitech@gmail.com',
          password_hash: '$2b$10$hl9JnxG307QqlN3zGG2NfuC21DuAhKFhnZilhagKhyKTMaqpNeVXO',
          role: 'admin',
          enabled: true
        }, {
          onConflict: 'id'
        })
        .select()

      if (insertError) {
        console.log(`  ⚠️  Error: ${insertError.message}`)
        if (insertError.message.includes('column') && insertError.message.includes('username')) {
          console.log('  📝 Username column still exists - need to run full SQL migration\n')
        }
      } else {
        console.log('  ✅ Admin user created/updated\n')
      }
    } catch (error) {
      console.log(`  ⚠️  Error: ${error.message}\n`)
    }

    console.log('\n⚠️  Some steps require manual SQL execution.')
    console.log('📋 Full migration SQL is available below:\n')
    showInstructions(migrationSQL)

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.log('\n📋 Please run the migration manually using the SQL below:\n')
    showInstructions()
    process.exit(1)
  }
}

function showInstructions(migrationSQL) {
  const migrationPath = path.join(__dirname, '../supabase/migrations/002_remove_username_column.sql')
  const sql = migrationSQL || fs.readFileSync(migrationPath, 'utf8')
  
  console.log('='.repeat(70))
  console.log('📋 COPY THIS SQL AND RUN IN SUPABASE SQL EDITOR:')
  console.log('='.repeat(70))
  console.log('\n' + sql)
  console.log('\n' + '='.repeat(70))
  console.log('\n📍 Steps:')
  console.log('1. Go to: https://supabase.com/dashboard')
  console.log('2. Select your project')
  console.log('3. Click "SQL Editor" → "New query"')
  console.log('4. Paste the SQL above')
  console.log('5. Click "Run"\n')
}

async function verifyMigration() {
  console.log('🔍 Verifying migration...\n')
  
  try {
    const { data: admin, error } = await supabase
      .from('users')
      .select('id, email, role, enabled')
      .eq('email', 'paruthimunaitech@gmail.com')
      .single()

    if (error || !admin) {
      console.log('⚠️  Admin user not found - migration may not have completed')
    } else {
      console.log('✅ Migration verified!')
      console.log(`   Admin user: ${admin.email}`)
      console.log(`   Role: ${admin.role}`)
      console.log(`   Enabled: ${admin.enabled}\n`)
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




