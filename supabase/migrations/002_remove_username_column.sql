-- Migration: Remove username column from users table and clear all users
-- Run this ENTIRE script in one go in Supabase SQL Editor

-- Step 1: Add email column if it doesn't exist (MUST BE FIRST)
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Step 2: Set temporary emails for any existing users (will be deleted anyway)
UPDATE users 
SET email = 'temp_' || id::text || '@temp.com' 
WHERE email IS NULL;

-- Step 3: Make email NOT NULL and UNIQUE (only if column was just added)
DO $$
BEGIN
    -- Check if constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'users_email_unique'
    ) THEN
        -- Add NOT NULL constraint
        ALTER TABLE users ALTER COLUMN email SET NOT NULL;
        
        -- Add UNIQUE constraint
        ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
    END IF;
END $$;

-- Step 4: Create index on email if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Step 5: Delete all existing users
DELETE FROM users;

-- Step 6: Remove username column and its constraints
DO $$
BEGIN
    -- Drop constraints first
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_username_key;
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_username_unique;
    
    -- Drop index
    DROP INDEX IF EXISTS idx_users_username;
    
    -- Drop column
    ALTER TABLE users DROP COLUMN IF EXISTS username;
END $$;

-- Step 7: Update RLS policy
DROP POLICY IF EXISTS "Allow public read access to users for login" ON users;
CREATE POLICY "Allow public read access to users for login"
  ON users FOR SELECT
  USING (true);

-- Step 8: Insert default admin user (email only, no username)
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

