# Admin Dashboard Setup Guide

## 🔐 Admin Access

- **URL**: `/admin`
- **Password**: `tabitha123` (Change this in `app/admin/page.tsx`)

## 📋 Supabase Table Setup

You need to create a `books` table in Supabase. Follow these steps:

### 1. Go to Supabase Dashboard

- Visit: https://app.supabase.com
- Select your project: `pmsazwxcapmheqskrkfy`

### 2. Create the "books" Table

Go to **SQL Editor** and run this SQL:

```sql
CREATE TABLE IF NOT EXISTS books (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  price NUMERIC NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_featured ON books(featured);
```

### 3. Import Existing Books (Optional)

If you have existing books data, you can import them as JSON or CSV in the Supabase dashboard.

## 🛡️ Security Notes

- The current admin password is stored in the client-side code (**NOT SECURE FOR PRODUCTION**)
- For production use:
  1. Implement proper backend authentication
  2. Use Supabase RLS (Row Level Security) policies
  3. Store passwords in environment variables
  4. Use JWT tokens for session management

### Example RLS Policy

```sql
-- Only authenticated users can access
CREATE POLICY "Only authenticated users can read books"
  ON books USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can insert books"
  ON books FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update books"
  ON books FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can delete books"
  ON books FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');
```

## 📱 Features

### Create Book

- Click "Add Book" button
- Fill in all required fields
- Submit to create a new book

### Read Books

- All books are displayed in a table
- Shows: Image, Title, Author, Category, Price, Featured status

### Update Book

- Click the Edit (pencil) icon on any book
- Modify the details
- Submit to save changes

### Delete Book

- Click the Delete (trash) icon on any book
- Confirm deletion
- Book will be removed from the database

## 🌐 Environment Variables

The following environment variables are already set in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://pmsazwxcapmheqskrkfy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 🚀 Next Steps

1. **Set up Supabase table** using the SQL above
2. **Test the admin dashboard** by visiting `/admin`
3. **Create/Edit/Delete books** using the admin interface
4. **For production**: Implement proper authentication and security

## 📝 Troubleshooting

- **"Failed to fetch books"**: Check if the table exists in Supabase
- **Books not showing**: Ensure Supabase credentials are correct
- **Can't login**: Check the password in `app/admin/page.tsx`
- **Image not loading**: Verify image URLs are accessible via CORS

---

**Questions?** Check the Supabase docs: https://supabase.com/docs
