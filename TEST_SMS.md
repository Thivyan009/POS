# Testing SMS Functionality

This guide explains how to test the birthday SMS feature.

## Prerequisites

1. **Text.lk Account Setup:**
   - Register at [Text.lk](https://app.text.lk/register/)
   - Get your API Token from the Developers section
   - Request a Sender ID (approval takes a few hours)
   - For testing, you can use the demo sender ID: `TextLKDemo`

2. **Environment Variables:**
   Add these to your `.env.local` file:
   ```env
   TEXT_LK_API_TOKEN=your_api_token_here
   TEXT_LK_SENDER_ID=TextLKDemo
   ```

3. **Test Customer Data:**
   - You need at least one customer with a valid phone number in your database
   - The customer should have a `date_of_birth` set to today's date (for birthday testing)

## Testing Methods

### Method 1: Test via Admin Panel UI (Recommended)

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Log into the admin panel:**
   - Go to `http://localhost:3000/login`
   - Login with your admin credentials

3. **Navigate to Dashboard:**
   - The dashboard should show the "Today's Birthdays" card

4. **Test the SMS button:**
   - If there are customers with birthdays today, you'll see them listed
   - Click the "Send SMS" button
   - Check the toast notification for success/error messages
   - Check the server console for detailed logs

### Method 2: Test via API Endpoint (Using curl)

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Get a customer ID:**
   - Go to the admin panel → Customer Management
   - Find a customer with a valid phone number
   - Copy their ID (UUID)

3. **Test the API:**
   ```bash
   curl -X POST http://localhost:3000/api/customers/send-birthday-sms \
     -H "Content-Type: application/json" \
     -d '{"customerIds": ["your-customer-uuid-here"]}'
   ```

   Replace `your-customer-uuid-here` with an actual customer ID.

### Method 3: Test via Script

1. **Install dependencies (if needed):**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Get customer IDs:**
   - Optionally set `TEST_CUSTOMER_IDS` in `.env.local`:
     ```env
     TEST_CUSTOMER_IDS=uuid1,uuid2
     ```

4. **Run the test script:**
   ```bash
   node scripts/test-sms.js
   ```

   **Note:** If you're using Node.js < 18, you may need to install node-fetch:
   ```bash
   npm install node-fetch@2
   ```

## Expected Results

### Success Response:
```json
{
  "success": true,
  "sent": 1,
  "failed": 0,
  "results": [
    {
      "customerId": "uuid",
      "name": "Customer Name",
      "phone": "94712345678",
      "status": "sent",
      "message": "Happy birthday Customer Name, enjoy 10% off at our restaurant"
    }
  ]
}
```

### Error Responses:

**Configuration Error:**
```json
{
  "error": "SMS service not configured",
  "details": "TEXT_LK_API_TOKEN and TEXT_LK_SENDER_ID must be set in environment variables"
}
```
**Solution:** Add the environment variables to `.env.local` and restart the server.

**No Customers Found:**
```json
{
  "error": "No customers found"
}
```
**Solution:** Use valid customer IDs from your database.

**SMS Sending Error:**
```json
{
  "success": true,
  "sent": 0,
  "failed": 1,
  "errors": [
    {
      "customerId": "uuid",
      "name": "Customer Name",
      "phone": "0712345678",
      "error": "Error message from Text.lk"
    }
  ]
}
```

## Creating a Test Customer

To create a test customer with today's birthday:

1. Go to Admin Panel → Customer Management
2. Click "Add Customer"
3. Fill in:
   - Name: Test Customer
   - Phone: Your test phone number (e.g., `0712345678`)
   - Date of Birth: Set to today's date
4. Save the customer
5. Now you can test the SMS functionality using any method above

## Debugging

### Check Server Logs
When you send SMS, check the server console for logs like:
```
[SMS] Sent to 94712345678 (Customer Name): { result object }
```

### Common Issues

1. **"SMS service not configured"**
   - Check `.env.local` has `TEXT_LK_API_TOKEN` and `TEXT_LK_SENDER_ID`
   - Restart the development server after adding variables

2. **"No customers found"**
   - Verify customer IDs are correct UUIDs
   - Check customers exist in the database

3. **SMS not delivered**
   - Check Text.lk dashboard for delivery status
   - Verify phone number format (should be `94712345678`)
   - Check Text.lk account has sufficient credits
   - Verify Sender ID is approved (if using custom sender ID)

4. **API Errors from Text.lk**
   - Check API token is correct
   - Verify Sender ID is valid and approved
   - Check Text.lk documentation for error codes

## Testing with Demo Credentials

For initial testing, Text.lk provides:
- **Demo Sender ID:** `TextLKDemo` (works immediately, no approval needed)
- You still need a valid API token from your Text.lk account

## Next Steps

Once testing is successful:
1. Request a custom Sender ID that reflects your restaurant name
2. Update `TEXT_LK_SENDER_ID` in `.env.local` with your approved sender ID
3. Monitor SMS delivery through Text.lk dashboard
4. Consider adding SMS delivery logging to your database for tracking


