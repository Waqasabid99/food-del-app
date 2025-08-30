import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import AdminLogin from "../auth/AdminLogin";
import AdminSignup from "../auth/AdminSignup";
import useAuthStore from "../../store/authStore";
import Dashboard from "./Dashboard";
import "../../App.css";
import AddProduct from "../components/AddProduct";
import AddMenu from "../components/AddMenu";
import Products from "../components/Products";
import Menu from "../components/Menu";

const Main = () => {
    const navigate = useNavigate();
  const { showLogin, showSignup, handleShowLogin, handleShowSignup } = useAuthStore();
  
  // Navigate to home when modals are closed
  const handleLoginWithNavigate = () => {
    handleShowLogin();
    if (showLogin) navigate("/");
  };

  const handleSignupWithNavigate = () => {
    handleShowSignup();
    if (showSignup) navigate("/");
  };
  return (
    <>
       {showLogin && (
        <AdminLogin
          handleShowLogin={handleLoginWithNavigate}
          handleShowSignup={handleSignupWithNavigate}
        />
      )}
      {showSignup && (
        <AdminSignup
          handleShowSignup={handleSignupWithNavigate}
          handleShowLogin={handleLoginWithNavigate}
        />
      )}
      <Routes>
        <Route path="/*" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/add-menu" element={<AddMenu />} />
      </Routes>
    </>
  );
};

export default Main;
