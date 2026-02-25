import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/store/Navbar";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import {
  getProducts,
  deleteProduct,
  clearProductCache,
} from "../../utils/supabase";

interface ProductData {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image_url: string;
}

export const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log("Fetching products...");
        setError(null);
        const { data: productsData, error: fetchError } = await getProducts();

        console.log(
          "Products fetched:",
          productsData?.length || 0,
          "Error:",
          fetchError,
        );

        if (fetchError) {
          console.error("Fetch error:", fetchError);
          setError(
            typeof fetchError === "string"
              ? fetchError
              : "Failed to load products",
          );
          setProducts([]);
          return;
        }

        if (productsData && Array.isArray(productsData)) {
          setProducts(productsData as ProductData[]);
        } else {
          console.warn("No products data returned");
          setProducts([]);
        }
      } catch (error) {
        console.error("Error loading dashboard:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load dashboard",
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleDelete = async (productId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this product? This action cannot be undone.",
      )
    ) {
      setDeleting(productId);
      try {
        const { error } = await deleteProduct(productId);
        if (error) {
          const errorMessage =
            typeof error === "string"
              ? error
              : error?.message || "Failed to delete product";
          alert(errorMessage);
          console.error("Delete error:", error);
        } else {
          clearProductCache();
          setProducts((prev) => prev.filter((p) => p.id !== productId));
        }
      } catch (err) {
        alert("An error occurred while deleting");
        console.error("Delete error:", err);
      } finally {
        setDeleting(null);
      }
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar isAdmin={true} />
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <p className="text-xs font-light text-gray-600">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar isAdmin={true} />
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="border border-gray-200 p-6 max-w-md">
            <p className="text-xs font-light text-dark mb-2 uppercase tracking-widest">
              Error Loading Dashboard
            </p>
            <p className="text-xs font-light text-gray-600 mt-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary-500 text-white font-light text-xs hover:bg-primary-600 transition rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar isAdmin={true} />

      <div className="pt-20 md:pt-32 pb-20 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b-4 border-primary-500">
            <div>
              <h1 className="text-4xl font-light text-dark tracking-tight">
                Dashboard
              </h1>
              <div className="w-12 h-1 bg-primary-500 mt-3"></div>
            </div>
            <Link
              to="/admin/products/new"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2 bg-primary-500 text-white font-light text-xs hover:bg-primary-600 transition uppercase tracking-widest"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Link>
          </div>

          {/* Products Section */}
          <div className="mb-16">
            <h2 className="text-sm font-light text-dark mb-8 uppercase tracking-widest">
              Products
            </h2>

            {/* Search */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 text-xs font-light focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            {products.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block border border-gray-200 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-xs font-light text-dark uppercase tracking-widest">
                          Product
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-light text-dark uppercase tracking-widest">
                          Category
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-light text-dark uppercase tracking-widest">
                          Price
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-light text-dark uppercase tracking-widest">
                          Stock
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-light text-dark uppercase tracking-widest">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-10 h-10 object-cover"
                              />
                              <span className="font-light text-xs text-dark">
                                {product.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-light text-gray-600 capitalize">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 text-xs font-light text-primary-500">
                            ₦{Number(product.price).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-xs">
                            <span
                              className={`px-2 py-1 text-xs font-light border ${
                                product.stock > 20
                                  ? "border-green-200 text-green-700"
                                  : product.stock > 10
                                    ? "border-yellow-200 text-yellow-700"
                                    : product.stock > 0
                                      ? "border-orange-200 text-orange-700"
                                      : "border-gray-200 text-gray-600"
                              }`}
                            >
                              {product.stock > 0 ? `${product.stock}` : "Out"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs space-x-2">
                            <Link
                              to={`/admin/products/${product.id}/edit`}
                              className="p-1 text-gray-400 hover:text-primary-500 transition inline-flex"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-1 text-gray-400 hover:text-primary-500 transition inline-flex disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                              disabled={deleting !== null}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="border border-gray-200 hover:border-primary-500 transition p-4"
                    >
                      <div className="flex gap-3 mb-4">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-16 h-16 object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-light text-xs text-dark">
                            {product.name}
                          </h3>
                          <p className="text-xs font-light text-gray-600 capitalize mb-2">
                            {product.category}
                          </p>
                          <p className="text-xs font-light text-primary-500">
                            ₦{Number(product.price).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span
                          className={`px-2 py-1 text-xs font-light border ${
                            product.stock > 20
                              ? "border-green-200 text-green-700"
                              : product.stock > 10
                                ? "border-yellow-200 text-yellow-700"
                                : product.stock > 0
                                  ? "border-orange-200 text-orange-700"
                                  : "border-gray-200 text-gray-600"
                          }`}
                        >
                          {product.stock > 0 ? `${product.stock}` : "Out"}
                        </span>
                        <div className="flex gap-2">
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="p-1 text-gray-400 hover:text-primary-500 transition inline-flex"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1 text-gray-400 hover:text-primary-500 transition inline-flex disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                            disabled={deleting !== null}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="border border-gray-200 p-8 text-center">
                <p className="text-xs font-light text-gray-600">
                  {searchTerm
                    ? "No products match your search."
                    : "No products yet."}{" "}
                  {!searchTerm && (
                    <Link
                      to="/admin/products/new"
                      className="text-primary-500 hover:text-primary-600 font-light"
                    >
                      Create one now
                    </Link>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
