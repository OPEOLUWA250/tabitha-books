"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BookCard } from "@/components/book-card";
import { useCart } from "@/hooks/use-cart";
import booksData from "@/lib/books.json";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, Star } from "lucide-react";
import { useState } from "react";

interface BookDetailPageProps {
  params: {
    id: string;
  };
}

export default function BookDetailPage({ params }: BookDetailPageProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const book = booksData.books.find((b) => b.id === parseInt(params.id));

  if (!book) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="font-sans text-3xl font-bold text-gray-900 mb-4">
            Book Not Found
          </h1>
          <p className="text-gray-600 mb-8 font-light">
            The book you're looking for doesn't exist.
          </p>
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Browse
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const relatedBooks = booksData.books
    .filter((b) => b.category === book.category && b.id !== book.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        image: book.image,
      });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const priceInNaira = `₦${book.price.toLocaleString()}`;

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in-down">
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-all duration-300 mb-8 hover-scale"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Browse
        </Link>
      </div>

      {/* Book Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Book Image */}
          <div className="flex justify-center animate-fade-in-left">
            <div className="relative w-full max-w-sm aspect-3/4 overflow-hidden rounded-lg shadow-lg hover-lift hover-scale">
              <Image
                src={book.image}
                alt={book.title}
                fill
                className="object-cover"
                crossOrigin="anonymous"
              />
            </div>
          </div>

          {/* Book Info */}
          <div className="flex flex-col justify-between animate-fade-in-right">
            {/* Badge */}
            <div className="animate-fade-in-down">
              <div className="inline-block px-4 py-2 bg-orange-100 rounded-full mb-6 hover-glow transition-all duration-300">
                <span className="text-orange-700 text-sm font-semibold capitalize">
                  {book.category}
                </span>
              </div>

              {/* Title and Author */}
              <h1 className="font-sans text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight animate-fade-in-up animation-delay-100">
                {book.title}
              </h1>
              <p className="text-2xl text-gray-600 mb-8 font-light animate-fade-in-up animation-delay-200">
                by {book.author}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-8 animate-fade-in-up animation-delay-300">
                <span className="text-4xl font-sans font-bold text-orange-600">
                  {priceInNaira}
                </span>
              </div>

              {/* Description */}
              <p className="text-lg text-gray-700 leading-relaxed mb-8 font-light animate-fade-in-up animation-delay-400">
                {book.description}
              </p>

              {/* Quantity Selector */}
              <div className="mb-8 animate-fade-in-up animation-delay-500">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Select Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:border-orange-600 transition-all duration-300 hover-scale"
                  >
                    −
                  </button>
                  <span className="text-xl font-semibold w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:border-orange-600 transition-all duration-300 hover-scale"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all mb-4 animate-fade-in-up animation-delay-500 hover-lift ${
                  addedToCart
                    ? "bg-green-600 text-white animate-scale-in"
                    : "bg-orange-600 text-white hover:bg-orange-700"
                }`}
              >
                <ShoppingCart className="w-6 h-6" />
                {addedToCart ? "Added to Cart!" : "Add to Cart"}
              </button>

              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/08180018752?text=Hi! I'm interested in "${book.title}" by ${book.author}. Can you help me order this book?`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-lg font-semibold text-lg border-2 border-green-600 text-green-600 hover:bg-green-50 transition-all duration-300 text-center hover-lift animate-fade-in-up animation-delay-500"
              >
                Order via WhatsApp
              </a>
            </div>

            {/* Additional Info */}
            <div className="pt-8 border-t border-gray-200 space-y-4 text-sm text-gray-600 animate-fade-in-up animation-delay-500 font-light">
              <p className="animate-fade-in animation-delay-600">
                ✓ Fast, secure checkout via WhatsApp
              </p>
              <p className="animate-fade-in animation-delay-700">
                ✓ Carefully curated for your journey
              </p>
              <p className="animate-fade-in animation-delay-800">
                ✓ From the Tabitha Books collection
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <section className="bg-gray-50 py-20 md:py-24 animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-sans text-4xl font-bold text-gray-900 mb-8 animate-fade-in-left">
              More from{" "}
              <span className="font-light italic capitalize">
                {book.category}
              </span>{" "}
              category
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedBooks.map((relatedBook, index) => (
                <div
                  key={relatedBook.id}
                  className="animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <BookCard {...relatedBook} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
