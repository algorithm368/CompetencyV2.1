import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FiHome, FiUsers, FiLock, FiChevronDown, FiChevronRight, FiCopy, FiBarChart2, FiChevronLeft } from "react-icons/fi";

interface AdminSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onMobileClose: () => void;
}

const mainMenu = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <FiHome /> },
  { name: "Users", path: "/admin/users", icon: <FiUsers /> },
  { name: "Permissions", path: "/admin/permissions", icon: <FiLock /> },
];

const frameworks = [
  {
    title: "TPQI",
    icon: <FiCopy />,
    key: "tpqi",
    items: [
      { label: "Sector", path: "/admin/tpqi/sector" },
      { label: "Category", path: "/admin/tpqi/category" },
    ],
  },
  {
    title: "SFIA",
    icon: <FiBarChart2 />,
    key: "sfia",
    items: [
      { label: "Skills", path: "/admin/sfia/skill" },
      { label: "Levels", path: "/admin/sfia/level" },
      { label: "Categories", path: "/admin/sfia/category" },
      { label: "SubCategories", path: "/admin/sfia/subcategory" },
      { label: "Descriptions", path: "/admin/sfia/description" },
    ],
  },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, mobileOpen, onToggle, onMobileClose }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      {/* Mobile overlay */}
      <div className={`fixed inset-0 bg-opacity-40 z-20 md:hidden transition-opacity ${mobileOpen ? "opacity-50 visible" : "opacity-0 invisible"}`} onClick={onMobileClose} />

      <aside
        className={`fixed top-0 left-0 bottom-0 z-20 w-64 bg-white text-gray-900 shadow-md transform transition-transform duration-200 ease-in-out
    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
    ${collapsed ? "-translate-x-full md:translate-x-0" : ""}`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-5 py-2 flex items-center justify-between ">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/src/assets/competency-logo.png" alt="Logo" className="h-10 w-10 rounded-full object-cover" />
              <span className="text-lg font-semibold text-gray-900 tracking-wide">Competency</span>
            </Link>
            <button className="md:hidden text-gray-500 hover:text-gray-800" onClick={onToggle}>
              <FiChevronLeft size={22} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto mt-4 px-1">
            {/* Main */}
            <div className="mb-6">
              <p className="px-5 text-xs font-semibold uppercase text-gray-400 mb-2 tracking-wider">Main</p>
              <ul className="space-y-1">
                {mainMenu.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-200
                   ${isActive ? "bg-indigo-100 text-indigo-600 font-semibold" : "text-gray-700 hover:bg-gray-100"}`
                      }
                      onClick={onMobileClose}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="truncate">{item.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Frameworks */}
            <div>
              <p className="px-5 text-xs font-semibold uppercase text-gray-400 mb-2 tracking-wider">Framework</p>
              <ul className="space-y-1">
                {frameworks.map(({ title, icon, key, items }) => (
                  <li key={key}>
                    <button type="button" onClick={() => toggleSection(key)} className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 transition rounded-lg">
                      <span className="text-lg text-indigo-500">{icon}</span>
                      <span className="flex-1 text-left font-medium">{title}</span>
                      {openSections[key] ? <FiChevronDown className="text-gray-500" /> : <FiChevronRight className="text-gray-500" />}
                    </button>

                    {openSections[key] && (
                      <ul className="pl-10 space-y-1 mt-1">
                        {items.map((link) => (
                          <li key={link.path}>
                            <NavLink
                              to={link.path}
                              className={({ isActive }) =>
                                `block px-4 py-2 rounded-md text-sm transition
                          ${isActive ? "bg-indigo-100 text-indigo-600 font-medium" : "text-gray-700 hover:bg-gray-100"}`
                              }
                              onClick={onMobileClose}
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
    </>
  );
};

export default AdminSidebar;
