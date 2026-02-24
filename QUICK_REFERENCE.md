# Mashafy Lifestyle - Quick Reference Guide

## 🎯 Project Overview

A complete, production-ready e-commerce platform for Mashafy Lifestyle brand built with modern web technologies.

**Live Dev Server**: http://localhost:5173/

## 📦 What's Included

### Pages & Routes

```
HOME        /              Hero + Featured Products
SHOP        /shop          Full Product Catalog with Filters
CART        /cart          Shopping Cart & Checkout
ABOUT       /about         Brand Story & Values
CONTACT     /contact       Contact Form & FAQ

ADMIN       /admin         Dashboard with Analytics
PRODUCTS    /admin/products    Product Management
ORDERS      /admin/orders      Order Management
ANALYTICS   /admin/analytics   Sales & Performance
```

## 🚀 Essential Commands

### Development

```bash
npm run dev      # Start dev server (hot reload)
npm run build    # Build for production
npm run preview  # Preview production build
```

### Project Location

```
c:\Users\Opeoluwa\Projects\mashafy-lifestyle\
```

## 📂 Key Files

### Components

- `src/components/store/Navbar.tsx` - Navigation
- `src/components/store/ProductCard.tsx` - Product display
- `src/components/store/Footer.tsx` - Footer links

### Pages (Store)

- `src/pages/store/Home.tsx` - Homepage
- `src/pages/store/Shop.tsx` - Product catalog
- `src/pages/store/Cart.tsx` - Shopping cart
- `src/pages/store/About.tsx` - About page
- `src/pages/store/Contact.tsx` - Contact page

### Pages (Admin)

- `src/pages/admin/Dashboard.tsx` - Admin dashboard
- `src/pages/admin/Products.tsx` - Product mgmt
- `src/pages/admin/Orders.tsx` - Order mgmt
- `src/pages/admin/Analytics.tsx` - Analytics

### Core Files

- `src/App.tsx` - Router configuration
- `src/store/cartStore.ts` - Cart state (Zustand)
- `src/types/index.ts` - TypeScript types

### Config Files

- `tailwind.config.js` - Tailwind CSS config
- `vite.config.ts` - Vite bundler config
- `tsconfig.json` - TypeScript config

## 🎨 Tailwind CSS Setup

Tailwind is fully configured with:

- Custom primary colors (brown/gold)
- Responsive utilities
- Dark mode ready
- Custom plugins

### Usage Example

```tsx
<div className="p-6 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
  Hello World
</div>
```

## 🗂️ Folder Structure Logic

```
src/
├── components/        Reusable UI components
├── pages/            Full page components
│   ├── store/        Customer-facing pages
│   └── admin/        Admin dashboard pages
├── store/            State management (Zustand)
├── types/            TypeScript definitions
├── utils/            Helper functions
└── style.css         Global styles + Tailwind
```

## 💾 State Management

### Zustand Cart Store

Located in `src/store/cartStore.ts`

```tsx
import { useCartStore } from "./store/cartStore";

// Usage in components
const items = useCartStore((state) => state.items);
const addItem = useCartStore((state) => state.addItem);
const removeItem = useCartStore((state) => state.removeItem);
const totalPrice = useCartStore((state) => state.getTotalPrice());
```

## 📱 Responsive Breakpoints

Tailwind default breakpoints:

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Usage

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* 1 col on mobile, 2 on tablet, 4 on desktop */}
</div>
```

## 🎯 Component Patterns

### Creating a New Page

```tsx
import React from "react";
import { Navbar } from "../../components/store/Navbar";
import { Footer } from "../../components/store/Footer";

export const NewPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Your content */}
      <Footer />
    </div>
  );
};
```

### Using Cart Store in Component

```tsx
import { useCartStore } from "../../store/cartStore";

export const MyComponent = () => {
  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);

  return <div>{cartItems.length} items</div>;
};
```

## 🎨 Color Reference

Primary colors (Tailwind):

- `bg-primary-50` through `bg-primary-900`
- `text-primary-600` (main brand color)
- `hover:bg-primary-700`

Custom colors for status:

- `bg-green-100/text-green-800` - Success
- `bg-red-100/text-red-800` - Error/Delete
- `bg-yellow-100/text-yellow-800` - Warning
- `bg-blue-100/text-blue-800` - Info

## 📝 TypeScript Types

All types defined in `src/types/index.ts`:

```tsx
interface Product {
  id: string;
  name: string;
  price: number;
  category: "tees" | "journals";
  inStock: boolean;
  // ... more fields
}

interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}
```

## 🔌 API Integration Points

When connecting to backend:

1. **Products API**
   - GET `/api/products` - Fetch all products
   - GET `/api/products/:id` - Single product
   - POST/PUT/DELETE for admin

2. **Orders API**
   - POST `/api/orders` - Create order
   - GET `/api/orders` - List orders
   - GET `/api/orders/:id` - Order details

3. **Auth API**
   - POST `/api/auth/login` - User login
   - POST `/api/auth/register` - User signup
   - POST `/api/auth/logout` - User logout

## 🚀 Deployment Checklist

- [ ] Replace placeholder images with real product images
- [ ] Setup backend API endpoints
- [ ] Configure payment gateway
- [ ] Setup email service
- [ ] Configure analytics
- [ ] Test on multiple devices
- [ ] Run `npm run build`
- [ ] Deploy to Vercel/Netlify/your host

## 📱 Testing Responsive Design

Test on:

- Mobile (iPhone 12, 375px)
- Tablet (iPad, 768px)
- Desktop (1024px+)
- Large desktop (1920px+)

Use Chrome DevTools: `F12` → Toggle device toolbar (`Ctrl+Shift+M`)

## 🐛 Common Issues & Solutions

### Images not loading

- Check image URLs in data files
- Ensure URLs are accessible
- Use placeholder service if needed

### Styles not applying

- Clear browser cache
- Restart dev server: `npm run dev`
- Check class names match Tailwind syntax

### Cart not persisting

- Check localStorage in DevTools
- Verify Zustand persist middleware
- Check browser privacy settings

## 📞 Support

For questions or issues:

- Check PROJECT_STATUS.md
- Review README.md
- Check component props in TypeScript files

## 🎉 You're All Set!

The Mashafy Lifestyle e-commerce platform is ready to use!

- Dev server running on **http://localhost:5173/**
- Full source code with TypeScript
- Beautiful Tailwind CSS styling
- Responsive on all devices
- Admin dashboard included
- Cart functionality built-in
- Ready for backend integration

**Start building! ⚡**
