import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import {
  MdEdit,
  MdDelete,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import axios from "axios";
import Fuse from "fuse.js";
import { ToastContainer, toast } from "react-toastify";

const Products = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [food_list, setFoodList] = useState([]);
  const base_url =
    import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000";

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${base_url}/api/food/getfood`, {
        withCredentials: true,
      });
      setFoodList(response.data.data);
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [setFoodList]);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${base_url}/api/menu/getmenu`, { withCredentials: true }).then((res) => {
      setCategories(res.data.data);
    });
  }, [setCategories]);

  // Filter products based on search term and category
  const fuse = new Fuse(food_list, {
    keys: ["name"],
    threshold: 0.2,
    ignoreLocation: true,
    includeScore: true,
  });

  // Fixed filtering logic
  let filteredProducts = products;

  if (searchTerm) {
    filteredProducts = fuse.search(searchTerm).map((result) => result.item);
  }

  if (selectedCategory !== "all") {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === selectedCategory
    );
  }

  const handleToggleAvailability = (productId) => {
    setProducts(
      products.map((product) =>
        product._id === productId
          ? { ...product, isAvailable: !product.isAvailable }
          : product
      )
    );
  };

  const handleDeleteProduct = (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete ${productName}?`)) {
      axios
        .post(`${base_url}/api/food/deletefood/${productId}`, productId, {
          withCredentials: true,
        })
        .then((res) => {
          setProducts(products.filter((product) => product._id !== productId));
          setFoodList(food_list.filter((product) => product._id !== productId));
          if (res.status === 200) {
            toast.success("Product deleted successfully!");
          } else {
            toast.error("Error deleting product. Please try again.");
          }
        });
    }
  };

  const getStockStatus = (isAvailable) => {
    if (!isAvailable)
      return {
        text: "Unavailable",
        color: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
      };
    return {
      text: "In Stock",
      color:
        "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
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
        <main className="flex-1 p-3 sm:p-4 md:p-6">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <ToastContainer />
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1 sm:mb-2 transition-colors duration-300">
                  Products
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Manage your restaurant's product inventory
                </p>
              </div>
              <button
                onClick={() => navigate("/admin/add-product")}
                className="bg-orange-500 dark:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300 flex items-center gap-2 shadow-sm dark:shadow-2xl text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <IoMdAdd className="text-base sm:text-lg" />
                <span className="hidden xs:inline">Add New Product</span>
                <span className="xs:hidden">Add Product</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Total Products
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                  {products.length}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Available
                </p>
                <p className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400 transition-colors duration-300">
                  {products.filter((p) => p.isAvailable).length}
                </p>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-4 sm:mb-6 transition-colors duration-300">
            <div className="flex flex-col gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors duration-300 text-sm sm:text-base" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                />
              </div>

              {/* Filters and View Toggle */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 sm:flex-initial px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden transition-colors duration-300">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-xs sm:text-sm transition-colors duration-300 ${
                      viewMode === "grid"
                        ? "bg-orange-500 dark:bg-orange-600 text-white"
                        : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-xs sm:text-sm transition-colors duration-300 ${
                      viewMode === "list"
                        ? "bg-orange-500 dark:bg-orange-600 text-white"
                        : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Display */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-8 sm:p-12 text-center transition-colors duration-300">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📦</div>
              <h3 className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">
                {searchTerm || selectedCategory !== "all"
                  ? "No products found"
                  : "No products yet"}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 transition-colors duration-300">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Start by adding your first product to the inventory"}
              </p>
              {!searchTerm && selectedCategory === "all" && (
                <button
                  onClick={() => navigate("/admin/add-product")}
                  className="bg-orange-500 dark:bg-orange-600 text-white px-4 sm:px-6 py-2 rounded-md font-medium hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300 text-sm sm:text-base"
                >
                  Add Your First Product
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-3 sm:mb-4">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Showing {filteredProducts.length} of {products.length}{" "}
                  products
                </p>
              </div>

              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.isAvailable);
                    return (
                      <div
                        key={product._id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-xl transition-all duration-300"
                      >
                        <div className="relative">
                          <img
                            src={`${base_url}/uploads/foodImages/${product.image}`}
                            alt={product.name}
                            className="w-full h-40 sm:h-48 object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color} transition-colors duration-300`}
                            >
                              {stockStatus.text}
                            </span>
                          </div>
                        </div>

                        <div className="p-3 sm:p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-100 truncate transition-colors duration-300">
                              {product.name}
                            </h3>
                          </div>

                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 sm:mb-2 transition-colors duration-300">
                            {product.category}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3 line-clamp-2 transition-colors duration-300">
                            {product.description}
                          </p>

                          <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <span className="text-base sm:text-lg font-bold text-orange-600 dark:text-orange-400 transition-colors duration-300">
                              ${product.price}
                            </span>
                          </div>

                          <div className="flex gap-1 sm:gap-2">
                            <button
                              onClick={() =>
                                handleToggleAvailability(product._id)
                              }
                              className={`flex-1 px-2 sm:px-3 py-2 rounded-md text-xs font-medium transition-colors duration-300 flex items-center justify-center ${
                                product.isAvailable
                                  ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800"
                                  : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800"
                              }`}
                              title={
                                product.isAvailable
                                  ? "Make unavailable"
                                  : "Make available"
                              }
                            >
                              {product.isAvailable ? (
                                <MdVisibility className="text-sm" />
                              ) : (
                                <MdVisibilityOff className="text-sm" />
                              )}
                            </button>
                            <button
                              onClick={() =>
                                alert(`Edit product: ${product.name}`)
                              }
                              className="px-2 sm:px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-md transition-colors duration-300 flex items-center justify-center"
                              title="Edit product"
                            >
                              <MdEdit className="text-sm" />
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteProduct(product._id, product.name);
                                fetchProducts();
                              }}
                              className="px-2 sm:px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md transition-colors duration-300 flex items-center justify-center"
                              title="Delete product"
                            >
                              <MdDelete className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                  {/* Mobile Cards for List View */}
                  <div className="block sm:hidden">
                    <div className="divide-y divide-gray-200 dark:divide-gray-600">
                      {filteredProducts.map((product) => {
                        const stockStatus = getStockStatus(product.isAvailable);
                        return (
                          <div key={product._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                            <div className="flex items-start gap-3 mb-3">
                              <img
                                src={`${base_url}/uploads/foodImages/${product.image}`}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate">
                                    {product.name}
                                  </h3>
                                  <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color} ml-2 flex-shrink-0`}
                                  >
                                    {stockStatus.text}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                                  {product.category}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                                  {product.description}
                                </p>
                                <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                                  ${product.price}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleToggleAvailability(product._id)
                                }
                                className={`flex-1 p-2 rounded-md transition-colors duration-300 flex items-center justify-center ${
                                  product.isAvailable
                                    ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/50"
                                    : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/50"
                                }`}
                              >
                                {product.isAvailable ? (
                                  <MdVisibility />
                                ) : (
                                  <MdVisibilityOff />
                                )}
                              </button>
                              <button
                                onClick={() =>
                                  alert(`Edit product: ${product.name}`)
                                }
                                className="p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50 rounded-md transition-colors duration-300"
                              >
                                <MdEdit />
                              </button>
                              <button
                                onClick={() => {
                                  handleDeleteProduct(product._id, product.name);
                                  fetchProducts();
                                }}
                                className="p-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/50 rounded-md transition-colors duration-300"
                              >
                                <MdDelete />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Desktop Table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 transition-colors duration-300">
                        <tr>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">
                            Product
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300 hidden md:table-cell">
                            Category
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">
                            Price
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">
                            Status
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 transition-colors duration-300">
                        {filteredProducts.map((product) => {
                          const stockStatus = getStockStatus(
                            product.isAvailable
                          );
                          return (
                            <tr
                              key={product._id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                            >
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <img
                                    src={`${base_url}/uploads/foodImages/${product.image}`}
                                    alt={product.name}
                                    className="w-10 sm:w-12 h-10 sm:h-12 object-cover rounded-lg"
                                  />
                                  <div className="min-w-0">
                                    <div className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300 truncate">
                                      {product.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-32 sm:max-w-xs transition-colors duration-300">
                                      {product.description}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300 hidden md:table-cell">
                                {product.category}
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300">
                                ${product.price}
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color} transition-colors duration-300`}
                                >
                                  {stockStatus.text}
                                </span>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <div className="flex gap-1 sm:gap-2">
                                  <button
                                    onClick={() =>
                                      handleToggleAvailability(product._id)
                                    }
                                    className={`p-1.5 sm:p-2 rounded-md transition-colors duration-300 ${
                                      product.isAvailable
                                        ? "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/50"
                                        : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50"
                                    }`}
                                    title={
                                      product.isAvailable
                                        ? "Make unavailable"
                                        : "Make available"
                                    }
                                  >
                                    {product.isAvailable ? (
                                      <MdVisibility className="text-sm" />
                                    ) : (
                                      <MdVisibilityOff className="text-sm" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() =>
                                      alert(`Edit product: ${product.name}`)
                                    }
                                    className="p-1.5 sm:p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-md transition-colors duration-300"
                                    title="Edit product"
                                  >
                                    <MdEdit className="text-sm" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteProduct(
                                        product._id,
                                        product.name
                                      )
                                    }
                                    className="p-1.5 sm:p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md transition-colors duration-300"
                                    title="Delete product"
                                  >
                                    <MdDelete className="text-sm" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;