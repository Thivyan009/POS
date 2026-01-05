-- Migration: Add image_url column to menu_items table
-- Run this script in Supabase SQL Editor

-- Step 1: Add image_url column if it doesn't exist
ALTER TABLE menu_items 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Step 2: Create index for image_url queries (optional, but can help with filtering)
CREATE INDEX IF NOT EXISTS idx_menu_items_image_url ON menu_items(image_url) WHERE image_url IS NOT NULL;

-- Step 3: Add comment to document the column
COMMENT ON COLUMN menu_items.image_url IS 'URL or data URL of the menu item image';






