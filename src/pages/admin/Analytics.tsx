import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/store/Navbar";
import { BarChart, TrendingUp, Users, ShoppingCart } from "lucide-react";
import { getOrders } from "../../utils/supabase";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
}

export const AdminAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    avgOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data: orders } = await getOrders();
        if (orders && Array.isArray(orders)) {
          const totalRevenue = orders.reduce(
            (sum: number, order: any) => sum + (Number(order.final_total) || 0),
            0,
          );
          const uniqueCustomers = new Set(
            orders.map((o: any) => o.customer_email),
          ).size;
          const avgOrderValue =
            orders.length > 0 ? totalRevenue / orders.length : 0;

          setAnalytics({
            totalRevenue,
            totalOrders: orders.length,
            totalCustomers: uniqueCustomers,
            avgOrderValue,
          });
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAdmin={true} />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600 mb-8">
            Track your store's performance metrics
          </p>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 text-sm font-medium">
                  Total Revenue
                </h3>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                ₦{analytics.totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-2">
                {analytics.totalOrders} orders
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 text-sm font-medium">
                  Total Orders
                </h3>
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {analytics.totalOrders}
              </p>
              <p className="text-sm text-blue-600 mt-2">
                {loading ? "Loading..." : "Real-time data"}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 text-sm font-medium">
                  Total Customers
                </h3>
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {analytics.totalCustomers}
              </p>
              <p className="text-sm text-purple-600 mt-2">Unique customers</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 text-sm font-medium">
                  Avg Order Value
                </h3>
                <BarChart className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                ₦{Math.round(analytics.avgOrderValue).toLocaleString()}
              </p>
              <p className="text-sm text-orange-600 mt-2">Per order average</p>
            </div>
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Sales Trend
              </h2>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500">
                <p>Chart visualization would display here</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Product Performance
              </h2>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500">
                <p>Chart visualization would display here</p>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Top Products
            </h2>
            <div className="space-y-4">
              {[
                { name: "I Dare to Stand Out", sales: 12, revenue: "₦102,000" },
                {
                  name: "Ambitious and Anointed",
                  sales: 10,
                  revenue: "₦85,000",
                },
                {
                  name: "Mashafy Reflection Journal",
                  sales: 8,
                  revenue: "₦96,000",
                },
              ].map((product, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      {product.sales} sales
                    </p>
                  </div>
                  <p className="font-bold text-gray-900">{product.revenue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
