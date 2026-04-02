"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useCart } from "@/hooks/use-cart";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useState, useMemo } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCart();
  const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false);

  const totalPrice = getTotalPrice();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Generate WhatsApp message
  const generateWhatsAppMessage = () => {
    const message = items
      .map(
        (item) =>
          `📚 ${item.title} by ${item.author}\n   Qty: ${item.quantity} x ₦${item.price.toLocaleString()}`,
      )
      .join("\n\n");

    const total = `\nTotal: ₦${totalPrice.toLocaleString()}`;
    const fullMessage = `Hi! I'd like to order the following books:\n\n${message}${total}\n\nPlease confirm availability and arrange delivery.`;

    return encodeURIComponent(fullMessage);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <Header />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6 animate-bounce-soft">
              <ShoppingBag className="w-10 h-10 text-orange-600" />
            </div>
            <h1 className="font-sans text-3xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              Your cart is empty
            </h1>
            <p className="text-gray-600 text-lg mb-8 font-light animate-fade-in-up animation-delay-100">
              Discover your next favorite book from our curated collection.
            </p>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-all duration-300 hover-lift animate-fade-in-up animation-delay-200"
            >
              Continue Shopping
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up">
        <h1 className="font-sans text-4xl font-bold text-gray-900 mb-12">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex gap-6 pb-6 border-b border-gray-200 last:border-b-0 animate-fade-in-up hover-lift transition-all duration-300"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Image */}
                  <div className="relative w-20 h-28 sm:w-24 sm:h-32 shrink-0 overflow-hidden rounded-lg hover-scale">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <Link
                        href={`/book/${item.id}`}
                        className="block font-sans font-bold text-gray-900 hover:text-orange-600 transition-all duration-300 mb-1 line-clamp-2 text-sm sm:text-base"
                      >
                        {item.title}
                      </Link>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 truncate font-light">
                        by {item.author}
                      </p>
                      <p className="text-base sm:text-lg font-sans font-bold text-orange-600">
                        ₦{item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1),
                            )
                          }
                          className="p-1 sm:p-2 hover:bg-gray-100 transition-all duration-300 hover-scale"
                        >
                          <Minus className="w-3 sm:w-4 h-3 sm:h-4 text-gray-600" />
                        </button>
                        <span className="w-6 sm:w-8 text-center font-semibold text-sm sm:text-base">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1 sm:p-2 hover:bg-gray-100 transition-all duration-300 hover-scale"
                        >
                          <Plus className="w-3 sm:w-4 h-3 sm:h-4 text-gray-600" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 hover-scale shrink-0"
                      >
                        <Trash2 className="w-4 sm:w-5 h-4 sm:h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="text-right font-semibold text-gray-900 text-sm sm:text-base whitespace-nowrap ml-2">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mt-8 transition-all duration-300 hover-scale"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-orange-50 rounded-lg p-8 border border-orange-200 animate-fade-in-right hover-lift">
              <h2 className="font-sans text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-orange-200">
                <div className="flex justify-between text-gray-700 font-light">
                  <span>Subtotal</span>
                  <span>₦{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700 font-light">
                  <span>Items</span>
                  <span>{totalItems}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="font-sans font-bold text-gray-900 text-lg">
                  Total
                </span>
                <span className="font-sans text-3xl font-bold text-orange-600">
                  ₦{totalPrice.toLocaleString()}
                </span>
              </div>

              {/* Checkout Button */}
              <a
                href={`https://wa.me/08180018752?text=${generateWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 text-center block mb-4 hover-lift hover-glow"
              >
                Checkout via WhatsApp
              </a>

              <p className="text-sm text-gray-600 text-center font-light">
                Your order details will be sent to WhatsApp for confirmation and
                delivery arrangements.
              </p>

              {/* Info Box */}
              <div className="mt-8 pt-6 border-t border-orange-200 space-y-3 text-sm text-gray-700 font-light">
                <div className="flex gap-2">
                  <span className="text-orange-600 font-bold">✓</span>
                  <span>Secure checkout via WhatsApp</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-orange-600 font-bold">✓</span>
                  <span>Fast order confirmation</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-orange-600 font-bold">✓</span>
                  <span>Reliable delivery service</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
