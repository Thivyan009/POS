# Database Setup & Migration Guide

This guide will help you set up and migrate your database automatically.

## Quick Setup

### Option 1: Run Full Schema (Recommended for New Databases)

1. Open your Supabase dashboard: https://supabase.com/dashboard
2. Go to **SQL Editor**
3. Click **New query**
4. Open `supabase/schema.sql` from this project
5. Copy the entire contents and paste into SQL Editor
6. Click **Run** to execute

This will create all tables, indexes, triggers, and insert the default admin user.

### Option 2: Run Migration Only (For Existing Databases)

If you already have the database set up but need to add the email column:

1. Open your Supabase dashboard: https://supabase.com/dashboard
2. Go to **SQL Editor**
3. Click **New query**
4. Open `supabase/migrations/001_add_email_column.sql` from this project
5. Copy the entire contents and paste into SQL Editor
6. Click **Run** to execute

## Check Database Status

### Via Command Line

```bash
npm run db:check
```

This will:
- ✅ Test database connection
- ✅ Check if all tables exist
- ✅ Verify users table structure
- ✅ Check for default admin user

### Via Web Interface

1. Start your development server: `npm run dev`
2. Navigate to: `http://localhost:3000/admin/setup`
3. Click "Check Database" to see current status
4. Follow instructions if migrations are needed

## Default Admin Credentials

After running the migration, you can login with:

- **Email**: `paruthimunaitech@gmail.com`
- **Password**: `Paruthi10000`

## Database Structure

The database includes the following tables:

- `menu_categories` - Menu categories
- `menu_items` - Individual menu items
- `users` - User accounts (admin/biller)
- `bills` - Sales transactions
- `bill_items` - Items in each bill
- `discount_codes` - Discount/promotion codes

## Troubleshooting

### "Email column missing" error

Run the migration SQL:
```sql
-- See supabase/migrations/001_add_email_column.sql
```

### "Table does not exist" error

Run the full schema:
```sql
-- See supabase/schema.sql
```

### Connection issues

1. Verify your `.env.local` file has:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Restart your development server after updating `.env.local`

3. Check Supabase project is active in dashboard

## Automatic Column Detection

The system automatically detects missing columns when you:
- Visit `/admin/setup` page
- Run `npm run db:check`
- Access the login page (will show connection status)

## Migration Files

- `supabase/schema.sql` - Full database schema (use for new databases)
- `supabase/migrations/001_add_email_column.sql` - Adds email column to users table

All migrations are idempotent and can be run multiple times safely.






