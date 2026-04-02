"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { BookCard } from "@/components/book-card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Search, X } from "lucide-react";

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");
  const urlSearch = searchParams.get("search");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    urlCategory ? decodeURIComponent(urlCategory) : null,
  );
  const [searchQuery, setSearchQuery] = useState(
    urlSearch ? decodeURIComponent(urlSearch) : "",
  );
  const [books, setBooks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setCategoriesLoading(true);

      try {
        // Fetch books
        const { data: booksData } = await supabase.from("books").select("*");
        setBooks(booksData || []);
        setLoading(false);

        // Fetch categories
        const { data: categoriesData, error } = await supabase
          .from("categories")
          .select("*")
          .order("name", { ascending: true });

        if (error) {
          if (error.message.includes("does not exist")) {
            console.log(
              "📝 Tip: Categories table not created yet. Run SUPABASE_SETUP.sql to enable categories management.",
            );
          } else {
            console.error("Error fetching categories:", error.message);
          }
          setCategories([]);
        } else {
          setCategories(categoriesData || []);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesCategory =
        !selectedCategory || book.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, books]);

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <section className="bg-linear-to-br from-orange-50 to-white py-12 md:py-16 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-sans text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-fade-in-up">
            Browse Our Collection
          </h1>
          <p className="text-gray-600 text-lg font-light animate-fade-in-up animation-delay-100">
            Explore {books.length} carefully curated books across all categories
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Search */}
              <div className="animate-fade-in-left animation-delay-100">
                <h3 className="font-sans font-semibold text-gray-900 mb-4 text-lg">
                  Search
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search books..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition hover-brightness text-sm font-light placeholder:font-light"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="animate-fade-in-left animation-delay-200">
                <h3 className="font-sans font-semibold text-gray-900 mb-4 text-lg">
                  Categories
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-light transition-all hover-scale ${
                      selectedCategory === null
                        ? "bg-orange-600 text-white hover-glow"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All Books
                  </button>

                  {/* Dynamic Categories */}
                  {categoriesLoading ? (
                    <div className="px-4 py-3 text-xs text-gray-500 font-light">
                      Loading categories...
                    </div>
                  ) : categories.length > 0 ? (
                    categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`w-full text-left px-4 py-3 rounded-lg font-light transition-all hover-scale capitalize ${
                          selectedCategory === category.name
                            ? "bg-orange-600 text-white hover-glow"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-xs text-gray-500 font-light">
                      No categories available
                    </div>
                  )}
                </div>
              </div>

              {/* Active Filters */}
              {(selectedCategory || searchQuery) && (
                <div className="pt-4 border-t border-gray-200 animate-fade-in-left animation-delay-300">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSearchQuery("");
                    }}
                    className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-light transition-all hover-scale"
                  >
                    <X className="w-4 h-4 animate-rotate" />
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Books Grid */}
          <div className="lg:col-span-3">
            {filteredBooks.length > 0 ? (
              <>
                <div className="mb-6 animate-fade-in-up">
                  <p className="text-gray-600">
                    Showing {filteredBooks.length} of {books.length} books
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBooks.map((book, index) => (
                    <div
                      key={book.id}
                      className="animate-fade-in-up"
                      style={{
                        animationDelay: `${(index % 3) * 100}ms`,
                      }}
                    >
                      <BookCard {...book} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="col-span-full text-center py-12 animate-fade-in-up">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4 animate-bounce-soft">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-sans text-xl font-bold text-gray-900 mb-2">
                  No books found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filters to find what you're
                  looking for.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery("");
                  }}
                  className="px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-all hover-lift"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
