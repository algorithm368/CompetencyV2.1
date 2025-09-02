import React, { useContext, useState } from "react";
import { FiMenu, FiBell } from "react-icons/fi";
import AuthContext from "@Contexts/AuthContext";
import Login from "../../Navbar/Login";
import ProfileDisplay from "../../Navbar/ProfileDisplay";

interface AdminNavbarProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onToggleSidebar }) => {
  const auth = useContext(AuthContext);
  const { user, loading, login } = auth!;
  const isLoggedIn = !!user;
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border border-gray-200 z-40 flex items-center px-4 md:px-6 transition-all duration-200">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <img src="/src/assets/competency-logo.png" alt="Logo" className="h-9 w-9 rounded-full object-cover" />
        <span className="text-xl font-bold text-indigo-700 tracking-wide">Competency</span>
      </div>

      {/* Mobile sidebar toggle */}
      <div className="flex items-center ml-4">
        <button onClick={onToggleSidebar} className="text-gray-500 hover:text-gray-700 md:hidden mr-3" aria-label="Toggle sidebar">
          <FiMenu size={22} />
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center ml-auto space-x-5">
        <button className="relative text-gray-500 hover:text-gray-700 transition" aria-label="Notifications">
          <FiBell size={22} />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">3</span>
        </button>

        {loading ? (
          <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
        ) : isLoggedIn ? (
          <ProfileDisplay profile={user} onLogout={async () => await auth?.logout()} />
        ) : (
          <>
            <button onClick={() => setLoginOpen(true)} className="flex items-center space-x-1 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-indigo-700 transition">
              Login
            </button>
            <Login
              open={loginOpen}
              onClose={() => setLoginOpen(false)}
              handleLogin={async (resp) => {
                await login(resp.credential!);
                setLoginOpen(false);
              }}
            />
          </>
        )}
      </div>
    </header>
  );
};

export default AdminNavbar;
