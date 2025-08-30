import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import useAuth from "@/context/useAuth";

const Checkout = ({ handleShowLogin }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [authStep, setAuthStep] = useState("auth"); // "auth" | "details"
  const { showLogin, showSignup, login, register, isLoading, error, clearError, isAuthenticated, user, token } = useAuth();
  const { cart, clearCart } = useCart();
  const base_url = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000";

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    username: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "cash",
    specialInstructions: ""
  });

  // Fill form with user data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
        phone: user.phone || "",
        username: user.name || user.username || "",
        // Keep existing address data if user has filled it
        address: prev.address || "",
        city: prev.city || "",
        zipCode: prev.zipCode || "",
      }));
      setAuthStep("details"); // Skip auth step if already authenticated
    } else {
      setAuthStep("auth"); // Show auth step if not authenticated
    }
  }, [isAuthenticated, user]);

  // Clear auth errors when switching between login/register
  useEffect(() => {
    clearError();
  }, [isLogin, clearError]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 2.99;
  const tax = subtotal * 0.1;
  const total = subtotal + deliveryFee + tax;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) clearError();
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login flow - need email OR phone, not both
      const credentials = {
        password: formData.password,
      };
      
      // Use email or phone based on what user filled
      if (formData.email && !formData.phone) {
        credentials.email = formData.email;
      } else if (formData.phone && !formData.email) {
        credentials.phone = formData.phone;
      } else if (formData.email && formData.phone) {
        // If both are provided, prefer email
        credentials.email = formData.email;
      } else {
        alert("Please provide either email or phone number");
        return;
      }

      const result = await login(credentials);
      if (result && result.success) {
        console.log("Login successful during checkout");
        setAuthStep("details");
      }
    } else {
      // Register flow
      if (!formData.username) {
        alert("Name is required for registration");
        return;
      }

      const userData = {
        name: formData.username,
        password: formData.password,
      };

      // Include email or phone based on what user filled
      if (formData.email) {
        userData.email = formData.email;
        userData.phone = formData.phone || "";
      } else if (formData.phone) {
        userData.phone = formData.phone;
        userData.email = formData.email || "";
      } else {
        alert("Please provide either email or phone number");
        return;
      }

      const result = await register(userData);
      if (result && result.success) {
        console.log("Registration successful during checkout");
        setAuthStep("details");
      }
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert("Please log in or register to place your order");
      return;
    }

    // Validate required fields for order
    if (!formData.phone) {
      alert("Phone number is required for order delivery");
      return;
    }

    if (!formData.address || !formData.city || !formData.zipCode) {
      alert("Please fill in all delivery address fields");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      const orderData = {
        items: cart.map(item => ({
          id: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        deliveryAddress: {
          street: formData.address,
          city: formData.city,
          zipCode: formData.zipCode
        },
        contactInfo: {
          phone: formData.phone,
          email: formData.email || ""
        },
        paymentMethod: formData.paymentMethod,
        pricing: {
          subtotal: parseFloat(subtotal.toFixed(2)),
          deliveryFee: parseFloat(deliveryFee.toFixed(2)),
          tax: parseFloat(tax.toFixed(2)),
          total: parseFloat(total.toFixed(2))
        },
        specialInstructions: formData.specialInstructions || ""
      };

      const response = await fetch(`${base_url}/api/order/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Order placed successfully:", result);
        clearCart();
        navigate('/thank-you', { 
          state: { 
            orderNumber: result.orderNumber,
            total: total.toFixed(2)
          } 
        });
      } else {
        throw new Error(result.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order placement error:', error);
      alert(`Failed to place order: ${error.message}`);
    }
  };

  // Determine which fields to show based on user authentication and data
  const shouldShowEmailField = () => {
    if (!isAuthenticated) return true; // Show both for registration/login
    return !user?.email; // Show email if user doesn't have email
  };

  const shouldShowPhoneField = () => {
    if (!isAuthenticated) return true; // Show both for registration/login
    return true; // Always show phone for order delivery
  };

  // Don't render if auth modals are showing
  if (showLogin || showSignup) {
    return null;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar handleShowLogin={handleShowLogin} />
      <div className="min-h-screen py-8 px-5">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">
              Checkout
            </h1>
            <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
              {isAuthenticated 
                ? `Complete your order${user?.name ? `, ${user.name}` : ''}` 
                : "Please log in or register to continue"
              }
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Side - Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                
                {/* Auth Step */}
                {authStep === "auth" && !isAuthenticated && (
                  <>
                    {/* Login/Register Toggle */}
                    <div className="mb-6">
                      <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 transition-colors duration-300">
                        <button
                          onClick={() => setIsLogin(true)}
                          disabled={isLoading}
                          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-300 ${
                            isLogin
                              ? "bg-white dark:bg-gray-600 text-orange-500 dark:text-orange-400 shadow-sm"
                              : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Login
                        </button>
                        <button
                          onClick={() => setIsLogin(false)}
                          disabled={isLoading}
                          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-300 ${
                            !isLogin
                              ? "bg-white dark:bg-gray-600 text-orange-500 dark:text-orange-400 shadow-sm"
                              : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Register
                        </button>
                      </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                      <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleAuthSubmit} className="space-y-6">
                      {/* Account Information */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
                          {isLogin ? "Login to Your Account" : "Create New Account"}
                        </h3>
                        <div className="space-y-4">
                          {shouldShowEmailField() && (
                            <div>
                              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                                Email {isLogin ? "" : <span className="text-red-500">*</span>}
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 ${
                                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                placeholder="your@email.com"
                                required={!isLogin && !formData.phone}
                              />
                            </div>
                          )}

                          {shouldShowPhoneField() && (
                            <div>
                              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                                Phone {isLogin ? "" : <span className="text-red-500">*</span>}
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 ${
                                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                placeholder="+1 (555) 123-4567"
                                required={!isLogin && !formData.email}
                              />
                            </div>
                          )}

                          {!isLogin && (
                            <div>
                              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                                Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 ${
                                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                placeholder="Your full name"
                                required
                              />
                            </div>
                          )}

                          <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                              Password <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              disabled={isLoading}
                              className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              placeholder="••••••••"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Auth Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-orange-500 dark:bg-orange-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {isLogin ? 'Logging in...' : 'Registering...'}
                          </>
                        ) : (
                          isLogin ? 'Login & Continue' : 'Register & Continue'
                        )}
                      </button>
                    </form>
                  </>
                )}

                {/* Order Details Step */}
                {(authStep === "details" || isAuthenticated) && (
                  <form onSubmit={handleOrderSubmit} className="space-y-6">
                    {/* Account Information Display */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
                        Account Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                            Name
                          </label>
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed transition-colors duration-300"
                          />
                        </div>
                        
                        {/* Phone field - always editable for order delivery */}
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                            Phone <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                            placeholder="+1 (555) 123-4567"
                            required
                          />
                          {!formData.phone && (
                            <p className="mt-1 text-sm text-orange-600 dark:text-orange-400">
                              Phone number is required for order delivery
                            </p>
                          )}
                        </div>

                        {/* Email field - show if user doesn't have one or if it's empty */}
                        {(!user?.email || !formData.email) && (
                          <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                              Email (Optional)
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                              placeholder="your@email.com"
                            />
                          </div>
                        )}

                        {user?.email && formData.email && (
                          <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              disabled
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed transition-colors duration-300"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
                        Delivery Address
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                            Street Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                            placeholder="123 Main Street, Apt 4B"
                            required
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                              City <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                              placeholder="New York"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                              ZIP Code <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                              placeholder="10001"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Special Instructions */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
                        Special Instructions
                      </h3>
                      <textarea
                        name="specialInstructions"
                        value={formData.specialInstructions}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                        placeholder="Any special instructions for delivery (e.g., gate code, apartment floor, etc.)"
                      />
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
                        Payment Method
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cash"
                            checked={formData.paymentMethod === "cash"}
                            onChange={handleInputChange}
                            className="mr-3 accent-orange-500 dark:accent-orange-400"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                              Cash on Delivery
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Pay with cash when your order arrives
                            </p>
                          </div>
                        </label>
                        <label className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={formData.paymentMethod === "card"}
                            onChange={handleInputChange}
                            className="mr-3 accent-orange-500 dark:accent-orange-400"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                              Credit/Debit Card
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Pay securely with your card
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right Side - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-6 sticky top-8 transition-colors duration-300">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
                  Order Summary
                </h3>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <img
                        src={`${base_url}/uploads/foodImages/${item.image}`}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.target.src = '/placeholder-food.jpg'; // Fallback image
                        }}
                      />
                      <div className="flex-1 px-3">
                        <p className="text-sm text-gray-800 dark:text-gray-100 truncate transition-colors duration-300">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm text-gray-800 dark:text-gray-100 font-medium transition-colors duration-300">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2 transition-colors duration-300">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                      Subtotal
                    </span>
                    <span className="text-gray-800 dark:text-gray-100 transition-colors duration-300">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                      Delivery Fee
                    </span>
                    <span className="text-gray-800 dark:text-gray-100 transition-colors duration-300">
                      ${deliveryFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                      Tax
                    </span>
                    <span className="text-gray-800 dark:text-gray-100 transition-colors duration-300">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-2 flex justify-between font-medium transition-colors duration-300">
                    <span className="text-gray-800 dark:text-gray-100 transition-colors duration-300">
                      Total
                    </span>
                    <span className="text-orange-500 dark:text-orange-400 transition-colors duration-300">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Order Button - Only show if in details step */}
                {(authStep === "details" || isAuthenticated) && (
                  <button
                    onClick={handleOrderSubmit}
                    disabled={isLoading || !formData.phone || !formData.address || !formData.city || !formData.zipCode}
                    className="w-full mt-6 bg-orange-500 dark:bg-orange-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Placing Order...
                      </>
                    ) : (
                      `Place Order - ${total.toFixed(2)}`
                    )}
                  </button>
                )}

                {(authStep === "details" || isAuthenticated) && (!formData.phone || !formData.address || !formData.city || !formData.zipCode) && (
                  <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700 rounded-lg">
                    <p className="text-sm text-orange-800 dark:text-orange-300 text-center">
                      {!formData.phone ? "Phone number is required" : "Please complete all delivery address fields"}
                    </p>
                  </div>
                )}

                {authStep === "auth" && !isAuthenticated && (
                  <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-300 text-center">
                      Please log in or register first
                    </p>
                  </div>
                )}

                {/* Estimated Delivery */}
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
                  <p className="text-xs text-gray-600 dark:text-gray-300 text-center transition-colors duration-300">
                    Estimated delivery: 25-35 minutes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default Checkout;