-- Fix RLS policies for customers table to allow public access
-- This fixes the "Permission denied" error when creating customers

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated access to customers" ON customers;
DROP POLICY IF EXISTS "Allow public read access to customers" ON customers;
DROP POLICY IF EXISTS "Allow public insert access to customers" ON customers;
DROP POLICY IF EXISTS "Allow public update access to customers" ON customers;
DROP POLICY IF EXISTS "Allow public delete access to customers" ON customers;

-- Create new policies that allow public access
-- Allow public read access (for searching customers)
CREATE POLICY "Allow public read access to customers"
  ON customers FOR SELECT
  USING (true);

-- Allow public insert access (for creating new customers)
CREATE POLICY "Allow public insert access to customers"
  ON customers FOR INSERT
  WITH CHECK (true);

-- Allow public update access (for updating customer details)
CREATE POLICY "Allow public update access to customers"
  ON customers FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow public delete access (for admin operations)
CREATE POLICY "Allow public delete access to customers"
  ON customers FOR DELETE
  USING (true);

