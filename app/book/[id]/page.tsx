"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BookCard } from "@/components/book-card";
import { useCart } from "@/hooks/use-cart";
import { useSignedUrl } from "@/hooks/use-signed-url";
import { getSupabaseImageUrl } from "@/lib/image-utils";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, MessageCircle, Check } from "lucide-react";
import { useState, useEffect } from "react";

interface BookDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function BookDetailPage({ params }: BookDetailPageProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [book, setBook] = useState<any>(null);
  const [relatedBooks, setRelatedBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookId, setBookId] = useState<string | null>(null);

  // Get signed URL for image
  const signedUrl = useSignedUrl(book?.image || "");

  // Unwrap params
  useEffect(() => {
    params.then((p) => setBookId(p.id));
  }, [params]);

  // Fetch book details
  useEffect(() => {
    if (!bookId) return;

    const fetchBook = async () => {
      try {
        setLoading(true);

        // Fetch book by ID
        const { data: bookData, error: bookError } = await supabase
          .from("books")
          .select("*")
          .eq("id", parseInt(bookId))
          .single();

        if (bookError || !bookData) {
          console.error("❌ Error fetching book:", bookError);
          setBook(null);
          setLoading(false);
          return;
        }

        console.log("📖 Book found:", bookData);
        setBook(bookData);

        // Fetch related books from same category
        if (bookData.category) {
          const { data: relatedData } = await supabase
            .from("books")
            .select("*")
            .eq("category", bookData.category)
            .neq("id", bookData.id)
            .limit(4);

          setRelatedBooks(relatedData || []);
        }

        setLoading(false);
      } catch (error) {
        console.error("❌ Error loading book:", error);
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-light">Loading book details...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

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
  
  // Use signed URL if available, fallback to public URL
  const displayImage = signedUrl || getSupabaseImageUrl(book.image);

  // Build WhatsApp message with proper encoding
  const whatsappMessage = `Hi! I'm interested in "${book.title}" by ${book.author}. Price: ${priceInNaira}. Can you help me order?`;
  const whatsappUrl = `https://wa.me/08180018752?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-all duration-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Browse
        </Link>
      </div>

      {/* Book Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Book Image */}
          <div className="flex items-start justify-center">
            <div className="relative w-full max-w-sm aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl bg-gray-100">
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt={book.title}
                  fill
                  className="object-cover"
                  crossOrigin="anonymous"
                  priority
                  onError={() => {
                    console.error(`Image failed for "${book.title}"`);
                  }}
                  onLoad={() => {
                    console.log(`Image loaded for "${book.title}"`);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
                  <div className="text-center">
                    <ShoppingCart className="w-16 h-16 text-orange-300 mx-auto mb-2" />
                    <p className="text-orange-600 font-light">Book Cover</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Book Info */}
          <div className="flex flex-col justify-start">
            {/* Category Badge */}
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-50 rounded-full mb-6 w-fit border border-orange-200">
              <span className="text-orange-700 text-sm font-semibold capitalize tracking-wide">
                {book.category || "Uncategorized"}
              </span>
            </div>

            {/* Title and Author */}
            <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight">
              {book.title}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 font-light">
              <span className="text-gray-500">by</span> <span className="font-medium">{book.author}</span>
            </p>

            {/* Price - Large and Prominent */}
            <div className="flex items-baseline gap-3 mb-8 p-4 bg-gradient-to-r from-orange-50 to-transparent rounded-lg border border-orange-200">
              <span className="text-4xl sm:text-5xl font-sans font-bold text-orange-600">
                {priceInNaira}
              </span>
              <span className="text-sm text-gray-600 font-light">Very affordable</span>
            </div>

            {/* Full Description */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-light whitespace-pre-wrap">
                {book.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                Quantity
              </label>
              <div className="flex items-center gap-4 bg-gray-50 w-fit p-3 rounded-lg border border-gray-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-700 hover:bg-white rounded transition-all duration-200 font-semibold"
                >
                  −
                </button>
                <div className="w-12 text-center">
                  <span className="text-lg font-semibold text-gray-900">
                    {quantity}
                  </span>
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-gray-700 hover:bg-white rounded transition-all duration-200 font-semibold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons - Enhanced */}
            <div className="space-y-3 mb-8">
              {/* Add to Cart Button - Primary CTA */}
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  addedToCart
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                    : "bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800"
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-6 h-6" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6" />
                    Add to Cart
                  </>
                )}
              </button>

              {/* WhatsApp Button - Secondary CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 border-2 border-green-500 text-green-700 hover:bg-green-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <MessageCircle className="w-6 h-6" />
                Chat on WhatsApp
              </a>
            </div>

            {/* Trust Badges */}
            <div className="space-y-3 text-sm text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <p className="font-light">Fast & secure checkout via WhatsApp</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <p className="font-light">Carefully curated for your personal growth</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <p className="font-light">From the trusted Tabitha Books collection</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-sans text-3xl sm:text-4xl font-bold text-gray-900 mb-12">
              More{" "}
              <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                {book.category}
              </span>{" "}
              <span className="text-gray-600">Books</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedBooks.map((relatedBook) => (
                <div key={relatedBook.id}>
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
