import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
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
      <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 border-blue-600 shadow-lg">
        <div className="w-full flex items-center justify-between py-2.5 px-3 sm:px-6">
          <div className="flex-shrink-0 flex items-center space-x-3">
            <Link
              to="/"
              className="flex items-center"
            >
              <img
                src="/src/assets/competency-logo.png"
                alt="Competency Logo"
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-xl ml-2 font-bold transition-colors duration-300 text-white">Competency</span>
            </Link>
          </div>

          <div className="hidden sm:flex space-x-8 flex-1 justify-center px-5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative font-medium transition-all duration-300 hover:scale-105 ${
                  isTop
                    ? "text-white/90 hover:text-white after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-400 hover:after:w-full after:transition-all after:duration-300"
                    : "text-blue-100 hover:text-white after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-400 hover:after:w-full after:transition-all after:duration-300"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden sm:flex items-center space-x-4 flex-shrink-0">
            {isLoggedIn ? (
              <ProfileDisplay
                profile={auth?.user}
                onLogout={handleLogout}
              />
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="flex items-center space-x-2 bg-white hover:bg-blue-600 text-black text-sm font-medium px-5 py-2.5 rounded-3xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 ease-in-out hover:scale-105 transform"
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
                sm:hidden transition-all duration-300 ease-in-out
                ${isTop ? "bg-gradient-to-br from-blue-900/95 via-blue-800/95 to-blue-700/95 backdrop-blur-md border-t border-blue-300/20" : "bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 border-t border-blue-600"}
                shadow-xl
              `}
          >
            <div className="px-6 pt-4 pb-6 flex flex-col space-y-3">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className="block text-white/90 hover:text-white font-medium py-2 px-3 rounded-lg hover:bg-blue-500/20 transition-all duration-200 transform hover:translate-x-1"
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-blue-400/30">
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200 font-medium"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setLoginOpen(true);
                      setMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full text-white font-medium px-5 py-3 text-base rounded-xl bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ease-in-out hover:scale-105 transform shadow-md"
                  >
                    <FaSignInAlt className="h-5 w-5" />
                    <span>Login</span>
                  </button>
                )}
              </div>
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
