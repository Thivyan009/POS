-- Test script to verify date_of_birth column works correctly
-- Run this in Supabase SQL Editor to test if the column accepts dates

-- Test 1: Insert a customer with date_of_birth
INSERT INTO customers (name, phone, date_of_birth)
VALUES ('Test Customer', '+94123456789', '1990-12-25')
RETURNING *;

-- Test 2: Check if the date was stored correctly
SELECT id, name, phone, date_of_birth, 
       date_of_birth::text as date_as_text,
       pg_typeof(date_of_birth) as date_type
FROM customers 
WHERE phone = '+94123456789';

-- Test 3: Update the date
UPDATE customers 
SET date_of_birth = '1985-06-15'
WHERE phone = '+94123456789'
RETURNING *;

-- Test 4: Verify the column structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'customers' 
  AND column_name = 'date_of_birth';

-- Clean up test data (optional)
-- DELETE FROM customers WHERE phone = '+94123456789';

