# Quick Start: Testing SMS Functionality

## 🚀 Quick Test Steps

### Step 1: Set Up Text.lk Credentials

1. Register at [Text.lk](https://app.text.lk/register/)
2. Get your API Token from the Developers section
3. Add to `.env.local`:
   ```env
   TEXT_LK_API_TOKEN=your_token_here
   TEXT_LK_SENDER_ID=TextLKDemo
   ```
   Note: `TextLKDemo` works immediately without approval

### Step 2: Start the Server

```bash
npm run dev
```

### Step 3: Test via UI (Easiest Method)

1. Go to `http://localhost:3000/login`
2. Login to admin panel
3. Look for "Today's Birthdays" card on dashboard
4. Click "Send SMS" button
5. Check toast notification for success/error

### Step 4: Create Test Customer (if needed)

To test with a customer that has a birthday today:

1. Go to Admin → Customer Management
2. Click "Add Customer"
3. Enter:
   - Name: Test Customer
   - Phone: Your phone number (e.g., `0712345678`)
   - Date of Birth: **Today's date**
4. Save
5. Go back to dashboard and click "Send SMS"

## 🧪 Alternative: Test via API

### Using curl:

```bash
# Replace with actual customer ID from your database
curl -X POST http://localhost:3000/api/customers/send-birthday-sms \
  -H "Content-Type: application/json" \
  -d '{"customerIds": ["customer-uuid-here"]}'
```

### Using the test script:

```bash
node scripts/test-sms.js
```

## ✅ Expected Results

**Success:**
- Toast shows "SMS sent successfully"
- Server console shows: `[SMS] Sent to 94712345678 (Customer Name): ...`
- You receive SMS on your phone

**Configuration Error:**
- Error: "SMS service not configured"
- **Fix:** Add `TEXT_LK_API_TOKEN` and `TEXT_LK_SENDER_ID` to `.env.local` and restart server

**No Customers:**
- Error: "No customers found"  
- **Fix:** Create a customer with today's birthday or use valid customer IDs

## 🔍 Troubleshooting

- **Server not responding?** Make sure `npm run dev` is running
- **Environment variables not working?** Restart the dev server after adding to `.env.local`
- **SMS not received?** Check Text.lk dashboard for delivery status and account credits

For detailed testing instructions, see [TEST_SMS.md](./TEST_SMS.md)


