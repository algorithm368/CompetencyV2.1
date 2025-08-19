import React from "react";
import { NavItem } from "./types";
import MobileMenuHeader from "./MobileMenuHeader";
import MobileMenuItems from "./MobileMenuItems";
import MobileMenuAuth from "./MobileMenuAuth";

interface MobileMenuProps {
  menuOpen: boolean;
  navItems: NavItem[];
  isLoggedIn: boolean;
  isActiveNavItem: (path: string) => boolean;
  onClose: () => void;
  onLogin: () => void;
  onLogout: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  menuOpen,
  navItems,
  isLoggedIn,
  isActiveNavItem,
  onClose,
  onLogin,
  onLogout,
}) => {
  if (!menuOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <button
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-all duration-500 ease-in-out border-0 p-0 m-0 cursor-default ${
          menuOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        aria-label="Close menu overlay"
      />
      
      {/* Menu Dialog */}
      <dialog
        open={menuOpen}
        className={`fixed inset-auto top-0 right-0 m-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden transform transition-all duration-500 ease-out ${
          menuOpen
            ? "translate-x-0 opacity-100 scale-100"
            : "translate-x-full opacity-0 scale-95"
        }`}
        aria-modal="true"
      >
        <MobileMenuHeader menuOpen={menuOpen} onClose={onClose} />
        <MobileMenuItems
          menuOpen={menuOpen}
          navItems={navItems}
          isActiveNavItem={isActiveNavItem}
          onClose={onClose}
        />
        <MobileMenuAuth
          menuOpen={menuOpen}
          isLoggedIn={isLoggedIn}
          navItemsCount={navItems.length}
          onLogin={onLogin}
          onLogout={onLogout}
          onClose={onClose}
        />
      </dialog>
    </>
  );
};

export default MobileMenu;
