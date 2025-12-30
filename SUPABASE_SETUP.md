# Supabase Setup Guide

This guide will help you set up Supabase for your POS system.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in your project details:
   - **Name**: Your project name (e.g., "POS System")
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the region closest to you
5. Click "Create new project" and wait for it to be set up (takes 1-2 minutes)

## Step 2: Get Your API Credentials

1. Once your project is ready, go to **Settings** → **API**
2. You'll find two important values:
   - **Project URL**: Your Supabase project URL (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key**: Your public API key

## Step 3: Set Up Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Replace the placeholder values with your actual Supabase credentials

## Step 4: Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Open the file `supabase/schema.sql` from this project
4. Copy the entire contents of the SQL file
5. Paste it into the SQL Editor
6. Click "Run" to execute the schema

This will create:
- All necessary tables (menu_categories, menu_items, bills, bill_items, users, discount_codes)
- Indexes for better performance
- Row Level Security (RLS) policies
- Sample data (optional - you can remove the INSERT statements at the end if you don't want sample data)

## Step 5: Verify the Setup

1. Go to **Table Editor** in your Supabase dashboard
2. You should see the following tables:
   - `menu_categories`
   - `menu_items`
   - `bills`
   - `bill_items`
   - `users`
   - `discount_codes`

3. Check that sample data was inserted (if you kept the INSERT statements)

## Step 6: Test Your Application

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to your application
3. Try accessing the admin dashboard - you should see the menu categories and items loaded from Supabase

## Important Notes

### Row Level Security (RLS)

The schema includes RLS policies that allow:
- **Public read access** to menu items and categories (for the biller interface)
- **Authenticated write access** to all tables

For production, you may want to customize these policies based on your security requirements. Currently, the app uses the anon key, which works with the RLS policies we've set up.

### Authentication

The current setup uses Supabase's anon key for all operations. For production, you should:
1. Implement proper authentication using Supabase Auth
2. Use user-specific RLS policies
3. Store user sessions securely

### Sample Data

The schema includes sample data (categories and menu items). You can:
- Keep it for testing
- Remove the INSERT statements if you want to start fresh
- Modify it to match your actual menu

## Troubleshooting

### "Invalid API key" error
- Make sure your `.env.local` file has the correct credentials
- Restart your development server after changing environment variables

### "Table does not exist" error
- Make sure you ran the SQL schema in the Supabase SQL Editor
- Check that all tables were created in the Table Editor

### "Permission denied" error
- Check your RLS policies in Supabase
- Make sure you're using the correct API key (anon key for public access)

### Data not loading
- Check the browser console for errors
- Verify your Supabase project is active
- Check the Network tab to see if API calls are being made

## Next Steps

1. **Set up authentication**: Implement Supabase Auth for user login
2. **Customize RLS policies**: Adjust security policies based on your needs
3. **Add more features**: Extend the schema as needed for your business requirements

For more information, visit the [Supabase Documentation](https://supabase.com/docs).




