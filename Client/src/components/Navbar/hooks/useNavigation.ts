import { useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { NavItem } from "../types";

export const useNavigation = (isLoggedIn: boolean) => {
  const location = useLocation();

  const NAV_ITEMS: NavItem[] = useMemo(() => {
    const baseItems = [
      { name: "Home", path: "/home" },
      { name: "Search", path: "/results" },
      { name: "About", path: "/about" },      
    ];

    // Only add Profile item if user is logged in
    if (isLoggedIn) {
      baseItems.push({ name: "Profile", path: "/profile" });
      baseItems.push({ name: "Portfolio", path: "/portfolio" });
    }

    return baseItems;
  }, [isLoggedIn]);

  const isActiveNavItem = useCallback(
    (itemPath: string) => location.pathname === itemPath,
    [location.pathname]
  );

  return {
    NAV_ITEMS,
    isActiveNavItem,
  };
};
