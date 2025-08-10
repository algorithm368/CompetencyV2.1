import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSignInAlt, FaBars, FaTimes } from "react-icons/fa";
import ProfileDisplay from "./ProfileDisplay";
import Login from "./Login";
import AuthContext from "@Contexts/AuthContext";

const Navbar: React.FC = () => {
  const auth = useContext(AuthContext);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  // Move isLoggedIn declaration before NAV_ITEMS to avoid temporal dead zone
  const isLoggedIn = !!auth?.user;

  const NAV_ITEMS = useMemo(
    () => {
      const baseItems = [
        { name: "Home", path: "/home" },
        { name: "Search", path: "/results" },
        { name: "About", path: "/about" }
      ];
      
      // Only add Profile item if user is logged in
      if (isLoggedIn) {
        baseItems.push({ name: "Profile", path: "/profile" });
      }
      
      return baseItems;
    },
    [isLoggedIn]
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        menuOpen &&
        !target.closest(".mobile-menu") &&
        !target.closest(".menu-button")
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActiveNavItem = useCallback(
    (itemPath: string) => location.pathname === itemPath,
    [location.pathname]
  );

  const handleLogin = useCallback(
    async (response: { credential?: string }) => {
      if (response.credential) {
        try {
          await auth?.login(response.credential);
        } catch (error) {
          console.error("Login failed:", error);
        }
      }
    },
    [auth]
  );

  const handleLogout = useCallback(async () => {
    try {
      await auth?.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [auth]);

  const openLogin = useCallback(() => setLoginOpen(true), []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full flex items-center justify-between py-3 px-4 md:px-6">
          {/* Logo */}
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

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-6 lg:space-x-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative font-medium transition-all duration-300 hover:scale-105 text-sm lg:text-base ${
                    isActiveNavItem(item.path)
                      ? "text-teal-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-teal-600 after:transition-all after:duration-300"
                      : "text-gray-600 hover:text-teal-600 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-teal-600 hover:after:w-full after:transition-all after:duration-300"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Login/Profile */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {isLoggedIn ? (
              <ProfileDisplay profile={auth?.user} onLogout={handleLogout} />
            ) : (
              <button
                onClick={openLogin}
                className="flex items-center space-x-2 bg-white text-teal-600 hover:bg-teal-600 hover:text-white text-sm font-medium px-4 lg:px-5 py-2 lg:py-2.5 rounded-3xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 ease-in-out hover:scale-105 transform border border-teal-600"
              >
                <FaSignInAlt className="h-4 w-4" />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {!isLoggedIn && (
              <button
                onClick={openLogin}
                className="flex items-center justify-center bg-white text-teal-600 hover:bg-teal-600 hover:text-white p-2 rounded-full shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-200 ease-in-out border border-teal-600"
                aria-label="Login"
              >
                <FaSignInAlt className="h-4 w-4" />
              </button>
            )}
            {isLoggedIn && (
              <div className="scale-90">
                <ProfileDisplay profile={auth?.user} onLogout={handleLogout} />
              </div>
            )}
            <button
              onClick={toggleMenu}
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

        {/* Mobile Menu */}
        {menuOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" />
            <dialog
              open
              className="mobile-menu fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-out"
              aria-modal="true"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <span className="text-gray-900 font-semibold text-lg">
                  Menu
                </span>
                <button
                  onClick={closeMenu}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") closeMenu();
                  }}
                  className="flex items-center justify-center w-8 h-8 text-teal-600 hover:text-teal-700 focus:outline-none rounded-lg transition-colors duration-200"
                  aria-label="Close menu"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col p-4 space-y-2">
                {NAV_ITEMS.map((item, index) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={closeMenu}
                    className={`flex items-center font-medium py-4 px-4 rounded-xl transition-all duration-200 transform hover:translate-x-1 border-b border-gray-100 last:border-b-0 ${
                      isActiveNavItem(item.path)
                        ? "text-teal-600 bg-teal-50 border-l-4 border-l-teal-600"
                        : "text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                    }`}
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
                <div className="pt-6 mt-6 border-t border-gray-200">
                  {isLoggedIn ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        closeMenu();
                      }}
                      className="flex items-center justify-center w-full text-red-600 hover:text-red-700 font-medium py-4 px-4 text-base rounded-xl hover:bg-red-50 transition-all duration-200 border border-red-200 hover:border-red-300"
                    >
                      <span>Sign Out</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        openLogin();
                        closeMenu();
                      }}
                      className="flex items-center justify-center space-x-3 w-full text-teal-600 font-medium py-4 px-4 text-base rounded-xl bg-white border border-teal-200 hover:bg-teal-50 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-200 ease-in-out hover:scale-105 transform shadow-lg"
                    >
                      <FaSignInAlt className="h-5 w-5" />
                      <span>Login</span>
                    </button>
                  )}
                </div>
              </div>
            </dialog>
          </>
        )}
      </nav>
      <Login
        open={loginOpen}
        onClose={closeLogin}
        handleLogin={async (resp) => {
          await handleLogin(resp);
          closeLogin();
        }}
      />
    </>
  );
};

export default Navbar;
