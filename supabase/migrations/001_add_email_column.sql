-- Migration: Add email column to users table if it doesn't exist
-- This migration is idempotent and can be run multiple times safely

-- Check if email column exists, if not add it
DO $$
BEGIN
    -- Check if the email column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'email'
    ) THEN
        -- Add email column
        ALTER TABLE users ADD COLUMN email VARCHAR(255);
        
        -- Make email unique and not null (if table is empty or we can set defaults)
        -- First, set a default for existing rows if any
        UPDATE users 
        SET email = username || '@example.com' 
        WHERE email IS NULL;
        
        -- Now add constraints
        ALTER TABLE users 
        ALTER COLUMN email SET NOT NULL,
        ADD CONSTRAINT users_email_unique UNIQUE (email);
        
        -- Create index on email
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        
        RAISE NOTICE 'Email column added to users table';
    ELSE
        RAISE NOTICE 'Email column already exists in users table';
    END IF;
END $$;

-- Update RLS policy if needed (idempotent)
DROP POLICY IF EXISTS "Allow public read access to users for login" ON users;
CREATE POLICY "Allow public read access to users for login"
  ON users FOR SELECT
  USING (true);

-- Ensure default admin user exists with email
INSERT INTO users (id, email, username, password_hash, role, enabled) 
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'paruthimunaitech@gmail.com',
  'admin',
  '$2b$10$hl9JnxG307QqlN3zGG2NfuC21DuAhKFhnZilhagKhyKTMaqpNeVXO',
  'admin',
  true
)
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  enabled = EXCLUDED.enabled;

