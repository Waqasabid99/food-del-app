import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import { Route, Routes, useNavigate } from "react-router-dom";
import SingleProduct from "./pages/SingleProduct";
import useAuthStore from "./store/authStore";
import Checkout from "./pages/Checkout";
import Shop from "./pages/Shop";
import Main from "./admin/pages/Main";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Menu from "./pages/Menu";
import ThankYou from "./components/Thank-you";
import UserDashboard from "./components/UserDashboard";
const App = () => {
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
        <Login
          handleShowLogin={handleLoginWithNavigate}
          handleShowSignup={handleSignupWithNavigate}
        />
      )}
      {showSignup && (
        <Signup
          handleShowSignup={handleSignupWithNavigate}
          handleShowLogin={handleLoginWithNavigate}
        />
      )}
      {!showLogin && !showSignup && (
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar handleShowLogin={handleLoginWithNavigate} />
              <Hero />
              <Categories />
              <Newsletter />
              <Footer />
            </>
          }
        />
        {/* <Route path="/product" element={<SingleProduct handleShowLogin={handleLoginWithNavigate} />} /> */}
        <Route path="/menu" element={<Menu handleShowLogin={handleLoginWithNavigate}/>} />
        <Route path="/shop" element={<Shop handleShowLogin={handleLoginWithNavigate} />} />
        <Route path="/product/:id" element={<SingleProduct handleShowLogin={handleLoginWithNavigate} />} />
        <Route path="/checkout" element={<Checkout handleShowLogin={handleLoginWithNavigate} />} />
        <Route path="/about" element={<About handleShowLogin={handleLoginWithNavigate}/>} />
        <Route path="/contact" element={<Contact handleShowLogin={handleLoginWithNavigate}/>} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
      )}
    </>
  );
};

export default App;
