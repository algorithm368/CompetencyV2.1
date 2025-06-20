import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiUsers, FiLock, FiChevronDown, FiChevronRight, FiCopy, FiBarChart2 } from "react-icons/fi";

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface AdminSidebarProps {
  collapsed?: boolean;
}

const mainMenu: MenuItem[] = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <FiHome /> },
  { name: "User", path: "/admin/users", icon: <FiUsers /> },
  { name: "Permission", path: "/admin/permissions", icon: <FiLock /> },
];

const dropdownSections = [
  {
    title: "TPQI",
    icon: <FiCopy />,
    expandedKey: "expandedTPQI",
    links: [
      { label: "Sector", path: "/admin/framework/tpqi/sector" },
      { label: "Category", path: "/admin/framework/tpqi/category" },
    ],
  },
  {
    title: "SFIA",
    icon: <FiBarChart2 />,
    expandedKey: "expandedSFIA",
    links: [
      { label: "Skills", path: "/admin/framework/sfia/skills" },
      { label: "Levels", path: "/admin/framework/sfia/levels" },
    ],
  },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed = false }) => {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const toggle = (key: string) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const renderNavLink = (to: string, icon: React.ReactNode, label: string) => (
    <NavLink
      to={to}
      className={({ isActive }) => `flex items-center px-6 py-3 text-sm hover:bg-slate-700 transition-colors duration-150 ${isActive ? "bg-slate-700 font-medium text-white" : "text-slate-300"}`}
    >
      <span className="mr-3 text-lg">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );

  return (
    <aside className={`bg-slate-800 text-slate-100 fixed top-0 left-0 bottom-0 z-20 w-64 transform transition-transform duration-200 ease-in-out ${collapsed ? "-translate-x-full" : "translate-x-0"}`}>
      <div className="h-full flex flex-col">
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>

        <nav className="flex-1 overflow-y-auto mt-4">
          {/* Main Menu */}
          <div className="mb-6">
            <p className="px-6 text-xs font-semibold uppercase text-slate-400 mb-2">Main</p>
            <ul>
              {mainMenu.map((item) => (
                <li key={item.path}>{renderNavLink(item.path, item.icon, item.name)}</li>
              ))}
            </ul>
          </div>

          {/* Dropdown Sections */}
          <div className="mb-6">
            <p className="px-6 text-xs font-semibold uppercase text-slate-400 mb-2">Framework</p>
            <ul>
              {dropdownSections.map(({ title, icon, links, expandedKey }) => (
                <li key={title}>
                  <button
                    type="button"
                    onClick={() => toggle(expandedKey)}
                    className="w-full flex items-center px-6 py-3 text-sm hover:bg-slate-700 transition-colors duration-150 text-slate-300"
                  >
                    <span className="mr-3 text-lg">{icon}</span>
                    <span className="flex-1 text-left">{title}</span>
                    {expanded[expandedKey] ? <FiChevronDown /> : <FiChevronRight />}
                  </button>
                  {expanded[expandedKey] && (
                    <ul className="pl-12 bg-slate-700">
                      {links.map((link) => (
                        <li key={link.path}>
                          <NavLink
                            to={link.path}
                            className={({ isActive }) => `block px-6 py-2 text-sm hover:bg-slate-600 transition-colors duration-150 ${isActive ? "bg-slate-600 font-medium text-white" : "text-slate-300"}`}
                          >
                            {link.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
