import React, { useEffect, useState } from "react";
import {
  MdEdit,
  MdSave,
  MdCancel,
  MdVisibility,
  MdVisibilityOff,
  MdPerson,
  MdEmail,
  MdLock,
  MdSecurity,
} from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { FiRefreshCw } from "react-icons/fi";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAdminAuthStore from "@/store/authStore";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("settings");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token, admin, setAdmin } = useAdminAuthStore();
  const base_url = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000";

  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    role: "",
    createdAt: "",
  });

  const [editData, setEditData] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (admin) {
      fetchAdminProfile();
    }
  }, [admin]);

  const fetchAdminProfile = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${base_url}/api/admin/getuser/${admin._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      if (response.data && response.data.admin) {
        const adminInfo = response.data.admin;
        setAdminData({
          name: adminInfo.name || "",
          email: adminInfo.email || "",
          role: adminInfo.role || "admin",
          createdAt: adminInfo.createdAt || "",
        });
        setEditData({
          name: adminInfo.name || "",
          email: adminInfo.email || "",
        });
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      toast.error('Error loading profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!editData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (editData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(editData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form to original data
      setEditData({
        name: adminData.name,
        email: adminData.email,
      });
      setErrors({});
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleUpdateProfile = async () => {
    if (!validateForm()) return;

    setIsUpdating(true);
    try {
      const response = await axios.put(
        `${base_url}/api/admin/update/${admin._id}`,
        editData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      if (response.data && response.data.admin) {
        const updatedAdmin = response.data.admin;
        setAdminData({
          ...adminData,
          name: updatedAdmin.name,
          email: updatedAdmin.email,
        });
        
        // Update the admin in the store
        setAdmin(updatedAdmin);
        
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error updating profile. Please try again.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!validatePassword()) return;

    setIsUpdating(true);
    try {
      // Note: You'll need to create a password update endpoint
      const response = await axios.put(
        `${base_url}/api/admin/update-password/${admin._id}`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error updating password. Please try again.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      superadmin: {
        color: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
        label: "Super Admin"
      },
      admin: {
        color: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
        label: "Admin"
      }
    };

    const config = roleConfig[role] || roleConfig.admin;
    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${config.color} transition-colors duration-300`}>
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <AdminNavbar setSidebarCollapsed={setSidebarCollapsed} sidebarCollapsed={sidebarCollapsed} />
        <div className="flex">
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} sidebarCollapsed={sidebarCollapsed} />
          <main className="flex-1 p-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-2xl border border-gray-100 dark:border-gray-700 p-16 text-center transition-colors duration-300">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
                  Admin Settings
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Manage your account preferences and security settings
                </p>
              </div>
              <button
                onClick={fetchAdminProfile}
                disabled={isLoading}
                className="bg-orange-500 dark:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300 flex items-center gap-2 shadow-sm dark:shadow-2xl disabled:opacity-50"
              >
                <FiRefreshCw className={`text-lg ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="xl:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-2xl border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                        <MdPerson className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                          Profile Information
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                          Update your account details and preferences
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleEditToggle}
                            disabled={isUpdating}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors duration-300 flex items-center gap-2 disabled:opacity-50"
                          >
                            <MdCancel className="w-4 h-4" />
                            Cancel
                          </button>
                          <button
                            onClick={handleUpdateProfile}
                            disabled={isUpdating}
                            className="px-4 py-2 bg-orange-500 dark:bg-orange-600 text-white hover:bg-orange-600 dark:hover:bg-orange-700 rounded-lg transition-colors duration-300 flex items-center gap-2 disabled:opacity-50"
                          >
                            {isUpdating ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <MdSave className="w-4 h-4" />
                            )}
                            Save Changes
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleEditToggle}
                          className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 rounded-lg transition-colors duration-300 flex items-center gap-2"
                        >
                          <MdEdit className="w-4 h-4" />
                          Edit Profile
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                        Full Name
                      </label>
                      {isEditing ? (
                        <div>
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300 ${
                              errors.name ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="Enter your full name"
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                          )}
                        </div>
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-300">
                          <p className="text-gray-900 dark:text-gray-100 font-medium">{adminData.name || "N/A"}</p>
                        </div>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                        Email Address
                      </label>
                      {isEditing ? (
                        <div>
                          <input
                            type="email"
                            value={editData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300 ${
                              errors.email ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="Enter your email address"
                          />
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                          )}
                        </div>
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-300">
                          <p className="text-gray-900 dark:text-gray-100 font-medium">{adminData.email || "N/A"}</p>
                        </div>
                      )}
                    </div>

                    {/* Role Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                        Role
                      </label>
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-300">
                        {getRoleBadge(adminData.role)}
                      </div>
                    </div>

                    {/* Created Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                        Account Created
                      </label>
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-300">
                        <p className="text-gray-900 dark:text-gray-100 font-medium">{formatDate(adminData.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Overview */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-2xl border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <IoSettingsSharp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    Account Overview
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Status</span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 transition-colors duration-300">
                      Active
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Role</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300 capitalize">
                      {adminData.role}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Last Login</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      Today
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-2xl border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <MdSecurity className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    Security
                  </h3>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => {
                      // You could implement a modal or expand this section
                      toast.info('Password change feature - implement modal or expand section');
                    }}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <MdLock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Change Password</span>
                    </div>
                    <span className="text-xs text-gray-400">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-2xl border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                    <MdLock className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      Change Password
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                      Update your password to keep your account secure
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300 pr-12 ${
                          errors.currentPassword ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showCurrentPassword ? <MdVisibilityOff className="w-5 h-5" /> : <MdVisibility className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.currentPassword}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300 pr-12 ${
                          errors.newPassword ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showNewPassword ? <MdVisibilityOff className="w-5 h-5" /> : <MdVisibility className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newPassword}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300 pr-12 ${
                          errors.confirmPassword ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? <MdVisibilityOff className="w-5 h-5" /> : <MdVisibility className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleUpdatePassword}
                    disabled={isUpdating || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    className="px-6 py-3 bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700 rounded-lg transition-colors duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <MdLock className="w-4 h-4" />
                    )}
                    Update Password
                  </button>
                </div>

                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <MdSecurity className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Password Security Tips</h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                        Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and special characters.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;