import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Logo from "./Logo";
import DesktopNavigation from "./DesktopNavigation";
import AuthActions from "./AuthActions";
import MobileMenuToggle from "./MobileMenuToggle";
import MobileMenu from "./MobileMenu";
import Login from "./Login";
import { AuthContext } from "@Contexts/AuthContext";

const NAV_ITEMS: { name: string; path: string }[] = [
  { name: "Home", path: "/home" },
  { name: "Search", path: "/results" },
  { name: "About", path: "/about" },
  { name: "Features", path: "/features" },
  { name: "Comparison", path: "/comparison" },
  { name: "Team", path: "/team" },
  { name: "Contact", path: "/contact" },
];

interface NavbarProps {
  isTop: boolean;
}

const Navbar: React.FC<NavbarProps> = () => {
  const auth = useContext(AuthContext);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (menuOpen && !target.closest(".mobile-menu") && !target.closest(".menu-button")) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
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

  const isActiveNavItem = (itemPath: string) => {
    return location.pathname === itemPath;
  };

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
        <div className="w-full grid grid-cols-2 md:grid-cols-3 items-center py-3 px-4 md:px-6">
          <Logo />

          <DesktopNavigation navItems={NAV_ITEMS} isActiveNavItem={isActiveNavItem} />

          <div className="flex justify-end items-center">
            <AuthActions isLoggedIn={isLoggedIn} user={auth?.user} onLogin={() => setLoginOpen(true)} onLogout={handleLogout} />

            <div className="md:hidden flex items-center space-x-3">
              <AuthActions isLoggedIn={isLoggedIn} user={auth?.user} onLogin={() => setLoginOpen(true)} onLogout={handleLogout} isMobile={true} />
              <MobileMenuToggle menuOpen={menuOpen} onToggle={() => setMenuOpen(!menuOpen)} />
            </div>
          </div>
        </div>

        <MobileMenu
          menuOpen={menuOpen}
          navItems={NAV_ITEMS}
          isLoggedIn={isLoggedIn}
          isActiveNavItem={isActiveNavItem}
          onClose={() => setMenuOpen(false)}
          onLogin={() => setLoginOpen(true)}
          onLogout={handleLogout}
        />
      </nav>
      <Login
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        handleLogin={async (resp) => {
          setLoading(true);
          try {
            await handleLogin(resp);
            setLoginOpen(false);
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        }}
        loading={loading}
      />
    </>
  );
};

export default Navbar;
