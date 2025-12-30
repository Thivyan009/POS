-- Create customers table
-- This migration creates the customers table if it doesn't exist
-- If the table exists, it ensures the date_of_birth column is properly configured

-- Create customers table if it doesn't exist
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure date_of_birth column exists and is of type DATE
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'customers' AND column_name = 'date_of_birth'
  ) THEN
    ALTER TABLE customers ADD COLUMN date_of_birth DATE;
  ELSE
    -- Ensure the column is of correct type
    ALTER TABLE customers ALTER COLUMN date_of_birth TYPE DATE USING date_of_birth::DATE;
  END IF;
END $$;

-- Create index for phone lookup
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- Create index for birthday queries
CREATE INDEX IF NOT EXISTS idx_customers_date_of_birth ON customers(date_of_birth);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow authenticated access to customers" ON customers;
DROP POLICY IF EXISTS "Allow public read access to customers" ON customers;
DROP POLICY IF EXISTS "Allow public insert access to customers" ON customers;
DROP POLICY IF EXISTS "Allow public update access to customers" ON customers;
DROP POLICY IF EXISTS "Allow public delete access to customers" ON customers;

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

-- Add customer_id to bills table for linking bills to customers
ALTER TABLE bills ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES customers(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_bills_customer_id ON bills(customer_id);
