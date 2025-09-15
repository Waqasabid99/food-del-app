import React, { useEffect, useState } from "react";
import {
  MdVisibility,
  MdEdit,
  MdCancel,
  MdCheckCircle,
  MdLocalShipping,
  MdRestaurant,
  MdPending,
  MdAdd,
} from "react-icons/md";
import { IoSearchOutline, IoFilterOutline } from "react-icons/io5";
import { FiRefreshCw } from "react-icons/fi";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAdminAuthStore from "@/store/authStore";
import CreateOrderModal from "./CreateOrderModal";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { token } = useAdminAuthStore();
  const base_url = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000";

  const orderStatuses = [
    { value: 'all', label: 'All Orders', icon: null, color: 'bg-gray-100 text-gray-800' },
    { value: 'pending', label: 'Pending', icon: MdPending, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', icon: MdCheckCircle, color: 'bg-blue-100 text-blue-800' },
    { value: 'preparing', label: 'Preparing', icon: MdRestaurant, color: 'bg-orange-100 text-orange-800' },
    { value: 'out_for_delivery', label: 'Out for Delivery', icon: MdLocalShipping, color: 'bg-purple-100 text-purple-800' },
    { value: 'delivered', label: 'Delivered', icon: MdCheckCircle, color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', icon: MdCancel, color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    fetchOrders();
  }, [pagination.currentPage, statusFilter]);

  const fetchOrders = async (page = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await axios.get(`${base_url}/api/order/admin/all?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },  
        withCredentials: true
      });

      if (response.data) {
        setOrders(response.data.orders || []);
        setPagination(response.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalOrders: 0
        });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error fetching orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!orderId || !newStatus) return;
    
    setIsUpdating(true);
    try {
      const response = await axios.put(
        `${base_url}/api/order/admin/status/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (response.data) {
        // Update the order in the list
        setOrders(orders.map(order => 
          order._id === orderId 
            ? { ...order, status: newStatus, actualDeliveryTime: newStatus === 'delivered' ? new Date() : order.actualDeliveryTime }
            : order
        ));
        
        // Update selected order if it's the same
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        
        toast.success(`Order status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error updating order status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateOrder = () => {
    setShowCreateModal(true);
  };

  const getStatusInfo = (status) => {
    const statusInfo = orderStatuses.find(s => s.value === status?.toLowerCase());
    return statusInfo || { value: 'pending', label: 'Pending', icon: MdPending, color: 'bg-gray-100 text-gray-800' };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      (order.orderNumber && order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.userId?.name && order.userId.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.userId?.email && order.userId.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const getOrderStats = () => {
    return orderStatuses.slice(1).map(status => ({
      ...status,
      count: orders.filter(order => order.status?.toLowerCase() === status.value).length
    }));
  };

  const handleOrderCreated = (newOrder) => {
    // Refresh the orders list
    fetchOrders(pagination.currentPage);
    toast.success('Order created successfully!');
  };

  const OrderModal = () => {
    if (!selectedOrder) return null;

    const statusInfo = getStatusInfo(selectedOrder.status);
    const StatusIcon = statusInfo.icon;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-2xl w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-3 sm:p-4 md:p-8">
            {/* Modal Header */}
            <div className="flex justify-between items-start sm:items-center mb-4 sm:mb-6 md:mb-8">
              <div className="min-w-0 flex-1 mr-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 truncate">
                  Order Details
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 truncate">
                  #{selectedOrder.orderNumber || selectedOrder._id?.slice(-8).toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {/* Left Column - Order Details */}
              <div className="xl:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
                {/* Customer Info */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 sm:p-4 md:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">Customer Information</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Name</p>
                      <p className="font-medium text-gray-800 dark:text-gray-100 text-sm sm:text-base truncate">
                        {selectedOrder.userId?.name || 'N/A'}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Email</p>
                      <p className="font-medium text-gray-800 dark:text-gray-100 text-sm sm:text-base break-all">
                        {selectedOrder.userId?.email || selectedOrder.contactInfo?.email || 'N/A'}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Phone</p>
                      <p className="font-medium text-gray-800 dark:text-gray-100 text-sm sm:text-base truncate">
                        {selectedOrder.contactInfo?.phone || selectedOrder.userId?.phone || 'N/A'}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Payment Method</p>
                      <p className="font-medium text-gray-800 dark:text-gray-100 text-sm sm:text-base capitalize truncate">
                        {selectedOrder.paymentMethod || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                {selectedOrder.deliveryAddress && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 sm:p-4 md:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">Delivery Address</h3>
                    <div className="text-gray-700 dark:text-gray-300 text-sm sm:text-base space-y-1">
                      <p>{selectedOrder.deliveryAddress.street}</p>
                      <p>{selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.zipCode}</p>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">Order Items</h3>
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 gap-3 sm:gap-4">
                        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                          <img
                            src={`${base_url}/uploads/foodImages/${item.image}`}
                            alt={item.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 object-cover rounded-lg flex-shrink-0"
                            onError={(e) => {
                              e.target.src = '/placeholder-food.jpg';
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-gray-800 dark:text-gray-100 truncate text-sm sm:text-base">{item.name}</h4>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                              ${item.price?.toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-800 dark:text-gray-100 flex-shrink-0 text-sm sm:text-base">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Instructions */}
                {selectedOrder.specialInstructions && (
                  <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-xl p-3 sm:p-4 md:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-amber-800 dark:text-amber-300 mb-2">Special Instructions</h3>
                    <p className="text-amber-700 dark:text-amber-300 text-sm sm:text-base">{selectedOrder.specialInstructions}</p>
                  </div>
                )}
              </div>

              {/* Right Column - Status & Actions */}
              <div className="space-y-4 sm:space-y-6">
                {/* Current Status */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 md:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">Order Status</h3>
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                    {StatusIcon && <StatusIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400 flex-shrink-0" />}
                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${statusInfo.color} dark:bg-opacity-20 truncate`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Order Placed</p>
                      <p className="font-medium text-gray-800 dark:text-gray-100 text-sm sm:text-base">
                        {formatDate(selectedOrder.createdAt)}
                      </p>
                    </div>
                    {selectedOrder.actualDeliveryTime && (
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Delivered At</p>
                        <p className="font-medium text-gray-800 dark:text-gray-100 text-sm sm:text-base">
                          {formatDate(selectedOrder.actualDeliveryTime)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Update Status */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 md:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">Update Status</h3>
                  <div className="space-y-2">
                    {orderStatuses.slice(1).map((status) => {
                      const StatusIcon = status.icon;
                      const isCurrentStatus = selectedOrder.status?.toLowerCase() === status.value;
                      const canUpdate = !isCurrentStatus && selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled';
                      
                      return (
                        <button
                          key={status.value}
                          onClick={() => canUpdate && updateOrderStatus(selectedOrder._id, status.value)}
                          disabled={isCurrentStatus || isUpdating || selectedOrder.status === 'delivered' || selectedOrder.status === 'cancelled'}
                          className={`w-full flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg text-left transition-colors ${
                            isCurrentStatus
                              ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 cursor-not-allowed'
                              : canUpdate
                              ? 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                              : 'bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
                          }`}
                        >
                          {StatusIcon && <StatusIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
                          <span className="text-xs sm:text-sm font-medium truncate">
                            {status.label}
                            {isCurrentStatus && ' (Current)'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 md:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">Order Summary</h3>
                  {selectedOrder.pricing && (
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span className="text-gray-800 dark:text-gray-100">${selectedOrder.pricing.subtotal?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Delivery Fee</span>
                        <span className="text-gray-800 dark:text-gray-100">${selectedOrder.pricing.deliveryFee?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Tax</span>
                        <span className="text-gray-800 dark:text-gray-100">${selectedOrder.pricing.tax?.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-2 sm:pt-3 flex justify-between font-semibold">
                        <span className="text-gray-800 dark:text-gray-100 text-sm sm:text-base">Total</span>
                        <span className="text-orange-500 dark:text-orange-400 text-base sm:text-lg">${selectedOrder.pricing.total?.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
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
        <main className="flex-1 p-3 sm:p-4 lg:p-6 xl:p-8">
          <ToastContainer position="top-right" />
          
          {/* Page Header */}
          <div className="mb-4 sm:mb-6 lg:mb-8 xl:mb-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2 lg:mb-3 transition-colors duration-300 truncate">
                  Orders Management
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Monitor and manage all customer orders
                </p>
              </div>
              <div className="flex flex-row gap-2 sm:gap-3 shrink-0">
                <button
                  onClick={handleCreateOrder}
                  className="bg-green-500 dark:bg-green-600 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-green-600 dark:hover:bg-green-700 transition-colors duration-300 flex items-center justify-center gap-1 sm:gap-2 shadow-sm dark:shadow-2xl text-xs sm:text-sm lg:text-base"
                >
                  <MdAdd className="text-base sm:text-lg" />
                  <span className="hidden sm:inline lg:hidden xl:inline">Create Order</span>
                  <span className="sm:hidden lg:inline xl:hidden">Create</span>
                </button>
                <button
                  onClick={() => fetchOrders(pagination.currentPage)}
                  disabled={isLoading}
                  className="bg-orange-500 dark:bg-orange-600 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300 flex items-center justify-center gap-1 sm:gap-2 shadow-sm dark:shadow-2xl disabled:opacity-50 text-xs sm:text-sm lg:text-base"
                >
                  <FiRefreshCw className={`text-base sm:text-lg ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
              <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 lg:p-4 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300 truncate">
                  Total Orders
                </p>
                <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                  {pagination.totalOrders}
                </p>
              </div>
              {getOrderStats().map((stat) => (
                <div key={stat.value} className="bg-white dark:bg-gray-800 p-2 sm:p-3 lg:p-4 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300 truncate">
                    {stat.label}
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                    {stat.count}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 transition-colors duration-300">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-full sm:max-w-md">
                <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors duration-300 text-sm sm:text-base" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-2 sm:gap-4 items-center">
                <IoFilterOutline className="text-gray-400 dark:text-gray-500 transition-colors duration-300 hidden sm:block" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-w-[100px] sm:min-w-[150px]"
                >
                  {orderStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {isLoading ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm dark:shadow-2xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8 lg:p-12 xl:p-16 text-center transition-colors duration-300">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-orange-500 mx-auto mb-3 sm:mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm dark:shadow-2xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8 lg:p-12 xl:p-16 text-center transition-colors duration-300">
              <div className="text-4xl sm:text-6xl lg:text-8xl mb-3 sm:mb-4 lg:mb-6 opacity-50">📦</div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3 transition-colors duration-300">
                {searchTerm ? "No orders found" : "No orders yet"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base lg:text-lg transition-colors duration-300 max-w-md mx-auto">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Orders will appear here when customers place them"}
              </p>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-3 sm:mb-4 lg:mb-6">
                <p className="text-gray-600 dark:text-gray-300 font-medium transition-colors duration-300 text-sm sm:text-base">
                  Showing {filteredOrders.length} orders
                </p>
              </div>

              {/* Mobile Cards View */}
              <div className="block lg:hidden space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {filteredOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <div key={order._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-2xl border border-gray-100 dark:border-gray-700 p-3 sm:p-4 transition-colors duration-300">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0 mr-3">
                          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">
                            #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                            {order.userId?.name || 'N/A'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          {StatusIcon && <StatusIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color} dark:bg-opacity-20 truncate max-w-[80px] sm:max-w-none`}>
                            <span className="sm:hidden">{statusInfo.label.slice(0, 3)}</span>
                            <span className="hidden sm:inline">{statusInfo.label}</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Items</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {order.items?.length || 0} items
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Total</p>
                          <p className="font-bold text-gray-900 dark:text-gray-100">
                            ${order.pricing?.total?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mb-3 sm:mb-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderModal(true);
                          }}
                          className="flex-1 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/70 transition-colors flex items-center justify-center gap-1"
                        >
                          <MdVisibility className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>View</span>
                        </button>
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderModal(true);
                            }}
                            className="flex-1 bg-orange-50 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-orange-100 dark:hover:bg-orange-900/70 transition-colors flex items-center justify-center gap-1"
                          >
                            <MdEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Update</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600 transition-colors duration-300">
                      <tr>
                        <th className="px-4 xl:px-8 py-4 xl:py-5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                          Order
                        </th>
                        <th className="px-4 xl:px-8 py-4 xl:py-5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                          Customer
                        </th>
                        <th className="px-4 xl:px-8 py-4 xl:py-5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                          Items
                        </th>
                        <th className="px-4 xl:px-8 py-4 xl:py-5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                          Total
                        </th>
                        <th className="px-4 xl:px-8 py-4 xl:py-5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                          Status
                        </th>
                        <th className="px-4 xl:px-8 py-4 xl:py-5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                          Date
                        </th>
                        <th className="px-4 xl:px-8 py-4 xl:py-5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-600 transition-colors duration-300">
                      {filteredOrders.map((order) => {
                        const statusInfo = getStatusInfo(order.status);
                        const StatusIcon = statusInfo.icon;
                        
                        return (
                          <tr
                            key={order._id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            <td className="px-4 xl:px-8 py-4 xl:py-6 whitespace-nowrap">
                              <div className="font-bold text-gray-900 dark:text-gray-100 text-sm transition-colors duration-300">
                                #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
                              </div>
                            </td>
                            <td className="px-4 xl:px-8 py-4 xl:py-6">
                              <div className="max-w-[200px]">
                                <div className="font-medium text-gray-900 dark:text-gray-100 text-sm transition-colors duration-300 truncate">
                                  {order.userId?.name || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300 truncate">
                                  {order.userId?.email || order.contactInfo?.email || 'N/A'}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 xl:px-8 py-4 xl:py-6 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-medium transition-colors duration-300">
                              {order.items?.length || 0} items
                            </td>
                            <td className="px-4 xl:px-8 py-4 xl:py-6 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                              ${order.pricing?.total?.toFixed(2) || '0.00'}
                            </td>
                            <td className="px-4 xl:px-8 py-4 xl:py-6 whitespace-nowrap">
                              <div className="flex items-center space-x-2 max-w-[140px]">
                                {StatusIcon && <StatusIcon className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />}
                                <span className={`px-2 xl:px-3 py-1 xl:py-1.5 text-xs font-medium rounded-full ${statusInfo.color} dark:bg-opacity-20 transition-colors duration-300 truncate`}>
                                  {statusInfo.label}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 xl:px-8 py-4 xl:py-6 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                              <div className="max-w-[120px]">
                                <div className="font-medium truncate">{formatDate(order.createdAt).split(' at ')[0]}</div>
                                <div className="text-xs truncate">{formatDate(order.createdAt).split(' at ')[1]}</div>
                              </div>
                            </td>
                            <td className="px-4 xl:px-8 py-4 xl:py-6 whitespace-nowrap">
                              <div className="flex gap-1 xl:gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setShowOrderModal(true);
                                  }}
                                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors duration-300"
                                  title="View order details"
                                >
                                  <MdVisibility className="w-4 h-4 xl:w-5 xl:h-5" />
                                </button>
                                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                  <button
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setShowOrderModal(true);
                                    }}
                                    className="p-2 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/50 rounded-lg transition-colors duration-300"
                                    title="Update order status"
                                  >
                                    <MdEdit className="w-4 h-4 xl:w-5 xl:h-5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-4 sm:mt-6 lg:mt-8 flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={() => {
                      setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
                      fetchOrders(pagination.currentPage - 1);
                    }}
                    disabled={pagination.currentPage === 1 || isLoading}
                    className="w-full sm:w-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto max-w-full">
                    {Array.from({ length: Math.min(pagination.totalPages, window.innerWidth < 640 ? 3 : 5) }, (_, i) => {
                      const pageNumber = i + 1;
                      const isCurrentPage = pageNumber === pagination.currentPage;
                      
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => {
                            setPagination(prev => ({ ...prev, currentPage: pageNumber }));
                            fetchOrders(pageNumber);
                          }}
                          disabled={isLoading}
                          className={`px-2 sm:px-3 lg:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-300 ${
                            isCurrentPage
                              ? 'bg-orange-500 dark:bg-orange-600 text-white'
                              : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => {
                      setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
                      fetchOrders(pagination.currentPage + 1);
                    }}
                    disabled={pagination.currentPage === pagination.totalPages || isLoading}
                    className="w-full sm:w-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && <OrderModal />}
      
      {/* Create Order Modal */}
      {showCreateModal &&  
      <CreateOrderModal 
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        token={token}
        base_url={base_url}
        onOrderCreated={handleOrderCreated}
      />}
    </div>
  );
};

export default Orders;