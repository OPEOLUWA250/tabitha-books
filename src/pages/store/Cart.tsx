import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/store/Navbar";
import { Footer } from "../../components/store/Footer";
import { useCartStore } from "../../store/cartStore";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { openWhatsAppCheckout } from "../../utils/whatsapp";

export const Cart: React.FC = () => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const totalPrice = getTotalPrice();
  const finalTotal = totalPrice;

  const handleWhatsAppCheckout = () => {
    setIsCheckingOut(true);
    openWhatsAppCheckout(items, finalTotal);
    setTimeout(() => {
      clearCart();
      setIsCheckingOut(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-beige-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900">Shopping Cart</h1>
        </div>
      </section>

      {/* Cart Content */}
      <section className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Add some items to get started
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 border border-beige-200 rounded-lg hover:shadow-md transition bg-white"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-beige-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {item.description}
                        </p>

                        {/* Size and Color */}
                        <div className="flex gap-4 text-sm text-gray-600 mb-3">
                          {item.selectedSize && (
                            <span>Size: {item.selectedSize}</span>
                          )}
                          {item.selectedColor && (
                            <div className="flex items-center gap-1">
                              <span>Color:</span>
                              <div
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: item.selectedColor }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <p className="font-bold text-lg text-gray-900">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      {/* Quantity and Remove */}
                      <div className="flex flex-col items-end gap-4">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-red-600 bg-transparent border border-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>

                        <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1),
                              )
                            }
                            className="p-2 bg-white hover:bg-gray-100 transition text-gray-600 border-r border-gray-300"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-2 bg-white hover:bg-gray-100 transition text-gray-600 border-l border-gray-300"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="h-fit">
                <div className="bg-beige-50 border border-beige-200 rounded-lg p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-3 border-b border-beige-200 pb-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₦{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-2xl font-bold text-gray-900 pt-4">
                    <span>Total</span>
                    <span>₦{finalTotal.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={handleWhatsAppCheckout}
                    disabled={isCheckingOut}
                    className="w-full py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} />
                    {isCheckingOut
                      ? "Opening WhatsApp..."
                      : "Order via WhatsApp"}
                  </button>

                  <Link
                    to="/shop"
                    className="block w-full py-3 border-2 border-gray-300 text-gray-900 font-bold rounded-lg hover:border-primary-600 hover:text-primary-600 transition text-center"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};
