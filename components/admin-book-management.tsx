"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, X, Loader } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";
import {
  getSupabaseImageUrl,
  constructSupabasePublicUrl,
  getSignedSupabaseUrl,
} from "@/lib/image-utils";
import Image from "next/image";

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  category: string;
  description: string;
  image: string;
  featured: boolean;
}

interface Category {
  id: number;
  name: string;
}

interface FormData extends Omit<Book, "id"> {}

export function BookManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [signedUrls, setSignedUrls] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    author: "",
    price: 0,
    category: "",
    description: "",
    image: "",
    featured: false,
  });

  useEffect(() => {
    fetchCategories();
    fetchBooks();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const { data, error: fetchError } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (fetchError) {
        console.error("Supabase fetch categories error:", fetchError);
        if (
          fetchError.code === "PGRST116" ||
          fetchError.message.includes("does not exist")
        ) {
          console.log(
            "⚠️ Categories table not found. Please run SUPABASE_SETUP.sql",
          );
          setCategories([]);
        } else {
          console.error("Error fetching categories:", fetchError.message);
          setCategories([]);
        }
      } else {
        setCategories(data || []);
        // Set default category to first available category
        if (data && data.length > 0 && !formData.category) {
          setFormData((prev) => ({ ...prev, category: data[0].name }));
        }
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const generateSignedUrls = async (booksToSign: Book[]) => {
    const urls: Record<number, string> = {};

    for (const book of booksToSign) {
      if (book.image && book.id) {
        try {
          console.log(
            `🔄 Generating signed URL for book ${book.id}: ${book.image.substring(0, 80)}...`,
          );
          const signedUrl = await getSignedSupabaseUrl(book.image);
          if (signedUrl) {
            urls[book.id] = signedUrl;
            console.log(
              `✅ Signed URL stored for book ${book.id}:`,
              signedUrl.substring(0, 100) + "...",
            );
          } else {
            console.warn(
              `⚠️ getSignedSupabaseUrl returned null for book ${book.id}`,
            );
          }
        } catch (err) {
          console.error(
            `❌ Failed to generate signed URL for book ${book.id}:`,
            err,
          );
        }
      }
    }

    console.log(
      `📦 Final signedUrls object:`,
      Object.keys(urls).length,
      "URLs generated",
    );
    setSignedUrls(urls);
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("books")
        .select("*")
        .order("id", { ascending: false });

      if (fetchError) throw fetchError;

      // Log books for debugging
      if (data) {
        data.forEach((book) => {
          console.log(`Book: ${book.title}, Image URL: ${book.image}`);
        });
        setBooks(data);

        // Generate signed URLs for all images
        await generateSignedUrls(data);
      } else {
        setBooks([]);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to fetch books";
      console.error(`Fetch error: ${errorMsg}`);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? parseFloat(value)
            : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setError("");
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      const fileName = `${Date.now()}-${file.name}`;
      const storagePath = `images/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from("books")
        .upload(storagePath, file);

      if (uploadError) throw uploadError;

      // Store just the path, not the full URL
      // Signed URLs will be generated when needed
      console.log(
        `Image uploaded successfully to storage path: ${storagePath}`,
      );

      return storagePath;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to upload image";
      console.error(`Image upload error: ${errorMsg}`);
      throw new Error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate required fields
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!formData.author.trim()) {
      setError("Author is required");
      return;
    }
    if (formData.price <= 0) {
      setError("Price must be greater than 0");
      return;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }
    if (!editingId && !imageFile && !formData.image) {
      setError("Book cover image is required");
      return;
    }

    setSubmitting(true);

    try {
      let imageUrl = formData.image;

      // Upload image if a new one is selected
      if (imageFile) {
        console.log(`Uploading image: ${imageFile.name}`);
        imageUrl = await uploadImage(imageFile);
        console.log(`Image URL after upload: ${imageUrl}`);
      }

      const bookData = { ...formData, image: imageUrl };
      console.log(`Saving book with image URL: ${imageUrl}`);

      if (editingId) {
        // Update
        console.log(`Updating book ${editingId}`);
        const { error: updateError } = await supabase
          .from("books")
          .update(bookData)
          .eq("id", editingId);

        if (updateError) throw updateError;
        setSuccess("Book updated successfully");
      } else {
        // Create
        const { error: insertError } = await supabase
          .from("books")
          .insert([bookData]);

        if (insertError) throw insertError;
        setSuccess("Book created successfully");
      }

      resetForm();
      await fetchBooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (book: Book) => {
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price,
      category: book.category,
      description: book.description,
      image: book.image,
      featured: book.featured,
    });
    setImageFile(null);
    setImagePreview("");
    setEditingId(book.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      const { error: deleteError } = await supabase
        .from("books")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
      setSuccess("Book deleted successfully");
      await fetchBooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete book");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      price: 0,
      category: categories.length > 0 ? categories[0].name : "",
      description: "",
      image: "",
      featured: false,
    });
    setImageFile(null);
    setImagePreview("");
    setEditingId(null);
    setIsFormOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 text-orange-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Books Management
          </h2>
          <p className="text-sm text-gray-600 font-light mt-1">
            {books.length} book{books.length !== 1 ? "s" : ""} in collection
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-linear-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Book
        </button>
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

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
          <div className="bg-linear-to-br from-white to-gray-50 rounded-2xl shadow-2xl w-full max-w-3xl my-4 border border-gray-100">
            {/* Header */}
            <div className="bg-linear-to-r from-orange-600 to-orange-500 p-6 sm:p-8 flex justify-between items-start sm:items-center gap-4 rounded-t-2xl">
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  {editingId ? "Edit Book Details" : "Add New Book"}
                </h3>
                <p className="text-orange-100 text-xs sm:text-sm mt-1">
                  {editingId
                    ? "Update your book information"
                    : "Create an amazing new book entry"}
                </p>
              </div>
              <button
                onClick={resetForm}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors shrink-0"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Content */}
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto"
            >
              {/* Error Alert */}
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded-lg text-red-800 font-light text-sm flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-red-600 rounded-full"></div>
                    <span>{error}</span>
                  </div>
                  <button onClick={() => setError("")}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Main Section - Book Info */}
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-orange-600 rounded"></div>
                  Book Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                      Book Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm font-light transition-all"
                      placeholder="Enter book title..."
                    />
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                      Author *
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm font-light transition-all"
                      placeholder="Author name..."
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                      Price (₦) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-600 text-lg">
                        ₦
                      </span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm font-light transition-all"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm font-light transition-all bg-white cursor-pointer"
                      disabled={categoriesLoading}
                    >
                      {categoriesLoading ? (
                        <option>Loading categories...</option>
                      ) : categories.length > 0 ? (
                        categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name.charAt(0).toUpperCase() +
                              cat.name.slice(1)}
                          </option>
                        ))
                      ) : (
                        <option value="">
                          No categories available. Add one in Category
                          Management.
                        </option>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-orange-600 rounded"></div>
                  Description
                </h4>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                  Book Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm font-light transition-all resize-none"
                  placeholder="Write a compelling description for your book..."
                />
                <p className="text-xs text-gray-500 mt-2 font-light">
                  {formData.description.length} characters
                </p>
              </div>

              {/* Book Cover Section */}
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-orange-600 rounded"></div>
                  Book Cover
                </h4>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-4 p-4 bg-linear-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                    <div className="relative w-24 sm:w-32 h-48 mx-auto rounded-lg overflow-hidden shadow-lg border border-gray-300">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-center text-xs text-gray-600 mt-3 font-light">
                      Preview
                    </p>
                  </div>
                )}

                {/* Current Image */}
                {formData.image && !imageFile && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-xs font-light">
                    ✓ Current image is set
                  </div>
                )}

                {/* File Upload */}
                <label className="block relative">
                  <div className="px-4 sm:px-6 py-6 sm:py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-400 transition-colors cursor-pointer bg-white hover:bg-orange-50/30 text-center group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={uploading}
                    />
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 group-hover:text-orange-600 transition-colors mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-gray-700 font-medium text-sm sm:text-base">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-gray-500 text-xs mt-1 font-light">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Additional Options */}
              <div className="bg-gray-50 rounded-xl p-4 text-sm">
                <label className="flex items-start sm:items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer mt-1 sm:mt-0 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs sm:text-sm font-medium text-gray-900 block">
                      Mark as Featured Book
                    </span>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-light inline-block mt-1">
                      Featured books appear on homepage
                    </span>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="flex-1 py-2.5 sm:py-3 bg-linear-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2 text-sm"
                >
                  {submitting || uploading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      {uploading ? "Uploading..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                      {editingId ? "Update Book" : "Create Book"}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Books Display - Desktop Table / Mobile Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-orange-600 animate-spin" />
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 font-light">
            No books yet. Create your first book to get started.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Image
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Author
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Featured
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {books.map((book) => (
                    <tr
                      key={book.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Image */}
                      <td className="px-4 py-4">
                        <div className="w-12 h-16 rounded overflow-hidden bg-orange-50 flex items-center justify-center">
                          {book.image ? (
                            <img
                              src={
                                signedUrls[book.id] ||
                                getSupabaseImageUrl(book.image) ||
                                ""
                              }
                              alt={book.title}
                              className="object-cover w-full h-full"
                              crossOrigin="anonymous"
                              onError={(e) => {
                                const url =
                                  signedUrls[book.id] ||
                                  getSupabaseImageUrl(book.image) ||
                                  "";
                                console.error(
                                  `❌ Image load error for ${book.title}:`,
                                  {
                                    hasSigned: !!signedUrls[book.id],
                                    hasPublic: !!getSupabaseImageUrl(
                                      book.image,
                                    ),
                                    attemptedUrl: url.substring(0, 100),
                                  },
                                );
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                              }}
                              onLoad={() => {
                                const url =
                                  signedUrls[book.id] ||
                                  getSupabaseImageUrl(book.image) ||
                                  "";
                                console.log(
                                  `✅ Image loaded for ${book.title}:`,
                                  url.substring(0, 80) + "...",
                                );
                              }}
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-xs text-orange-600 text-center px-1">
                              No Image
                            </span>
                          )}
                        </div>
                      </td>
                      {/* Title */}
                      <td className="px-4 py-4 text-sm font-light text-gray-900 truncate max-w-xs whitespace-nowrap">
                        {book.title}
                      </td>
                      {/* Author */}
                      <td className="px-4 py-4 text-sm font-light text-gray-600 truncate max-w-xs whitespace-nowrap">
                        {book.author}
                      </td>
                      {/* Category */}
                      <td className="px-4 py-4 text-sm font-light text-gray-600 capitalize">
                        {book.category}
                      </td>
                      {/* Price */}
                      <td className="px-4 py-4 text-sm font-light text-gray-900">
                        ₦{Number(book.price).toLocaleString()}
                      </td>
                      {/* Featured */}
                      <td className="px-4 py-4 text-sm">
                        {book.featured ? (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-light">
                            Featured
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-light">
                            No
                          </span>
                        )}
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(book)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FontAwesomeIcon
                              icon={faPencil}
                              className="w-4 h-4"
                            />
                          </button>
                          <button
                            onClick={() => handleDelete(book.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="w-4 h-4"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card Header with Image */}
                <div className="flex gap-4 p-4">
                  <div className="shrink-0">
                    <div className="w-16 h-24 rounded overflow-hidden bg-orange-50 flex items-center justify-center">
                      {book.image ? (
                        <img
                          src={
                            signedUrls[book.id] ||
                            getSupabaseImageUrl(book.image) ||
                            ""
                          }
                          alt={book.title}
                          className="object-cover w-full h-full"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            const url =
                              signedUrls[book.id] ||
                              getSupabaseImageUrl(book.image) ||
                              "";
                            console.error(
                              `❌ Mobile image load error for ${book.title}:`,
                              {
                                hasSigned: !!signedUrls[book.id],
                                hasPublic: !!getSupabaseImageUrl(book.image),
                                attemptedUrl: url.substring(0, 100),
                              },
                            );
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                          onLoad={() => {
                            const url =
                              signedUrls[book.id] ||
                              getSupabaseImageUrl(book.image) ||
                              "";
                            console.log(
                              `✅ Mobile image loaded for ${book.title}:`,
                              url.substring(0, 80) + "...",
                            );
                          }}
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-xs text-orange-600">
                          No Image
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-xs text-gray-600 font-light mt-1">
                      by {book.author}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-semibold text-orange-600">
                        ₦{book.price.toLocaleString()}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-light capitalize">
                        {book.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {book.featured && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-light">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(book)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FontAwesomeIcon icon={faPencil} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
