-- FIXED Migration: Remove username column from users table
-- Copy and paste this ENTIRE file into Supabase SQL Editor and run it

-- Step 1: Add email column if it doesn't exist (MUST BE FIRST)
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Step 2: Set temporary emails for any existing users
UPDATE users 
SET email = 'temp_' || id::text || '@temp.com' 
WHERE email IS NULL;

-- Step 3: Make email NOT NULL and UNIQUE
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'users_email_unique'
    ) THEN
        ALTER TABLE users ALTER COLUMN email SET NOT NULL;
        ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
    END IF;
END $$;

-- Step 4: Create index on email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Step 5: Delete all existing users
DELETE FROM users;

-- Step 6: Remove username column
DO $$
BEGIN
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_username_key;
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_username_unique;
    DROP INDEX IF EXISTS idx_users_username;
    ALTER TABLE users DROP COLUMN IF EXISTS username;
END $$;

-- Step 7: Update RLS policy
DROP POLICY IF EXISTS "Allow public read access to users for login" ON users;
CREATE POLICY "Allow public read access to users for login"
  ON users FOR SELECT
  USING (true);

-- Step 8: Insert default admin user
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

