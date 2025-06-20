import React from "react";
import { FiMenu, FiBell, FiUser } from "react-icons/fi";

interface AdminNavbarProps {
  onToggleSidebar?: () => void;
  collapsed: boolean;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onToggleSidebar, collapsed }) => {
  const leftClass = collapsed ? "left-0" : "left-64";

  return (
    <header className={`bg-white border-b border-gray-200 fixed top-0 ${leftClass} right-0 z-10`}>
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="text-gray-700 hover:text-gray-900 lg:hidden mr-4"
            >
              <FiMenu className="text-xl" />
            </button>
          )}
          <span className="text-xl font-semibold text-gray-800">Hello</span>
        </div>
        <div className="flex items-center space-x-4">
          {/* Notification */}
          <button className="relative text-gray-700 hover:text-gray-900">
            <FiBell className="text-xl" />
            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
          </button>
          {/* User avatar/name */}
          <div className="flex items-center space-x-2">
            <FiUser className="text-xl text-gray-700" />
            <span className="text-gray-700">User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
