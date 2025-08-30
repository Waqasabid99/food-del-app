import React, { useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const AddProduct = () => {
  const [activeTab, setActiveTab] = useState("add-product");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const base_url = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000";

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    isAvailable: true,
    category: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${base_url}/api/menu/getmenu`).then((res) => {
      setCategories(res.data.data);
    })
  }, [categories])

  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors(prev => ({ ...prev, image: "Please select a valid image file" }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: "Image size should be less than 5MB" }));
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Clear error
      setErrors(prev => ({ ...prev, image: "" }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById("image-upload");
    if (fileInput) fileInput.value = "";
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description should be at least 10 characters long";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.image) {
      newErrors.image = "Product image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      axios.post(`${base_url}/api/food/addfood`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true
      })
        .then((res) => {
          if (res.status === 200) {
            toast.success("Product added successfully!");
            console.log("Product added successfully!");
          }
        })
        .catch((err) => {
          console.error("Error adding product:", err);
          toast.error("Error adding product. Please try again.");
        }
        );

      // Reset form
      setFormData({
        name: "",
        price: "",
        description: "",
        isAvailable: true,
        category: "",
        image: null,
      });
      setImagePreview(null);

      // Reset file input
      const fileInput = document.getElementById("image-upload");
      if (fileInput) fileInput.value = "";

    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error adding product. Please try again.", error);
    } finally {
      setIsLoading(false);
    }
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
        <main className="flex-1 p-6">
          {/* Page Header */}
          <div className="mb-8">
            <ToastContainer />
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300"
              >
                <IoArrowBack className="text-xl" />
              </button>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">Add New Product</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
              Create a new product for your restaurant menu.
            </p>
          </div>

          {/* Form */}
          <div className="max-w-4xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6 transition-colors duration-300">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300 ${errors.name ? "border-red-400 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                        }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1 transition-colors duration-300">{errors.name}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300 ${errors.category ? "border-red-400 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                        }`}
                    >
                      <option value="">Select category</option>
                      {categories.map((cat, index) => (
                        <option key={index} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1 transition-colors duration-300">{errors.category}</p>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300 ${errors.price ? "border-red-400 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                        }`}
                    />
                    {errors.price && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1 transition-colors duration-300">{errors.price}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    rows="4"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm resize-vertical bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300 ${errors.description ? "border-red-400 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                      }`}
                  />
                  {errors.description && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1 transition-colors duration-300">{errors.description}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
                    Minimum 10 characters
                  </p>
                </div>

                {/* Availability Toggle */}
                <div className="mt-6">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isAvailable"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-orange-500 dark:text-orange-400 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-orange-500 dark:focus:ring-orange-400 transition-colors duration-300"
                    />
                    <label htmlFor="isAvailable" className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-300">
                      Product is available for ordering
                    </label>
                  </div>
                </div>
              </div>

              {/* Image Upload Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6 transition-colors duration-300">
                  Product Image
                </h3>

                <div className="space-y-4">
                  {!imagePreview ? (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-orange-400 dark:hover:border-orange-400 transition-colors duration-300">
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <IoCloudUploadOutline className="text-4xl text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors duration-300" />
                        <p className="text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                          Click to upload product image
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full max-w-sm h-64 object-cover rounded-lg border border-gray-300 dark:border-gray-600 transition-colors duration-300"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 dark:bg-red-600 text-white p-2 rounded-full hover:bg-red-600 dark:hover:bg-red-700 transition-colors duration-300"
                      >
                        <MdDelete className="text-sm" />
                      </button>
                    </div>
                  )}

                  {errors.image && (
                    <p className="text-red-500 dark:text-red-400 text-xs transition-colors duration-300">{errors.image}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-3 rounded-md font-medium transition-colors duration-300 ${isLoading
                    ? "bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-400 cursor-not-allowed"
                    : "bg-orange-500 dark:bg-orange-600 text-white hover:bg-orange-600 dark:hover:bg-orange-700"
                    }`}
                >
                  {isLoading ? "Adding Product..." : "Add Product"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/dashboard")}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddProduct;