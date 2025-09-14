import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useAuth from "@/context/useAuth";

const ThankYou = ({ handleShowLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, getUserOrders } = useAuth();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get order data from navigation state or props
  const orderData = location.state;
  const base_url = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    // If we have order data from navigation, use it
    if (orderData?.orderNumber) {
      setOrderDetails({
        orderNumber: orderData.orderNumber,
        total: orderData.total,
        estimatedDelivery: "25-35 minutes"
      });
      setIsLoading(false);
    } else if (isAuthenticated) {
      // Try to fetch the most recent order
      fetchRecentOrder();
    } else {
      // No order data and not authenticated, redirect to home
      navigate('/');
    }
  }, [orderData, isAuthenticated, navigate]);

  const fetchRecentOrder = async () => {
    try {
      const result = await getUserOrders(1, 1); // Get most recent order
      if (result.success && result.orders && result.orders.length > 0) {
        const recentOrder = result.orders[0];
        setOrderDetails({
          orderNumber: recentOrder.orderNumber || recentOrder._id?.slice(-8).toUpperCase(),
          total: recentOrder.pricing?.total?.toFixed(2) || "0.00",
          estimatedDelivery: "25-35 minutes",
          items: recentOrder.items || [],
          deliveryAddress: recentOrder.deliveryAddress || null
        });
      }
    } catch (error) {
      console.error('Error fetching recent order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  const handleViewOrders = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 min-h-screen">
        <Navbar handleShowLogin={handleShowLogin} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar handleShowLogin={handleShowLogin} />
      <div className="min-h-screen py-8 px-5">
        <div className="max-w-4xl mx-auto px-4">
          {/* Success Message */}
          <div className="text-center mb-8">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <svg 
                  className="w-10 h-10 text-green-500 dark:text-green-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Thank You Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
              Thank You for Your Order!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
              {user?.name ? `Hi ${user.name}, your` : "Your"} order has been confirmed and is being prepared.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
              You'll receive updates about your order status soon.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors duration-300">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">
                  Order Confirmation
                </h2>
                {orderDetails?.orderNumber && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    Order Number: <span className="font-medium text-orange-500 dark:text-orange-400">#{orderDetails.orderNumber}</span>
                  </p>
                )}
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Total Amount
                </p>
                <p className="text-2xl font-bold text-orange-500 dark:text-orange-400 transition-colors duration-300">
                  ${orderDetails?.total || "0.00"}
                </p>
              </div>
            </div>

            {/* Order Items */}
            {orderDetails?.items && orderDetails.items.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
                  Order Items
                </h3>
                <div className="space-y-3">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                      <div className="flex items-center">
                        {item.image && (
                          <img
                            src={`${base_url}/uploads/foodImages/${item.image}`}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded mr-3"
                            onError={(e) => {
                              e.target.src = '/placeholder-food.jpg';
                            }}
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Info */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Delivery Address */}
              {orderDetails?.deliveryAddress && (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3 transition-colors duration-300">
                    Delivery Address
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-colors duration-300">
                    <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      {orderDetails.deliveryAddress.street}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      {orderDetails.deliveryAddress.city}, {orderDetails.deliveryAddress.zipCode}
                    </p>
                  </div>
                </div>
              )}

              {/* Estimated Delivery */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3 transition-colors duration-300">
                  Estimated Delivery
                </h3>
                <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg border border-orange-200 dark:border-orange-700 transition-colors duration-300">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-orange-500 dark:text-orange-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-orange-800 dark:text-orange-300 transition-colors duration-300">
                      {orderDetails?.estimatedDelivery || "25-35 minutes"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
              What's Next?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300">
                    Order Confirmation
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
                    We've received your order and started preparing it.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-400">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300">
                    Preparation
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
                    Our chefs are preparing your delicious meal.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-400">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300">
                    Delivery
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
                    Your order will be delivered to your doorstep.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleContinueShopping}
              className="px-6 py-3 bg-orange-500 dark:bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Continue Shopping
            </button>
            {isAuthenticated && (
              <button
                onClick={handleViewOrders}
                className="px-6 py-3 bg-gray-600 dark:bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                View My Orders
              </button>
            )}
          </div>

          {/* Contact Support */}
          <div className="text-center mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors duration-300">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-300">
              Need help with your order?
            </p>
            <p className="text-sm text-gray-800 dark:text-gray-200 transition-colors duration-300">
              Contact us at <span className="font-medium text-orange-500 dark:text-orange-400">support@yourstore.com</span> or 
              <span className="font-medium text-orange-500 dark:text-orange-400"> (555) 123-4567</span>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ThankYou;