import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useAuth from "@/context/useAuth";

const UserDashboard = ({ handleShowLogin }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, token, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const base_url = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000";

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get token from auth context or localStorage
      let authToken = token;
      if (!authToken) {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          authToken = parsed.token || parsed.state?.token;
        }
      }

      const response = await fetch(`${base_url}/api/order/user-orders?page=${page}&limit=10`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders');
      }

      setOrders(data.orders || []);
      setPagination(data.pagination || {
        currentPage: page,
        totalPages: Math.ceil((data.totalOrders || 0) / 10),
        totalOrders: data.totalOrders || 0
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message);
      if (error.message.includes('unauthorized') || error.message.includes('token')) {
        logout();
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'preparing':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'out for delivery':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const OrderModal = () => {
    if (!selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Order Details
              </h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Order Info */}
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Order Number</p>
                  <p className="font-medium text-orange-500 dark:text-orange-400">
                    #{selectedOrder.orderNumber || selectedOrder._id?.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status || 'Pending'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Order Date</p>
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    ${selectedOrder.pricing?.total?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center">
                      <img
                        src={`${base_url}/uploads/foodImages/${item.image}`}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded mr-3"
                        onError={(e) => {
                          e.target.src = '/placeholder-food.jpg';
                        }}
                      />
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{item.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium text-gray-800 dark:text-gray-100">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            {selectedOrder.deliveryAddress && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">Delivery Address</h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedOrder.deliveryAddress.street}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.zipCode}
                  </p>
                </div>
              </div>
            )}

            {/* Pricing Breakdown */}
            {selectedOrder.pricing && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-800 dark:text-gray-100">${selectedOrder.pricing.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Delivery Fee</span>
                    <span className="text-gray-800 dark:text-gray-100">${selectedOrder.pricing.deliveryFee?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                    <span className="text-gray-800 dark:text-gray-100">${selectedOrder.pricing.tax?.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-medium">
                    <span className="text-gray-800 dark:text-gray-100">Total</span>
                    <span className="text-orange-500 dark:text-orange-400">${selectedOrder.pricing.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar handleShowLogin={handleShowLogin} />
      <div className="min-h-screen py-8 px-5">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              My Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Welcome back, {user?.name || user?.username || 'User'}! Manage your orders and account here.
            </p>
          </div>

          {/* Dashboard Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'orders'
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  My Orders
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'profile'
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Profile
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                      Order History
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {pagination.totalOrders} total orders
                    </p>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12">
                      <div className="text-red-500 dark:text-red-400 mb-2">Error loading orders</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                      <button
                        onClick={() => fetchOrders()}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                        No orders yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Start shopping to see your orders here
                      </p>
                      <button
                        onClick={() => navigate('/')}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Orders List */}
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                                    Order #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
                                  </h3>
                                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 sm:mt-0 ${getStatusColor(order.status)}`}>
                                    {order.status || 'Pending'}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  {formatDate(order.createdAt)}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {order.items?.length || 0} items • ${order.pricing?.total?.toFixed(2) || '0.00'}
                                </p>
                              </div>
                              <div className="mt-4 md:mt-0 md:ml-4">
                                <button
                                  onClick={() => handleViewOrderDetails(order)}
                                  className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination */}
                      {pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-4 mt-8">
                          <button
                            onClick={() => fetchOrders(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            Previous
                          </button>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Page {pagination.currentPage} of {pagination.totalPages}
                          </span>
                          <button
                            onClick={() => fetchOrders(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
                    Profile Information
                  </h2>
                  <div className="max-w-md space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Name</label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-100">
                        {user?.name || user?.username || 'Not provided'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Email</label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-100">
                        {user?.email || 'Not provided'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Phone</label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-100">
                        {user?.phone || 'Not provided'}
                      </div>
                    </div>
                    <div className="pt-4">
                      <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && <OrderModal />}
      
      <Footer />
    </div>
  );
};

export default UserDashboard;