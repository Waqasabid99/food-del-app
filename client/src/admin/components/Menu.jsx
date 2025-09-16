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
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Menu = () => {
  const [activeTab, setActiveTab] = useState("menu");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const base_url =
    import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    axios.get(`${base_url}/api/menu/getmenu`, { withCredentials: true }).then((res) => {
      setCategories(res.data.data);
    });
  }, [setCategories]);

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete ${categoryName}?`))
      return;
    try {
      const res = await axios.post(
        `${base_url}/api/menu/deletemenu/${categoryId}`,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        setCategories(categories.filter((c) => c._id !== categoryId));
        toast.success("Category deleted successfully!");
      } else {
        toast.error("Error deleting category. Please try again.");
      }
    } catch (err) {
      toast.error("Error deleting category");
    }
  };

  const handleToggleAvailability = (categoryId) => {
    setCategories(
      categories.map((category) =>
        category._id === categoryId
          ? { ...category, isAvailable: !category.isAvailable }
          : category
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
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
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8 md:mb-10">
            <ToastContainer />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 transition-colors duration-300">
                  Menu Categories
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Manage your restaurant's menu categories
                </p>
              </div>
              <button
                onClick={() => navigate("/admin/add-menu")}
                className="bg-orange-500 dark:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300 flex items-center gap-2 shadow-sm dark:shadow-2xl text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <IoMdAdd className="text-base sm:text-lg" />
                <span className="hidden xs:inline">Add New Category</span>
                <span className="xs:hidden">Add Category</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Total Categories
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                  {categories.length}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Available
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400 transition-colors duration-300">
                  {categories.filter((p) => p.isAvailable).length}
                </p>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-4 sm:mb-6 transition-colors duration-300">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-full sm:max-w-md">
                <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors duration-300 text-sm sm:text-base" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden transition-colors duration-300">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm transition-colors duration-300 flex-1 sm:flex-initial ${
                    viewMode === "grid"
                      ? "bg-orange-500 dark:bg-orange-600 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm transition-colors duration-300 flex-1 sm:flex-initial ${
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

          {/* Categories Display */}
          {filteredCategories.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-2xl shadow-sm dark:shadow-2xl border border-gray-100 dark:border-gray-700 p-8 sm:p-12 lg:p-16 text-center transition-colors duration-300">
              <div className="text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6 opacity-50">📋</div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3 transition-colors duration-300">
                {searchTerm ? "No categories found" : "No categories yet"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg transition-colors duration-300">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Start by adding your first menu category"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => navigate("/admin/add-category")}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 transform hover:scale-105 transition-all duration-200 shadow-lg dark:shadow-2xl text-sm sm:text-base"
                >
                  Add Your First Category
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-4 sm:mb-6">
                <p className="text-gray-600 dark:text-gray-300 font-medium transition-colors duration-300 text-sm sm:text-base">
                  Showing {filteredCategories.length} of {categories.length}{" "}
                  categories
                </p>
              </div>

              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {filteredCategories.map((category, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={`${base_url}/uploads/menuImages/${category.image}`}
                          alt={category.name}
                          className="w-full h-40 sm:h-48 lg:h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {category.featured && (
                          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                            <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 text-white shadow-lg">
                              Featured
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      <div className="p-4 sm:p-5 lg:p-6">
                        <div className="flex items-start justify-between mb-2 sm:mb-3">
                          <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-gray-100 truncate transition-colors duration-300">
                            {category.name}
                          </h3>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 line-clamp-2 leading-relaxed transition-colors duration-300 text-sm sm:text-base">
                          {category.description}
                        </p>

                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                          <span className="text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300 text-sm">
                            {category.itemCount} items
                          </span>
                        </div>

                        <div className="flex gap-1 sm:gap-2">
                          <button
                            onClick={() =>
                              handleToggleAvailability(category._id)
                            }
                            className={`flex-1 px-2 sm:px-3 py-2 rounded-md text-xs font-medium transition-colors duration-300 flex items-center justify-center ${
                              category.isAvailable
                                ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800"
                                : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800"
                            }`}
                            title={
                              category.isAvailable
                                ? "Make unavailable"
                                : "Make available"
                            }
                          >
                            {category.isAvailable ? (
                              <MdVisibility className="text-sm sm:text-base" />
                            ) : (
                              <MdVisibilityOff className="text-sm sm:text-base" />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              alert(`Edit category: ${category.name}`)
                            }
                            className="px-2 sm:px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-md transition-colors duration-300 flex items-center justify-center"
                            title="Edit category"
                          >
                            <MdEdit className="text-sm sm:text-base" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteCategory(category._id, category.name)
                            }
                            className="px-2 sm:px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md transition-colors duration-300 flex items-center justify-center"
                            title="Delete category"
                          >
                            <MdDelete className="text-sm sm:text-base" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-2xl shadow-sm dark:shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                  {/* Mobile Cards for List View */}
                  <div className="block sm:hidden">
                    <div className="divide-y divide-gray-100 dark:divide-gray-600">
                      {filteredCategories.map((category, key) => (
                        <div key={key} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                          <div className="flex items-start gap-3 mb-3">
                            <img
                              src={`${base_url}/uploads/menuImages/${category.image}`}
                              alt={category.name}
                              className="w-12 h-12 object-cover rounded-lg shadow-sm flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1">
                                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base truncate">
                                  {category.name}
                                </h3>
                                {category.featured && (
                                  <span className="px-2 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white ml-2 flex-shrink-0">
                                    Featured
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-2">
                                {category.description}
                              </p>
                              <p className="text-gray-500 dark:text-gray-400 text-xs">
                                {category.itemCount} items
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleToggleAvailability(category._id)
                              }
                              className={`flex-1 p-2 rounded-md transition-colors duration-300 flex items-center justify-center ${
                                category.isAvailable
                                  ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/50"
                                  : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/50"
                              }`}
                            >
                              {category.isAvailable ? (
                                <MdVisibility />
                              ) : (
                                <MdVisibilityOff />
                              )}
                            </button>
                            <button
                              onClick={() =>
                                alert(`Edit category: ${category.name}`)
                              }
                              className="p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50 rounded-md transition-colors duration-300"
                            >
                              <MdEdit />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteCategory(
                                  category._id,
                                  category.name
                                )
                              }
                              className="p-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/50 rounded-md transition-colors duration-300"
                            >
                              <MdDelete />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Desktop Table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600 transition-colors duration-300">
                        <tr>
                          <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                            Category
                          </th>
                          <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300 hidden md:table-cell">
                            Description
                          </th>
                          <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                            Items
                          </th>
                          <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300 hidden lg:table-cell">
                            Status
                          </th>
                          <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-600 transition-colors duration-300">
                        {filteredCategories.map((category, key) => (
                          <tr
                            key={key}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 whitespace-nowrap">
                              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                                <img
                                  src={`${base_url}/uploads/menuImages/${category.image}`}
                                  alt={category.name}
                                  className="w-10 sm:w-12 lg:w-16 h-10 sm:h-12 lg:h-16 object-cover rounded-lg sm:rounded-xl shadow-sm"
                                />
                                <div className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base lg:text-lg transition-colors duration-300">
                                  {category.name}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 text-gray-600 dark:text-gray-300 transition-colors duration-300 hidden md:table-cell">
                              <div className="max-w-xs truncate leading-relaxed text-sm">
                                {category.description}
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 whitespace-nowrap text-gray-700 dark:text-gray-200 font-medium transition-colors duration-300 text-sm">
                              {category.itemCount} items
                            </td>
                            <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 whitespace-nowrap hidden lg:table-cell">
                              {category.featured && (
                                <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 text-white">
                                  Featured
                                </span>
                              )}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex gap-1 sm:gap-2">
                                <button
                                  onClick={() =>
                                    handleToggleAvailability(category._id)
                                  }
                                  className={`p-1.5 sm:p-2 rounded-md transition-colors duration-300 ${
                                    category.isAvailable
                                      ? "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/50"
                                      : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50"
                                  }`}
                                  title={
                                    category.isAvailable
                                      ? "Make unavailable"
                                      : "Make available"
                                  }
                                >
                                  {category.isAvailable ? (
                                    <MdVisibility className="text-sm sm:text-base" />
                                  ) : (
                                    <MdVisibilityOff className="text-sm sm:text-base" />
                                  )}
                                </button>
                                <button
                                  onClick={() =>
                                    alert(`Edit category: ${category.name}`)
                                  }
                                  className="p-1.5 sm:p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-md transition-colors duration-300"
                                  title="Edit category"
                                >
                                  <MdEdit className="text-sm sm:text-base" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteCategory(
                                      category._id,
                                      category.name
                                    )
                                  }
                                  className="p-1.5 sm:p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md transition-colors duration-300"
                                  title="Delete category"
                                >
                                  <MdDelete className="text-sm sm:text-base" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
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

export default Menu;