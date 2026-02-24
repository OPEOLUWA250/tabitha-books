import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/store/Navbar";
import { Link } from "react-router-dom";
import { Plus, Edit } from "lucide-react";
import { getProducts } from "../../utils/supabase";

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: productsData } = await getProducts();

        if (productsData && Array.isArray(productsData)) {
          setProducts(productsData as ProductData[]);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isAdmin={true} />
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAdmin={true} />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-5xl font-bold text-gray-900">Dashboard</h1>
            <Link
              to="/admin/products/new"
              className="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Product
            </Link>
          </div>

          {/* Products Section */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Products</h2>
              <Link
                to="/admin/products"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                Manage All
              </Link>
            </div>

            {products.length > 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <span className="font-medium text-gray-900">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                          ₦{Number(product.price).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              product.stock > 20
                                ? "bg-green-100 text-green-800"
                                : product.stock > 10
                                  ? "bg-yellow-100 text-yellow-800"
                                  : product.stock > 0
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {product.stock > 0 ? `${product.stock}` : "Out"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition inline-flex"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-600">
                  No products yet.{" "}
                  <Link
                    to="/admin/products/new"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Create one now
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
