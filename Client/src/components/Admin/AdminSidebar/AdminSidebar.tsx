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
      { label: "Career", path: "/admin/tpqi/career" },
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
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity ${mobileOpen ? "opacity-50 visible" : "opacity-0 invisible"}`} onClick={onMobileClose} />

      <aside
        className={`fixed top-0 left-0 bottom-0 z-30 w-64 bg-gray-800 text-gray-100 transform transition-transform duration-200 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${collapsed ? "-translate-x-full md:translate-x-0" : ""}`}
      >
        <div className="h-full flex flex-col">
          <div className="px-5 py-3 flex items-center justify-between">
            <div className="flex-shrink-0 flex items-center space-x-3">
              <Link to="/" className="flex items-center">
                <img src="/src/assets/competency-logo.png" alt="Competency Logo" className="h-9 w-9 rounded-full object-cover" />
                <span className="text-xl ml-3 font-semibold transition-colors duration-300 text-white">Competency</span>
              </Link>
            </div>
            <button className="md:hidden" onClick={onToggle} aria-label="Collapse sidebar">
              <FiChevronLeft size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto mt-4">
            <div className="mb-6">
              <p className="px-6 text-xs font-semibold uppercase text-gray-400 mb-2">Main</p>
              <ul>
                {mainMenu.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center px-6 py-3 text-sm hover:bg-gray-700 transition-colors duration-150 ${isActive ? "bg-gray-700 font-medium text-white" : "text-gray-300"}`
                      }
                      onClick={onMobileClose}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      <span>{item.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="px-6 text-xs font-semibold uppercase text-gray-400 mb-2">Framework</p>
              <ul>
                {frameworks.map(({ title, icon, key, items }) => (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => toggleSection(key)}
                      className="w-full flex items-center px-6 py-3 text-sm hover:bg-gray-700 transition-colors duration-150 text-gray-300"
                      aria-expanded={!!openSections[key]}
                    >
                      <span className="mr-3 text-lg">{icon}</span>
                      <span className="flex-1 text-left">{title}</span>
                      {openSections[key] ? <FiChevronDown /> : <FiChevronRight />}
                    </button>
                    {openSections[key] && (
                      <ul className="pl-12 bg-gray-700">
                        {items.map((link) => (
                          <li key={link.path}>
                            <NavLink
                              to={link.path}
                              className={({ isActive }) =>
                                `block px-6 py-2 text-sm hover:bg-gray-600 transition-colors duration-150 ${isActive ? "bg-gray-600 font-medium text-white" : "text-gray-300"}`
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
