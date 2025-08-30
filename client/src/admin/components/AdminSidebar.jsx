import React from "react";
import { GrRestaurant } from "react-icons/gr";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { MdRestaurantMenu } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const AdminSidebar = ({ activeTab, setActiveTab, sidebarCollapsed }) => {
  const navigate = useNavigate();

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <MdOutlineSpaceDashboard />,
      action: () => navigate("/admin/dashboard"),
      isRoute: true,
    },
    {
      id: "products",
      label: "Products",
      icon: <GrRestaurant />,
      action: () => navigate("/admin/products"),
      isRoute: true,
    },
    {
      id: "menu",
      label: "Menu",
      icon: <MdRestaurantMenu />,
      action: () => navigate("/admin/menu"),
      isRoute: true,
    },
    {
      id: "orders",
      label: "Orders",
      icon: <IoCartOutline />,
      action: () => setActiveTab("orders"),
    },
    {
      id: "customers",
      label: "Customers",
      icon: <FaRegUser />,
      action: () => setActiveTab("customers"),
    },
    {
      id: "settings",
      label: "Settings",
      icon: <IoSettingsOutline />,
      action: () => setActiveTab("settings"),
    },
  ];

  return (
    <aside
      className={`bg-white dark:bg-gray-800 shadow-sm dark:shadow-2xl border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        sidebarCollapsed ? "w-18" : "w-64"
      }`}
    >
      <div className="p-4">
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-300 ${
                activeTab === item.id
                  ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-orange-500 dark:hover:text-orange-400"
              } ${item.isRoute ? "hover:bg-orange-50 dark:hover:bg-orange-900/50" : ""}`}
            >
              <span className="text-lg">{item.icon}</span>
              {!sidebarCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;