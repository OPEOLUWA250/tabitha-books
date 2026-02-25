import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "../../components/store/Navbar";
import { Footer } from "../../components/store/Footer";
import { ProductCard } from "../../components/store/ProductCard";
import type { Product } from "../../types";
import { Filter, X } from "lucide-react";
import { getProducts } from "../../utils/supabase";

export const Shop: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high">(
    "newest",
  );
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await getProducts();
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
            featured: false,
          }));
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

  const filteredAndSortedProducts = useMemo(() => {
    let items = [...products];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query),
      );
    }

    // Filter by category
    if (selectedCategory) {
      items = items.filter((p) => p.category === selectedCategory);
    }

    // Filter by price range
    items = items.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    // Sort
    switch (sortBy) {
      case "price-low":
        items.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        items.sort((a, b) => b.price - a.price);
        break;
      default:
        // Keep original order (newest)
        break;
    }

    return items;
  }, [selectedCategory, sortBy, products, searchQuery, priceRange]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section
        className="w-full pt-32 pb-12 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: "#FF5B00" }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-light text-white mb-2 tracking-tight">
            Shop
          </h1>
          <div className="h-1 w-12 bg-white mb-6"></div>
          <p className="text-sm font-light text-white max-w-3xl tracking-wide">
            Discover curated books across leadership, fiction, and lifestyle
            categories
          </p>
        </div>
      </section>

      {/* Shop Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Filters Sidebar */}
            <div
              className={`${
                showFilters ? "block" : "hidden"
              } lg:block lg:col-span-1 border border-gray-200 p-8 h-fit`}
            >
              <div className="flex justify-between items-center lg:block mb-8 lg:mb-0">
                <h3 className="text-sm font-light tracking-widest text-dark uppercase">
                  Filters
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-dark hover:text-primary-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h4 className="font-light text-xs text-dark mb-4 uppercase tracking-widest">
                  Category
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === null}
                      onChange={() => setSelectedCategory(null)}
                      className="w-4 h-4 text-primary-500 cursor-pointer"
                    />
                    <span className="ml-3 text-xs font-light text-gray-600 group-hover:text-primary-500">
                      All Items
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value="leadership"
                      checked={selectedCategory === "leadership"}
                      onChange={() => setSelectedCategory("leadership")}
                      className="w-4 h-4 text-primary-500 cursor-pointer"
                    />
                    <span className="ml-3 text-xs font-light text-gray-600 group-hover:text-primary-500">
                      Leadership
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value="fiction"
                      checked={selectedCategory === "fiction"}
                      onChange={() => setSelectedCategory("fiction")}
                      className="w-4 h-4 text-primary-500 cursor-pointer"
                    />
                    <span className="ml-3 text-xs font-light text-gray-600 group-hover:text-primary-500">
                      Fiction
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value="lifestyle"
                      checked={selectedCategory === "lifestyle"}
                      onChange={() => setSelectedCategory("lifestyle")}
                      className="w-4 h-4 text-primary-500 cursor-pointer"
                    />
                    <span className="ml-3 text-xs font-light text-gray-600 group-hover:text-primary-500">
                      Lifestyle
                    </span>
                  </label>
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h4 className="font-light text-xs text-dark mb-4 uppercase tracking-widest">
                  Price Range
                </h4>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs font-light text-gray-600">
                    <span>₦{priceRange[0].toLocaleString()}</span>
                    <span>₦{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Sort Filter */}
              <div className="mb-8">
                <h4 className="font-light text-xs text-dark mb-4 uppercase tracking-widest">
                  Sort By
                </h4>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as "newest" | "price-low" | "price-high",
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-200 text-xs font-light focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {/* Clear Filters */}
              {(selectedCategory || priceRange[1] < 1000000) && (
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setPriceRange([0, 1000000]);
                    setSortBy("newest");
                  }}
                  className="w-full px-3 py-2 border border-gray-200 text-primary-500 hover:bg-primary-500 hover:text-white text-xs font-light transition rounded-lg"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden mb-8 flex items-center space-x-2 px-4 py-2 border border-gray-200 text-dark hover:bg-gray-50 transition w-full justify-center text-xs font-light rounded-lg"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>

              {/* Results Count */}
              <div className="mb-8">
                <p className="text-xs font-light text-gray-600 tracking-wide">
                  {filteredAndSortedProducts.length} product
                  {filteredAndSortedProducts.length !== 1 ? "s" : ""}
                </p>
              </div>

              {loading && products.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-100 border border-gray-200 animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {filteredAndSortedProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-xs font-light">
                    No products found in this category.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
