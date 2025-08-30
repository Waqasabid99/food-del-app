import React from "react";
import { MdLogout } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import ThemeToggleButton from "../../components/ui/theme-toggle-button";

const AdminNavbar = ({ setSidebarCollapsed, sidebarCollapsed }) => {
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
          <h1 className="text-2xl font-bold text-orange-500 dark:text-orange-400 transition-colors duration-300">FOODIE.</h1>
          <span className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">Admin Dashboard</span>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggleButton variant="circle-blur" url="" />
          <div className="relative">
            <div className="w-8 h-8 bg-orange-500 dark:bg-orange-600 rounded-full flex items-center justify-center transition-colors duration-300">
              <FaRegUser className="text-white text-sm" />
            </div>
          </div>
          <button className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300">
            <MdLogout className="text-xl" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;