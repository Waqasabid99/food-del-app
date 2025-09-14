import React, { useEffect, useState } from "react";
import {
  MdVisibility,
  MdEdit,
  MdCancel,
  MdCheckCircle,
  MdLocalShipping,
  MdRestaurant,
  MdPending,
} from "react-icons/md";
import { IoSearchOutline, IoFilterOutline } from "react-icons/io5";
import { FiRefreshCw } from "react-icons/fi";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAdminAuthStore from "@/store/authStore";

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

  const OrderModal = () => {
    if (!selectedOrder) return null;

    const statusInfo = getStatusInfo(selectedOrder.status);
    const StatusIcon = statusInfo.icon;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-8">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Order Details
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  #{selectedOrder.orderNumber || selectedOrder._id?.slice(-8).toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Order Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Customer Info */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Customer Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                      <p className="font-medium text-gray-800 dark:text-gray-100">
                        {selectedOrder.userId?.name || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                      <p className="font-medium text-gray-800 dark:text-gray-100">
                        {selectedOrder.userId?.email || selectedOrder.contactInfo?.email || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                      <p className="font-medium text-gray-800 dark:text-gray-100">
                        {selectedOrder.contactInfo?.phone || selectedOrder.userId?.phone || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Payment Method</p>
                      <p className="font-medium text-gray-800 dark:text-gray-100 capitalize">
                        {selectedOrder.paymentMethod || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                {selectedOrder.deliveryAddress && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Delivery Address</h3>
                    <div className="text-gray-700 dark:text-gray-300">
                      <p>{selectedOrder.deliveryAddress.street}</p>
                      <p>{selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.zipCode}</p>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Order Items</h3>
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                        <div className="flex items-center space-x-4">
                          <img
                            src={`${base_url}/uploads/foodImages/${item.image}`}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = '/placeholder-food.jpg';
                            }}
                          />
                          <div>
                            <h4 className="font-medium text-gray-800 dark:text-gray-100">{item.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              ${item.price?.toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-800 dark:text-gray-100">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Instructions */}
                {selectedOrder.specialInstructions && (
                  <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-2">Special Instructions</h3>
                    <p className="text-amber-700 dark:text-amber-300">{selectedOrder.specialInstructions}</p>
                  </div>
                )}
              </div>

              {/* Right Column - Status & Actions */}
              <div className="space-y-6">
                {/* Current Status */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Order Status</h3>
                  <div className="flex items-center space-x-3 mb-4">
                    {StatusIcon && <StatusIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />}
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusInfo.color} dark:bg-opacity-20`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Order Placed</p>
                      <p className="font-medium text-gray-800 dark:text-gray-100">
                        {formatDate(selectedOrder.createdAt)}
                      </p>
                    </div>
                    {selectedOrder.actualDeliveryTime && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Delivered At</p>
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {formatDate(selectedOrder.actualDeliveryTime)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Update Status */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Update Status</h3>
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
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                            isCurrentStatus
                              ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 cursor-not-allowed'
                              : canUpdate
                              ? 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                              : 'bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
                          }`}
                        >
                          {StatusIcon && <StatusIcon className="w-5 h-5" />}
                          <span className="text-sm font-medium">
                            {status.label}
                            {isCurrentStatus && ' (Current)'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Order Summary</h3>
                  {selectedOrder.pricing && (
                    <div className="space-y-3">
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
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-semibold">
                        <span className="text-gray-800 dark:text-gray-100">Total</span>
                        <span className="text-orange-500 dark:text-orange-400 text-lg">${selectedOrder.pricing.total?.toFixed(2)}</span>
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
        <main className="flex-1 p-8">
          <ToastContainer position="top-right" />
          
          {/* Page Header */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3 transition-colors duration-300">
                  Orders Management
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Monitor and manage all customer orders
                </p>
              </div>
              <button
                onClick={() => fetchOrders(pagination.currentPage)}
                disabled={isLoading}
                className="bg-orange-500 dark:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300 flex items-center gap-2 shadow-sm dark:shadow-2xl disabled:opacity-50"
              >
                <FiRefreshCw className={`text-lg ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                  {pagination.totalOrders}
                </p>
              </div>
              {getOrderStats().map((stat) => (
                <div key={stat.value} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                    {stat.count}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors duration-300">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Search by order number, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-4 items-center">
                <IoFilterOutline className="text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-w-[150px]"
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-2xl border border-gray-100 dark:border-gray-700 p-16 text-center transition-colors duration-300">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-2xl border border-gray-100 dark:border-gray-700 p-16 text-center transition-colors duration-300">
              <div className="text-8xl mb-6 opacity-50">📦</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3 transition-colors duration-300">
                {searchTerm ? "No orders found" : "No orders yet"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg transition-colors duration-300">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Orders will appear here when customers place them"}
              </p>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-300 font-medium transition-colors duration-300">
                  Showing {filteredOrders.length} orders
                </p>
              </div>

              {/* Orders Table */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600 transition-colors duration-300">
                      <tr>
                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                          Order
                        </th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                          Customer
                        </th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                          Items
                        </th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                          Total
                        </th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                          Status
                        </th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                          Date
                        </th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
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
                            <td className="px-8 py-6 whitespace-nowrap">
                              <div className="font-bold text-gray-900 dark:text-gray-100 text-sm transition-colors duration-300">
                                #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
                              </div>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap">
                              <div>
                                <div className="font-medium text-gray-900 dark:text-gray-100 text-sm transition-colors duration-300">
                                  {order.userId?.name || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                                  {order.userId?.email || order.contactInfo?.email || 'N/A'}
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-medium transition-colors duration-300">
                              {order.items?.length || 0} items
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                              ${order.pricing?.total?.toFixed(2) || '0.00'}
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {StatusIcon && <StatusIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
                                <span className={`px-3 py-1.5 text-xs font-medium rounded-full ${statusInfo.color} dark:bg-opacity-20 transition-colors duration-300`}>
                                  {statusInfo.label}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                              <div className="max-w-xs">
                                <div className="font-medium">{formatDate(order.createdAt).split(' at ')[0]}</div>
                                <div className="text-xs">{formatDate(order.createdAt).split(' at ')[1]}</div>
                              </div>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setShowOrderModal(true);
                                  }}
                                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors duration-300"
                                  title="View order details"
                                >
                                  <MdVisibility className="w-5 h-5" />
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
                                    <MdEdit className="w-5 h-5" />
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
                <div className="mt-8 flex justify-center items-center space-x-4">
                  <button
                    onClick={() => {
                      setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
                      fetchOrders(pagination.currentPage - 1);
                    }}
                    disabled={pagination.currentPage === 1 || isLoading}
                    className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
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
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
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
                    className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
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
    </div>
  );
};

export default Orders;