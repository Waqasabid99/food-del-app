import React from "react";
import {
  MdCheckCircle,
  MdLocalShipping,
  MdRestaurant,
  MdPending,
  MdCancel,
} from "react-icons/md";

const OrderModal = ({ 
  selectedOrder, 
  showOrderModal, 
  setShowOrderModal, 
  orderStatuses, 
  updateOrderStatus, 
  isUpdating, 
  base_url 
}) => {
  if (!selectedOrder || !showOrderModal) return null;

  const getStatusInfo = (status) => {
    const statusInfo = orderStatuses.find(s => s.value === status?.toLowerCase());
    return statusInfo || { value: 'pending', label: 'Pending', icon: MdPending, color: 'bg-gray-100 text-gray-800' };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

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

export default OrderModal;