import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Menu,
  X,
  User,
  LogOut,
  Search,
  Heart,
} from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";

interface NavbarProps {
  isAdmin?: boolean;
  onSearch?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAdmin = false,
  onSearch,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartItems = useCartStore((state) => state.getTotalItems());
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      onSearch?.(searchQuery);
      setSearchQuery("");
    }
  };

  return (
    <nav className="fixed w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to={isAdmin ? "/admin" : "/"}
            className="flex items-center space-x-3 group"
          >
            <span className="text-2xl">📚</span>
            <span className="text-lg font-light tracking-widest text-dark group-hover:text-primary-500 transition">
              TABITHA
            </span>
            <div className="h-5 w-0.5 bg-primary-500"></div>
          </Link>

          {/* Desktop Menu - Hidden for Admin */}
          {!isAdmin && (
            <div className="hidden md:flex items-center space-x-12">
              <Link
                to="/"
                className="text-dark font-light tracking-wide hover:text-primary-500 transition text-sm"
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="text-dark font-light tracking-wide hover:text-primary-500 transition text-sm"
              >
                Shop
              </Link>
              <Link
                to="/about"
                className="text-dark font-light tracking-wide hover:text-primary-500 transition text-sm"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-dark font-light tracking-wide hover:text-primary-500 transition text-sm"
              >
                Contact
              </Link>
            </div>
          )}

          {/* Search Bar - Hidden for Admin */}
          {!isAdmin && (
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center"
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books..."
                  className="px-4 py-2 border border-gray-300 text-sm font-light focus:outline-none focus:border-primary-500 transition"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500 transition"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAdmin && (
              <>
                <Link
                  to="/wishlist"
                  className="text-dark hover:text-primary-500 transition"
                >
                  <Heart className="w-5 h-5" />
                </Link>
                <Link to="/cart" className="relative inline-flex items-center">
                  <ShoppingBag className="w-5 h-5 text-dark hover:text-primary-500 transition" />
                  {cartItems > 0 && (
                    <span
                      className="absolute -top-2 -right-2 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-lg animate-pulse z-50 flex-shrink-0 leading-none"
                      style={{
                        backgroundColor: "#FF5B00",
                        fontSize: "9px",
                        lineHeight: "1",
                      }}
                    >
                      {cartItems > 9 ? "9+" : cartItems}
                    </span>
                  )}
                </Link>
              </>
            )}
            <Link
              to={isAdmin ? "/" : "/admin"}
              className="text-dark hover:text-primary-500 transition"
            >
              {isAdmin ? (
                <LogOut className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {!isAdmin && (
              <>
                <Link to="/wishlist" className="inline-flex items-center">
                  <Heart className="w-5 h-5 text-dark" />
                </Link>
                <Link to="/cart" className="relative inline-flex items-center">
                  <ShoppingBag className="w-5 h-5 text-dark" />
                  {cartItems > 0 && (
                    <span
                      className="absolute -top-2 -right-2 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-lg animate-pulse z-50 flex-shrink-0 leading-none"
                      style={{
                        backgroundColor: "#FF5B00",
                        fontSize: "9px",
                        lineHeight: "1",
                      }}
                    >
                      {cartItems > 9 ? "9+" : cartItems}
                    </span>
                  )}
                </Link>
              </>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-dark hover:text-primary-500 transition"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && !isAdmin && (
          <div
            className="md:hidden pb-4 space-y-3 border-t border-gray-200 pt-4"
            style={{ backgroundColor: "#FF5B00" }}
          >
            <Link
              to="/"
              className="block text-white font-light tracking-wide hover:opacity-80 py-2 text-sm"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="block text-white font-light tracking-wide hover:opacity-80 py-2 text-sm"
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="block text-white font-light tracking-wide hover:opacity-80 py-2 text-sm"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block text-white font-light tracking-wide hover:opacity-80 py-2 text-sm"
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
