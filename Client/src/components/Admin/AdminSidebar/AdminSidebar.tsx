import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiHome, FiUsers, FiLock, FiChevronDown, FiChevronRight, FiCopy, FiBarChart2, FiKey, FiChevronLeft } from "react-icons/fi";

interface AdminSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onMobileClose: () => void;
}

// Main menu
const mainMenu = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome /> },
  { label: "Users", path: "/admin/users", icon: <FiUsers /> },
  { label: "Session Management", path: "/admin/session", icon: <FiLock /> },
  // { label: "Backup", path: "/admin/backup", icon: <FiCopy /> },
  { label: "Logs", path: "/admin/logs", icon: <FiBarChart2 /> },
];

// RBAC groups
const rbacGroups = [
  {
    title: "RBAC",
    icon: <FiKey />,
    key: "rbac",
    items: [
      { label: "Roles", path: "/admin/roles" },
      { label: "Role Permissions", path: "/admin/role-permissions" },
      { label: "Permissions", path: "/admin/permissions" },
      { label: "Operations", path: "/admin/operations" },
      { label: "Assets", path: "/admin/assets" },
      { label: "Asset Instances", path: "/admin/asset-instances" },
      { label: "User Roles", path: "/admin/user-roles" },
      { label: "User Asset Instances", path: "/admin/user-asset-instances" },
    ],
  },
];

// Frameworks groups
const frameworks = [
  {
    title: "TPQI",
    icon: <FiCopy />,
    key: "tpqi",
    items: [
      { label: "Sector", path: "/admin/tpqi/sector" },
      { label: "Career", path: "/admin/tpqi/career" },
      { label: "Skill", path: "/admin/tpqi/skill" },
      { label: "Occupational", path: "/admin/tpqi/occupational" },
      { label: "Knowledge", path: "/admin/tpqi/knowledge" },
      { label: "Unit Code", path: "/admin/tpqi/unitcode" },
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
  const location = useLocation();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // เปิด group ที่ตรงกับ path ปัจจุบันอัตโนมัติ
  useEffect(() => {
    const allGroups = [...rbacGroups, ...frameworks];
    const newOpenSections: Record<string, boolean> = {};
    allGroups.forEach((group) => {
      if (group.items.some((item) => location.pathname === item.path)) {
        newOpenSections[group.key] = true;
      }
    });
    setOpenSections(newOpenSections);
  }, [location.pathname]);

  const renderGroup = (group: (typeof rbacGroups)[0] | (typeof frameworks)[0]) => (
    <li key={group.key}>
      <button
        type="button"
        onClick={() => setOpenSections((prev) => ({ ...prev, [group.key]: !prev[group.key] }))}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition rounded-md"
      >
        <span className="text-lg text-indigo-500">{group.icon}</span>
        <span className="flex-1 text-left font-medium">{group.title}</span>
        {openSections[group.key] ? <FiChevronDown className="text-gray-500" /> : <FiChevronRight className="text-gray-500" />}
      </button>

      {openSections[group.key] && (
        <ul className="pl-11 space-y-1 mt-1 transition-all">
          {group.items.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) => `block px-3 py-2 rounded-md text-sm transition ${isActive ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={onMobileClose}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );

  return (
    <>
      {/* Mobile overlay */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity ${mobileOpen ? "opacity-50 visible" : "opacity-0 invisible"}`} onClick={onMobileClose} />

      <aside
        className={`fixed top-16 left-0 bottom-0 z-30 bg-white text-gray-900 shadow-sm transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          ${collapsed ? "w-16" : "w-64"} border-r border-gray-200`}
      >
        <div className="h-full flex flex-col">
          {/* Mobile close button */}
          <div className="px-6 py-4 flex items-center justify-end border-b md:hidden">
            <button className="text-gray-500 hover:text-gray-800" onClick={onToggle}>
              <FiChevronLeft size={22} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto mt-3 px-2">
            {/* Main */}
            <div className="mb-6">
              <p className="px-4 text-xs font-semibold uppercase text-gray-400 mb-2 tracking-wider">Main</p>
              <ul className="space-y-1">
                {mainMenu.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-200 border-l-4 ${
                          isActive ? "bg-indigo-50 text-indigo-600 font-semibold border-indigo-600" : "text-gray-700 hover:bg-gray-100 border-transparent"
                        }`
                      }
                      onClick={onMobileClose}
                    >
                      {item.icon && <span className="text-lg">{item.icon}</span>}
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* RBAC Groups */}
            <div className="mb-6">
              <p className="px-4 text-xs font-semibold uppercase text-gray-400 mb-2 tracking-wider">RBAC</p>
              <ul className="space-y-1">{rbacGroups.map(renderGroup)}</ul>
            </div>

            {/* Frameworks Groups */}
            <div>
              <p className="px-4 text-xs font-semibold uppercase text-gray-400 mb-2 tracking-wider">Framework</p>
              <ul className="space-y-1">{frameworks.map(renderGroup)}</ul>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
