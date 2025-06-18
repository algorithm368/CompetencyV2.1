import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { FaSignInAlt } from "react-icons/fa";
import ProfileDisplay from "./ProfileDisplay";
import Login from "./Login";
import AuthContext from "@Contexts/AuthContext";

const NAV_ITEMS: { name: string; path: string }[] = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Features", path: "/features" },
  { name: "Comparison", path: "/comparison" },
  { name: "Team", path: "/team" },
  { name: "Contact", path: "/contact" },
];

interface NavbarProps {
  isTop: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isTop }) => {
  const auth = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 640) {
        setMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isLoggedIn = !!auth?.user;

  const handleLogin = async (response: { credential?: string }) => {
    if (response.credential) {
      try {
        await auth?.login(response.credential);
      } catch (error) {
        console.error("Login failed:", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await auth?.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <nav
        className={`
            fixed top-0 left-0 w-full z-50
            transition-colors duration-300
            ${isTop ? "bg-transparent" : "bg-white dark:bg-gray-900 shadow"}
          `}
      >
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            Competency
          </Link>

          {/* Mobile menu toggle */}
          <div className="sm:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="focus:outline-none"
            >
              {menuOpen ? <XMarkIcon className="h-6 w-6 text-white dark:text-white" /> : <Bars3Icon className="h-6 w-6 text-white dark:text-white" />}
            </button>
          </div>

          {/* Desktop nav items */}
          <div className="hidden sm:flex space-x-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="hover:underline text-gray-900 dark:text-white font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop profile/login */}
          <div className="hidden sm:flex items-center space-x-4">
            {isLoggedIn ? (
              <ProfileDisplay
                profile={auth?.user}
                onLogout={handleLogout}
              />
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="flex items-center space-x-1 bg-black text-white text-sm font-medium px-5 py-2 rounded-lg shadow hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 transition transform duration-200 ease-in-out hover:scale-105 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-500"
              >
                <FaSignInAlt className="h-4 w-4" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className={`
                sm:hidden transition-all duration-300
                ${isTop ? "bg-white/90 backdrop-blur-md" : "bg-white dark:bg-gray-900"}
                shadow-md
              `}
          >
            <div className="px-4 pt-2 pb-4 flex flex-col space-y-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className="block hover:underline text-black dark:text-white font-medium"
                >
                  {item.name}
                </Link>
              ))}

              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 rounded"
                >
                  SignOut
                </button>
              ) : (
                <button
                  onClick={() => {
                    setLoginOpen(true);
                    setMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-blue-600 font-medium px-5 py-2 rounded-2xl hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition transform duration-200 ease-in-out hover:scale-105 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <FaSignInAlt className="h-5 w-5" />
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Login modal */}
      <Login
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        handleLogin={(resp) => {
          handleLogin(resp);
          setLoginOpen(false);
        }}
      />
    </>
  );
};

export default Navbar;
