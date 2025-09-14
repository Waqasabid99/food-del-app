import AdminAuthStore from "@/store/authStore";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const AdminSignup = ({ handleShowSignup, handleShowLogin, handleCloseAuth }) => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { register } = AdminAuthStore();
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    
    // Clear confirm password error when user types
    if (errors.confirmPassword) {
      setErrors({
        ...errors,
        confirmPassword: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate username
    if (!formData.name) {
      newErrors.name = "Username is required";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Prepare admin registration data
      const adminData = {
        email: formData.email.trim().toLowerCase(),
        name: formData.name.trim(),
        password: formData.password,
        isAdmin: true, // Mark as admin user
      };

      const result = await register(adminData);

      if(result.status === 200 || result.status === 201) {
        setTimeout(() => {     
          // Registration successful, component will unmount
          console.log("Admin registration successful:", result.message);
          handleShowSignup(false);
        }, 1000)
      }
      
      // Handle successful registration
      console.log("Admin registration successful");
      
    } catch (error) {
      console.error("Admin registration error:", error);
      setErrors({ form: "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (fieldName) => {
    return errors[fieldName] || "";
  };

  return (
    <div className="w-full flex h-screen items-center justify-center py-10 bg-white">
      <ToastContainer />
      <div className="relative max-h-fit w-[400px] bg-white shadow-lg rounded-2xl p-6">
        <button
          onClick={() => handleCloseAuth()}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
          disabled={loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        
        <h2 className="text-2xl font-bold text-center mb-2 text-black">Admin Sign Up</h2>
        <p className="text-gray-500 text-center mb-5 text-sm">Create your admin account</p>

        {/* Error Message Display */}
        {errors.form && (
          <div className="mb-4 p-3 bg-red-50 border border-red-400 text-red-700 rounded-lg text-sm">
            {errors.form}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className={`w-full p-3 border rounded-lg transition-all duration-300 text-gray-500 placeholder:text-gray-500
                         ${getFieldError('email') 
                           ? 'border-red-500 focus:outline-red-500 focus:ring-2 focus:ring-red-500' 
                           : 'border-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-500'
                         }
                         ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              required
            />
            {getFieldError('email') && (
              <p className="text-red-500 text-sm mt-1">{getFieldError('email')}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Username"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className={`w-full p-3 border rounded-lg transition-all duration-300 text-gray-500 placeholder:text-gray-500
                         ${getFieldError('name') 
                           ? 'border-red-500 focus:outline-red-500 focus:ring-2 focus:ring-red-500' 
                           : 'border-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-500'
                         }
                         ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              required
            />
            {getFieldError('username') && (
              <p className="text-red-500 text-sm mt-1">{getFieldError('username')}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className={`w-full p-3 border rounded-lg transition-all duration-300 text-gray-500 placeholder:text-gray-500
                         ${getFieldError('password') 
                           ? 'border-red-500 focus:outline-red-500 focus:ring-2 focus:ring-red-500' 
                           : 'border-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-500'
                         }
                         ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              required
            />
            {getFieldError('password') && (
              <p className="text-red-500 text-sm mt-1">{getFieldError('password')}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              disabled={loading}
              className={`w-full p-3 border rounded-lg transition-all duration-300 text-gray-500 placeholder:text-gray-500
                         ${getFieldError('confirmPassword') 
                           ? 'border-red-500 focus:outline-red-500 focus:ring-2 focus:ring-red-500' 
                           : 'border-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-500'
                         }
                         ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              required
            />
            {getFieldError('confirmPassword') && (
              <p className="text-red-500 text-sm mt-1">{getFieldError('confirmPassword')}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`py-3 rounded-lg text-white font-medium transition-all duration-300
                       ${loading 
                         ? 'bg-gray-400 cursor-not-allowed' 
                         : 'bg-orange-500 hover:bg-orange-600 hover:scale-95'
                       }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              'Create Admin Account'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <button
            onClick={() => {
              if (!loading) {
                handleShowSignup(false);
                handleShowLogin(true);
              }
            }}
            disabled={loading}
            className="text-orange-500 font-semibold hover:text-orange-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminSignup;