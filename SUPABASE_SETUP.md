# Supabase Setup Guide for Mashafy Lifestyle

## Overview

This project uses Supabase as the backend database for products catalog and order management. Supabase provides real-time PostgreSQL database with a simple REST API.

## Prerequisites

- Supabase account (free tier available at https://supabase.com)
- Basic understanding of SQL/databases

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Enter project details:
   - **Name:** mashafy-lifestyle
   - **Database Password:** (Create a strong password)
   - **Region:** Choose closest to your location
5. Click "Create new project" and wait for setup (2-3 minutes)

## Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL:** (VITE_SUPABASE_URL)
   - **anon public:** (VITE_SUPABASE_ANON_KEY)

## Step 3: Create Database Tables

### Products Table

Go to **SQL Editor** and run this query:

```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'tees' or 'journals'
  image VARCHAR(500),
  colors JSONB, -- Array of color hex codes
  sizes JSONB, -- Array of sizes
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for public read access
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON products
  FOR SELECT USING (true);
```

### Orders Table

```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  items JSONB NOT NULL, -- Array of cart items
  total_price INTEGER NOT NULL,
  shipping_cost INTEGER NOT NULL DEFAULT 2000,
  tax INTEGER NOT NULL,
  final_total INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, delivered, cancelled
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_insert" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "public_select" ON orders
  FOR SELECT USING (true);

CREATE POLICY "public_update" ON orders
  FOR UPDATE USING (true);
```

## Step 4: Add Sample Products

Go to **SQL Editor** and insert sample data:

```sql
INSERT INTO products (name, description, price, category, image, colors, sizes, in_stock, featured)
VALUES
  (
    'I Dare to Stand Out',
    'Unisex minimalist typography tee with universal appeal',
    8500,
    'tees',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    '["#000000", "#FFFFFF", "#8B4513"]'::jsonb,
    '["XS", "S", "M", "L", "XL", "XXL"]'::jsonb,
    true,
    true
  ),
  (
    'Ambitious and Anointed',
    'Female-cut empowering tee for the bold visionary',
    8500,
    'tees',
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&h=500&fit=crop',
    '["#000000", "#FFFFFF"]'::jsonb,
    '["XS", "S", "M", "L", "XL"]'::jsonb,
    true,
    true
  ),
  (
    'Fierce and Fearless',
    'Bold statement tee for those who dare differently',
    8500,
    'tees',
    'https://images.unsplash.com/photo-1503341320519-c92dcca89b13?w=500&h=500&fit=crop',
    '["#8B0000", "#000000", "#FFFFFF"]'::jsonb,
    '["XS", "S", "M", "L", "XL", "XXL"]'::jsonb,
    true,
    true
  ),
  (
    'Mashafy Reflection Journal',
    'Premium journal for intentional living and daily clarity',
    12000,
    'journals',
    'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=500&fit=crop',
    '["#8B4513", "#000000"]'::jsonb,
    NULL,
    true,
    true
  );
```

## Step 5: Configure Environment Variables

1. Create a `.env.local` file in your project root (copy from `.env.example`):

```bash
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Replace placeholders with values from Step 2

## Step 6: Test the Connection

Run the development server:

```bash
npm run dev
```

Visit http://localhost:5173/shop - it should fetch products from Supabase.

## Database Operations Available

### Get Products

```typescript
import { getProducts } from "@/utils/supabase";

const { data: products, error } = await getProducts();
```

### Save Order

```typescript
import { saveOrder } from "@/utils/supabase";

const { data, error } = await saveOrder({
  customer_name: "John Doe",
  customer_email: "john@example.com",
  customer_phone: "+2348180129670",
  items: cartItems,
  total_price: 25000,
  shipping_cost: 2000,
  tax: 2025,
  final_total: 29025,
  status: "pending",
});
```

### Get Orders (Admin)

```typescript
import { getOrders } from "@/utils/supabase";

const { data: orders, error } = await getOrders();
```

### Update Order Status

```typescript
import { updateOrderStatus } from "@/utils/supabase";

await updateOrderStatus(orderId, "processing");
```

## Troubleshooting

### Products not loading?

- Check browser console for errors
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in `.env.local`
- Ensure the `products` table exists and has data
- Check Row Level Security policies are allowing SELECT

### Cannot insert orders?

- Verify RLS policy allows INSERT on `orders` table
- Check order data structure matches the schema
- Look for validation errors in browser console

### Admin Dashboard empty?

- Ensure orders exist in the `orders` table
- Verify RLS policies allow SELECT and UPDATE
- Check browser console for fetch errors

## Next Steps

1. **Connect Shop page to Supabase:** Update [Shop.tsx](src/pages/store/Shop.tsx) to fetch from `getProducts()`
2. **Connect Home page:** Update featured products in [Home.tsx](src/pages/store/Home.tsx)
3. **Save orders from cart:** Integrate `saveOrder()` in Cart checkout
4. **Admin dashboard:** Connect [Dashboard.tsx](src/pages/admin/Dashboard.tsx) to real order data

## Security Notes

- The `anon public` key is public - it's safe to expose
- Row Level Security (RLS) policies protect your data
- Never commit `.env.local` to version control (it's in `.gitignore`)
- For production, consider enabling additional RLS policies

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
