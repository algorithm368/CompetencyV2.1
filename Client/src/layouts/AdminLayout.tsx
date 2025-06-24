import React, { useState, useEffect, useCallback } from "react";
import { AdminSidebar, AdminNavbar } from "@Components/ExportComponent";

/**
 * Wraps admin pages with responsive sidebar and navbar.
 */
export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        onToggle={toggleSidebar}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content panel */}
      <div className={`flex-1 flex flex-col bg-gray-100 transition-all duration-200 pt-16 ` + (sidebarCollapsed ? "md:pl-0" : "md:pl-64")}>
        <AdminNavbar
          collapsed={sidebarCollapsed}
          onToggleSidebar={() => {
            if (window.innerWidth < 768) {
              toggleMobile();
            } else {
              toggleSidebar();
            }
          }}
        />

        <main className="flex-1 p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
};
