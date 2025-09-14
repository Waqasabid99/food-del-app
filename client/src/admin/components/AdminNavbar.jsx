import React, { useEffect, useRef, useState } from "react";
import { MdLogout } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import ThemeToggleButton from "../../components/ui/theme-toggle-button";
import useAdminAuthStore from "@/store/authStore";

const AdminNavbar = ({ setSidebarCollapsed, sidebarCollapsed }) => {
  const [open, setOpen] = useState(false);
  const { admin, logout } = useAdminAuthStore();
  const username = admin?.name || admin?.username || "";
    const menuRef = useRef(null);
    // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300"
          >
            <span className="text-xl">☰</span>
          </button>
          <h1 className="text-2xl font-bold text-orange-500 dark:text-orange-400 transition-colors duration-300">
            FOODIE.
          </h1>
          <span className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
            Admin Dashboard
          </span>
        </div>

          <div className="flex items-center gap-4 relative" ref={menuRef}>
      {/* Theme toggle stays unchanged */}
      <ThemeToggleButton variant="circle-blur" url="" />

      {/* User avatar + name */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="w-8 h-8 bg-orange-500 dark:bg-orange-600 rounded-full flex items-center justify-center transition-colors duration-300">
          <FaRegUser className="text-white text-sm" />
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {username || "User"}
        </span>
      </div>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 w-36 border border-gray-200 dark:border-gray-700">
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 w-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <MdLogout className="text-lg" />
            Logout
          </button>
        </div>
      )}
    </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
