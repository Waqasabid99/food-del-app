import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "@/context/useAuth";
import axios from "axios";
import { ToastContainer } from "react-toastify";

const Signup = ({ handleShowSignup, handleShowLogin, handleCloseAuth }) => {
  const [formData, setFormData] = useState({
    phone: "",
    name: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000";
  const navigate = useNavigate()

  // Get auth functions and state from the store
  const { register, isLoading, error, clearError, isAuthenticated } = useAuth();

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
    setValidationErrors({});
  }, [clearError]);

  // Redirect if already authenticated
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     handleShowSignup(false);
  //   }
  // }, [isAuthenticated, handleShowSignup]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear specific field error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: "",
      });
    }
  };

  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      phone: value,
    });
    
    // Clear phone error when user changes phone
    if (validationErrors.phone) {
      setValidationErrors({
        ...validationErrors,
        phone: "",
      });
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    
    // Clear confirm password error when user types
    if (validationErrors.confirmPassword) {
      setValidationErrors({
        ...validationErrors,
        confirmPassword: "",
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validate name
    if (!formData.name.trim()) {
      errors.name = "Username is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Username must be at least 2 characters";
    }

    // Validate phone
    if (!formData.phone || formData.phone.length < 10) {
      errors.phone = "Please enter a valid phone number";
    }

    // Validate password
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Validate confirm password
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== formData.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any existing errors
    clearError();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Prepare registration data
    const registrationData = {
      name: formData.name.trim(),
      phone: formData.phone,
      password: formData.password,
    };

    try {
      // Call register function from auth store
      const result = await register(registrationData);
      console.log(result)
      if (result.status === 200) {
        // Registration successful - user is now logged in automatically
        console.log("Registration successful:", result.message);
        
        // Close the signup modal
        setTimeout(() => {
          handleCloseAuth()
        }, 1000)
        
      } else {
        // Registration failed
        console.error("Registration failed:", result.message);
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  const getFieldError = (fieldName) => {
    return validationErrors[fieldName] || "";
  };

  return (
    <div className="w-full flex h-screen items-center justify-center py-10 bg-white dark:bg-gray-900 transition-colors duration-300">
      <ToastContainer />
      <div className="relative max-h-fit w-[400px] bg-white dark:bg-gray-800 shadow-lg dark:shadow-2xl rounded-2xl p-6 transition-all duration-300 border-0 dark:border dark:border-gray-600">
        <button
          onClick={() => handleCloseAuth()}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-300"
          aria-label="Close"
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
        
        <h2 className="text-2xl font-bold text-center mb-5 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          Sign Up
        </h2>

        {/* Error Message Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Phone Number */}
          <div>
            <PhoneInput
              country={"us"}
              value={formData.phone}
              onChange={handlePhoneChange}
              inputStyle={{
                width: "100%",
                height: "45px",
                borderRadius: "8px",
                backgroundColor: "inherit",
                color: "inherit",
                border: getFieldError('phone') ? "1px solid #ef4444" : "1px solid #d1d5db",
              }}
              containerClass="dark:text-gray-200"
              inputClass="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            />
            {getFieldError('phone') && (
              <p className="text-red-500 text-sm mt-1">{getFieldError('phone')}</p>
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
              className={`w-full p-3 border rounded-lg 
                         bg-white dark:bg-gray-700 
                         text-gray-700 dark:text-gray-200 
                         placeholder:text-gray-500 dark:placeholder:text-gray-400
                         transition-all duration-300
                         ${getFieldError('name') 
                           ? 'border-red-500 focus:outline-red-500 focus:ring-2 focus:ring-red-500' 
                           : 'border-gray-300 dark:border-gray-600 focus:outline-orange-500 focus:ring-2 focus:ring-orange-500'
                         }`}
              required
            />
            {getFieldError('name') && (
              <p className="text-red-500 text-sm mt-1">{getFieldError('name')}</p>
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
              className={`w-full p-3 border rounded-lg 
                         bg-white dark:bg-gray-700 
                         text-gray-700 dark:text-gray-200 
                         placeholder:text-gray-500 dark:placeholder:text-gray-400
                         transition-all duration-300
                         ${getFieldError('password') 
                           ? 'border-red-500 focus:outline-red-500 focus:ring-2 focus:ring-red-500' 
                           : 'border-gray-300 dark:border-gray-600 focus:outline-orange-500 focus:ring-2 focus:ring-orange-500'
                         }`}
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
              className={`w-full p-3 border rounded-lg 
                         bg-white dark:bg-gray-700 
                         text-gray-700 dark:text-gray-200 
                         placeholder:text-gray-500 dark:placeholder:text-gray-400
                         transition-all duration-300
                         ${getFieldError('confirmPassword') 
                           ? 'border-red-500 focus:outline-red-500 focus:ring-2 focus:ring-red-500' 
                           : 'border-gray-300 dark:border-gray-600 focus:outline-orange-500 focus:ring-2 focus:ring-orange-500'
                         }`}
              required
            />
            {getFieldError('confirmPassword') && (
              <p className="text-red-500 text-sm mt-1">{getFieldError('confirmPassword')}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`py-3 rounded-lg text-white font-medium transition-all duration-300 
                       ${isLoading 
                         ? 'bg-gray-400 cursor-not-allowed' 
                         : 'bg-orange-500 hover:bg-orange-600 hover:scale-95'
                       }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Already have an account?{" "}
          <Link
            onClick={() => {
              handleShowSignup(false);
              handleShowLogin(true);
            }}
            className="text-orange-500 font-semibold hover:text-orange-600 transition-colors duration-300"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;