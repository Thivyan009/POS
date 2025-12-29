# Quick Fix: Database Migration - Remove Username, Use Email Only

## The Problem
The database needs to be updated to:
1. Remove the `username` column (we only use email now)
2. Clear all existing users
3. Add the default admin user with email only

## The Solution (2 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New query**

### Step 2: Run Migration SQL
Copy and paste this SQL:

```sql
-- Migration: Remove username column and use email only

-- Step 1: Ensure email column exists FIRST (before any operations)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'email'
    ) THEN
        ALTER TABLE users ADD COLUMN email VARCHAR(255);
        UPDATE users SET email = 'temp_' || id::text || '@temp.com' WHERE email IS NULL;
        ALTER TABLE users 
        ALTER COLUMN email SET NOT NULL,
        ADD CONSTRAINT users_email_unique UNIQUE (email);
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    END IF;
END $$;

-- Step 2: Delete all existing users
DELETE FROM users;

-- Step 3: Remove username column if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'username'
    ) THEN
        ALTER TABLE users DROP CONSTRAINT IF EXISTS users_username_key;
        ALTER TABLE users DROP CONSTRAINT IF EXISTS users_username_unique;
        DROP INDEX IF EXISTS idx_users_username;
        ALTER TABLE users DROP COLUMN username;
    END IF;
END $$;

-- Step 4: Update RLS policy
DROP POLICY IF EXISTS "Allow public read access to users for login" ON users;
CREATE POLICY "Allow public read access to users for login"
  ON users FOR SELECT USING (true);

-- Step 5: Insert default admin user (email only)
INSERT INTO users (id, email, password_hash, role, enabled) 
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'paruthimunaitech@gmail.com',
  '$2b$10$hl9JnxG307QqlN3zGG2NfuC21DuAhKFhnZilhagKhyKTMaqpNeVXO',
  'admin',
  true
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    password_hash = EXCLUDED.password_hash,
    enabled = EXCLUDED.enabled;
```

### Step 3: Click "Run"
Click the **Run** button (or press Cmd/Ctrl + Enter)

### Step 4: Verify
Run this command in your terminal:
```bash
npm run db:check
```

You should see:
- ✅ Email column exists
- ✅ Default admin user exists

### Step 5: Try Login Again
Go back to http://localhost:3000/login and login with:
- **Email**: `paruthimunaitech@gmail.com`
- **Password**: `Paruthi10000`

## Alternative: Use Setup Page
1. Visit: http://localhost:3000/admin/setup
2. Click "Copy Migration SQL"
3. Paste in Supabase SQL Editor
4. Run it

## That's It! 🎉
The migration is idempotent (safe to run multiple times), so don't worry if you run it again.

