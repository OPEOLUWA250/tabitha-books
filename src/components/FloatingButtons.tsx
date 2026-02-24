import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export const FloatingButtons: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWhatsApp = () => {
    window.open("https://wa.me/2348027842294", "_blank");
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-4">
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={handleBackToTop}
          className="flex items-center justify-center w-14 h-14 bg-gray-700 hover:bg-gray-800 text-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
          aria-label="Back to top"
        >
          <ArrowUp size={24} />
        </button>
      )}

      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsApp}
        className="flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
        aria-label="Contact via WhatsApp"
      >
        <FontAwesomeIcon icon={faWhatsapp} size="xl" />
      </button>
    </div>
  );
};
