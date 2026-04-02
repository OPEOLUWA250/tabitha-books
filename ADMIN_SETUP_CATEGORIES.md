# Supabase Categories Table Setup Guide

## Quick Setup (2 minutes)

### Step 1: Go to Your Supabase Dashboard

1. Visit [https://app.supabase.com](https://app.supabase.com)
2. Sign in with your account
3. Select your project (Tabitha Books)

### Step 2: Open SQL Editor

1. On the left sidebar, click **"SQL Editor"**
2. Click **"New Query"** button
3. A new SQL editor window opens

### Step 3: Copy & Run the Setup SQL

1. Open `SUPABASE_SETUP.sql` file in this project
2. Copy **ALL** the SQL code
3. Paste it into the SQL editor in Supabase
4. Click the **"Run"** button (or press Ctrl+Enter)

You should see a green checkmark ✅ if successful.

### Step 4: Verify the Table Was Created

1. In Supabase, go to **"Table Editor"** on the left
2. You should see a **`categories`** table in the list
3. Click on it to verify it has these columns:
   - `id` (number)
   - `name` (text)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

### Step 5: Return to the App

1. Go back to the Next.js app: `http://localhost:3000/admin`
2. Login (password: `tabitha123`)
3. Click the **"🏷️ Categories"** tab
4. Try adding a category like "Mystery" or "Science Fiction"
5. It should work now! ✨

---

## What the SQL Does

The SQL script in `SUPABASE_SETUP.sql`:

1. **Creates the `categories` table** with proper columns
2. **Adds Row Level Security (RLS)** so the app can read/write
3. **Grants permissions** to anonymous and authenticated users
4. **Seeds default categories** (fiction, non-fiction, leadership, etc.)
5. **Creates an index** for faster queries

---

## Troubleshooting

### Error: "does not exist" or "relation does not exist"

- The SQL didn't run successfully
- Make sure you copied ALL the code from SUPABASE_SETUP.sql
- Try running it again

### Error: "permission denied"

- The RLS policies weren't set up correctly
- Go back to SQL Editor and run the SQL again
- Check that all 7 GRANT and POLICY statements ran

### Still Can't Add Categories?

1. Refresh your browser (Ctrl+F5)
2. Clear browser cache
3. Restart the Next.js dev server: `npm run dev`

---

## How It Works

After setup:

1. Admin goes to **Admin Dashboard** → **Categories** tab
2. Enters a new category name (e.g., "Mystery")
3. Clicks "Add"
4. The category is saved to Supabase
5. Automatically appears in:
   - ✅ Books form dropdown
   - ✅ Browse page filters
   - ✅ Category list on all pages

---

## Next Steps

Once categories are working:

1. Add a few categories in the admin dashboard
2. Go to "📚 Books Management" tab
3. Add a book and select one of your new categories
4. Visit `/browse` and filter by category - it should work perfectly!

---

**Questions?** Check the browser console (F12) for detailed error messages if something doesn't work.
