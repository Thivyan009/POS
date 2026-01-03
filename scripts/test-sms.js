/**
 * Test script for SMS functionality
 * This script tests the SMS API endpoint with sample data
 * 
 * Usage:
 *   node scripts/test-sms.js
 * 
 * Make sure to set TEXT_LK_API_TOKEN and TEXT_LK_SENDER_ID in .env.local
 */

require('dotenv').config({ path: '.env.local' })

// Node.js 18+ has built-in fetch, no need to require it

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

async function testSMS() {
  console.log('🧪 Testing SMS API Endpoint...\n')
  
  // Check environment variables
  const apiToken = process.env.TEXT_LK_API_TOKEN
  const senderId = process.env.TEXT_LK_SENDER_ID
  
  console.log('📋 Configuration:')
  console.log(`   API URL: ${API_URL}`)
  console.log(`   TEXT_LK_API_TOKEN: ${apiToken ? '✅ Set' : '❌ Not set'}`)
  console.log(`   TEXT_LK_SENDER_ID: ${senderId ? '✅ Set' : '❌ Not set'}`)
  console.log('')
  
  if (!apiToken || !senderId) {
    console.log('⚠️  Warning: TEXT_LK_API_TOKEN or TEXT_LK_SENDER_ID not set')
    console.log('   The API will return a configuration error, but we can test the endpoint structure\n')
  }
  
  // Test data - you need to provide actual customer IDs from your database
  const testCustomerIds = process.env.TEST_CUSTOMER_IDS 
    ? process.env.TEST_CUSTOMER_IDS.split(',')
    : []
  
  if (testCustomerIds.length === 0) {
    console.log('ℹ️  To test with real customer IDs, set TEST_CUSTOMER_IDS in .env.local')
    console.log('   Example: TEST_CUSTOMER_IDS=uuid1,uuid2\n')
    console.log('📝 Testing endpoint validation only (will fail without customer IDs)...\n')
  }
  
  try {
    console.log('🚀 Sending request to /api/customers/send-birthday-sms...\n')
    
    const response = await fetch(`${API_URL}/api/customers/send-birthday-sms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerIds: testCustomerIds.length > 0 
          ? testCustomerIds 
          : ['00000000-0000-0000-0000-000000000000'] // Invalid UUID for testing
      }),
    })
    
    const data = await response.json()
    
    console.log(`📊 Response Status: ${response.status}`)
    console.log(`📦 Response Data:`, JSON.stringify(data, null, 2))
    console.log('')
    
    if (response.ok && data.success) {
      console.log('✅ SMS API endpoint is working!')
      console.log(`   Sent: ${data.sent}`)
      console.log(`   Failed: ${data.failed}`)
      if (data.errors && data.errors.length > 0) {
        console.log(`   Errors:`, data.errors)
      }
    } else {
      console.log('❌ API returned an error:')
      console.log(`   Error: ${data.error || 'Unknown error'}`)
      console.log(`   Details: ${data.details || 'No details'}`)
      
      if (data.error && data.error.includes('not configured')) {
        console.log('\n💡 Solution: Set TEXT_LK_API_TOKEN and TEXT_LK_SENDER_ID in .env.local')
      } else if (data.error && data.error.includes('No customers found')) {
        console.log('\n💡 Solution: Use valid customer IDs from your database')
        console.log('   You can find customer IDs by:')
        console.log('   1. Going to the admin panel → Customer Management')
        console.log('   2. Or querying the customers table in Supabase')
      }
    }
  } catch (error) {
    console.error('❌ Error testing SMS API:', error.message)
    console.log('\n💡 Make sure:')
    console.log('   1. The development server is running (npm run dev)')
    console.log('   2. The API_URL is correct')
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('📖 How to test with real data:')
  console.log('   1. Start the dev server: npm run dev')
  console.log('   2. Log into the admin panel')
  console.log('   3. Go to the dashboard (should show "Today\'s Birthdays")')
  console.log('   4. Click the "Send SMS" button')
  console.log('   5. Or use this script with real customer IDs')
  console.log('='.repeat(50))
}

// Run the test
testSMS().catch(console.error)

