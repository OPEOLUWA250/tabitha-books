-- SUPABASE SQL SETUP FOR TABITHA BOOKS CATEGORIES
-- Run this in your Supabase SQL editor (https://app.supabase.com)

-- 1. Create the categories table
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create an index on name for faster queries
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policy to allow public read access
CREATE POLICY "Allow public read access" ON categories
  FOR SELECT USING (true);

-- 5. Create RLS policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON categories
  FOR INSERT WITH CHECK (true);

-- 6. Create RLS policy to allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON categories
  FOR UPDATE USING (true);

-- 7. Create RLS policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON categories
  FOR DELETE USING (true);

-- 8. Grant permissions
GRANT ALL ON categories TO anon, authenticated;

-- 9. Optional: Seed with default categories
INSERT INTO categories (name) VALUES 
  ('fiction'),
  ('non-fiction'),
  ('leadership'),
  ('lifestyle'),
  ('business'),
  ('personal-development')
ON CONFLICT (name) DO NOTHING;

-- Done! Your categories table is ready.
