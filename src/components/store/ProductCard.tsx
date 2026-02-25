import React, { useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "../../types";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [showAddedNotif, setShowAddedNotif] = useState(false);
  const [showWishlistNotif, setShowWishlistNotif] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const {
    isInWishlist,
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
  } = useWishlistStore();

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product, 1);
    setShowAddedNotif(true);
    setTimeout(() => setShowAddedNotif(false), 2000);
  };

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      setShowWishlistNotif(false);
    } else {
      addToWishlist(product);
      setShowWishlistNotif(true);
      setTimeout(() => setShowWishlistNotif(false), 2000);
    }
  };

  // Random rating for books (4-5 stars)
  const rating = 4.5 + Math.random() * 0.5;
  const reviews = Math.floor(Math.random() * 300) + 50;

  return (
    <motion.div
      className="group bg-white border border-gray-200 hover:border-primary-500 transition flex flex-col h-full relative"
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(255, 91, 0, 0.1)" }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* Book Cover Image */}
      <motion.div
        className="relative aspect-square bg-gray-100 overflow-hidden"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <motion.img
          src={
            product.image ||
            "https://via.placeholder.com/300x400?text=" + product.name
          }
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        />
        {product.featured && (
          <motion.div
            className="absolute top-4 left-4 text-xs font-light text-primary-500 bg-white px-3 py-1 border border-primary-500"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            FEATURED
          </motion.div>
        )}
        {!product.inStock && (
          <motion.div
            className="absolute inset-0 bg-white/80 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-sm font-light text-dark">Out of Stock</span>
          </motion.div>
        )}
        <motion.button
          onClick={handleWishlist}
          className="absolute top-4 right-4 p-2 bg-white border border-gray-200 hover:border-primary-500 transition"
          whileHover={{ scale: 1.2, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <motion.div
            animate={{
              scale: isWishlisted ? [1, 1.3, 1] : 1,
              rotate: isWishlisted ? [0, 10, 0] : 0,
            }}
            transition={{ duration: 0.4 }}
          >
            <Heart
              className={`w-4 h-4 ${isWishlisted ? "fill-primary-500 text-primary-500" : "text-gray-400"}`}
            />
          </motion.div>
        </motion.button>
        {showWishlistNotif && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-2 text-white text-xs font-light text-center border rounded z-50"
            style={{ backgroundColor: "#FF5B00", borderColor: "#FF5B00" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            ✓ Added to wishlist
          </motion.div>
        )}
      </motion.div>

      {/* Book Info */}
      <motion.div
        className="p-6 flex flex-col flex-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Title */}
        <motion.h3
          className="text-sm font-light text-dark mb-2 line-clamp-2 tracking-wide"
          whileHover={{ color: "#FF5B00" }}
        >
          {product.name}
        </motion.h3>

        {/* Description */}
        <motion.p className="text-xs font-light text-gray-500 mb-3 line-clamp-2">
          {product.description}
        </motion.p>

        {/* Rating */}
        <motion.div
          className="flex items-center gap-2 mb-4 text-xs font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div className="flex">
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                className={
                  i < Math.floor(rating) ? "text-primary-500" : "text-gray-300"
                }
                animate={{
                  scale: i < Math.floor(rating) ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                ★
              </motion.span>
            ))}
          </motion.div>
          <span className="text-gray-600">({reviews})</span>
        </motion.div>

        {/* Price and Button */}
        <motion.div
          className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.span
            className="text-lg font-light text-primary-500"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ₦{product.price.toLocaleString()}
          </motion.span>
          <motion.button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`p-2 ml-auto transition ${
              product.inStock
                ? "border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white"
                : "border border-gray-200 text-gray-300 cursor-not-allowed"
            }`}
            whileHover={product.inStock ? { scale: 1.15 } : {}}
            whileTap={product.inStock ? { scale: 0.85 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ShoppingCart className="w-4 h-4" />
            </motion.div>
          </motion.button>
        </motion.div>

        {showAddedNotif && (
          <motion.div
            className="mt-2 p-2 bg-green-50 text-green-700 text-xs font-light text-center border border-green-200"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            ✓ Added to cart
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};
