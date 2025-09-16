import React, { useState } from "react";
import { GoPlus } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import useAuthStore from "../store/authStore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";
import axios from "axios";

const Shop = ({ handleShowLogin, handleShowSignup, handleCloseAuth }) => {
  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    sortBy: "name",
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showLogin, showSignup } = useAuthStore();
  const [food_list, setFoodList] = useState([]);
  const [menu_list, setMenuList] = useState([]);
  const base_url =
    import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    axios.get(`${base_url}/api/food/getfood`, { withCredentials: true }).then((res) => {
      setFoodList(res.data.data);
    });
  }, [setFoodList]);

    useEffect(() => {
    axios.get(`${base_url}/api/menu/getmenu`, { withCredentials: true }).then((res) => {
      setMenuList(res.data.data);
    });
  }, [setMenuList]);

  const priceRanges = [
    { label: "All Prices", value: "" },
    { label: "Under $8", value: "0-8" },
    { label: "$8 - $12", value: "8-12" },
    { label: "Over $12", value: "12+" },
  ];

  const showSingleProduct = (id) => {
    navigate(`/product/${id}`);
  };

  // Filter products based on selected filters
  const filteredProducts = food_list.filter((product) => {
    const categoryMatch =
      !filters.category ||
      filters.category === "All" ||
      product.category === filters.category;

    let priceMatch = true;
    if (filters.priceRange) {
      const [min, max] = filters.priceRange
        .split("-")
        .map((p) => p.replace("+", ""));
      if (max) {
        priceMatch =
          product.price >= parseInt(min) && product.price <= parseInt(max);
      } else {
        priceMatch = product.price >= parseInt(min);
      }
    }

    return categoryMatch && priceMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      priceRange: "",
      sortBy: "name",
    });
  };

  return (
    <>
      {!showLogin && !showSignup && (
        <>
          <Navbar
            handleShowSignup={handleShowSignup}
            handleShowLogin={handleShowLogin}
            handleCloseAuth={handleCloseAuth}
          />
          <div className="shop-page w-full py-3 px-4 sm:py-5 sm:px-6 lg:px-10 bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Header */}
            <div className="headings w-full mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-gray-100 transition-colors duration-300">
                Explore our Menu
              </h1>
              <p className="text-gray-800 dark:text-gray-300 text-sm sm:text-[15px] pt-2 transition-colors duration-300">
                Choose from a wide range of delicious dishes and have them
                delivered to your doorstep. Our mission is to provide you with a
                satisfying and enjoyable dining experience.
              </p>
            </div>

            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="w-full bg-orange-500 dark:bg-gray-600 text-white dark:text-gray-100 py-2 px-4 rounded-lg font-medium hover:bg-orange-600 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                {showMobileFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
              {/* Sidebar Filters */}
              <div
                className={`sidebar w-full lg:w-[280px] lg:flex-shrink-0 ${
                  showMobileFilters ? "block" : "hidden lg:block"
                }`}
              >
                <div className="filters bg-gray-50 dark:bg-gray-800 p-4 sm:p-5 rounded-lg transition-colors duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-black dark:text-gray-100 transition-colors duration-300">
                      Filters
                    </h2>
                    <button
                      onClick={clearFilters}
                      className="text-orange-500 dark:text-orange-400 text-sm hover:text-orange-600 dark:hover:text-orange-300 transition-colors duration-300"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Category Filter */}
                  <div className="flex flex-col gap-2 mb-6">
                    <h4 className="font-semibold text-black dark:text-gray-100 transition-colors duration-300">
                      Categories
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                      {menu_list.map((category, index) => (
                        <label
                          key={index}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="category"
                            value={
                              category.menu_name === "All"
                                ? ""
                                : category.menu_name
                            }
                            checked={
                              filters.category ===
                              (category.menu_name === "All"
                                ? ""
                                : category.menu_name)
                            }
                            onChange={(e) =>
                              handleFilterChange("category", e.target.value)
                            }
                            className="cursor-pointer accent-orange-500 dark:accent-orange-400"
                          />
                          <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 transition-colors duration-300">
                            {category.menu_name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div className="filter-group mb-6">
                    <h3 className="font-medium mb-3 text-gray-800 dark:text-gray-200 transition-colors duration-300">
                      Price Range
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                      {priceRanges.map((range) => (
                        <label
                          key={range.value}
                          className="flex items-center cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="priceRange"
                            value={range.value}
                            checked={filters.priceRange === range.value}
                            onChange={(e) =>
                              handleFilterChange("priceRange", e.target.value)
                            }
                            className="mr-3 text-orange-500 dark:text-orange-400 focus:ring-orange-500 dark:focus:ring-orange-400 accent-orange-500 dark:accent-orange-400"
                          />
                          <span className="text-sm sm:text-[15px] text-gray-700 dark:text-gray-300 transition-colors duration-300">
                            {range.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sort Filter */}
                  <div className="filter-group">
                    <h3 className="font-medium mb-3 text-gray-800 dark:text-gray-200 transition-colors duration-300">
                      Sort By
                    </h3>
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        handleFilterChange("sortBy", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm sm:text-[15px] bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors duration-300"
                    >
                      <option value="name">Name (A-Z)</option>
                      <option value="price-low">Price (Low to High)</option>
                      <option value="price-high">Price (High to Low)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <div className="products-section flex-1">
                <div className="products-header flex justify-between items-center mb-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-[15px] transition-colors duration-300">
                    Showing {sortedProducts.length} of {food_list.length} dishes
                  </p>
                </div>

                {/* Products Grid */}
                <div className="products-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-2 sm:p-4">
                  {sortedProducts.map((item, index) => (
                    <div
                      key={index}
                      className="item flex flex-col bg-white dark:bg-gray-800 border-white dark:border-gray-700 border rounded-xl object-cover shadow-xl dark:shadow-2xl hover:translate-y-2 hover:shadow-2xl hover:scale-105 cursor-pointer relative transition-all duration-300"
                    >
                      <span className="hidden">{item._id}</span>
                      <span className="hidden">{item.category}</span>
                      <img
                        className="rounded-t-xl w-full h-48 sm:h-56 md:h-64 object-cover"
                        src={`${base_url}/uploads/foodImages/${item.image}`}
                        alt={item.name}
                        onClick={() => showSingleProduct(item._id)}
                      />
                      <button className="absolute right-3 top-[35%] sm:top-[42%] text-xl sm:text-2xl">
                        <GoPlus
                          onClick={() => addToCart(item, 1)}
                          className="text-black dark:text-gray-800 bg-white dark:bg-gray-200 rounded-full p-1 w-7 h-7 sm:w-8 sm:h-8 active:scale-[-0.9] hover:scale-[1.3] transition-all duration-300 shadow-lg"
                        />
                      </button>
                      <div
                        onClick={() => showSingleProduct(item._id)}
                        className="content flex flex-col gap-2 w-full px-3 pt-2 pb-4 sm:pb-7"
                      >
                        <h2 className="text-lg sm:text-xl font-semibold line-clamp-2 text-black dark:text-gray-100 transition-colors duration-300">
                          {item.name}
                        </h2>
                        <p className="text-sm sm:text-md text-gray-500 dark:text-gray-400 line-clamp-2 transition-colors duration-300">
                          {item.description}
                        </p>
                        <p className="text-lg sm:text-xl font-bold text-orange-400 dark:text-orange-300 transition-colors duration-300">
                          ${item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {sortedProducts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg transition-colors duration-300">
                      No dishes found matching your filters.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="mt-4 bg-orange-500 dark:bg-gray-600 text-white dark:text-gray-100 px-4 sm:px-6 py-2 rounded-md hover:bg-orange-600 dark:hover:bg-gray-700 transition-colors duration-300 text-sm sm:text-base"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default Shop;
