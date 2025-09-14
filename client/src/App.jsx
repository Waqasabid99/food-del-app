import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import { Route, Routes, useNavigate } from "react-router-dom";
import SingleProduct from "./pages/SingleProduct";
import useAuthStore from "./store/useAuthStore";
import Checkout from "./pages/Checkout";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Menu from "./pages/Menu";
import ThankYou from "./components/Thank-you";
import UserDashboard from "./components/UserDashboard";
import { useState } from "react";

const App = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { isAuthenticated } = useAuthStore();

  //handleShowLogin
  const handleShowLogin = () => {
    if (!showLogin) {
      setShowLogin(true);
      setShowSignup(false);
    } else {
      setShowLogin(false);
      setShowSignup(true);
    }
  };
  //handleShowSignup
  const handleShowSignup = () => {
    if (!showSignup) {
      setShowSignup(true);
      setShowLogin(false);
    } else {
      setShowSignup(false);
      setShowLogin(true);
    }
  };

  //close modals
  const handleCloseAuth = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  return (
    <>
      {showLogin && (
        <Login
          handleShowLogin={handleShowLogin}
          handleShowSignup={handleShowSignup}
          handleCloseAuth={handleCloseAuth}
        />
      )}
      {showSignup && (
        <Signup
          handleShowSignup={handleShowSignup}
          handleShowLogin={handleShowLogin}
          handleCloseAuth={handleCloseAuth}
        />
      )}

      {!showLogin && !showSignup && (
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar
                  handleShowSignup={handleShowSignup}
                  handleShowLogin={handleShowLogin}
                  handleCloseAuth={handleCloseAuth}
                />
                <Hero />
                <Categories />
                <Newsletter />
                <Footer />
              </>
            }
          />
          {/* <Route path="/product" element={<SingleProduct handleShowLogin={handleLoginWithNavigate} />} /> */}
          <Route
            path="/menu"
            element={
              <Menu
                handleShowSignup={handleShowSignup}
                handleShowLogin={handleShowLogin}
                handleCloseAuth={handleCloseAuth}
              />
            }
          />
          <Route
            path="/shop"
            element={
              <Shop
                handleShowSignup={handleShowSignup}
                handleShowLogin={handleShowLogin}
                handleCloseAuth={handleCloseAuth}
              />
            }
          />
          <Route
            path="/product/:id"
            element={
              <SingleProduct
                handleShowSignup={handleShowSignup}
                handleShowLogin={handleShowLogin}
                handleCloseAuth={handleCloseAuth}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <Checkout
                handleShowSignup={handleShowSignup}
                handleShowLogin={handleShowLogin}
                handleCloseAuth={handleCloseAuth}
              />
            }
          />
          <Route
            path="/about"
            element={
              <About
                handleShowSignup={handleShowSignup}
                handleShowLogin={handleShowLogin}
                handleCloseAuth={handleCloseAuth}
              />
            }
          />
          <Route
            path="/contact"
            element={
              <Contact
                handleShowSignup={handleShowSignup}
                handleShowLogin={handleShowLogin}
                handleCloseAuth={handleCloseAuth}
              />
            }
          />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/dashboard" element={<UserDashboard />} />
        </Routes>
      )}
    </>
  );
};

export default App;