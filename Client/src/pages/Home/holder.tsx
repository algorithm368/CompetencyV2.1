import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FaSignInAlt, FaBars, FaTimes } from "react-icons/fa";
import ProfileDisplay from "./ProfileDisplay";
import Login from "./Login";
import AuthContext from "@Contexts/AuthContext";

const NAV_ITEMS: { name: string; path: string }[] = [
  { name: "Home", path: "/home" },
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
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (
        menuOpen &&
        !target.closest(".mobile-menu") &&
        !target.closest(".menu-button")
      ) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

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
      <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full flex items-center justify-between py-3 px-4 md:px-6">
          {/* Logo - More compact on mobile */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/home" className="flex items-center space-x-1">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                ompetency
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 lg:space-x-8 flex-1 justify-center px-5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative font-medium transition-all duration-300 hover:scale-105 text-sm lg:text-base ${
                  isTop
                    ? "text-gray-600 hover:text-teal-600 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-teal-600 hover:after:w-full after:transition-all after:duration-300"
                    : "text-gray-600 hover:text-teal-600 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-teal-600 hover:after:w-full after:transition-all after:duration-300"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Login/Profile */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {isLoggedIn ? (
              <ProfileDisplay profile={auth?.user} onLogout={handleLogout} />
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="flex items-center space-x-2 bg-white text-teal-600 hover:bg-teal-600 hover:text-white text-sm font-medium px-4 lg:px-5 py-2 lg:py-2.5 rounded-3xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 ease-in-out hover:scale-105 transform border border-teal-600"
              >
                <FaSignInAlt className="h-4 w-4" />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mobile Login Button - Show only when not logged in */}
            {!isLoggedIn && (
              <button
                onClick={() => setLoginOpen(true)}
                className="flex items-center justify-center bg-white text-teal-600 hover:bg-teal-600 hover:text-white p-2 rounded-full shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-200 ease-in-out border border-teal-600"
                aria-label="Login"
              >
                <FaSignInAlt className="h-4 w-4" />
              </button>
            )}

            {/* Profile for mobile when logged in */}
            {isLoggedIn && (
              <div className="scale-90">
                <ProfileDisplay profile={auth?.user} onLogout={handleLogout} />
              </div>
            )}

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="menu-button flex items-center justify-center w-10 h-10 text-teal-600 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-transparent rounded-lg transition-all duration-200 hover:bg-teal-50"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <FaTimes className="h-5 w-5" />
              ) : (
                <FaBars className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Full screen overlay */}
        {menuOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" />

            {/* Menu Content */}
            <div className="mobile-menu fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-out">
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <span className="text-gray-900 font-semibold text-lg">
                  Menu
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center w-8 h-8 text-teal-600 hover:text-teal-700 focus:outline-none rounded-lg transition-colors duration-200"
                  aria-label="Close menu"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex flex-col p-4 space-y-2">
                {NAV_ITEMS.map((item, index) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center text-gray-700 hover:text-teal-600 font-medium py-4 px-4 rounded-xl hover:bg-teal-50 transition-all duration-200 transform hover:translate-x-1 border-b border-gray-100 last:border-b-0"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: menuOpen
                        ? "slideInRight 0.3s ease-out forwards"
                        : "none",
                    }}
                  >
                    <span className="text-base">{item.name}</span>
                  </Link>
                ))}

                {/* Mobile Login/Logout at bottom */}
                <div className="pt-6 mt-6 border-t border-gray-200">
                  {isLoggedIn ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="flex items-center justify-center w-full text-red-600 hover:text-red-700 font-medium py-4 px-4 text-base rounded-xl hover:bg-red-50 transition-all duration-200 border border-red-200 hover:border-red-300"
                    >
                      <span>Sign Out</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setLoginOpen(true);
                        setMenuOpen(false);
                      }}
                      className="flex items-center justify-center space-x-3 w-full text-teal-600 font-medium py-4 px-4 text-base rounded-xl bg-white border border-teal-200 hover:bg-teal-50 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-200 ease-in-out hover:scale-105 transform shadow-lg"
                    >
                      <FaSignInAlt className="h-5 w-5" />
                      <span>Login</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
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
