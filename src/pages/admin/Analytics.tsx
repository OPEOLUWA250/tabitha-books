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
      }
    };

    fetchAnalytics();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAdmin={true} />

      <div className="pt-20 md:pt-32 pb-20 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 md:mb-2">
            Analytics
          </h1>
          <p className="text-xs sm:text-base text-gray-600 mb-6 md:mb-8">
            Track your store's performance metrics
          </p>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 md:mb-12">
            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-gray-600 text-xs sm:text-sm font-medium truncate pr-2">
                  Total Revenue
                </h3>
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
              </div>
              <p className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-900 line-clamp-1">
                ₦{analytics.totalRevenue.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-green-600 mt-1.5 sm:mt-2">
                {analytics.totalOrders} orders
              </p>
            </div>

            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-gray-600 text-xs sm:text-sm font-medium truncate pr-2">
                  Total Orders
                </h3>
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
              </div>
              <p className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                {analytics.totalOrders}
              </p>
              <p className="text-xs sm:text-sm text-blue-600 mt-1.5 sm:mt-2">
                Real-time data
              </p>
            </div>

            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-gray-600 text-xs sm:text-sm font-medium truncate pr-2">
                  Customers
                </h3>
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
              </div>
              <p className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                {analytics.totalCustomers}
              </p>
              <p className="text-xs sm:text-sm text-purple-600 mt-1.5 sm:mt-2">
                Unique
              </p>
            </div>

            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-gray-600 text-xs sm:text-sm font-medium truncate pr-2">
                  Avg Order Value
                </h3>
                <BarChart className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
              </div>
              <p className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-900 line-clamp-1">
                ₦{Math.round(analytics.avgOrderValue).toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-orange-600 mt-1.5 sm:mt-2">
                Average
              </p>
            </div>
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 md:mb-4">
                Sales Trend
              </h2>
              <div className="h-40 sm:h-48 md:h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 text-xs sm:text-sm">
                <p>Chart visualization would display here</p>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 md:mb-4">
                Product Performance
              </h2>
              <div className="h-40 sm:h-48 md:h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 text-xs sm:text-sm">
                <p>Chart visualization would display here</p>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 md:mb-4">
              Top Products
            </h2>
            <div className="space-y-3 md:space-y-4">
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
                  className="flex items-center justify-between pb-3 md:pb-4 border-b border-gray-200 last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm md:text-base line-clamp-2">
                      {product.name}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">
                      {product.sales} sales
                    </p>
                  </div>
                  <p className="font-bold text-gray-900 text-sm md:text-base ml-2 flex-shrink-0">
                    {product.revenue}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
