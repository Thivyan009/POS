# Run Database Migration

## Quick Steps

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click **SQL Editor** in the left sidebar
   - Click **New query**

3. **Copy & Paste Migration SQL**
   - Copy the SQL from the box below
   - Paste into the SQL Editor

4. **Run the Migration**
   - Click **Run** button (or press Cmd/Ctrl + Enter)
   - Wait for "Success" message

5. **Verify Migration**
   ```bash
   npm run db:check
   ```

## Migration SQL

Copy this entire block:

```sql
-- Migration: Remove username column from users table and clear all users
-- Step 1: Ensure email column exists FIRST (before any operations)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'email'
    ) THEN
        ALTER TABLE users ADD COLUMN email VARCHAR(255);
        UPDATE users SET email = 'temp_' || id::text || '@temp.com' WHERE email IS NULL;
        ALTER TABLE users 
        ALTER COLUMN email SET NOT NULL,
        ADD CONSTRAINT users_email_unique UNIQUE (email);
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        RAISE NOTICE 'Email column added to users table';
    ELSE
        RAISE NOTICE 'Email column already exists';
    END IF;
END $$;

-- Step 2: Delete all existing users
DELETE FROM users;

-- Step 3: Remove username column if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'username'
    ) THEN
        ALTER TABLE users DROP CONSTRAINT IF EXISTS users_username_key;
        ALTER TABLE users DROP CONSTRAINT IF EXISTS users_username_unique;
        DROP INDEX IF EXISTS idx_users_username;
        ALTER TABLE users DROP COLUMN username;
        RAISE NOTICE 'Username column removed from users table';
    ELSE
        RAISE NOTICE 'Username column does not exist';
    END IF;
END $$;

-- Step 4: Update RLS policy
DROP POLICY IF EXISTS "Allow public read access to users for login" ON users;
CREATE POLICY "Allow public read access to users for login"
  ON users FOR SELECT
  USING (true);

-- Step 5: Insert default admin user (email only, no username)
INSERT INTO users (id, email, password_hash, role, enabled) 
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'paruthimunaitech@gmail.com',
  '$2b$10$hl9JnxG307QqlN3zGG2NfuC21DuAhKFhnZilhagKhyKTMaqpNeVXO',
  'admin',
  true
)
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  enabled = EXCLUDED.enabled;
```

## What This Migration Does

✅ Creates email column (if missing)  
✅ Deletes all existing users  
✅ Removes username column  
✅ Updates security policies  
✅ Creates default admin user  

## After Migration

Test login with:
- **Email**: `paruthimunaitech@gmail.com`
- **Password**: `Paruthi10000`

## Troubleshooting

If you get an error:
1. Make sure you're in the correct Supabase project
2. Check that the `users` table exists
3. Try running each step separately if needed
4. Check the error message for specific issues

## Verify Success

Run this command to verify:
```bash
npm run db:check
```

You should see:
- ✅ Email column exists
- ✅ Default admin user exists





