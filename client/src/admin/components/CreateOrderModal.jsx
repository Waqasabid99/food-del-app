import React, { useState, useEffect } from "react";
import { MdAdd, MdClose, MdDelete, MdPerson, MdPersonAdd, MdShoppingCart } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";

const CreateOrderModal = ({ showCreateModal, setShowCreateModal, token, base_url, onOrderCreated }) => {
  // State management
  const [currentStep, setCurrentStep] = useState(1); // 1: User Selection, 2: Order Details
  const [users, setUsers] = useState([]);
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // User selection/creation state
  const [userSelectionMode, setUserSelectionMode] = useState("existing"); // "existing" or "new"
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUserData, setNewUserData] = useState({
    name: "",
    phone: "",
    email: ""
  });

  // Order creation state
  const [orderData, setOrderData] = useState({
    deliveryAddress: {
      street: "",
      city: "",
      zipCode: ""
    },
    contactInfo: {
      phone: "",
      email: ""
    },
    items: [],
    paymentMethod: "cash",
    specialInstructions: ""
  });

  const [selectedFood, setSelectedFood] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Fetch data on modal open
  useEffect(() => {
    if (showCreateModal) {
      fetchUsers();
      fetchFoods();
    }
  }, [showCreateModal]);

  // Update contact info when user changes
  useEffect(() => {
    if (selectedUser) {
      setOrderData(prev => ({
        ...prev,
        contactInfo: {
          phone: selectedUser.phone || "",
          email: selectedUser.email || ""
        }
      }));
    } else if (userSelectionMode === "new" && newUserData.phone) {
      setOrderData(prev => ({
        ...prev,
        contactInfo: {
          phone: newUserData.phone || "",
          email: newUserData.email || ""
        }
      }));
    }
  }, [selectedUser, newUserData, userSelectionMode]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${base_url}/api/user/getall`);
      if (response.data && response.data.users) {
        setUsers(response.data.users);
      }
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const fetchFoods = async () => {
    try {
      const response = await axios.get(`${base_url}/api/food/getfood`);
      if (response.data && response.data.data) {
        // Filter only available foods
        const availableFoods = response.data.data.filter(food => food.isAvailable !== false);
        setFoods(availableFoods);
      }
    } catch (error) {
      toast.error('Failed to load food items');
    }
  };

  const handleUserSelection = (user) => {
    setSelectedUser(user);
  };

  const handleNewUserDataChange = (field, value) => {
    setNewUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOrderDataChange = (field, value, nested = null) => {
    setOrderData(prev => {
      if (nested) {
        return {
          ...prev,
          [nested]: {
            ...prev[nested],
            [field]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const addItemToOrder = () => {
    if (!selectedFood || quantity < 1) {
      toast.error('Please select a food item and valid quantity');
      return;
    }

    const food = foods.find(f => f._id === selectedFood);
    if (!food) {
      toast.error('Selected food item not found');
      return;
    }

    // Check if item already exists in order
    const existingItemIndex = orderData.items.findIndex(item => item.foodId === selectedFood);
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedItems = [...orderData.items];
      updatedItems[existingItemIndex].quantity += quantity;
      setOrderData(prev => ({ ...prev, items: updatedItems }));
    } else {
      // Add new item
      const newItem = {
        foodId: food._id,
        name: food.name,
        price: food.price,
        quantity: quantity,
        image: food.image
      };
      setOrderData(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }));
    }

    // Reset selection
    setSelectedFood("");
    setQuantity(1);
    toast.success('Item added to order');
  };

  const removeItemFromOrder = (index) => {
    setOrderData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
    toast.success('Item removed from order');
  };

  const updateItemQuantity = (index, newQuantity) => {
    if (newQuantity < 1) {
      removeItemFromOrder(index);
      return;
    }

    setOrderData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, quantity: newQuantity } : item
      )
    }));
  };

  const calculateOrderTotal = () => {
    const subtotal = orderData.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = 2.99;
    const taxRate = 0.08; // 8% tax
    const tax = subtotal * taxRate;
    const total = subtotal + deliveryFee + tax;

    return {
      subtotal: subtotal.toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const validateStep1 = () => {
    if (userSelectionMode === "existing") {
      return selectedUser !== null;
    } else {
      return newUserData.name.trim() && newUserData.phone.trim();
    }
  };

  const validateStep2 = () => {
    return (
      orderData.deliveryAddress.street.trim() &&
      orderData.deliveryAddress.city.trim() &&
      orderData.deliveryAddress.zipCode.trim() &&
      orderData.contactInfo.phone.trim() &&
      orderData.items.length > 0
    );
  };

  const proceedToStep2 = () => {
    if (!validateStep1()) {
      toast.error('Please complete user selection');
      return;
    }
    setCurrentStep(2);
  };

  const goBackToStep1 = () => {
    setCurrentStep(1);
  };

  const createUserAndOrder = async () => {
    try {
      setIsLoading(true);

      let userId = selectedUser?._id;

      // Create new user if needed
      if (userSelectionMode === "new") {
        const userResponse = await axios.post(`${base_url}/api/user/register`, {
          name: newUserData.name,
          phone: newUserData.phone,
          email: newUserData.email,
          password: "defaultpassword123"
        });

        if (userResponse.data && userResponse.data.user) {
          userId = userResponse.data.user._id;
          toast.success('New user created successfully');
        } else {
          throw new Error('Failed to create user');
        }
      }

      // Calculate pricing
      const pricing = calculateOrderTotal();

      // Create order
      const orderPayload = {
        userId,
        items: orderData.items.map(item => ({
          id: item.foodId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        deliveryAddress: orderData.deliveryAddress,
        contactInfo: orderData.contactInfo,
        paymentMethod: orderData.paymentMethod,
        pricing: {
          subtotal: parseFloat(pricing.subtotal),
          deliveryFee: parseFloat(pricing.deliveryFee),
          tax: parseFloat(pricing.tax),
          total: parseFloat(pricing.total)
        },
        specialInstructions: orderData.specialInstructions
      };

      // Create order using admin endpoint
      const orderResponse = await axios.post(
        `${base_url}/api/order/admin/create-order-by-admin`,
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: userId,
          withCredentials: true
        }
      );

      if (orderResponse.data) {
        toast.success('Order created successfully!');
        onOrderCreated && onOrderCreated(orderResponse.data.order);
        handleCloseModal();
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create order';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    // Reset all state
    setCurrentStep(1);
    setUserSelectionMode("existing");
    setSelectedUser(null);
    setNewUserData({ name: "", phone: "", email: "" });
    setOrderData({
      deliveryAddress: { street: "", city: "", zipCode: "" },
      contactInfo: { phone: "", email: "" },
      items: [],
      paymentMethod: "cash",
      specialInstructions: ""
    });
    setSelectedFood("");
    setQuantity(1);
    setSearchTerm("");
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!showCreateModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-4 sm:p-6 md:p-8">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                Create New Order
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Step {currentStep} of 2: {currentStep === 1 ? 'User Selection' : 'Order Details'}
              </p>
            </div>
            <button
              onClick={handleCloseModal}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <MdClose className="w-6 h-6" />
            </button>
          </div>

          {/* Step 1: User Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* User Selection Mode */}
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setUserSelectionMode("existing")}
                  className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                    userSelectionMode === "existing"
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-900/30"
                      : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                  }`}
                >
                  <MdPerson className="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">Select Existing User</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Choose from registered users</p>
                </button>
                
                <button
                  onClick={() => setUserSelectionMode("new")}
                  className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                    userSelectionMode === "new"
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-900/30"
                      : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                  }`}
                >
                  <MdPersonAdd className="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">Create New User</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Add a new customer</p>
                </button>
              </div>

              {/* Existing User Selection */}
              {userSelectionMode === "existing" && (
                <div className="space-y-4">
                  <div className="relative">
                    <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users by name, phone, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                    {filteredUsers.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No users found
                      </div>
                    ) : (
                      filteredUsers.map((user) => (
                        <div
                          key={user._id}
                          onClick={() => handleUserSelection(user)}
                          className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors ${
                            selectedUser?._id === user._id
                              ? "bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800"
                              : "hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold text-gray-800 dark:text-gray-100">{user.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{user.phone}</p>
                              {user.email && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                              )}
                            </div>
                            {selectedUser?._id === user._id && (
                              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* New User Creation */}
              {userSelectionMode === "new" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={newUserData.name}
                        onChange={(e) => handleNewUserDataChange("name", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Enter customer name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        value={newUserData.phone}
                        onChange={(e) => handleNewUserDataChange("phone", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={newUserData.email}
                      onChange={(e) => handleNewUserDataChange("email", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
              )}

              {/* Step 1 Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={proceedToStep2}
                  disabled={!validateStep1()}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next: Order Details
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Order Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Selected User Info */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Customer Information
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Name:</strong> {selectedUser?.name || newUserData.name}</p>
                  <p><strong>Phone:</strong> {selectedUser?.phone || newUserData.phone}</p>
                  {(selectedUser?.email || newUserData.email) && (
                    <p><strong>Email:</strong> {selectedUser?.email || newUserData.email}</p>
                  )}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Delivery Address
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={orderData.deliveryAddress.street}
                      onChange={(e) => handleOrderDataChange("street", e.target.value, "deliveryAddress")}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Enter street address"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={orderData.deliveryAddress.city}
                        onChange={(e) => handleOrderDataChange("city", e.target.value, "deliveryAddress")}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Zip Code *
                      </label>
                      <input
                        type="text"
                        value={orderData.deliveryAddress.zipCode}
                        onChange={(e) => handleOrderDataChange("zipCode", e.target.value, "deliveryAddress")}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Enter zip code"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={orderData.contactInfo.phone}
                      onChange={(e) => handleOrderDataChange("phone", e.target.value, "contactInfo")}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Contact phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={orderData.contactInfo.email}
                      onChange={(e) => handleOrderDataChange("email", e.target.value, "contactInfo")}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Contact email"
                    />
                  </div>
                </div>
              </div>

              {/* Food Items Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Order Items
                </h3>
                
                {/* Add Item Controls */}
                <div className="flex space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <select
                      value={selectedFood}
                      onChange={(e) => setSelectedFood(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Select a food item</option>
                      {foods.map((food) => (
                        <option key={food._id} value={food._id}>
                          {food.name} - ${food.price.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-20">
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Qty"
                    />
                  </div>
                  <button
                    onClick={addItemToOrder}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-1"
                  >
                    <MdAdd className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Order Items List */}
                {orderData.items.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <MdShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No items added to order yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {orderData.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img
                            src={`${base_url}/uploads/foodImages/${item.image}`}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = '/placeholder-food.jpg';
                            }}
                          />
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100">{item.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateItemQuantity(index, item.quantity - 1)}
                              className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-semibold text-gray-800 dark:text-gray-100">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateItemQuantity(index, item.quantity + 1)}
                              className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500"
                            >
                              +
                            </button>
                          </div>
                          <p className="font-bold text-gray-800 dark:text-gray-100 min-w-[60px] text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeItemFromOrder(index)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                          >
                            <MdDelete className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Payment Method
                </h3>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={orderData.paymentMethod === "cash"}
                      onChange={(e) => handleOrderDataChange("paymentMethod", e.target.value)}
                      className="text-orange-500 focus:ring-orange-400"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Cash on Delivery</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={orderData.paymentMethod === "card"}
                      onChange={(e) => handleOrderDataChange("paymentMethod", e.target.value)}
                      className="text-orange-500 focus:ring-orange-400"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Card Payment</span>
                  </label>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Special Instructions (Optional)
                </h3>
                <textarea
                  value={orderData.specialInstructions}
                  onChange={(e) => handleOrderDataChange("specialInstructions", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  rows="3"
                  placeholder="Any special instructions for the order..."
                />
              </div>

              {/* Order Summary */}
              {orderData.items.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    Order Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="text-gray-800 dark:text-gray-100">${calculateOrderTotal().subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Delivery Fee</span>
                      <span className="text-gray-800 dark:text-gray-100">${calculateOrderTotal().deliveryFee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                      <span className="text-gray-800 dark:text-gray-100">${calculateOrderTotal().tax}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2 flex justify-between font-bold text-lg">
                      <span className="text-gray-800 dark:text-gray-100">Total</span>
                      <span className="text-orange-500 dark:text-orange-400">${calculateOrderTotal().total}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 Actions */}
              <div className="flex justify-between space-x-3">
                <button
                  onClick={goBackToStep1}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createUserAndOrder}
                    disabled={!validateStep2() || isLoading}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    {isLoading && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    <span>{isLoading ? 'Creating...' : 'Create Order'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateOrderModal;