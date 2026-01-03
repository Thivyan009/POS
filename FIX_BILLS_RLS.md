# Fix Bills RLS Permission Error

## Problem
You're getting this error when trying to create bills:
```
Permission denied. Please check Row Level Security policies for the bills table.
```

## Solution

Run the migration SQL to fix the RLS policies for the `bills` and `bill_items` tables.

### Steps:

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click **SQL Editor** in the left sidebar
   - Click **New query**

3. **Copy & Paste Migration SQL**
   - Open the file: `supabase/migrations/006_fix_bills_rls_policies.sql`
   - Copy the entire contents
   - Paste into the SQL Editor

4. **Run the Migration**
   - Click **Run** button (or press Cmd/Ctrl + Enter)
   - Wait for "Success" message

5. **Test**
   - Try creating a bill again in your POS system
   - The error should be resolved

## What This Migration Does

- Drops the old authenticated-only policy for bills
- Creates new public access policies for bills (read, insert, update, delete)
- Does the same for bill_items table
- Allows the app to create bills using the anon key (no authentication required)

This matches the pattern used for the customers table.

