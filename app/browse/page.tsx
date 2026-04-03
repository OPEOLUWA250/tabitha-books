import { Suspense } from "react";
import { BookCard } from "@/components/book-card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { supabase } from "@/lib/supabase";
import { Search, X } from "lucide-react";

// Disable caching completely for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

async function BrowsePageContent({ searchParams }: { searchParams: Promise<any> }) {
  try {
    // Await searchParams (Next.js 15+ requirement)
    const params = await searchParams;
    const selectedCategory = params?.category
      ? decodeURIComponent(params.category).toLowerCase()
      : null;

    console.log("📖 Browse Page - Selected Category:", selectedCategory);

    // Fetch books with no-cache
    const { data: booksData = [], error: booksError } = await supabase
      .from("books")
      .select("*");

    if (booksError) {
      console.error("❌ Error fetching books:", booksError);
    }

    let books = booksData || [];
    console.log("📚 Total books fetched:", books.length);

    // Filter by category if selected (case-insensitive)
    if (selectedCategory) {
      const beforeFilter = books.length;
      books = books.filter((book: any) => {
        const bookCategory = book.category?.toLowerCase();
        const matches = bookCategory === selectedCategory;
        return matches;
      });
      console.log(
        `🔍 Filtered from ${beforeFilter} to ${books.length} books in category: "${selectedCategory}"`,
      );
    } else {
      console.log("📚 Showing all books");
    }

    // Fetch categories with no-cache
    let categories: any[] = [];
    try {
      const { data: categoriesData = [] } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });
      categories = categoriesData || [];
      console.log("📂 Categories fetched:", categories.length);
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
              {selectedCategory
                ? `Showing books in "${selectedCategory}" (${books.length})`
                : `Explore ${books.length} carefully curated books`}
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {/* Sidebar - Category Filter (Mobile: Grid, Desktop: Vertical) */}
            <div className="col-span-2 lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 lg:p-6 lg:sticky lg:top-20">
                <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-6">
                  🏷️ Categories
                </h2>

                {/* Mobile: Grid Layout, Desktop: Vertical */}
                <div className="grid grid-cols-2 gap-2 lg:grid-cols-1 lg:space-y-2">
                  {/* All Books Option */}
                  <a
                    href="/browse"
                    className={`px-3 py-2 lg:px-4 lg:py-2 text-xs lg:text-sm font-semibold rounded-lg transition-all duration-200 text-center lg:text-left block ${
                      !selectedCategory
                        ? "text-white bg-orange-600 hover:bg-orange-700"
                        : "text-gray-700 bg-white hover:bg-orange-50 border border-gray-200"
                    }`}
                  >
                    📚 All Books
                  </a>

                  {categories.length > 0 ? (
                    <>
                      {categories.map((category: any) => {
                        const categoryNameLower = category.name?.toLowerCase();
                        const isSelected = selectedCategory === categoryNameLower;
                        return (
                          <a
                            key={category.id}
                            href={`/browse?category=${encodeURIComponent(category.name)}`}
                            className={`px-3 py-2 lg:px-4 lg:py-2 text-xs lg:text-sm rounded-lg transition-all duration-200 capitalize text-center lg:text-left block ${
                              isSelected
                                ? "text-white bg-orange-600 hover:bg-orange-700"
                                : "text-gray-700 bg-white hover:bg-orange-50 border border-gray-200"
                            }`}
                          >
                            {category.name}
                          </a>
                        );
                      })}
                    </>
                  ) : (
                    <p className="text-xs lg:text-sm text-gray-500 font-light col-span-2 lg:col-span-1 px-2">
                      No categories
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Books Grid */}
            <div className="col-span-2 lg:col-span-3">
              {books && books.length > 0 ? (
                <>
                  <p className="text-sm text-gray-600 mb-4 lg:mb-6">
                    Showing {books.length} book{books.length !== 1 ? "s" : ""}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {books.map((book: any) => (
                      <BookCard key={book.id} {...book} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 col-span-2">
                  <p className="text-gray-500 font-light">
                    No books available yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("❌ Error fetching browse page data:", error);
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-gray-600 text-center">Unable to load books at this time</p>
      </div>
    );
  }
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<any>;
}) {
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
        <BrowsePageContent searchParams={searchParams} />
      </Suspense>
      <Footer />
    </main>
  );
}
