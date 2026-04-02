import { Suspense } from "react";
import { BookCard } from "@/components/book-card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { supabase } from "@/lib/supabase";
import { Search, X } from "lucide-react";

// Disable static generation to avoid prerendering errors
export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every 60 seconds

async function BrowsePageContent() {
  try {
    // Fetch books
    const { data: booksData = [] } = await supabase.from("books").select("*");
    const books = booksData || [];

    // Fetch categories
    let categories: any[] = [];
    try {
      const { data: categoriesData = [] } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });
      categories = categoriesData || [];
    } catch (err) {
      console.log(
        "📝 Categories table not available. Run SUPABASE_SETUP.sql to enable categories.",
      );
    }

    return (
      <>
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
            {/* Sidebar - Category Filter */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  🏷️ Categories
                </h2>

                {categories.length > 0 ? (
                  <div className="space-y-2">
                    {categories.map((category: any) => (
                      <a
                        key={category.id}
                        href={`/browse?category=${encodeURIComponent(category.name)}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-100 rounded-lg transition-all duration-200"
                      >
                        {category.name}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 font-light">
                    No categories available yet
                  </p>
                )}
              </div>
            </div>

            {/* Books Grid */}
            <div className="lg:col-span-3">
              {books.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {books.map((book: any) => (
                    <BookCard key={book.id} {...book} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 font-light">No books available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching browse page data:", error);
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-gray-600 text-center">Unable to load books at this time</p>
      </div>
    );
  }
}

export default function BrowsePage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-gray-600 font-light">Loading collection...</p>
          </div>
        }
      >
        <BrowsePageContent />
      </Suspense>
      <Footer />
    </main>
  );
}
