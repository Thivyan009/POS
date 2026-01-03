import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { sendSMS } from "textlk-node"

/**
 * Send birthday SMS to customers
 * POST /api/customers/send-birthday-sms
 * Body: { customerIds: string[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerIds } = body

    // Validation
    if (!customerIds || !Array.isArray(customerIds) || customerIds.length === 0) {
      return NextResponse.json(
        { error: "customerIds array is required" },
        { status: 400 }
      )
    }

    // Create server-side Supabase client
    const supabase = createServerClient()

    // Fetch customer details
    const { data: customers, error: fetchError } = await supabase
      .from("customers")
      .select("id, name, phone")
      .in("id", customerIds)

    if (fetchError) {
      console.error("Error fetching customers:", fetchError)
      return NextResponse.json(
        { error: "Failed to fetch customers", details: fetchError.message },
        { status: 500 }
      )
    }

    if (!customers || customers.length === 0) {
      return NextResponse.json(
        { error: "No customers found" },
        { status: 404 }
      )
    }

    // Send SMS to each customer
    const results = []
    const errors = []

    // Get Text.lk credentials from environment variables
    const apiToken = process.env.TEXT_LK_API_TOKEN
    const senderId = process.env.TEXT_LK_SENDER_ID

    if (!apiToken || !senderId) {
      return NextResponse.json(
        { 
          error: "SMS service not configured",
          details: "TEXT_LK_API_TOKEN and TEXT_LK_SENDER_ID must be set in environment variables"
        },
        { status: 500 }
      )
    }

    for (const customer of customers) {
      try {
        // Format phone number for Text.lk (format: 94712345678, without + sign)
        let phoneNumber = customer.phone.trim().replace(/\s+/g, "")
        
        // Remove + if present
        if (phoneNumber.startsWith("+")) {
          phoneNumber = phoneNumber.substring(1)
        }
        
        // Convert to Text.lk format (947...)
        if (phoneNumber.startsWith("94")) {
          // Already in correct format (947...)
        } else if (phoneNumber.startsWith("0")) {
          // Local format (07...), convert to 947...
          phoneNumber = "94" + phoneNumber.substring(1)
        } else {
          // Assume it's a local number without leading 0, add 94
          phoneNumber = "94" + phoneNumber
        }

        // Personalized SMS message template for Pauthi Munai Restaurant
        const message = `🎉 Happy birthday ${customer.name}, enjoy 10% off at Paruthi Munai Restaurant! 🎂🍽️`

        // Send SMS using Text.lk
        const result = await sendSMS({
          phoneNumber: phoneNumber,
          message: message,
          apiToken: apiToken,
          senderId: senderId
        })

        console.log(`[SMS] Sent to ${phoneNumber} (${customer.name}):`, result)
        
        results.push({
          customerId: customer.id,
          name: customer.name,
          phone: phoneNumber,
          status: "sent",
          message: message
        })
      } catch (error: any) {
        console.error(`Error sending SMS to ${customer.name} (${customer.phone}):`, error)
        
        // Extract error message from Text.lk API error
        let errorMessage = error.message || "Failed to send SMS"
        
        // Handle specific Text.lk error cases
        if (errorMessage.includes("exceeded your sending limit")) {
          errorMessage = "Sending limit exceeded - Please check your Text.lk account credits"
        } else if (errorMessage.includes("404")) {
          // Try to extract the actual error message from the response
          try {
            const errorMatch = errorMessage.match(/\{"status":"error","message":"([^"]+)"\}/)
            if (errorMatch && errorMatch[1]) {
              errorMessage = errorMatch[1]
            }
          } catch (e) {
            // Keep original error message if parsing fails
          }
        }
        
        errors.push({
          customerId: customer.id,
          name: customer.name,
          phone: customer.phone,
          error: errorMessage
        })
      }
    }

    return NextResponse.json({
      success: true,
      sent: results.length,
      failed: errors.length,
      results: results,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error: any) {
    console.error("Send birthday SMS error:", error)
    
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

