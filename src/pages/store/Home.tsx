import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Navbar } from "../../components/store/Navbar";
import { Footer } from "../../components/store/Footer";
import { ProductCard } from "../../components/store/ProductCard";
import type { Product } from "../../types";
import { ArrowRight, Zap, Shield, Heart } from "lucide-react";
import { getProducts } from "../../utils/supabase";

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await getProducts();
        console.log("Fetched products:", data);
        if (data && Array.isArray(data) && data.length > 0) {
          const mapped = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            description: p.name,
            price: p.price,
            category: p.category,
            image: p.image_url,
            sizes: ["XS", "S", "M", "L", "XL", "XXL"],
            colors: ["#000000", "#FFFFFF"],
            inStock: (p.stock || 0) > 0,
            featured: true,
          }));
          console.log("Mapped products:", mapped);
          setProducts(mapped);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        {/* Animated bar */}
        <motion.div
          className="absolute left-0 top-32 w-1 bg-primary-500"
          initial={{ height: 0 }}
          animate={{ height: "10rem" }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Floating circles background */}
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          {/* Animated heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-heading text-5xl md:text-7xl font-light text-dark leading-tight tracking-tight">
              <motion.div
                className="inline-block"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Curated books for the
              </motion.div>
              <motion.span
                className="block hero-accent text-primary-500 font-light"
                animate={{
                  textShadow: [
                    "0px 0px 0px rgba(255, 91, 0, 0)",
                    "0px 0px 30px rgba(255, 91, 0, 0.5)",
                    "0px 0px 0px rgba(255, 91, 0, 0)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                mindful reader
              </motion.span>
            </h1>
          </motion.div>

          {/* Animated paragraph */}
          <motion.p
            className="text-lg font-light text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover stories that transform, inspire, and empower. Leadership,
            fiction, and lifestyle books—carefully selected for your journey.
          </motion.p>

          {/* Animated buttons container */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link
                to="/shop"
                className="px-8 py-3 font-light tracking-wide transition text-sm cursor-pointer group flex items-center justify-center gap-2 relative overflow-hidden"
                style={{
                  backgroundColor: "#FF5B00",
                  color: "white",
                  borderColor: "#FF5B00",
                  border: "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                  e.currentTarget.style.color = "#FF5B00";
                  e.currentTarget.style.border = "2px solid #FF5B00";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FF5B00";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.border = "2px solid transparent";
                }}
              >
                Explore Collection
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link
                to="/about"
                className="px-8 py-3 font-light tracking-wide transition text-sm cursor-pointer flex items-center justify-center gap-2"
                style={{
                  backgroundColor: "#FFFFFF",
                  color: "#FF5B00",
                  border: "2px solid #FF5B00",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#FF5B00";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                  e.currentTarget.style.color = "#FF5B00";
                }}
              >
                Our Story
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section
        className="w-full py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{ backgroundColor: "#FF5B00" }}
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-4xl font-light text-white text-center mb-4 tracking-tight"
              animate={{ scale: [1, 1.01, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Featured Products
            </motion.h2>
            <motion.div
              className="h-1 w-12 bg-white mx-auto"
              animate={{ width: [48, 60, 48] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2,
                },
              },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {loading && products.length === 0
              ? [1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="aspect-square bg-white/20 animate-pulse rounded"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  />
                ))
              : products.slice(0, 4).map((product, index) => (
                  <motion.div
                    key={product.id}
                    className="w-full"
                    variants={{
                      hidden: { opacity: 0, y: 20, scale: 0.8 },
                      show: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          type: "spring",
                          stiffness: 200,
                          damping: 20,
                        },
                      },
                    }}
                    whileHover={{
                      scale: 1.08,
                      y: -10,
                      transition: { type: "spring", stiffness: 300 },
                    }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
          </motion.div>

          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/shop"
                className="inline-block px-8 py-3 border-2 border-white text-white font-light tracking-wide hover:bg-white hover:text-black transition text-sm"
              >
                View All Books
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="hidden py-24 px-4 sm:px-6 lg:px-8 bg-white border-t-4 border-primary-500">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-light text-dark mb-2 tracking-tight">
            Join Our Readers' Circle
          </h2>
          <div className="h-1 w-12 bg-primary-500 mx-auto mb-6"></div>
          <p className="text-gray-600 font-light mb-8">
            Get curated book recommendations directly to your inbox
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 border border-gray-300 font-light text-sm focus:outline-none focus:border-primary-500 transition"
            />
            <button className="px-6 py-3 bg-primary-500 text-white font-light tracking-wide hover:bg-primary-600 transition text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
