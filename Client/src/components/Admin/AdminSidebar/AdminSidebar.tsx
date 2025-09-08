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
      { label: "Skill", path: "/admin/tpqi/skill" },
      { label: "Occupational", path: "/admin/tpqi/occupational" },
      { label: "Knowledge", path: "/admin/tpqi/knowledge" },
      { label: "Unit Code", path: "/admin/tpqi/unitcode" },
      { label: "Career", path: "/admin/tpqi/career" },
      { label: "Level", path: "/admin/tpqi/level" },
      { label: "Career Knowledge", path: "/admin/tpqi/clknowledge" },
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
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-2 ">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/src/assets/competency-logo.png" alt="Logo" className="object-cover w-10 h-10 rounded-full" />
              <span className="text-lg font-semibold tracking-wide text-gray-900">Competency</span>
            </Link>
            <button className="text-gray-500 md:hidden hover:text-gray-800" onClick={onToggle}>
              <FiChevronLeft size={22} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-1 mt-4 overflow-y-auto">
            {/* Main */}
            <div className="mb-6">
              <p className="px-5 mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">Main</p>
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
              <p className="px-5 mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">Framework</p>
              <ul className="space-y-1">
                {frameworks.map(({ title, icon, key, items }) => (
                  <li key={key}>
                    <button type="button" onClick={() => toggleSection(key)} className="flex items-center w-full gap-3 px-5 py-3 text-sm text-gray-700 transition rounded-lg hover:bg-gray-100">
                      <span className="text-lg text-indigo-500">{icon}</span>
                      <span className="flex-1 font-medium text-left">{title}</span>
                      {openSections[key] ? <FiChevronDown className="text-gray-500" /> : <FiChevronRight className="text-gray-500" />}
                    </button>

                    {openSections[key] && (
                      <ul className="pl-10 mt-1 space-y-1">
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
