# Tabitha Books - E-Commerce Platform

A premium, fully responsive e-commerce platform built for Tabitha Books, a curated online bookstore dedicated to sharing transformative stories that inspire growth, spark imagination, and create meaningful connections.

## 🚀 Features

### Store Features

- **Responsive Design**: Fully responsive across all devices (mobile, tablet, desktop)
- **Book Catalog**: Browse curated books, journals, and lifestyle pieces with advanced filtering
- **Shopping Cart**: Add to cart with persistent storage using Zustand
- **Wishlist**: Save favorite items with persistent localStorage
- **Search & Filter**: Find products by search query, category, price range, and sort options
- **Product Details**: Detailed product information with ratings and reviews
- **Beautiful UI**: Minimalist design with Tailwind CSS and ultra-thin Poppins font
- **Smooth Animations**: Powered by Framer Motion for engaging interactions
- **Fast Performance**: Optimized with Vite for instant load times
- **WhatsApp Integration**: Direct order placement via WhatsApp

### Admin Dashboard

- **Dashboard Overview**: Browse and manage products with search
- **Product Management**: Add, edit, and delete inventory
- **Responsive Admin UI**: Fully optimized for mobile and desktop

### Additional Pages

- **Home Page**: Hero section with animated featured products
- **About Page**: Brand story, mission, values (AFRICA), and Muse Community
- **Contact Page**: Contact information and inquiries
- **Shop Page**: Full product catalog with advanced filtering
- **Wishlist Page**: Saved products with bulk cart actions
- **Cart Page**: Full checkout flow with WhatsApp ordering

## 🏗️ Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3 + Custom CSS
- **Animations**: Framer Motion
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Zustand with localStorage persistence
- **Icons**: Lucide React + Font Awesome
- **Backend**: Supabase
- **HTTP Client**: Axios

## 📁 Project Structure

```
tabitha-books/
├── src/
│   ├── components/
│   │   ├── store/
│   │   │   ├── Navbar.tsx (with search bar)
│   │   │   ├── ProductCard.tsx (with wishlist)
│   │   │   ├── Footer.tsx (centered on mobile)
│   │   │   └── FloatingButtons.tsx (back-to-top)
│   │   └── admin/
│   ├── pages/
│   │   ├── store/
│   │   │   ├── Home.tsx (with hero animations)
│   │   │   ├── Shop.tsx (with advanced filters)
│   │   │   ├── Cart.tsx
│   │   │   ├── Wishlist.tsx
│   │   │   ├── About.tsx
│   │   │   └── Contact.tsx
│   │   └── admin/
│   │       ├── Dashboard.tsx
│   │       ├── Products.tsx
│   │       ├── AddProduct.tsx
│   │       └── EditProduct.tsx
│   ├── store/
│   │   ├── cartStore.ts
│   │   └── wishlistStore.ts
│   ├── utils/
│   │   ├── supabase.ts
│   │   └── whatsapp.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── style.css
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
└── README.md
```

## 🎨 Brand Identity

**Tabitha Books** - Curated literature and lifestyle pieces for transformative living

### Mission

To democratize access to transformative literature that inspires personal growth, sparks restless ambition, and cultivates authentic living.

### Core Values: AFRICA

- **A** - Ambition: Drive and determination to achieve greatness
- **F** - Faith: Trust in purpose and divine direction
- **R** - Refinement: Excellence in quality and execution
- **I** - Identity: Authentic expression of who you truly are
- **C** - Confidence: Believing in your power and inherent worth
- **A** - Audacity: Courage to stand out and be authentically bold

### Product Line

1. **Curated Books** - Leadership, fiction, and lifestyle reads handpicked for impact
2. **Premium Journals** - Intentional spaces for reflection and manifestation
3. **Signature Apparel** - Wearable affirmations (I Dare to Stand Out, Ambitious and Anointed, Fierce and Fearless)

### Community

**The Muse** - A gender-inclusive community of visionaries connected by purpose and belonging. Join individuals who dare to live authentically, think critically, and lead with intention.

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open browser and navigate to:

```
http://localhost:5173/
```

## 📦 Available Scripts

### Development

```bash
npm run dev      # Start development server
```

### Build

```bash
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🔗 Routes

### Store Routes

- `/` - Home page with hero and featured products
- `/shop` - Product catalog with advanced filters
- `/cart` - Shopping cart
- `/wishlist` - Saved products
- `/about` - About Tabitha Books and values
- `/contact` - Contact information

### Admin Routes

- `/admin` - Dashboard
- `/admin/products` - Product management
- `/admin/products/new` - Add new product
- `/admin/products/:id/edit` - Edit product

## 🎯 Key Features

### Advanced Product Filtering

- **Search Bar**: Real-time search across product names, descriptions, and categories
- **Category Filters**: Leadership, Fiction, Lifestyle, or All
- **Price Range**: Slider filter from ₦0 to ₦1,000,000
- **Sorting**: Newest, Price Low-to-High, Price High-to-Low

### Cart & Wishlist System

- Add/remove products with notifications
- Update quantities with hover controls
- Persistent storage across sessions
- Bulk actions (Add All to Cart from Wishlist)
- Real-time badge count

### Animation & UX

- Scroll-triggered animations with Framer Motion
- Staggered product card reveals
- Smooth page transitions with scroll-to-top
- Interactive hover effects with spring physics
- Confetti-like animations on key actions

### Admin Features

- Full inventory management
- Product CRUD operations
- Search and filter products
- Mobile-responsive dashboard

## 📱 Responsive Design

- Mobile First approach
- Optimized for all screen sizes
- Touch-friendly interface
- Footer content centered on mobile
- Adaptive animations based on viewport
- Fast loading on mobile networks

## 🎨 Color Scheme

- **Primary Color**: #FF5B00 (Brand Orange)
- **Dark**: #1a1a1a
- **White**: #FFFFFF
- **Light Grays**: Various shades for hierarchy
- **Accent Colors**: For status badges and highlights

## 🎬 Animation Framework

Powered by Framer Motion:

- Hero section with floating backgrounds and cascading text
- Featured products with stagger effects
- Card lift on hover with shadow
- Button interactions with spring physics
- Continuous animations (pulse, bounce, glow effects)

## 🚀 Deployment Ready

- Production build optimized
- Vite configured for fast builds
- React Router for client-side routing
- Can be deployed to Vercel, Netlify, or any static host
- Supabase backend ready

## 📊 Performance

- Optimized bundle size (~200KB gzipped with animations)
- Fast page load times
- Efficient asset loading
- Lazy loading ready
- Scroll-to-top optimization

## 🔐 Security

- Type-safe with TypeScript
- Environment variable support
- Input validation
- XSS protection with React
- LocalStorage encryption ready

## WhatsApp Integration

- Direct order placement via WhatsApp
- Pre-filled order summaries
- Mobile-optimized checkout flow

## 🤝 Contributing

For updates to Tabitha Books, follow these guidelines:

1. Create feature branches
2. Write components with TypeScript + React
3. Use Tailwind CSS for styling
4. Use Framer Motion for animations
5. Keep components modular and reusable
6. Maintain ultra-thin font aesthetic

## 📄 License

© 2026 Tabitha Books. All rights reserved.

---

**Made with ⚡ for the Muse Community**

For inquiries: hello@tabithabooks.com | +234 818 012 9670 | WhatsApp: https://wa.me/2348180129670

Join the Muse Community – Book every day, transform everyday.
