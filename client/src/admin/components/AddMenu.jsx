import React, { useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const AddMenu = () => {
  const [activeTab, setActiveTab] = useState("add-menu");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const base_url =
    import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000";

  const [formData, setFormData] = useState({
    name: "",
    image: null,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size should be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Clear error
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById("image-upload");
    if (fileInput) fileInput.value = "";
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Menu item name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name =
        "Menu item name should be at least 3 characters long";
    }

    if (!formData.image) {
      newErrors.image = "Menu item image is required";
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
       const data = new FormData();
       data.append("name", formData.name);
       data.append("image", formData.image);
       setFormData(data);
      axios
        .post(`${base_url}/api/menu/addmenu`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true
        })
        .then((res) => {
          if (res.status === 200) {
            toast.success("Menu item added successfully!");
            console.log("Menu item added successfully!");
          }
        })
        .catch((err) => {
          console.error("Error adding menu item:", err);
          toast.error("Error adding menu item. Please try again.");
        });

      // Reset form
      setFormData({
        name: "",
        image: null,
      });
      setImagePreview(null);

      // Reset file input
      const fileInput = document.getElementById("image-upload");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error adding menu item:", error);
      alert("Error adding menu item. Please try again.");
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
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                Add New Menu Item
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
              Add a new item to your restaurant menu.
            </p>
          </div>

          {/* Form */}
          <div className="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Menu Item Information Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6 transition-colors duration-300">
                  Menu Item Information
                </h3>

                {/* Item Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                    Menu Item Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter menu item name (e.g., Margherita Pizza)"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300 ${
                      errors.name
                        ? "border-red-400 dark:border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1 transition-colors duration-300">
                      {errors.name}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
                    Minimum 3 characters
                  </p>
                </div>
              </div>

              {/* Image Upload Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6 transition-colors duration-300">
                  Menu Item Image
                </h3>

                <div className="space-y-4">
                  {!imagePreview ? (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center hover:border-orange-400 dark:hover:border-orange-400 transition-colors duration-300">
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <IoCloudUploadOutline className="text-5xl text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors duration-300" />
                        <p className="text-gray-600 dark:text-gray-300 mb-2 font-medium transition-colors duration-300">
                          Click to upload menu item image
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-300">
                          PNG, JPG, GIF up to 5MB
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 transition-colors duration-300">
                          Recommended size: 800x600px for best quality
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="flex justify-center">
                        <img
                          src={imagePreview}
                          alt="Menu item preview"
                          className="max-w-full h-80 object-cover rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm transition-colors duration-300"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-3 right-3 bg-red-500 dark:bg-red-600 text-white p-2 rounded-full hover:bg-red-600 dark:hover:bg-red-700 transition-colors duration-300 shadow-lg"
                        title="Remove image"
                      >
                        <MdDelete className="text-lg" />
                      </button>
                      <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                          Image uploaded successfully
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const fileInput =
                              document.getElementById("image-upload");
                            if (fileInput) fileInput.click();
                          }}
                          className="text-orange-500 dark:text-orange-400 text-sm hover:text-orange-600 dark:hover:text-orange-300 transition-colors duration-300 mt-1"
                        >
                          Change image
                        </button>
                      </div>
                    </div>
                  )}

                  {errors.image && (
                    <p className="text-red-500 dark:text-red-400 text-xs transition-colors duration-300">
                      {errors.image}
                    </p>
                  )}
                </div>
              </div>

              {/* Preview Card */}
              {formData.name && imagePreview && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
                    Preview
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300">
                          {formData.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                          Menu Item
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-3 rounded-md font-medium transition-colors duration-300 flex items-center gap-2 ${
                    isLoading
                      ? "bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-400 cursor-not-allowed"
                      : "bg-orange-500 dark:bg-orange-600 text-white hover:bg-orange-600 dark:hover:bg-orange-700"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding Menu Item...
                    </>
                  ) : (
                    "Add Menu Item"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/dashboard")}
                  disabled={isLoading}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300 disabled:opacity-50"
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

export default AddMenu;