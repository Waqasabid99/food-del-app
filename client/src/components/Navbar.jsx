import React, { useRef, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { CiShoppingBasket } from "react-icons/ci";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import Fuse from "fuse.js";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ThemeToggleButton from "./ui/theme-toggle-button";
import useAuth from "@/context/useAuth";

const Navbar = ({ handleShowLogin }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showCartItems, setShowCartitems] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [food_list, setFoodList] = useState([]);
  const searchRef = useRef(null);
  const { cart } = useCart();
  const navigate = useNavigate();
  const base_url =
    import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000";
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    axios.get(`${base_url}/api/food/getfood`).then((res) => {
      setFoodList(res.data.data);
    });
  }, [setFoodList]);

  // Handle Search
  const handleShowSearch = () => {
    if (!showSearch) setShowSearch(true);
    else setShowSearch(false);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const fuse = new Fuse(food_list, {
    keys: ["name"],
    threshold: 0.2,
    ignoreLocation: true,
    includeScore: true,
  });
  const results = fuse.search(searchText).map((result) => result.item);
  console.log(results);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchText("");
      }
    }
    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearch]);

  //Handle Cart
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const handleShowCart = () => {
    if (!showCartItems && cartCount >= 1) setShowCartitems(true);
    else setShowCartitems(false);
  };

  const handleNavigate = () => navigate("/checkout");

  // Handle mobile menu
  const handleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Close mobile menu when clicking on a link
  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  useEffect(() => {});

  return (
    <>
      <div className="flex justify-between items-center w-full px-4 sm:px-6 lg:px-10 py-5 bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="logo">
          <NavLink
            to="/"
            className="text-2xl sm:text-3xl lg:text-4xl text-orange-400 dark:text-orange-300 font-extrabold transition-colors duration-300"
          >
            FOODIE.
          </NavLink>
        </div>

        {/* Desktop NavLink Section */}
        <div className="navlinks hidden lg:block">
          <nav className="flex gap-8 text-xl">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative px-1 ${
                  isActive
                    ? "text-orange-400 dark:text-orange-300"
                    : "text-black dark:text-gray-200"
                } after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-orange-400 dark:after:bg-orange-300 after:transition-all after:duration-300 hover:after:w-full hover:text-orange-400 dark:hover:text-orange-300 transition-colors duration-300`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/menu"
              className={({ isActive }) =>
                `relative px-1 ${
                  isActive
                    ? "text-orange-400 dark:text-orange-300"
                    : "text-black dark:text-gray-200"
                } after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-orange-400 dark:after:bg-orange-300 after:transition-all after:duration-300 hover:after:w-full hover:text-orange-400 dark:hover:text-orange-300 transition-colors duration-300`
              }
            >
              Menu
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `relative px-1 ${
                  isActive
                    ? "text-orange-400 dark:text-orange-300"
                    : "text-black dark:text-gray-200"
                } after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-orange-400 dark:after:bg-orange-300 after:transition-all after:duration-300 hover:after:w-full hover:text-orange-400 dark:hover:text-orange-300 transition-colors duration-300`
              }
            >
              Shop
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `relative px-1 ${
                  isActive
                    ? "text-orange-400 dark:text-orange-300"
                    : "text-black dark:text-gray-200"
                } after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-orange-400 dark:after:bg-orange-300 after:transition-all after:duration-300 hover:after:w-full hover:text-orange-400 dark:hover:text-orange-300 transition-colors duration-300`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `relative px-1 ${
                  isActive
                    ? "text-orange-400 dark:text-orange-300"
                    : "text-black dark:text-gray-200"
                } after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-orange-400 dark:after:bg-orange-300 after:transition-all after:duration-300 hover:after:w-full hover:text-orange-400 dark:hover:text-orange-300 transition-colors duration-300`
              }
            >
              Contact
            </NavLink>
            {isAuthenticated && (
              <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `relative px-1 ${
                  isActive
                    ? "text-orange-400 dark:text-orange-300"
                    : "text-black dark:text-gray-200"
                } after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-orange-400 dark:after:bg-orange-300 after:transition-all after:duration-300 hover:after:w-full hover:text-orange-400 dark:hover:text-orange-300 transition-colors duration-300`
              }
            >
              Dashboard
            </NavLink>
            )}
          </nav>
        </div>

        <div
          className="flex justify-between items-center gap-2 sm:gap-4 lg:gap-8 relative"
          ref={searchRef}
        >
          {/* Theme Toggle Button */}
          <ThemeToggleButton
            variant="gif"
            url="https://media.giphy.com/media/KBbr4hHl9DSahKvInO/giphy.gif?cid=790b76112m5eeeydoe7et0cr3j3ekb1erunxozyshuhxx2vl&ep=v1_stickers_search&rid=giphy.gif&ct=s"
          />
          {/* Search Input - Responsive */}
          {showSearch && (
            <input
              onChange={handleSearch}
              type="text"
              placeholder="Search..."
              value={searchText}
              className="outline-none bg-white dark:bg-gray-700 px-3 sm:px-4 py-1.5 rounded-full border-gray-500 dark:border-gray-600 border-1 text-sm sm:text-md text-gray-500 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 w-32 sm:w-48 lg:w-auto transition-all duration-300"
            />
          )}

          {/* Search Results */}
          {showSearch && results.length > 0 && (
            <div className="absolute w-32 sm:w-48 lg:w-[80%] top-10 left-0 z-100 h-fit max-h-[50vh] bg-white dark:bg-gray-800 overflow-y-auto shadow-lg dark:shadow-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors duration-300">
              {results.map((item) => (
                <div
                  onClick={() => navigate(`/product/${item._id}`)}
                  key={item._id}
                  className="flex items-center gap-2 px-2 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                >
                  <img
                    src={`${
                      import.meta.env.VITE_BACKEND_BASE_URL ||
                      "http://localhost:5000"
                    }/uploads/foodImages/${item.image}`}
                    alt={item.name}
                    className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded"
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <p className="font-semibold text-xs sm:text-sm lg:text-base truncate text-black dark:text-gray-200">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {item.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Search Button */}
          <button
            onClick={handleShowSearch}
            className="hover:text-orange-400 dark:hover:text-orange-300 active:text-orange-400 dark:active:text-orange-300 text-[20px] sm:text-[25px] text-black dark:text-gray-200 transition-colors duration-300"
          >
            <IoSearchOutline />
          </button>

          {/* Cart Button */}
          <button className="relative hover:text-orange-400 dark:hover:text-orange-300 active:text-orange-400 dark:active:text-orange-300 text-[24px] sm:text-[28px] text-black dark:text-gray-200 transition-colors duration-300">
            <CiShoppingBasket
              onClick={() => handleShowCart(true)}
              className="relative"
            />

            {/* Cart Badge */}
            {cartCount > 0 && !showCartItems && (
              <span className="absolute -top-1 -right-1 text-xs font-medium text-white bg-orange-500 dark:bg-orange-400 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center transition-colors duration-300">
                {cartCount}
              </span>
            )}

            {/* Cart Dropdown */}
            {showCartItems && (
              <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900 border border-gray-200 dark:border-gray-600 overflow-hidden z-50 transition-colors duration-300">
                {/* Header */}
                <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    Cart ({cart.length})
                  </h3>
                </div>

                {/* Cart Items */}
                <div className="max-h-64 overflow-y-auto">
                  {cart.length > 0 ? (
                    cart.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center px-3 py-2 border-b border-gray-100 dark:border-gray-700"
                      >
                        <img
                          src={`${
                            import.meta.env.VITE_BACKEND_BASE_URL ||
                            "http://localhost:5000"
                          }/uploads/foodImages/${item.image}`}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1 px-3">
                          <p className="text-sm text-gray-800 dark:text-gray-200 truncate">
                            {item.name}
                          </p>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                          {item.quantity}
                        </div>
                        <button className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200">
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                      Cart is empty
                    </div>
                  )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                  <div className="p-3 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={handleNavigate}
                      className="w-full bg-orange-500 dark:bg-orange-600 text-white py-2 rounded text-sm hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300"
                    >
                      Checkout
                    </button>
                  </div>
                )}
              </div>
            )}
          </button>

          {/* Sign-in Button - Hidden on mobile */}
          {isAuthenticated && (
            <>
              <button
                onClick={() => logout()}
                className="hidden sm:block border-[1px] border-black dark:border-gray-400 px-4 lg:px-6 py-1 rounded-full text-[16px] lg:text-[20px] text-black dark:text-gray-200 hover:transition-all hover:duration-300 hover:bg-black dark:hover:bg-gray-200 hover:text-white dark:hover:text-gray-800 transition-colors duration-300"
              >
                Logout
              </button>
            </>
          )}
          {!isAuthenticated && (
            <button
              onClick={() => handleShowLogin(true)}
              className="hidden sm:block border-[1px] border-black dark:border-gray-400 px-4 lg:px-6 py-1 rounded-full text-[16px] lg:text-[20px] text-black dark:text-gray-200 hover:transition-all hover:duration-300 hover:bg-black dark:hover:bg-gray-200 hover:text-white dark:hover:text-gray-800 transition-colors duration-300"
            >
              Sign-in
            </button>
          )}
          {/* Mobile Menu Button */}
          <button
            onClick={handleMobileMenu}
            className="lg:hidden hover:text-orange-400 dark:hover:text-orange-300 text-[24px] text-black dark:text-gray-200 transition-colors duration-300"
          >
            {showMobileMenu ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-40 transition-opacity duration-300"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900 z-50 transform transition-all duration-300 ease-in-out">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-600">
            <span className="text-lg font-semibold text-black dark:text-gray-200">
              Menu
            </span>
            <button
              onClick={closeMobileMenu}
              className="text-2xl hover:text-orange-400 dark:hover:text-orange-300 text-black dark:text-gray-200 transition-colors duration-300"
            >
              <HiOutlineX />
            </button>
          </div>

          <nav className="flex flex-col p-4">
            <NavLink
              to="/"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `py-3 px-2 text-lg border-b border-gray-100 dark:border-gray-700 ${
                  isActive
                    ? "text-orange-400 dark:text-orange-300 font-semibold"
                    : "text-black dark:text-gray-200"
                } hover:text-orange-400 dark:hover:text-orange-300 transition-colors duration-300`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/menu"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `py-3 px-2 text-lg border-b border-gray-100 dark:border-gray-700 ${
                  isActive
                    ? "text-orange-400 dark:text-orange-300 font-semibold"
                    : "text-black dark:text-gray-200"
                } hover:text-orange-400 dark:hover:text-orange-300 transition-colors duration-300`
              }
            >
              Menu
            </NavLink>
            <NavLink
              to="/shop"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `py-3 px-2 text-lg border-b border-gray-100 dark:border-gray-700 ${
                  isActive
                    ? "text-orange-400 dark:text-orange-300 font-semibold"
                    : "text-black dark:text-gray-200"
                } hover:text-orange-400 dark:hover:text-orange-300 transition-colors duration-300`
              }
            >
              Shop
            </NavLink>
            <NavLink
              to="/about"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `py-3 px-2 text-lg border-b border-gray-100 dark:border-gray-700 ${
                  isActive
                    ? "text-orange-400 dark:text-orange-300 font-semibold"
                    : "text-black dark:text-gray-200"
                } hover:text-orange-400 dark:hover:text-orange-300 transition-colors duration-300`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `py-3 px-2 text-lg border-b border-gray-100 dark:border-gray-700 ${
                  isActive
                    ? "text-orange-400 dark:text-orange-300 font-semibold"
                    : "text-black dark:text-gray-200"
                } hover:text-orange-400 dark:hover:text-orange-300 transition-colors duration-300`
              }
            >
              Contact
            </NavLink>
            {isAuthenticated && (
              <NavLink
              to="/dashboard"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `py-3 px-2 text-lg border-b border-gray-100 dark:border-gray-700 ${
                  isActive
                    ? "text-orange-400 dark:text-orange-300 font-semibold"
                    : "text-black dark:text-gray-200"
                } hover:text-orange-400 dark:hover:text-orange-300 transition-colors duration-300`
              }
            >
              Dashboard
            </NavLink>
            )}

            {/* Mobile Sign-in Button */}
            {isAuthenticated && (
              <button
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
                className="mt-6 border-[1px] border-black dark:border-gray-400 px-6 py-2 rounded-full text-lg text-black dark:text-gray-200 hover:bg-black dark:hover:bg-gray-200 hover:text-white dark:hover:text-gray-800 transition-all duration-300"
              >
                Logout
              </button>
            )}
            {!isAuthenticated && (
              <button
                onClick={() => {
                  handleShowLogin(true);
                  closeMobileMenu();
                }}
                className="mt-6 border-[1px] border-black dark:border-gray-400 px-6 py-2 rounded-full text-lg text-black dark:text-gray-200 hover:bg-black dark:hover:bg-gray-200 hover:text-white dark:hover:text-gray-800 transition-all duration-300"
              >
                Sign-in
              </button>
            )}
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
