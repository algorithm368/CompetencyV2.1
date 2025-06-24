import React, { useContext, useState } from "react";
import { FiMenu, FiBell } from "react-icons/fi";
import AuthContext from "@Contexts/AuthContext";
import Login from "../Navbar/Login";
import ProfileDisplay from "../Navbar/ProfileDisplay";

interface AdminNavbarProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ collapsed, onToggleSidebar }) => {
  const auth = useContext(AuthContext);
  const isLoggedIn = !!auth?.user;
  const [loginOpen, setLoginOpen] = useState(false);

  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-20 flex items-center px-4 md:px-6 transition-all duration-200 ${collapsed ? "md:pl-4" : "md:pl-64"}`}>
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="text-gray-600 hover:text-gray-800 md:hidden mr-4"
            aria-label="Toggle sidebar"
          >
            <FiMenu size={20} />
          </button>
        </div>

        <div className="flex items-center ml-auto space-x-4">
          {/* Notifications */}
          <button
            className="relative text-gray-600 hover:text-gray-800"
            aria-label="Notifications"
          >
            <FiBell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full" />
          </button>

          {/* Profile / Login */}
          {isLoggedIn ? (
            <div style={{ marginTop: "6px" }}>
              <ProfileDisplay
                profile={auth!.user!}
                onLogout={auth!.logout!}
              />
            </div>
          ) : (
            <>
              <button
                onClick={handleLoginOpen}
                className="flex items-center space-x-1 bg-black text-white text-sm font-medium px-4 py-2 rounded-3xl hover:bg-gray-800 transition"
              >
                Login
              </button>
              <Login
                open={loginOpen}
                onClose={handleLoginClose}
                handleLogin={async (resp) => {
                  await auth?.login(resp.credential!);
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
