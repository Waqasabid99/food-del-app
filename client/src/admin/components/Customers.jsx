import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import {
  MdEdit,
  MdDelete,
  MdVisibility,
  MdPerson,
  MdPhone,
  MdEmail,
} from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import { FiRefreshCw } from "react-icons/fi";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Customers = () => {
  const [activeTab, setActiveTab] = useState("customers");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const base_url =
    import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${base_url}/api/user/getall`, {
        withCredentials: true,
      });

      if (response.data) {
        setCustomers(response.data.users || []);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Error fetching customers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId, customerName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${customerName}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await axios.delete(
        `${base_url}/api/user/delete/${customerId}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setCustomers(
          customers.filter((customer) => customer._id !== customerId)
        );
        toast.success("Customer deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      if (error.response?.status === 404) {
        toast.error(
          "Delete endpoint not implemented. Please add DELETE /api/user/delete/:id route."
        );
      } else {
        toast.error("Error deleting customer. Please try again.");
      }
    }
  };

  //handle create customer
  const handleCreateCustomer = async (data, reset) => {
    // Validation
    if (!data.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!data.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }
    if (!data.password || data.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsCreating(true);
    try {
      const response = await axios.post(
        `${base_url}/api/user/register`,
        {
          name: data.name.trim(),
          phone: data.phone.trim(),
          email: data.email.trim() || undefined,
          password: data.password,
        },
        { withCredentials: true }
      );

      if (response.data) {
        setCustomers([response.data.user, ...customers]);
        toast.success("Customer created successfully!");
        setShowCreateModal(false);
        reset({ name: "", phone: "", email: "", password: "" }); // reset modal form
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Error creating customer. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " at " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(customer.phone || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CustomerModal = () => {
    if (!selectedCustomer) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-8">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Customer Details
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  View customer information and activity
                </p>
              </div>
              <button
                onClick={() => setShowCustomerModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Customer Information */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <MdPerson className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Name
                      </p>
                      <p className="font-medium text-gray-800 dark:text-gray-100">
                        {selectedCustomer.name || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MdPhone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Phone
                      </p>
                      <p className="font-medium text-gray-800 dark:text-gray-100">
                        {selectedCustomer.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                  {selectedCustomer.email && (
                    <div className="flex items-center space-x-3">
                      <MdEmail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Email
                        </p>
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {selectedCustomer.email}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Account Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Customer ID
                    </p>
                    <p className="font-medium text-gray-800 dark:text-gray-100 font-mono text-sm">
                      {selectedCustomer._id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Member Since
                    </p>
                    <p className="font-medium text-gray-800 dark:text-gray-100">
                      {formatDate(selectedCustomer.createdAt)}
                    </p>
                  </div>
                  {selectedCustomer.updatedAt && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last Updated
                      </p>
                      <p className="font-medium text-gray-800 dark:text-gray-100">
                        {formatDate(selectedCustomer.updatedAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowCustomerModal(false)}
                className="flex-1 px-6 py-3 bg-gray-600 dark:bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-300"
              >
                Close
              </button>
              <button
                onClick={() =>
                  handleDeleteCustomer(
                    selectedCustomer._id,
                    selectedCustomer.name
                  )
                }
                className="px-6 py-3 bg-red-500 dark:bg-red-600 text-white rounded-lg font-medium hover:bg-red-600 dark:hover:bg-red-700 transition-colors duration-300"
              >
                Delete Customer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CreateCustomerModal = ({ onClose, onSubmit, isCreating }) => {
    const [newCustomer, setNewCustomer] = useState({
      name: "",
      phone: "",
      email: "",
      password: "",
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(newCustomer, setNewCustomer);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl">
          <form onSubmit={handleSubmit}>
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Create New Customer
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Add a new customer to the system
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustomer.name}
                    onChange={(e) =>
                      setNewCustomer((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                    placeholder="Enter customer name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newCustomer.phone}
                    onChange={(e) =>
                      setNewCustomer((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) =>
                      setNewCustomer((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength="6"
                    value={newCustomer.password}
                    onChange={(e) =>
                      setNewCustomer((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                    placeholder="Enter password (min. 6 characters)"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-600 dark:bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 px-6 py-3 bg-orange-500 dark:bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? "Creating..." : "Create Customer"}
                </button>
              </div>
            </div>
          </form>
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
                  Customers Management
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Manage your customer database
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={fetchCustomers}
                  disabled={isLoading}
                  className="bg-gray-500 dark:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors duration-300 flex items-center gap-2 shadow-sm dark:shadow-2xl disabled:opacity-50"
                >
                  <FiRefreshCw
                    className={`text-lg ${isLoading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-orange-500 dark:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300 flex items-center gap-2 shadow-sm dark:shadow-2xl"
                >
                  <IoMdAdd className="text-lg" />
                  Add New Customer
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Total Customers
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                  {customers.length}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  New This Month
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 transition-colors duration-300">
                  {
                    customers.filter((customer) => {
                      const createdDate = new Date(customer.createdAt);
                      const currentDate = new Date();
                      return (
                        createdDate.getMonth() === currentDate.getMonth() &&
                        createdDate.getFullYear() === currentDate.getFullYear()
                      );
                    }).length
                  }
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  With Email
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">
                  {customers.filter((customer) => customer.email).length}
                </p>
              </div>
            </div>
          </div>

          {/* Search and View Mode */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors duration-300">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden transition-colors duration-300">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 text-sm transition-colors duration-300 ${
                    viewMode === "grid"
                      ? "bg-orange-500 dark:bg-orange-600 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 text-sm transition-colors duration-300 ${
                    viewMode === "list"
                      ? "bg-orange-500 dark:bg-orange-600 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Customers Display */}
          {isLoading ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-2xl border border-gray-100 dark:border-gray-700 p-16 text-center transition-colors duration-300">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading customers...
              </p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-2xl border border-gray-100 dark:border-gray-700 p-16 text-center transition-colors duration-300">
              <div className="text-8xl mb-6 opacity-50">👥</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3 transition-colors duration-300">
                {searchTerm ? "No customers found" : "No customers yet"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg transition-colors duration-300">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Start by adding your first customer"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 transform hover:scale-105 transition-all duration-200 shadow-lg dark:shadow-2xl"
                >
                  Add Your First Customer
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-300 font-medium transition-colors duration-300">
                  Showing {filteredCustomers.length} of {customers.length}{" "}
                  customers
                </p>
              </div>

              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer._id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-xl transition-all duration-300"
                    >
                      <div className="p-6">
                        {/* Customer Avatar */}
                        <div className="flex justify-center mb-4">
                          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                            <MdPerson className="w-8 h-8 text-orange-500 dark:text-orange-400" />
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div className="text-center mb-4">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1 transition-colors duration-300">
                            {customer.name || "Unnamed Customer"}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                            {customer.phone}
                          </p>
                          {customer.email && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                              {customer.email}
                            </p>
                          )}
                        </div>

                        {/* Member Since */}
                        <div className="text-center mb-4">
                          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                            Member since{" "}
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setShowCustomerModal(true);
                            }}
                            className="flex-1 px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-md transition-colors duration-300 text-center"
                            title="View customer details"
                          >
                            <MdVisibility className="w-4 h-4 mx-auto" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteCustomer(customer._id, customer.name)
                            }
                            className="flex-1 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md transition-colors duration-300 text-center"
                            title="Delete customer"
                          >
                            <MdDelete className="w-4 h-4 mx-auto" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600 transition-colors duration-300">
                        <tr>
                          <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                            Customer
                          </th>
                          <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                            Contact
                          </th>
                          <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                            Member Since
                          </th>
                          <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-600 transition-colors duration-300">
                        {filteredCustomers.map((customer) => (
                          <tr
                            key={customer._id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            <td className="px-8 py-6 whitespace-nowrap">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                                  <MdPerson className="w-6 h-6 text-orange-500 dark:text-orange-400" />
                                </div>
                                <div>
                                  <div className="font-bold text-gray-900 dark:text-gray-100 text-lg transition-colors duration-300">
                                    {customer.name || "Unnamed Customer"}
                                  </div>
                                  <div className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300 font-mono">
                                    ID: {customer._id?.slice(-8).toUpperCase()}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <MdPhone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                  <span className="text-gray-800 dark:text-gray-200 font-medium transition-colors duration-300">
                                    {customer.phone}
                                  </span>
                                </div>
                                {customer.email && (
                                  <div className="flex items-center gap-2">
                                    <MdEmail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                                      {customer.email}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                              <div className="max-w-xs">
                                <div className="font-medium">
                                  {
                                    formatDate(customer.createdAt).split(
                                      " at "
                                    )[0]
                                  }
                                </div>
                                <div className="text-xs">
                                  {
                                    formatDate(customer.createdAt).split(
                                      " at "
                                    )[1]
                                  }
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedCustomer(customer);
                                    setShowCustomerModal(true);
                                  }}
                                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors duration-300"
                                  title="View customer details"
                                >
                                  <MdVisibility className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteCustomer(
                                      customer._id,
                                      customer.name
                                    )
                                  }
                                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-colors duration-300"
                                  title="Delete customer"
                                >
                                  <MdDelete className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Customer Details Modal */}
      {showCustomerModal && <CustomerModal />}

      {/* Create Customer Modal */}
      {showCreateModal && (
        <CreateCustomerModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={(data, reset) => handleCreateCustomer(data, reset)}
          isCreating={isCreating}
        />
      )}
    </div>
  );
};

export default Customers;
