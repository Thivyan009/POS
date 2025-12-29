-- POS System Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Menu Categories Table
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  tax BOOLEAN DEFAULT true,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table (for authentication and authorization)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'biller')),
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bills Table
CREATE TABLE IF NOT EXISTS bills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  tax DECIMAL(10, 2) NOT NULL CHECK (tax >= 0),
  discount DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'cancelled')),
  whatsapp_number VARCHAR(20),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bill Items Table (junction table for bills and menu items)
CREATE TABLE IF NOT EXISTS bill_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  item_name VARCHAR(255) NOT NULL, -- Store name at time of sale
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0), -- Store price at time of sale
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  tax BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discount Codes Table
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_percent DECIMAL(5, 2) NOT NULL CHECK (discount_percent >= 0 AND discount_percent <= 100),
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(available);
CREATE INDEX IF NOT EXISTS idx_bills_created_at ON bills(created_at);
CREATE INDEX IF NOT EXISTS idx_bills_created_by ON bills(created_by);
CREATE INDEX IF NOT EXISTS idx_bill_items_bill_id ON bill_items(bill_id);
CREATE INDEX IF NOT EXISTS idx_bill_items_menu_item_id ON bill_items(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON discount_codes(active);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_enabled ON users(enabled);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_menu_categories_updated_at
  BEFORE UPDATE ON menu_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discount_codes_updated_at
  BEFORE UPDATE ON discount_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow all operations for authenticated users
-- In production, you should customize these policies based on your security requirements

-- Menu Categories: Allow read for all, write for authenticated
CREATE POLICY "Allow public read access to menu_categories"
  ON menu_categories FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated write access to menu_categories"
  ON menu_categories FOR ALL
  USING (auth.role() = 'authenticated');

-- Menu Items: Allow read for all, write for authenticated
CREATE POLICY "Allow public read access to menu_items"
  ON menu_items FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated write access to menu_items"
  ON menu_items FOR ALL
  USING (auth.role() = 'authenticated');

-- Bills: Allow read/write for authenticated users
CREATE POLICY "Allow authenticated access to bills"
  ON bills FOR ALL
  USING (auth.role() = 'authenticated');

-- Bill Items: Allow read/write for authenticated users
CREATE POLICY "Allow authenticated access to bill_items"
  ON bill_items FOR ALL
  USING (auth.role() = 'authenticated');

-- Users: Allow public read access for login (email and password_hash lookup)
-- In production, consider using Supabase Auth or a service role key for better security
CREATE POLICY "Allow public read access to users for login"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated write access to users"
  ON users FOR ALL
  USING (auth.role() = 'authenticated');

-- Discount Codes: Allow read for all, write for authenticated
CREATE POLICY "Allow public read access to discount_codes"
  ON discount_codes FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated write access to discount_codes"
  ON discount_codes FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert sample data (optional - remove in production)
-- Note: You'll need to hash passwords properly in production
INSERT INTO menu_categories (id, name) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Appetizers'),
  ('00000000-0000-0000-0000-000000000002', 'Main Course'),
  ('00000000-0000-0000-0000-000000000003', 'Desserts'),
  ('00000000-0000-0000-0000-000000000004', 'Beverages')
ON CONFLICT (id) DO NOTHING;

INSERT INTO menu_items (id, name, price, category_id, tax, available) VALUES
  ('00000000-0000-0000-0000-000000000011', 'Burger', 8.99, '00000000-0000-0000-0000-000000000002', true, true),
  ('00000000-0000-0000-0000-000000000012', 'Pizza', 12.99, '00000000-0000-0000-0000-000000000002', true, true),
  ('00000000-0000-0000-0000-000000000013', 'Salad', 6.99, '00000000-0000-0000-0000-000000000001', true, true),
  ('00000000-0000-0000-0000-000000000014', 'Fries', 3.99, '00000000-0000-0000-0000-000000000001', false, true),
  ('00000000-0000-0000-0000-000000000015', 'Ice Cream', 4.99, '00000000-0000-0000-0000-000000000003', true, false),
  ('00000000-0000-0000-0000-000000000016', 'Coffee', 2.99, '00000000-0000-0000-0000-000000000004', false, true),
  ('00000000-0000-0000-0000-000000000017', 'Soda', 2.49, '00000000-0000-0000-0000-000000000004', true, true),
  ('00000000-0000-0000-0000-000000000018', 'Pasta', 10.99, '00000000-0000-0000-0000-000000000002', true, true)
ON CONFLICT (id) DO NOTHING;

-- Clear existing users and insert default admin user
-- Email: paruthimunaitech@gmail.com
-- Password: Paruthi10000 (hashed with bcrypt)
DELETE FROM users;
INSERT INTO users (id, email, password_hash, role, enabled) VALUES
  ('00000000-0000-0000-0000-000000000001', 'paruthimunaitech@gmail.com', '$2b$10$hl9JnxG307QqlN3zGG2NfuC21DuAhKFhnZilhagKhyKTMaqpNeVXO', 'admin', true)
ON CONFLICT (id) DO NOTHING;

