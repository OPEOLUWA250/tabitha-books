"use client";

import { useState, useEffect } from "react";
import { LoginForm, AdminNav } from "@/components/admin-auth";
import { BookManagement } from "@/components/admin-book-management";
import { CategoryManagement } from "@/components/admin-category-management";

const ADMIN_PASSWORD = "tabitha123"; // Change this to a strong password!

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"books" | "categories">("books");

  useEffect(() => {
    // Check if user is already authenticated (stored in localStorage)
    const auth =
      typeof window !== "undefined" ? localStorage.getItem("admin_auth") : null;
    setIsAuthenticated(auth === "true");
    setIsLoading(false);
  }, []);

  const handleLogin = (password: string) => {
    setLoginLoading(true);
    // Simulate a small delay for better UX
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem("admin_auth", "true");
        setIsAuthenticated(true);
      } else {
        alert("Invalid password");
      }
      setLoginLoading(false);
    }, 500);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-white via-orange-50 to-white flex items-center justify-center">
        <div className="text-gray-600 font-light">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} isLoading={loginLoading} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-300">
          <button
            onClick={() => setActiveTab("books")}
            className={`px-4 py-3 font-light text-sm sm:text-base transition-all relative ${
              activeTab === "books"
                ? "text-orange-600 font-semibold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            📚 Books Management
            {activeTab === "books" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-3 font-light text-sm sm:text-base transition-all relative ${
              activeTab === "categories"
                ? "text-orange-600 font-semibold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            🏷️ Categories
            {activeTab === "categories" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === "books" && <BookManagement />}
          {activeTab === "categories" && <CategoryManagement />}
        </div>
      </main>
    </div>
  );
}
