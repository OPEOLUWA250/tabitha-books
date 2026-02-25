import React from "react";
import { Link } from "react-router-dom";
import { Trash2, ArrowRight } from "lucide-react";
import { Navbar } from "../../components/store/Navbar";
import { Footer } from "../../components/store/Footer";
import { ProductCard } from "../../components/store/ProductCard";
import { useWishlistStore } from "../../store/wishlistStore";

export const Wishlist: React.FC = () => {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-light text-dark mb-2 tracking-tight">
              My Wishlist
            </h1>
            <div className="h-1 w-12 bg-primary-500"></div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 font-light text-lg mb-8">
                Your wishlist is empty
              </p>
              <Link
                to="/shop"
                className="inline-block px-8 py-3 bg-primary-500 text-white font-light tracking-wide hover:opacity-90 transition text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8 text-sm font-light text-gray-600">
                {items.length} book{items.length !== 1 ? "s" : ""} in wishlist
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {items.map((product) => (
                  <div key={product.id} className="relative">
                    <ProductCard product={product} />
                    <button
                      onClick={() => removeItem(product.id)}
                      className="absolute top-4 right-4 p-2 bg-white border border-gray-200 hover:border-red-500 transition z-10"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-8">
                <div className="flex gap-4 justify-center">
                  <Link
                    to="/shop"
                    className="px-8 py-3 border-2 border-primary-500 text-primary-500 font-light tracking-wide hover:bg-primary-500 hover:text-white transition text-sm"
                  >
                    Continue Shopping
                  </Link>
                  <button
                    onClick={() => {
                      items.forEach((item) => {
                        addToCart(item, 1);
                      });
                      useWishlistStore.setState({ items: [] });
                    }}
                    className="px-8 py-3 bg-primary-500 text-white font-light tracking-wide hover:opacity-90 transition text-sm flex items-center gap-2"
                  >
                    Add All to Cart
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};
