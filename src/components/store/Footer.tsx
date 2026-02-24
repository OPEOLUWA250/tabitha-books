import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-2">
              ⚡ <span className="text-primary-400">Mashafy</span>
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Premium lifestyle brand for visionaries who live with intention,
              faith, and courage.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link
                  to="/shop?category=tees"
                  className="hover:text-primary-400 transition"
                >
                  Tees
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=journals"
                  className="hover:text-primary-400 transition"
                >
                  Journals
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?featured=true"
                  className="hover:text-primary-400 transition"
                >
                  Featured
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-primary-400 transition">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="/about" className="hover:text-primary-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary-400 transition"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary-400 transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-primary-400 transition"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition">
                <Phone className="w-4 h-4" />
                <a href="tel:+2348180129670">+234 818 012 9670</a>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition">
                <Mail className="w-4 h-4" />
                <a href="mailto:hello@mashafy.com">hello@mashafy.com</a>
              </li>
              <li className="flex items-start space-x-2 text-gray-400">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>&copy; 2026 Mashafy Lifestyle. All rights reserved.</p>
            <p>
              Made with 💖 by{" "}
              <a
                href="https://portfolio-website-tau-one-87.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-400 transition"
              >
                devopeoluwa
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
