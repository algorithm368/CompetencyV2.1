import React, { useContext, useState } from "react";
import { FiMenu, FiBell } from "react-icons/fi";
import AuthContext from "@Contexts/AuthContext";
import Login from "../../Navbar/Login";
import ProfileDisplay from "../../Navbar/ProfileDisplay";

interface AdminNavbarProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ collapsed, onToggleSidebar }) => {
  const auth = useContext(AuthContext);
  const { user, loading, login } = auth!;
  const isLoggedIn = !!user;
  const [loginOpen, setLoginOpen] = useState(false);

  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);
  const handleLogout = async () => {
    try {
      await auth?.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <>
      <header className={`fixed top-0 left-0 right-0 h-18 bg-white shadow-sm z-10 flex items-center px-4 md:px-6 transition-all duration-200 ${collapsed ? "md:pl-4" : "md:pl-64"}`}>
        {/* Sidebar toggle button (mobile only) */}
        <div className="flex items-center">
          <button onClick={onToggleSidebar} className="text-gray-500 hover:text-gray-700 md:hidden mr-4" aria-label="Toggle sidebar">
            <FiMenu size={22} />
          </button>
        </div>

        {/* Right section */}
        <div className="flex items-center ml-auto space-x-4">
          {/* Notifications */}
          <button className="relative text-gray-500 hover:text-gray-700" aria-label="Notifications">
            <FiBell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full" />
          </button>

          {/* Profile or Login */}
          {loading ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          ) : isLoggedIn ? (
            <div className="mt-[6px]">
              <ProfileDisplay profile={user} onLogout={handleLogout} />
            </div>
          ) : (
            <>
              <button onClick={handleLoginOpen} className="flex items-center space-x-1 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-indigo-700 transition">
                Login
              </button>
              <Login
                open={loginOpen}
                onClose={handleLoginClose}
                handleLogin={async (resp) => {
                  await login(resp.credential!);
                  setLoginOpen(false);
                }}
              />
            </>
          )}
        </div>
      </header>
    </>
  );
};

export default AdminNavbar;
