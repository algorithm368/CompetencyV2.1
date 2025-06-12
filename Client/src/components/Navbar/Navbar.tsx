import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { FaSignInAlt } from "react-icons/fa";
import ProfileDisplay from "./ProfileDisplay";
import Login from "./Login";

export interface RawProfile {
  givenName?: string;
  familyName?: string;
  imageUrl?: string;
  email?: string;
  role?: string;
}

export interface CredentialResponse {
  credential?: string;
}

interface NavbarProps {
  isTop: boolean;
  isLoggedIn: boolean;
  profile: RawProfile | null;
  handleLogin: (response: CredentialResponse | { credential: string }) => void;
  handleLogout: () => void;
}

const NAV_ITEMS: { name: string; path: string }[] = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Features", path: "/features" },
  { name: "Comparison", path: "/comparison" },
  { name: "Team", path: "/team" },
  { name: "Contact", path: "/contact" },
];

const Navbar: React.FC<NavbarProps> = ({ isTop, isLoggedIn, profile, handleLogin, handleLogout }) => {
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

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 w-full z-50
          transition-colors duration-300
          ${isTop ? "bg-transparent" : "bg-white  dark:bg-gray-900 shadow"}
        `}
      >
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            Competency
          </Link>
          <div className="sm:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="focus:outline-none"
            >
              {menuOpen ? <XMarkIcon className="h-6 w-6 text-white dark:text-white" /> : <Bars3Icon className="h-6 w-6 text-white dark:text-white" />}
            </button>
          </div>
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
          <div className="hidden sm:flex items-center space-x-4">
            {isLoggedIn ? (
              <ProfileDisplay
                profile={profile}
                onLogout={handleLogout}
              />
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="
                  flex items-center space-x-1
                  bg-black text-white text-sm font-medium
                  px-5 py-2 rounded-lg
                  shadow
                  hover:bg-blue-50 hover:text-blue-700
                  focus:outline-none focus:ring-1 focus:ring-blue-300
                  transition transform duration-200 ease-in-out
                  hover:scale-105
                  dark:bg-gray-800 dark:text-gray-200
                  dark:hover:bg-gray-700 dark:hover:text-white
                  dark:focus:ring-gray-500
                "
              >
                <FaSignInAlt className="h-4 w-4" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
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
                <div className="mt-2">
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 rounded"
                  >
                    SignOut
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setLoginOpen(true);
                    setMenuOpen(false);
                  }}
                  className="
                  flex items-center space-x-2
                text-blue-600 font-medium
                  px-5 py-2 rounded-2xl
                  hover:bg-blue-50 hover:text-blue-700
                  focus:outline-none focus:ring-2 focus:ring-blue-300
                  transition transform duration-200 ease-in-out
                  hover:scale-105
                  dark:bg-gray-800 dark:text-gray-200
                  dark:hover:bg-gray-700 dark:hover:text-white
                  
                "
                >
                  <FaSignInAlt className="h-5 w-5" />
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

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
