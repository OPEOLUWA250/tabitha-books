import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/store/Navbar";
import { Footer } from "../../components/store/Footer";
import { useCartStore } from "../../store/cartStore";
import { Trash2, Plus, Minus, ArrowLeft, X } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { openWhatsAppCheckout } from "../../utils/whatsapp";

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
}

export const Cart: React.FC = () => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const totalPrice = getTotalPrice();
  const finalTotal = totalPrice;

  const validateForm = () => {
    const newErrors: Partial<CustomerInfo> = {};
    if (!customerInfo.name.trim()) newErrors.name = "Name is required";
    if (!customerInfo.phone.trim())
      newErrors.phone = "Phone number is required";
    if (!customerInfo.address.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWhatsAppCheckout = () => {
    if (!validateForm()) return;

    setIsCheckingOut(true);
    openWhatsAppCheckout(items, finalTotal, customerInfo);
    setTimeout(() => {
      clearCart();
      setShowCheckoutForm(false);
      setCustomerInfo({ name: "", phone: "", address: "" });
      setIsCheckingOut(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 border-b-4 border-primary-500">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-light text-dark mb-2 tracking-tight">
            Cart
          </h1>
          <div className="w-12 h-1 bg-primary-500 mb-0"></div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-light text-dark mb-4 tracking-tight">
                Your cart is empty
              </h2>
              <p className="text-sm font-light text-gray-600 mb-8 tracking-wide">
                Add some items to get started
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center px-6 py-2 bg-primary-500 text-white font-light text-xs hover:bg-primary-600 transition"
              >
                <ArrowLeft className="w-3 h-3 mr-2" />
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 border border-gray-200 hover:border-primary-500 transition bg-white"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <h3 className="font-light text-dark text-sm mb-1">
                          {item.name}
                        </h3>
                        <p className="text-xs font-light text-gray-600 mb-3">
                          {item.description}
                        </p>

                        {/* Size and Color */}
                        <div className="flex gap-4 text-xs font-light text-gray-600 mb-3 tracking-wide">
                          {item.selectedSize && (
                            <span>Size: {item.selectedSize}</span>
                          )}
                          {item.selectedColor && (
                            <div className="flex items-center gap-1">
                              <span>Color:</span>
                              <div
                                className="w-3 h-3 border border-gray-300"
                                style={{ backgroundColor: item.selectedColor }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <p className="font-light text-sm text-primary-500">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      {/* Quantity and Remove */}
                      <div className="flex flex-col items-end gap-4">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-gray-400 hover:text-primary-500 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="flex items-center border border-gray-200 bg-white">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1),
                              )
                            }
                            className="p-1 bg-white transition border-r border-gray-200 rounded-l-lg"
                            style={{ color: "#1a1a1a" }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#FF5B00";
                              e.currentTarget.style.color = "white";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "white";
                              e.currentTarget.style.color = "#1a1a1a";
                            }}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 font-light text-xs text-dark">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 bg-white transition border-l border-gray-200 rounded-r-lg"
                            style={{ color: "#1a1a1a" }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#FF5B00";
                              e.currentTarget.style.color = "white";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "white";
                              e.currentTarget.style.color = "#1a1a1a";
                            }}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="h-fit">
                <div className="border border-gray-200 p-8 space-y-6">
                  <h2 className="text-sm font-light tracking-widest text-dark uppercase">
                    Order Summary
                  </h2>

                  <div className="space-y-3 border-b border-gray-200 pb-6">
                    <div className="flex justify-between text-xs font-light text-gray-600">
                      <span>Subtotal</span>
                      <span>₦{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-primary-500 font-light text-sm pt-2">
                    <span>Total</span>
                    <span>₦{finalTotal.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => setShowCheckoutForm(true)}
                    disabled={isCheckingOut}
                    className="w-full py-4 text-white font-light text-xs transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-widest rounded-lg"
                    style={{ backgroundColor: "#FF5B00" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.opacity = "0.9")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    <FontAwesomeIcon icon={faWhatsapp} />
                    {isCheckingOut ? "Processing..." : "Order via WhatsApp"}
                  </button>

                  <Link
                    to="/shop"
                    className="block w-full py-4 font-light text-xs text-center uppercase tracking-widest rounded-lg"
                    style={{
                      borderColor: "#FF5B00",
                      color: "#1a1a1a",
                      border: "2px solid #FF5B00",
                    }}
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Checkout Modal */}
      {showCheckoutForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-8 space-y-6 border border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-light text-dark tracking-tight">
                Checkout Details
              </h2>
              <button
                onClick={() => setShowCheckoutForm(false)}
                className="p-2 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-light text-gray-600 mb-2 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, name: e.target.value })
                  }
                  className={`w-full px-4 py-2 border font-light text-sm focus:outline-none transition ${
                    errors.name
                      ? "border-red-500"
                      : "border-gray-300 focus:border-primary-500"
                  }`}
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-light text-gray-600 mb-2 uppercase tracking-wide">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, phone: e.target.value })
                  }
                  className={`w-full px-4 py-2 border font-light text-sm focus:outline-none transition ${
                    errors.phone
                      ? "border-red-500"
                      : "border-gray-300 focus:border-primary-500"
                  }`}
                  placeholder="e.g., +234 800 000 0000"
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-light text-gray-600 mb-2 uppercase tracking-wide">
                  Delivery Address
                </label>
                <textarea
                  value={customerInfo.address}
                  onChange={(e) =>
                    setCustomerInfo({
                      ...customerInfo,
                      address: e.target.value,
                    })
                  }
                  rows={3}
                  className={`w-full px-4 py-2 border font-light text-sm focus:outline-none transition resize-none ${
                    errors.address
                      ? "border-red-500"
                      : "border-gray-300 focus:border-primary-500"
                  }`}
                  placeholder="Your full delivery address"
                />
                {errors.address && (
                  <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-3">
              <button
                onClick={handleWhatsAppCheckout}
                disabled={isCheckingOut}
                className="w-full py-3 text-white font-light text-xs transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-widest rounded-lg"
                style={{ backgroundColor: "#FF5B00" }}
              >
                <FontAwesomeIcon icon={faWhatsapp} />
                {isCheckingOut ? "Processing..." : "Confirm Order"}
              </button>
              <button
                onClick={() => setShowCheckoutForm(false)}
                className="w-full py-3 border-2 font-light text-xs transition uppercase tracking-widest rounded-lg"
                style={{
                  borderColor: "#FF5B00",
                  color: "#1a1a1a",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
