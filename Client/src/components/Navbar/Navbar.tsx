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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Smooth visibility animation on mount
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

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
          transition-all duration-300 ease-out
          ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0"
          }
          bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm border-b border-gray-200/30 dark:border-gray-700/30
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between min-h-[56px] sm:min-h-[64px]">
          {/* Logo */}
          <Link
            to="/"
            className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white 
                     transition-colors duration-200 ease-out
                     hover:text-blue-600 dark:hover:text-blue-400
                     touch-manipulation"
          >
            Competency
          </Link>

          {/* Mobile menu toggle */}
          <div className="sm:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="p-3 rounded-xl transition-all duration-200 ease-out
                       hover:bg-gray-100 dark:hover:bg-gray-800
                       active:bg-gray-200 dark:active:bg-gray-700 active:scale-95
                       focus:outline-none focus:ring-2 focus:ring-blue-500/30
                       touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <div className="w-6 h-6 relative">
                <Bars3Icon
                  className={`absolute inset-0 h-6 w-6 text-gray-700 dark:text-gray-300
                           transition-all duration-200 ease-out
                           ${
                             menuOpen
                               ? "opacity-0 rotate-45"
                               : "opacity-100 rotate-0"
                           }`}
                />
                <XMarkIcon
                  className={`absolute inset-0 h-6 w-6 text-gray-700 dark:text-gray-300
                           transition-all duration-200 ease-out
                           ${
                             menuOpen
                               ? "opacity-100 rotate-0"
                               : "opacity-0 -rotate-45"
                           }`}
                />
              </div>
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden sm:flex items-center space-x-6 lg:space-x-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="relative text-gray-700 dark:text-gray-300 font-medium text-sm lg:text-base
                         transition-colors duration-200 ease-out
                         hover:text-gray-900 dark:hover:text-white
                         group touch-manipulation py-2"
              >
                {item.name}
                <span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 
                           group-hover:w-full transition-all duration-200 ease-out"
                />
              </Link>
            ))}
          </div>

          {/* Desktop auth section */}
          <div className="hidden sm:flex items-center">
            {isLoggedIn ? (
              <div className="touch-manipulation">
                <ProfileDisplay profile={auth?.user} onLogout={handleLogout} />
              </div>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 
                         text-white text-sm font-medium px-4 py-2 rounded-lg
                         transition-all duration-200 ease-out
                         active:bg-blue-800 active:scale-95
                         focus:outline-none focus:ring-2 focus:ring-blue-500/30
                         touch-manipulation min-h-[40px]"
              >
                <FaSignInAlt className="h-4 w-4" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`sm:hidden transition-all duration-300 ease-out overflow-hidden
                     ${
                       menuOpen
                         ? "max-h-screen opacity-100"
                         : "max-h-0 opacity-0"
                     }`}
        >
          <div
            className={`
              ${
                isTop
                  ? "bg-white/96 dark:bg-gray-900/96 backdrop-blur-sm"
                  : "bg-white dark:bg-gray-900"
              }
              border-t border-gray-200/40 dark:border-gray-700/40
              shadow-lg
            `}
          >
            <div className="px-4 py-6 space-y-1 max-h-[70vh] overflow-y-auto overscroll-contain">
              {NAV_ITEMS.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className="block py-4 px-4 rounded-xl text-gray-700 dark:text-gray-300 font-medium text-base
                           transition-all duration-200 ease-out
                           hover:bg-gray-50 dark:hover:bg-gray-800
                           hover:text-gray-900 dark:hover:text-white
                           active:bg-gray-100 dark:active:bg-gray-700 active:scale-[0.98]
                           touch-manipulation min-h-[52px] flex items-center
                           border-l-4 border-transparent hover:border-blue-500/20"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: menuOpen
                      ? "slideIn 0.3s ease-out forwards"
                      : "none",
                  }}
                >
                  <span className="flex-1">{item.name}</span>
                  <span className="text-gray-400 dark:text-gray-500 text-sm">
                    ›
                  </span>
                </Link>
              ))}

              {/* Mobile auth section */}
              <div className="pt-6 border-t border-gray-200/60 dark:border-gray-700/60 mt-6">
                {isLoggedIn ? (
                  <div className="space-y-3">
                    {/* User info section */}
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {auth?.user?.name?.charAt(0) || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {auth?.user?.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {auth?.user?.email || "user@example.com"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-4 text-red-600 dark:text-red-400 font-medium
                               rounded-xl transition-all duration-200 ease-out
                               hover:bg-red-50 dark:hover:bg-red-900/20
                               active:bg-red-100 dark:active:bg-red-900/30 active:scale-[0.98]
                               touch-manipulation min-h-[52px] flex items-center justify-center
                               border-2 border-red-200/50 dark:border-red-800/50"
                    >
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setLoginOpen(true);
                      setMenuOpen(false);
                    }}
                    className="flex items-center justify-center space-x-3 w-full bg-blue-600 hover:bg-blue-700
                             text-white font-medium px-4 py-4 rounded-xl
                             transition-all duration-200 ease-out
                             active:bg-blue-800 active:scale-[0.98]
                             touch-manipulation min-h-[52px]
                             shadow-lg shadow-blue-600/20"
                  >
                    <FaSignInAlt className="h-5 w-5" />
                    <span className="text-base">Login to Continue</span>
                  </button>
                )}
              </div>
            </div>

            {/* Safe area for mobile devices */}
            <div className="h-safe-area-inset-bottom bg-transparent"></div>
          </div>
        </div>
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

      {/* Minimal CSS animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile-specific optimizations */
        @media (max-width: 640px) {
          .touch-manipulation {
            touch-action: manipulation;
          }

          /* Prevent zoom on input focus */
          input,
          select,
          textarea {
            font-size: 16px;
          }

          /* Better scrolling for mobile menu */
          .overscroll-contain {
            overscroll-behavior: contain;
          }

          /* Safe area handling for devices with notches */
          .h-safe-area-inset-bottom {
            height: env(safe-area-inset-bottom);
          }
        }

        /* Improve touch targets */
        @media (hover: none) and (pointer: coarse) {
          /* This targets touch devices */
          button,
          a {
            min-height: 44px;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
