"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, X, Loader, Trash2 } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface Category {
  id: number;
  name: string;
  created_at?: string;
}

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const { data, error: fetchError } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (fetchError) {
        console.error("Supabase fetch error:", fetchError);
        // Table doesn't exist yet
        if (
          fetchError.code === "PGRST116" ||
          fetchError.message.includes("does not exist")
        ) {
          setError(
            "⚠️ Categories table not found. Please run the Supabase setup SQL first. See SUPABASE_SETUP.sql in the project root.",
          );
          setCategories([]);
        } else if (fetchError.message.includes("permission")) {
          setError("❌ Permission denied. Check your Supabase RLS policies.");
          setCategories([]);
        } else {
          setError(`Error loading categories: ${fetchError.message}`);
          setCategories([]);
        }
      } else {
        setCategories(data || []);
        if (data && data.length === 0) {
          setError("ℹ️ No categories found. Add one below to get started!");
        }
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError(
        `Error: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCategoryName.trim()) {
      setError("Category name is required");
      return;
    }

    // Check for duplicates
    if (
      categories.some(
        (cat) => cat.name.toLowerCase() === newCategoryName.toLowerCase(),
      )
    ) {
      setError("Category already exists");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const { data, error: insertError } = await supabase
        .from("categories")
        .insert([{ name: newCategoryName.trim() }])
        .select();

      if (insertError) {
        console.error("Insert error:", insertError);

        if (insertError.message.includes("does not exist")) {
          setError(
            "❌ Categories table not found in Supabase. Please run the SQL setup from SUPABASE_SETUP.sql first.",
          );
        } else if (insertError.message.includes("permission")) {
          setError("❌ Permission denied. Check your RLS policies.");
        } else if (insertError.message.includes("duplicate")) {
          setError("This category already exists");
        } else {
          setError(`Error: ${insertError.message}`);
        }
        throw insertError;
      }

      setSuccess("✅ Category added successfully");
      setNewCategoryName("");
      setCategories([...categories, data[0]]);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to add category";
      console.error("Add category error:", err);
      // Error already set above in insertError handling
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${name}"? Books with this category will need to be updated.`,
      )
    ) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      setSuccess("Category deleted successfully");
      setCategories(categories.filter((cat) => cat.id !== id));

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to delete category";
      setError(errorMsg);
      console.error("Delete category error:", err);
    }
  };

  return (
    <div className="space-y-6 bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-900">Category Management</h3>
        <p className="text-sm text-gray-600 font-light">
          Manage book categories used across the store
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded-lg text-red-800 font-light text-sm flex justify-between items-start gap-3">
          <span className="flex-1">{error}</span>
          <button onClick={() => setError("")} className="shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border-l-4 border-green-600 rounded-lg text-green-800 font-light text-sm flex justify-between items-start gap-3">
          <span className="flex-1">{success}</span>
          <button onClick={() => setSuccess("")} className="shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Add Category Form */}
      <div className="bg-linear-to-br from-orange-50 to-white border border-orange-200 rounded-lg p-4 space-y-3">
        <label className="block text-sm font-semibold text-gray-900">
          Add New Category
        </label>
        <form onSubmit={handleAddCategory} className="flex gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Enter category name (e.g., Science, Romance)..."
            className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm font-light transition-all"
            disabled={submitting}
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-lg transition-all flex items-center gap-2 font-light text-sm"
          >
            {submitting ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Add
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-900">
          Existing Categories ({categories.length})
        </label>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-6 h-6 text-orange-600 animate-spin" />
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all group"
              >
                <span className="text-sm font-light text-gray-900 capitalize truncate">
                  {category.name}
                </span>
                <button
                  onClick={() =>
                    handleDeleteCategory(category.id, category.name)
                  }
                  className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete category"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm font-light">
              No categories yet. Add one to get started!
            </p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 font-light">
        💡{" "}
        <span className="ml-2">
          Categories can be used when creating or editing books. Delete a
          category only if no books are using it.
        </span>
      </div>
    </div>
  );
}
