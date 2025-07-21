import React, { useState, useEffect } from "react";
import { LogOut, Menu, X, Bell, Search } from "lucide-react";
import { getCurrentUser } from "../utils/auth";

const UserDropdown = ({ user, onClose }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onClose();
    window.location.href = "/login";
  };

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 border border-gray-200">
      <div className="py-1">
        <div className="px-4 py-2 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user.name}
          </p>
          <p className="text-xs text-gray-500 truncate" title={user.email}>
            {user.email}
          </p>
          {user.role && (
            <p className="text-xs text-[#F2711F] font-semibold">
              Role: {user.role}
            </p>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center"
        >
          <LogOut size={16} className="mr-2 cursor-pointer" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

const AdminConsultantLayout = ({
  children,
  menuItems = [],
  supportItems = [],
  userRole = "Admin",
  panelTitle = "Admin Panel",
}) => {
  // Debug: log menuItems
  console.log('AdminConsultantLayout menuItems:', menuItems);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const MenuItem = ({ item }) => {
    const Icon = item.icon;
    const active = item.active || false;

    return (
      <li>
        <button
          onClick={item.onClick}
          className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group ${
            active
              ? `${item.bgColor} ${item.color} shadow-sm`
              : "text-gray-700 hover:bg-gray-50"
          } ${item.className || ""}`}
        >
          <Icon
            size={20}
            className={`${
              sidebarOpen ? "mr-3" : "mx-auto"
            } flex-shrink-0 transition-colors ${
              active ? item.color : "text-gray-500 group-hover:text-gray-700"
            }`}
          />
          <div
            className={`${
              sidebarOpen ? "block" : "hidden"
            } transition-all duration-300 text-left`}
          >
            <div className="font-medium text-sm">{item.name}</div>
            <div
              className={`text-xs mt-0.5 ${
                active ? `${item.color} opacity-80` : "text-gray-500"
              }`}
            >
              {item.description}
            </div>
          </div>
        </button>
      </li>
    );
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col border-r border-gray-200`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div
            className={`${
              sidebarOpen ? "block" : "hidden"
            } transition-all duration-300`}
          >
            <div className="flex items-center mb-2">
              <img
                src="https://daihoc.fpt.edu.vn/wp-content/uploads/2023/04/cropped-cropped-2021-FPTU-Long-300x93.png"
                alt="FPT Logo"
                className="h-8 w-auto"
              />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              {panelTitle}
            </h2>
            <p className="text-sm text-[#F2711F]">
              Xin chào, {user?.name || "User"}
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {/* Main Menu */}
          {menuItems.length > 0 && (
            <div className="mb-6">
              <h3
                className={`${
                  sidebarOpen ? "block" : "hidden"
                } text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3`}
              >
                Quản lý chính
              </h3>
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <MenuItem key={item.id} item={item} />
                ))}
              </ul>
            </div>
          )}

          {/* Support Menu */}
          {supportItems.length > 0 && (
            <div className="mb-6">
              <h3
                className={`${
                  sidebarOpen ? "block" : "hidden"
                } text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3`}
              >
                {userRole === "Admin" ? "Hỗ trợ hệ thống" : "Hỗ trợ sinh viên"}
              </h3>
              <ul className="space-y-2">
                {supportItems.map((item) => (
                  <MenuItem key={item.id} item={item} onClick={item.onClick} />
                ))}
              </ul>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="w-full flex items-center p-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group cursor-pointer"
          >
            <LogOut
              size={20}
              className={`${
                sidebarOpen ? "mr-3" : "mx-auto"
              } flex-shrink-0 transition-colors group-hover:text-red-600`}
            />
            <span
              className={`${
                sidebarOpen ? "block" : "hidden"
              } transition-all duration-300 font-medium text-sm`}
            >
              Đăng xuất
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                {panelTitle}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Chào mừng đến với hệ thống quản lý
              </p>
            </div>

            <div className="flex items-center space-x-4">
              

              {/* User Profile */}
              {user && (
                <div className="relative">
                  <button
                    onClick={toggleUserDropdown}
                    className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                  >
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                    <div className="w-10 h-10 bg-[#F2711F] rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default AdminConsultantLayout;
