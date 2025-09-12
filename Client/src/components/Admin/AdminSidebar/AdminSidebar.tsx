<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiChevronDown, FiChevronRight, FiChevronLeft, FiAlertCircle } from "react-icons/fi";
import { checkViewPermission } from "@Services/competency/authService";
import { rbacGroups, frameworks, mainMenu } from "./MenuItem";
import { Modal } from "@Components/Common/Modal/Modal";
import { AdminSidebarProps, MenuItemBase, Group } from "./AdminSidebarType";
=======
import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FiHome, FiUsers, FiLock, FiChevronDown, FiChevronRight, FiCopy, FiBarChart2, FiChevronLeft } from "react-icons/fi";
import { label } from "framer-motion/client";

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
      { label: "Career Level", path: "/admin/tpqi/careerlevel" },
      { label: "Career Knowledge", path: "/admin/tpqi/clknowledge" },
      { label: "Career Detail", path: "/admin/tpqi/cldetail" },
      { label: "Career Skill", path: "/admin/tpqi/clskill" },
      { label: "Career Unit Code", path: "/admin/tpqi/clunitcode" },
      { label: "Unit Occupational", path: "/admin/tpqi/unitoccupational" },
      { label: "Unit Sector", path:"/admin/tpqi/unitsector"},
      { label: "User Skill", path:"/admin/tpqi/userskill"},
      { label: "User Knowledge", path:"/admin/tpqi/userknowledge"}
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
>>>>>>> crud-admin-tpqi

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, mobileOpen, onToggle, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [loadingPaths, setLoadingPaths] = useState<Record<string, boolean>>({});
  const [modalState, setModalState] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: "",
  });

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

  const handleClick = async (item: MenuItemBase) => {
    if (!item.resource) {
      navigate(item.path);
      onMobileClose();
      return;
    }

    setLoadingPaths((prev) => ({ ...prev, [item.path]: true }));

    try {
      const res = await checkViewPermission(item.resource);
      if (res.allowed) {
        navigate(item.path);
      } else {
        setModalState({ isOpen: true, message: "You do not have permission to access this page" });
      }
    } catch {
      setModalState({ isOpen: true, message: "An error occurred while checking permissions." });
    } finally {
      setLoadingPaths((prev) => ({ ...prev, [item.path]: false }));
      onMobileClose();
    }
  };

  const renderItem = (item: MenuItemBase) => {
    const isActive = location.pathname === item.path;

    return (
      <li key={item.path}>
        <button
          onClick={() => handleClick(item)}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-md w-full text-left transition
          ${isActive ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-700 hover:bg-gray-100"}
          ${loadingPaths[item.path] ? "opacity-50 cursor-wait" : ""}`}
          disabled={loadingPaths[item.path]}
        >
          {item.icon && <span className="text-lg">{item.icon}</span>}
          <span>{item.label}</span>
        </button>
      </li>
    );
  };

  const renderGroup = (group: Group) => (
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

      {openSections[group.key] && <ul className="pl-11 space-y-1 mt-1 transition-all">{group.items.map(renderItem)}</ul>}
    </li>
  );

  return (
    <>
      {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, message: "" })}
        className="p-0"
        actions={
          <button onClick={() => setModalState({ isOpen: false, message: "" })} className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-all shadow-md">
            Close
          </button>
        }
      >
        <div className="flex flex-col items-center justify-center gap-4 p-6">
          <FiAlertCircle className="w-12 h-12 text-red-600" />
          <p className="text-gray-800 text-center text-base md:text-lg">{modalState.message}</p>
        </div>
      </Modal>

      {/* Mobile overlay */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity ${mobileOpen ? "opacity-50 visible" : "opacity-0 invisible"}`} onClick={onMobileClose} />

      <aside
        className={`fixed top-16 left-0 bottom-0 z-30 bg-white text-gray-900 shadow-sm transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          ${collapsed ? "w-16" : "w-64"} border-r border-gray-200`}
      >
<<<<<<< HEAD
        <div className="h-full flex flex-col">
          {/* Mobile close button */}
          <div className="px-6 py-4 flex items-center justify-end border-b md:hidden">
            <button className="text-gray-500 hover:text-gray-800" onClick={onToggle}>
=======
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-2 ">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/src/assets/competency-logo.png" alt="Logo" className="object-cover w-10 h-10 rounded-full" />
              <span className="text-lg font-semibold tracking-wide text-gray-900">Competency</span>
            </Link>
            <button className="text-gray-500 md:hidden hover:text-gray-800" onClick={onToggle}>
>>>>>>> crud-admin-tpqi
              <FiChevronLeft size={22} />
            </button>
          </div>

          {/* Navigation */}
<<<<<<< HEAD
          <nav className="flex-1 overflow-y-auto mt-3 px-2">
            {/* Main */}
            <div className="mb-6">
              <p className="px-4 text-xs font-semibold uppercase text-gray-400 mb-2 tracking-wider">Main</p>
              <ul className="space-y-1">{mainMenu.map(renderItem)}</ul>
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
=======
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
>>>>>>> crud-admin-tpqi
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
