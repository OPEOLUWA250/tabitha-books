"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BookCard } from "@/components/book-card";

export default function HomePage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const { data: booksData } = await supabase
          .from("books")
          .select("*")
          .eq("featured", true)
          .limit(12);

        setBooks(booksData || []);
      } catch (err) {
        console.error("Error fetching books:", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Featured books for display
  const featuredBooks = books;

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-linear-to-br from-orange-50 via-white to-white h-screen flex items-center justify-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl animate-float animation-delay-0" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl animate-float animation-delay-300" />
          <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl animate-float animation-delay-600" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(0deg, #f97316 1px, transparent 1px), linear-gradient(90deg, #f97316 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 items-start">
            {/* Left: Text and CTA */}
              <div className="space-y-8 lg:space-y-6 text-center lg:text-left px-4 sm:px-0 pt-10 lg:pt-20">
              <div className="space-y-4">
                <div className="inline-block lg:inline-block">
                  <span className="text-xs sm:text-sm font-light text-orange-600 uppercase tracking-widest px-4 py-2 bg-orange-100 rounded-full animate-fade-in-up">
                    ✨ Welcome to Tabitha Books
                  </span>
                </div>
              </div>

              <h1 className="font-sans text-5xl sm:text-6xl lg:text-5xl font-light text-gray-900 leading-tight animate-fade-in-up animation-delay-100">
                Discover{" "}
                <span className="relative inline-block text-transparent bg-linear-to-r from-orange-600 to-orange-500 bg-clip-text animate-pulse animation-delay-200">
                  Transformative
                </span>{" "}
                Stories
              </h1>

              <p className="text-lg sm:text-xl lg:text-lg text-gray-700 leading-relaxed font-light max-w-xl lg:max-w-none animate-fade-in-up animation-delay-200 mx-auto lg:mx-0">
                Curated books that inspire mindful living, personal growth, and
                meaningful change in your life.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-4 animate-fade-in-up animation-delay-300">
                <a
                  href="/browse"
                  className="px-6 py-3 bg-linear-to-r from-orange-600 to-orange-500 text-white font-semibold rounded-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                >
                  🛍️ Explore Now
                </a>
                <a
                  href="/browse"
                  className="px-6 py-3 border-2 border-orange-600 text-orange-600 font-semibold rounded-lg hover:bg-linear-to-r hover:from-orange-50 hover:to-orange-50 transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 group"
                >
                  📚 Browse
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4 animate-fade-in-up animation-delay-400 text-xs sm:text-sm lg:text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📖</span>
                  <span>500+ Books</span>
                </div>
                <div className="hidden sm:block h-4 w-px bg-gray-300" />
                <div className="flex items-center gap-2">
                  <span className="text-xl">⭐</span>
                  <span>Hand-Picked</span>
                </div>
                <div className="hidden sm:block h-4 w-px bg-gray-300" />
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚀</span>
                  <span>Fast Delivery</span>
                </div>
              </div>
            </div>

            {/* Right: Visual element for large screens */}
            <div className="hidden lg:flex items-start justify-center relative pt-20">
              <div className="relative w-80 h-80 animate-fade-in animation-delay-500">
                {/* Gradient card background */}
                <div className="absolute inset-0 bg-linear-to-br from-orange-100 to-orange-50 rounded-3xl transform rotate-3 hover:rotate-1 transition-transform duration-300" />
                <div className="absolute inset-0 bg-linear-to-tl from-white to-orange-50 rounded-3xl transform -rotate-2" />

                {/* Book stack illustration */}
                <div className="absolute inset-8 rounded-2xl bg-white shadow-xl flex items-center justify-center overflow-hidden">
                  <div className="space-y-4 w-full h-full flex flex-col justify-center items-center p-8">
                    <div className="text-6xl">📚</div>
                    <div className="text-center space-y-2">
                      <p className="text-2xl font-bold text-gray-900">
                        Your Next
                      </p>
                      <p className="text-2xl font-bold bg-linear-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                        Great Read
                      </p>
                    </div>
                    <p className="text-gray-600 text-center text-sm mt-4">
                      Awaits you in our
                    </p>
                    <p className="text-gray-600 text-center text-sm">
                      carefully curated collection
                    </p>
                  </div>
                </div>

                {/* Floating accent cards */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-orange-400 rounded-2xl shadow-lg transform rotate-12 hover:rotate-6 transition-transform duration-300 opacity-80 flex items-center justify-center text-5xl animate-float animation-delay-200">
                  ✨
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED BOOKS SECTION ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="mb-16 md:mb-20 space-y-3">
          <h2 className="font-sans text-4xl md:text-5xl font-light text-gray-900">
            ⭐ Featured Collection
          </h2>
          <p className="text-gray-600 text-lg font-light max-w-2xl">
            Hand-picked selections that define mindful reading
          </p>
          <div className="h-1 w-20 bg-linear-to-r from-orange-600 to-orange-500 rounded-full" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-lg h-80 animate-pulse"
              />
            ))}
          </div>
        ) : featuredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book, index) => (
              <div
                key={book.id}
                className="animate-fade-in-up hover-lift"
                style={{
                  animationDelay: `${(index % 4) * 100}ms`,
                }}
              >
                <BookCard {...book} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="font-light">No featured books at the moment</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <a
            href="/browse"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-orange-600 text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-all duration-300 hover:scale-105 transform animate-fade-in-up animation-delay-300"
          >
            View All Books
            <span className="animate-float animation-delay-200">→</span>
          </a>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="bg-linear-to-r from-orange-600 to-orange-700 py-12 md:py-16 mb-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white space-y-6">
          <h2 className="font-sans text-4xl md:text-5xl font-semibold">
            Ready to Start Reading?
          </h2>
          <p className="text-lg font-light text-orange-50">
            Browse our complete collection and find your next favorite book
          </p>
          <a
            href="/browse"
            className="inline-block px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            Browse All Books
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
