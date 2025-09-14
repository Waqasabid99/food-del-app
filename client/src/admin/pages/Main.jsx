import useAdminAuthStore from "@/store/authStore";
import React, { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import AdminLogin from "../auth/AdminLogin";
import AdminSignup from "../auth/AdminSignup";
import Dashboard from "./Dashboard";
import Products from "../components/Products";
import AddProduct from "../components/AddProduct";
import AddMenu from "../components/AddMenu";
import Menu from "../components/Menu";
import AdminOrders from "../components/Orders";
import Customers from "../components/Customers";
import Settings from "../components/Settings";

const Main = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const { isAuthenticated } = useAdminAuthStore();

  const handleShowLogin = () => {
    if (!showLogin) {
      setShowLogin(true);
      setShowSignup(false);
    } else {
      setShowLogin(false);
      setShowSignup(true);
    }
  };

  const handleShowSignup = () => {
    if (!showSignup) {
      setShowSignup(true);
      setShowLogin(false);
    }
  };

  const handleCloseAuth = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <Routes>
            <Route path="/*" element={<Dashboard />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/signup" element={<AdminSignup />} />
            <Route path="/products" element={<Products />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/add-menu" element={<AddMenu />} />
            <Route path="/orders" element={<AdminOrders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </>
      ) : (
        <>
          {!isAuthenticated && !showLogin && !showSignup && (
            <>
              <div className="min-h-screen w-full bg-gradient-to-br from-orange-100 via-white to-orange-50 flex justify-center items-center px-4">
                <div className="flex flex-col justify-center items-center gap-4 text-gray-800 border border-gray-200 rounded-2xl px-8 py-10 shadow-lg bg-white max-w-md w-full">
                  {/* Icon / Logo Placeholder */}
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-500 text-white text-2xl font-bold shadow-md">
                    🔒
                  </div>

                  <h1 className="text-2xl font-bold text-gray-900">
                    Login to Continue
                  </h1>
                  <p className="text-center text-sm text-gray-600">
                    Login or create an account to access all our services
                    securely.
                  </p>

                  <button
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2.5 rounded-lg mt-4 transition duration-200 shadow-md"
                    onClick={() => setShowLogin(true)}
                  >
                    <p className="block w-full h-full text-center">Login</p>
                  </button>

                  <p className="text-xs text-gray-500 mt-2">
                    Don’t have an account?{" "}
                    <Link
                      onClick={() => setShowSignup(true)}
                      className="text-orange-500 hover:underline font-medium"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            </>
          )}

          {showLogin && (
            <AdminLogin
              handleShowLogin={handleShowLogin}
              handleShowSignup={handleShowSignup}
              handleCloseAuth={handleCloseAuth}
            />
          )}
          {showSignup && (
            <AdminSignup
              handleShowLogin={handleShowSignup}
              handleShowSignup={handleShowLogin}
              handleCloseAuth={handleCloseAuth}
            />
          )}
        </>
      )}
    </>
  );
};

export default Main;
