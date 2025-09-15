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
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        {/* Left section */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300 flex-shrink-0"
          >
            <span className="text-lg sm:text-xl">☰</span>
          </button>
          
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-orange-500 dark:text-orange-400 transition-colors duration-300 flex-shrink-0">
              FOODIE.
            </h1>
            <span className="hidden sm:inline text-gray-500 dark:text-gray-400 text-xs sm:text-sm transition-colors duration-300 truncate">
              Admin Dashboard
            </span>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 relative flex-shrink-0" ref={menuRef}>
          {/* Theme toggle */}
          <div className="flex-shrink-0">
            <ThemeToggleButton variant="circle-blur" url="" />
          </div>

          {/* User section */}
          <div
            className="flex items-center gap-1 sm:gap-2 cursor-pointer min-w-0"
            onClick={() => setOpen((prev) => !prev)}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-500 dark:bg-orange-600 rounded-full flex items-center justify-center transition-colors duration-300 flex-shrink-0">
              <FaRegUser className="text-white text-xs sm:text-sm" />
            </div>
            <span className="hidden xs:inline text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-20 sm:max-w-24 md:max-w-32">
              {username || "User"}
            </span>
          </div>

          {/* Dropdown menu */}
          {open && (
            <div className="absolute right-0 top-8 sm:top-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 w-32 sm:w-36 border border-gray-200 dark:border-gray-700 z-50">
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 w-full text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <MdLogout className="text-base sm:text-lg flex-shrink-0" />
                <span className="truncate">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;