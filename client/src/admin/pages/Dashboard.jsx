import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdRestaurantMenu } from "react-icons/md";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import { useNavigate } from "react-router-dom";
import useAdminAuthStore from "@/store/authStore";
import Orders from "../components/Orders";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuthStore();
  console.log(admin)
  // Mock data for dashboard stats
  const dashboardStats = {
    totalOrders: 245,
    todaysOrders: 23,
    totalProducts: 156,
    totalRevenue: 12450.5,
    pendingOrders: 8,
    completedOrders: 237,
  };

  const recentOrders = [
    {
      id: "#ORD001",
      customer: "John Doe",
      amount: "$24.99",
      status: "Delivered",
      time: "2 hours ago",
    },
    {
      id: "#ORD002",
      customer: "Jane Smith",
      amount: "$18.50",
      status: "Preparing",
      time: "30 mins ago",
    },
    {
      id: "#ORD003",
      customer: "Mike Johnson",
      amount: "$32.75",
      status: "On the way",
      time: "15 mins ago",
    },
    {
      id: "#ORD004",
      customer: "Sarah Wilson",
      amount: "$27.25",
      status: "Pending",
      time: "5 mins ago",
    },
    {
      id: "#ORD005",
      customer: "David Brown",
      amount: "$19.99",
      status: "Delivered",
      time: "3 hours ago",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "Preparing":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "On the way":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "Pending":
        return "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Header */}
        <AdminNavbar 
          setSidebarCollapsed={setSidebarCollapsed} 
          sidebarCollapsed={sidebarCollapsed} 
        />

        <div className="flex">
          {/* Sidebar */}
          <AdminSidebar 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            sidebarCollapsed={sidebarCollapsed}
          />

          {/* Main Content */}
          <main className="flex-1 p-6">
            {activeTab === "dashboard" && (
              <div>
                {/* Dashboard Header */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">
                    Dashboard
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    Welcome back! Here's what's happening with your restaurant
                    today.
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-300">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                          {dashboardStats.totalOrders}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1 transition-colors duration-300">
                          ↗️ +12% from last month
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center transition-colors duration-300">
                        <span className="text-blue-600 dark:text-blue-300 text-xl">🛒</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-300">
                          Today's Orders
                        </p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                          {dashboardStats.todaysOrders}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1 transition-colors duration-300">
                          ↗️ +5 from yesterday
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center transition-colors duration-300">
                        <span className="text-green-600 dark:text-green-300 text-xl">📈</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-300">
                          Total Products
                        </p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                          {dashboardStats.totalProducts}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 transition-colors duration-300">3 categories</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center transition-colors duration-300">
                        <span className="text-purple-600 dark:text-purple-300 text-xl">🍕</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-300">
                          Total Revenue
                        </p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                          ${dashboardStats.totalRevenue.toFixed(2)}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1 transition-colors duration-300">
                          ↗️ +8% from last month
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center transition-colors duration-300">
                        <span className="text-orange-600 dark:text-orange-300 text-xl font-bold">
                          💰
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div className="lg:col-span-2">
                    {/* Recent Orders */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                      <div className="p-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                            Recent Orders
                          </h3>
                          <button className="text-orange-500 dark:text-orange-400 text-sm hover:text-orange-600 dark:hover:text-orange-300 transition-colors duration-300">
                            View All
                          </button>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">
                                Order ID
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">
                                Customer
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">
                                Amount
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">
                                Time
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                            {recentOrders.map((order) => (
                              <tr
                                key={order.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300">
                                  {order.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                                  {order.customer}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300">
                                  {order.amount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                      order.status
                                    )} transition-colors duration-300`}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                                  {order.time}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => navigate("/admin/add-product")}
                        className="w-full bg-orange-500 dark:bg-orange-600 text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300 flex items-center gap-2"
                      >
                        <span><IoMdAdd /> </span> Add New Product
                      </button>
                      <button
                        onClick={() => navigate("/admin/add-menu")}
                        className="w-full bg-blue-500 dark:bg-blue-600 text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2"
                      >
                        <span><MdRestaurantMenu /></span> Add Menu Item
                      </button>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 py-3 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300 flex items-center gap-2"
                      >
                        <span>👁️</span> View All Orders
                      </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
                      <h4 className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-3 transition-colors duration-300">
                        Quick Stats
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Pending Orders</span>
                          <span className="font-medium text-orange-600 dark:text-orange-400 transition-colors duration-300">
                            {dashboardStats.pendingOrders}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Completed Today</span>
                          <span className="font-medium text-green-600 dark:text-green-400 transition-colors duration-300">
                            {dashboardStats.todaysOrders -
                              dashboardStats.pendingOrders}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs content */}
            {activeTab === "orders" && (
              <Orders />
              // <div>
              //   <div className="mb-8">
              //     <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">
              //       Orders Management
              //     </h2>
              //     <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
              //       Manage and track all customer orders.
              //     </p>
              //   </div>
              //   <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
              //     <div className="text-center py-12">
              //       <span className="text-6xl mb-4 block">📦</span>
              //       <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">
              //         Orders Management
              //       </h3>
              //       <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
              //         Full orders management interface will be implemented here.
              //       </p>
              //     </div>
              //   </div>
              // </div>
            )}

            {activeTab === "customers" && (
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">
                    Customer Management
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    View and manage customer information.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                  <div className="text-center py-12">
                    <span className="text-6xl mb-4 block">👥</span>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">
                      Customer Management
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                      Customer management interface will be implemented here.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">
                    Settings
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    Configure your restaurant settings and preferences.
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
                      Restaurant Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                          Restaurant Name
                        </label>
                        <input
                          type="text"
                          defaultValue="FOODIE Restaurant"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                          Address
                        </label>
                        <input
                          type="text"
                          defaultValue="123 Food Street, City"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                          Phone
                        </label>
                        <input
                          type="tel"
                          defaultValue="+1 (555) 123-4567"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
                      Delivery Settings
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                          Delivery Fee
                        </label>
                        <input
                          type="number"
                          defaultValue="2.99"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                          Tax Rate (%)
                        </label>
                        <input
                          type="number"
                          defaultValue="10"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                          Estimated Delivery Time
                        </label>
                        <input
                          type="text"
                          defaultValue="25-35 minutes"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button className="bg-orange-500 dark:bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300">
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;