import React, { useState } from "react";
import { AdminSidebar, AdminNavbar } from "@Components/ExportComponent";
interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const sidebarWidth = sidebarCollapsed ? 0 : 256;

  return (
    <>
      <AdminSidebar collapsed={sidebarCollapsed} />
      <div
        className="flex flex-col h-screen transition-[margin-left] duration-200"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <AdminNavbar
          onToggleSidebar={handleToggleSidebar}
          collapsed={sidebarCollapsed}
        />

        <main className="mt-13 p-5 flex-1 overflow-auto bg-gray-50">{children}</main>
      </div>
    </>
  );
};
