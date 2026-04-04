"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "@/hooks/use-cart";
import { useSignedUrl } from "@/hooks/use-signed-url";
import { getSupabaseImageUrl } from "@/lib/image-utils";

interface BookCardProps {
  id: number;
  title: string;
  author: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export function BookCard({
  id,
  title,
  author,
  price,
  image,
  category,
  description,
}: BookCardProps) {
  const { addItem } = useCart();

  // Generate signed URL automatically - use immediate fallback
  const signedUrl = useSignedUrl(image);
  
  // Use fallback immediately while signed URL is being generated
  const fallbackUrl = getSupabaseImageUrl(image);
  const displayImage = signedUrl || fallbackUrl;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id,
      title,
      author,
      price,
      image,
    });
  };

  const priceInNaira = `₦${price.toLocaleString()}`;

  return (
    <Link href={`/book/${id}`}>
      <div className="group cursor-pointer h-full flex flex-col bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 hover-lift">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-orange-50 aspect-3/4 h-48 sm:h-64 md:h-80">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300 animate-scale-in"
              crossOrigin="anonymous"
              priority={false}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => {
                console.warn(`⚠️ Image failed to load for "${title}"`);
              }}
              onLoad={() => {
                console.log(`✅ Image loaded for "${title}"`);
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full bg-linear-to-br from-orange-100 to-orange-50">
              <FontAwesomeIcon
                icon={faBook}
                className="w-12 h-12 text-orange-400 mb-2"
              />
              <p className="text-sm text-orange-600 font-light">No Image</p>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category Badge */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 px-2 sm:px-3 py-1 bg-orange-600 text-white text-xs font-semibold rounded-full capitalize animate-slide-in-right">
            {category}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col">
          <div className="mb-2">
            <p className="text-xs text-gray-500 font-medium mb-1 animate-fade-in animation-delay-100 truncate">
              {author}
            </p>
            <h3 className="font-sans font-bold text-gray-900 line-clamp-2 text-sm sm:text-base animate-fade-in-up animation-delay-200">
              {title}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3 sm:mb-4 flex-1 animate-fade-in-up animation-delay-300">
            {description}
          </p>

          {/* Footer with Price and Button */}
          <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4 border-t border-gray-200 animate-fade-in-up animation-delay-400 gap-2">
            <div className="text-base sm:text-lg font-sans font-bold text-orange-600">
              {priceInNaira}
            </div>
            <button
              onClick={handleAddToCart}
              className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-300 hover:scale hover-glow shrink-0"
              aria-label={`Add ${title} to cart`}
            >
              <ShoppingCart className="w-4 sm:w-5 h-4 sm:h-5 animate-bounce-soft" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
