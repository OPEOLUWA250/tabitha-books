import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/store/Navbar";
import { Download } from "lucide-react";
import { getOrders } from "../../utils/supabase";

interface OrderRow {
  id: string;
  customer_name: string;
  customer_email: string;
  final_total: number;
  status: string;
  created_at: string;
}

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await getOrders();
        if (data && Array.isArray(data)) {
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAdmin={true} />

      <div className="pt-20 md:pt-32 pb-20 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Orders
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Manage customer orders
              </p>
            </div>
            <button className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:border-primary-600 transition text-sm sm:text-base">
              <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Export
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6">
            <select className="flex-1 px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm">
              <option>All Status</option>
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>
            <select className="flex-1 px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm">
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
            </select>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <span className="font-bold text-primary-600">
                          {order.id.slice(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.customer_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.customer_email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        ₦{Number(order.final_total).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500 text-sm">
                No orders yet
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs text-gray-600">Order ID</p>
                      <p className="font-bold text-primary-600 text-sm">
                        {order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                  <div className="space-y-2 mb-3 border-t border-gray-200 pt-3">
                    <div>
                      <p className="text-xs text-gray-600">Customer</p>
                      <p className="font-medium text-gray-900 text-sm">
                        {order.customer_name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {order.customer_email}
                      </p>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-gray-600">Amount</p>
                        <p className="font-bold text-gray-900 text-sm">
                          ₦{Number(order.final_total).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-xs text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
