import { FiHome, FiUsers, FiLock, FiCopy, FiBarChart2, FiKey } from "react-icons/fi";
import { MenuItemBase, Group } from "./AdminSidebarType";

// Main menu
export const mainMenu: MenuItemBase[] = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome /> },
  { label: "Users", path: "/admin/users", icon: <FiUsers /> },
  { label: "Session Management", path: "/admin/session", icon: <FiLock /> },
  { label: "Logs", path: "/admin/logs", icon: <FiBarChart2 /> },
];

// RBAC groups
export const rbacGroups: Group[] = [
  {
    title: "RBAC",
    icon: <FiKey />,
    key: "rbac",
    items: [
      { label: "Roles", path: "/admin/roles", resource: "Role" },
      { label: "Role Permissions", path: "/admin/role-permissions", resource: "RolePermission" },
      { label: "Permissions", path: "/admin/permissions", resource: "Permission" },
      { label: "Operations", path: "/admin/operations", resource: "Operation" },
      { label: "Assets", path: "/admin/assets", resource: "Asset" },
      { label: "Asset Instances", path: "/admin/asset-instances", resource: "AssetInstance" },
      { label: "User Roles", path: "/admin/user-roles", resource: "UserRole" },
      { label: "User Asset Instances", path: "/admin/user-asset-instances", resource: "UserAssetInstance" },
    ],
  },
];

// Frameworks groups
export const frameworks: Group[] = [
  {
    title: "TPQI",
    icon: <FiCopy />,
    key: "tpqi",
    items: [
      { label: "Sector", path: "/admin/tpqi/sector", resource: "Sector" },
      { label: "Career", path: "/admin/tpqi/career", resource: "Career" },
      { label: "Skill", path: "/admin/tpqi/skill", resource: "Skill" },
      { label: "Occupational", path: "/admin/tpqi/occupational", resource: "Occupational" },
      { label: "Knowledge", path: "/admin/tpqi/knowledge", resource: "Knowledge" },
      { label: "Unit Code", path: "/admin/tpqi/unitcode", resource: "UnitCode" },
    ],
  },
  {
    title: "SFIA",
    icon: <FiBarChart2 />,
    key: "sfia",
    items: [
      { label: "Skills", path: "/admin/sfia/skill", resource: "Skill" },
      { label: "Levels", path: "/admin/sfia/level", resource: "Level" },
      { label: "Categories", path: "/admin/sfia/category", resource: "Category" },
      { label: "SubCategories", path: "/admin/sfia/subcategory", resource: "Subcategory" },
      { label: "Descriptions", path: "/admin/sfia/description", resource: "Description" },
    ],
  },
];
