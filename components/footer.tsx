"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* WhatsApp Button - Bottom */}
      <a
        href="https://wa.me/08180018752"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40 animate-fade-in flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
      </a>

      {/* Back to Top Button - Above WhatsApp */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-24 right-8 w-12 h-12 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40 animate-fade-in flex items-center justify-center"
        aria-label="Back to top"
      >
        <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" />
      </button>

      <footer className="bg-black border-t border-gray-800 mt-0 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand */}
            <div className="animate-fade-in-up animation-delay-100">
              <div className="text-2xl font-sans font-bold text-orange-600 mb-4 hover:animate-bounce-soft transition-all duration-300">
                Tabitha Books
              </div>
              <p className="text-gray-300 text-sm leading-relaxed font-light">
                Curated books for the mindful reader. Discover stories that
                transform, inspire, and empower your journey.
              </p>
            </div>

            {/* Quick Links */}
            <div className="animate-fade-in-up animation-delay-200">
              <h3 className="font-sans font-semibold text-white mb-6 text-lg">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/browse"
                    className="text-gray-400 hover:text-orange-600 transition-all duration-300 text-sm font-light relative group"
                  >
                    Browse Books
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/browse"
                    className="text-gray-400 hover:text-orange-600 transition-all duration-300 text-sm font-light relative group"
                  >
                    All Categories
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cart"
                    className="text-gray-400 hover:text-orange-600 transition-all duration-300 text-sm font-light relative group"
                  >
                    Shopping Cart
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="animate-fade-in-up animation-delay-300">
              <h3 className="font-sans font-semibold text-white mb-6 text-lg">
                Get in Touch
              </h3>
              <p className="text-gray-400 text-sm mb-6 font-light leading-relaxed">
                Order via WhatsApp for seamless checkout and personalized
                service.
              </p>
              <a
                href="https://wa.me/08180018752"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm font-light hover-glow"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 animate-fade-in-up animation-delay-400">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-xs sm:text-sm font-light text-center sm:text-left">
                &copy; {currentYear} Tabitha Books. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs font-light italic text-center sm:text-right">
                Curating stories for the mindful soul.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
