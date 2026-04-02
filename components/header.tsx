"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export function Header() {
  const { items } = useCart();
  const cartCount = items.length;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 animate-slide-in-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="text-2xl font-sans font-bold text-orange-600 animate-fade-in group-hover:animate-bounce-soft transition-all duration-300">
              Tabitha
            </div>
            <div className="ml-2 text-sm text-gray-600 font-light group-hover:text-orange-600 transition-colors duration-300 animate-fade-in animation-delay-100">
              Books
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/browse"
              className="text-gray-700 hover:text-orange-600 transition-all duration-300 font-light relative group animate-fade-in animation-delay-200"
            >
              Browse Books
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              href="/browse"
              className="text-gray-700 hover:text-orange-600 transition-all duration-300 font-light relative group animate-fade-in animation-delay-300"
            >
              All Books
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300" />
            </Link>
          </nav>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2 text-gray-700 hover:text-orange-600 transition-all duration-300 hover-scale animate-fade-in animation-delay-400"
          >
            <ShoppingCart className="w-6 h-6 hover:animate-bounce-soft" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold animate-scale-in hover-glow">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
