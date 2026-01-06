-- Fix RLS policies for bills table
-- Allow public access for bill creation (similar to customers table)

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow authenticated access to bills" ON bills;

-- Allow public read access (for viewing bills)
CREATE POLICY "Allow public read access to bills"
  ON bills FOR SELECT
  USING (true);

-- Allow public insert access (for creating bills)
CREATE POLICY "Allow public insert access to bills"
  ON bills FOR INSERT
  WITH CHECK (true);

-- Allow public update access (for updating bills)
CREATE POLICY "Allow public update access to bills"
  ON bills FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow public delete access (for admin operations)
CREATE POLICY "Allow public delete access to bills"
  ON bills FOR DELETE
  USING (true);

-- Also fix bill_items RLS policies
DROP POLICY IF EXISTS "Allow authenticated access to bill_items" ON bill_items;

-- Allow public read access to bill_items
CREATE POLICY "Allow public read access to bill_items"
  ON bill_items FOR SELECT
  USING (true);

-- Allow public insert access to bill_items
CREATE POLICY "Allow public insert access to bill_items"
  ON bill_items FOR INSERT
  WITH CHECK (true);

-- Allow public update access to bill_items
CREATE POLICY "Allow public update access to bill_items"
  ON bill_items FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow public delete access to bill_items
CREATE POLICY "Allow public delete access to bill_items"
  ON bill_items FOR DELETE
  USING (true);




