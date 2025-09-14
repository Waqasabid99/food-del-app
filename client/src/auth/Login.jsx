import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Link } from "react-router-dom";
import useAuth from "../store/useAuthStore";
import { ToastContainer } from "react-toastify";

const Login = ({ handleShowLogin, handleShowSignup, handleCloseAuth }) => {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     handleShowLogin(false);
  //   }
  // }, [isAuthenticated, handleShowLogin]);

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) clearError();
  };

  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      phone: value,
    });
    // Clear error when user changes phone
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare credentials with phone and password
    const credentials = {
      phone: formData.phone,
      password: formData.password,
    };

    const result = await login(credentials);
    
    if (result.status === 200 || result.status === 201) {
      // Login successful, component will unmount
      console.log("Login successful:", result.message);

      setTimeout(() => {
        handleCloseAuth()
      }, 1000);
    }
    // Error will be handled by the store and displayed in UI
  };

  return (
    <div className="w-full flex h-screen items-center justify-center py-10 bg-white dark:bg-gray-900 transition-colors duration-300">
      <ToastContainer />
      <div className="relative max-h-fit w-[400px] bg-white dark:bg-gray-800 shadow-lg dark:shadow-2xl rounded-2xl p-6 transition-all duration-300 border-0 dark:border dark:border-gray-600">
        <button
          onClick={() => handleCloseAuth()}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-300"
          aria-label="Close"
          disabled={isLoading}
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
          Login
        </h2>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Phone Number */}
          <PhoneInput
            country={"us"}
            value={formData.phone}
            onChange={handlePhoneChange}
            disabled={isLoading}
            inputStyle={{
              width: "100%",
              height: "45px",
              borderRadius: "8px",
              backgroundColor: "inherit",
              color: "inherit",
              border: "1px solid #d1d5db",
              opacity: isLoading ? 0.5 : 1,
            }}
            containerClass="dark:text-gray-200"
            inputClass="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            className="p-3 border rounded-lg 
                       bg-white dark:bg-gray-700 
                       text-gray-700 dark:text-gray-200 
                       placeholder:text-gray-500 dark:placeholder:text-gray-400
                       border-gray-300 dark:border-gray-600
                       focus:outline-orange-500 focus:ring-2 focus:ring-orange-500 
                       transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-all duration-300 hover:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Forgot Password Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
          <Link
            to="/forgot-password"
            className="text-orange-500 font-semibold hover:text-orange-600 transition-colors duration-300"
          >
            Forgot Password?
          </Link>
        </p>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Don't have an account?{" "}
          <button
            onClick={() => {
              if (!isLoading) {
                handleShowLogin(false);
                handleShowSignup(true);
              }
            }}
            disabled={isLoading}
            className="text-orange-500 font-semibold hover:text-orange-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;