import React, { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdRestaurantMenu } from "react-icons/md";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import { Link, useNavigate } from "react-router-dom";
import useAdminAuthStore from "@/store/authStore";
import Orders from "../components/Orders";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    todaysOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuthStore();

  // API base URL - adjust this to match your backend URL
  const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000/api';

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all orders
      const ordersResponse = await fetch(`${API_BASE_URL}/order/admin/all?limit=50`);
      const ordersData = await ordersResponse.json();
      
      // Fetch all products
      const productsResponse = await fetch(`${API_BASE_URL}/food/getfood`);
      const productsData = await productsResponse.json();
      
      // Fetch all users
      const usersResponse = await fetch(`${API_BASE_URL}/user/getall`);
      const usersData = await usersResponse.json();

      if (ordersData && productsData && usersData) {
        const orders = ordersData.orders || [];
        const products = productsData.data || [];
        const users = usersData.users || [];

        // Calculate today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Filter today's orders
        const todaysOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= today && orderDate < tomorrow;
        });

        // Calculate stats
        const totalRevenue = orders
          .filter(order => order.status === 'delivered')
          .reduce((sum, order) => sum + (order.pricing?.total || 0), 0);

        const pendingOrders = orders.filter(order => 
          ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(order.status)
        ).length;

        const completedOrders = orders.filter(order => 
          order.status === 'delivered'
        ).length;

        // Update dashboard stats
        setDashboardStats({
          totalOrders: orders.length,
          todaysOrders: todaysOrders.length,
          totalProducts: products.length,
          totalRevenue: totalRevenue,
          pendingOrders: pendingOrders,
          completedOrders: completedOrders,
        });

        // Set recent orders (last 5 orders)
        const formattedRecentOrders = orders.slice(0, 5).map(order => ({
          id: order.orderNumber || `#${order._id.slice(-6).toUpperCase()}`,
          customer: order.userId?.name || 'Unknown Customer',
          amount: `$${(order.pricing?.total || 0).toFixed(2)}`,
          status: getDisplayStatus(order.status),
          time: getTimeAgo(order.createdAt),
          rawStatus: order.status
        }));

        setRecentOrders(formattedRecentOrders);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Keep default values if fetch fails
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format order status for display
  const getDisplayStatus = (status) => {
    const statusMap = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'preparing': 'Preparing',
      'out_for_delivery': 'On the way',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  };

  // Helper function to calculate time ago
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const orderDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - orderDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "preparing":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "on the way":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "pending":
      case "confirmed":
        return "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
    
    // Set up polling to refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

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
          <main className="flex-1 p-3 sm:p-4 lg:p-6 w-full overflow-x-hidden">
            {activeTab === "dashboard" && (
              <div className="max-w-7xl mx-auto">
                {/* Dashboard Header */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">
                        Dashboard
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 transition-colors duration-300">
                        Welcome back! Here's what's happening with your restaurant today.
                      </p>
                    </div>
                    <button
                      onClick={fetchDashboardData}
                      className="px-3 py-2 sm:px-4 sm:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300 flex items-center gap-2 text-sm sm:text-base self-start sm:self-auto"
                      disabled={loading}
                    >
                      <span className={loading ? 'animate-spin' : ''}>🔄</span>
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                  <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-300 truncate">
                          Total Orders
                        </p>
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                          {dashboardStats.totalOrders}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 transition-colors duration-300 hidden sm:block">
                          All time orders
                        </p>
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center transition-colors duration-300 flex-shrink-0 ml-2">
                        <span className="text-blue-600 dark:text-blue-300 text-sm sm:text-base lg:text-xl">🛒</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-300 truncate">
                          Today's Orders
                        </p>
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                          {dashboardStats.todaysOrders}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1 transition-colors duration-300 hidden sm:block">
                          Orders placed today
                        </p>
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center transition-colors duration-300 flex-shrink-0 ml-2">
                        <span className="text-green-600 dark:text-green-300 text-sm sm:text-base lg:text-xl">📈</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-300 truncate">
                          Total Products
                        </p>
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                          {dashboardStats.totalProducts}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 transition-colors duration-300 hidden sm:block">
                          Available items
                        </p>
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center transition-colors duration-300 flex-shrink-0 ml-2">
                        <span className="text-purple-600 dark:text-purple-300 text-sm sm:text-base lg:text-xl">🍕</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-300 truncate">
                          Total Revenue
                        </p>
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                          ${dashboardStats.totalRevenue.toFixed(2)}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1 transition-colors duration-300 hidden sm:block">
                          From delivered orders
                        </p>
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center transition-colors duration-300 flex-shrink-0 ml-2">
                        <span className="text-orange-600 dark:text-orange-300 text-sm sm:text-base lg:text-xl font-bold">
                          💰
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="xl:col-span-2 order-2 xl:order-1">
                    {/* Recent Orders */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                            Recent Orders
                          </h3>
                          <button 
                            onClick={() => setActiveTab("orders")}
                            className="text-orange-500 dark:text-orange-400 text-sm hover:text-orange-600 dark:hover:text-orange-300 transition-colors duration-300"
                          >
                            View All
                          </button>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        {recentOrders.length > 0 ? (
                          <div className="min-w-full">
                            {/* Desktop Table View */}
                            <table className="w-full hidden md:table">
                              <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
                                <tr>
                                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">
                                    Order ID
                                  </th>
                                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">
                                    Customer
                                  </th>
                                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">
                                    Amount
                                  </th>
                                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">
                                    Status
                                  </th>
                                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">
                                    Time
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                                {recentOrders.map((order, index) => (
                                  <tr
                                    key={`${order.id}-${index}`}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                                  >
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300">
                                      {order.id}
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                                      {order.customer}
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300">
                                      {order.amount}
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                                      <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                          order.status
                                        )} transition-colors duration-300`}
                                      >
                                        {order.status}
                                      </span>
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                                      {order.time}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            
                            {/* Mobile Card View */}
                            <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
                              {recentOrders.map((order, index) => (
                                <div key={`${order.id}-${index}`} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="font-medium text-gray-800 dark:text-gray-100 text-sm">
                                      {order.id}
                                    </div>
                                    <span
                                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                        order.status
                                      )} transition-colors duration-300`}
                                    >
                                      {order.status}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                    {order.customer}
                                  </div>
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-gray-800 dark:text-gray-100">
                                      {order.amount}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400">
                                      {order.time}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">No orders found</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-300 order-1 xl:order-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <Link 
                        to="/admin/add-product"
                        className="w-full bg-orange-500 dark:bg-orange-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg text-sm font-medium hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300 flex items-center gap-2 justify-center"
                      >
                        <IoMdAdd className="text-base sm:text-lg" /> 
                        <span className="truncate">Add New Product</span>
                      </Link>
                      <Link
                        to="/admin/add-menu"
                        className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg text-sm font-medium hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2 justify-center"
                      >
                        <MdRestaurantMenu className="text-base sm:text-lg" /> 
                        <span className="truncate">Add Menu Item</span>
                      </Link>
                      <Link
                        to='/admin/orders'
                        className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300 flex items-center gap-2 justify-center"
                      >
                        <span>👁️</span> 
                        <span className="truncate">View All Orders</span>
                      </Link>
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
                          <span className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Completed Orders</span>
                          <span className="font-medium text-green-600 dark:text-green-400 transition-colors duration-300">
                            {dashboardStats.completedOrders}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Success Rate</span>
                          <span className="font-medium text-blue-600 dark:text-blue-400 transition-colors duration-300">
                            {dashboardStats.totalOrders > 0 
                              ? Math.round((dashboardStats.completedOrders / dashboardStats.totalOrders) * 100)
                              : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs content */}
            {activeTab === "orders" && <Orders />}

            {activeTab === "customers" && (
              <div className="max-w-7xl mx-auto">
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">
                    Customer Management
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    View and manage customer information.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-300">
                  <div className="text-center py-8 sm:py-12">
                    <span className="text-4xl sm:text-6xl mb-4 block">👥</span>
                    <h3 className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">
                      Customer Management
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 transition-colors duration-300">
                      Customer management interface will be implemented here.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="max-w-7xl mx-auto">
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">
                    Settings
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    Configure your restaurant settings and preferences.
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-300">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
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

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-300">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
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

                <div className="mt-4 sm:mt-6">
                  <button className="bg-orange-500 dark:bg-orange-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300 text-sm sm:text-base">
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