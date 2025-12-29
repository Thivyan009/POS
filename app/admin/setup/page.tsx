"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface MigrationResult {
  success: boolean
  results: string[]
  errors: string[]
  message: string
}

export default function DatabaseSetupPage() {
  const [isChecking, setIsChecking] = useState(false)
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null)
  const { toast } = useToast()

  const checkDatabase = async () => {
    setIsChecking(true)
    setMigrationResult(null)

    try {
      const response = await fetch("/api/db/migrate", {
        method: "POST",
      })

      const result = await response.json()
      setMigrationResult(result)

      if (result.success) {
        toast({
          title: "Success",
          description: "Database is up to date!",
        })
      } else {
        toast({
          title: "Migration Needed",
          description: "Some database changes are required.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Migration check error:", error)
      toast({
        title: "Error",
        description: "Failed to check database. Please verify your connection.",
        variant: "destructive",
      })
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkDatabase()
  }, [])

  const copyMigrationSQL = () => {
    const migrationSQL = `-- Run this SQL in your Supabase SQL Editor
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
    enabled = EXCLUDED.enabled;`

    navigator.clipboard.writeText(migrationSQL)
    toast({
      title: "Copied!",
      description: "Migration SQL copied to clipboard. Paste it in Supabase SQL Editor.",
    })
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Database Setup & Migration</h1>

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Database Status</h2>
          <Button onClick={checkDatabase} disabled={isChecking}>
            {isChecking ? "Checking..." : "Check Database"}
          </Button>
        </div>

        {migrationResult && (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-lg ${
                migrationResult.success
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
              }`}
            >
              <p className="font-medium">{migrationResult.message}</p>
            </div>

            {migrationResult.results.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Check Results:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {migrationResult.results.map((result, idx) => (
                    <li key={idx} className="text-sm">
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {migrationResult.errors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-red-600 dark:text-red-400">
                  Issues Found:
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {migrationResult.errors.map((error, idx) => (
                    <li key={idx} className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Migration Instructions</h2>
        <div className="space-y-4">
          <div>
            <p className="mb-2">
              If the database check shows missing columns, follow these steps:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Open your Supabase dashboard</li>
              <li>Go to SQL Editor</li>
              <li>Click "New query"</li>
              <li>Copy and paste the migration SQL below</li>
              <li>Click "Run" to execute</li>
            </ol>
          </div>

          <div className="flex gap-2">
            <Button onClick={copyMigrationSQL} variant="outline">
              Copy Migration SQL
            </Button>
            <Button
              onClick={() => {
                window.open("https://supabase.com/dashboard", "_blank")
              }}
              variant="outline"
            >
              Open Supabase Dashboard
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-mono whitespace-pre-wrap">
              {`-- Migration SQL (also available in supabase/migrations/002_remove_username_column.sql)

-- Step 1: Ensure email column exists FIRST
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

-- Step 3: Remove username column
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
    enabled = EXCLUDED.enabled;`}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

