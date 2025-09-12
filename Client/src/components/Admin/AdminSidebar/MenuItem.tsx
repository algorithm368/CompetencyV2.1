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
      { label: "Skill", path: "/admin/tpqi/skill", resource: "Skill" },
      { label: "Sector", path: "/admin/tpqi/sector", resource: "Sector" },
      { label: "Occupational", path: "/admin/tpqi/occupational", resource: "Occupational" },
      { label: "Knowledge", path: "/admin/tpqi/knowledge", resource: "Knowledge" },
      { label: "Unit Code", path: "/admin/tpqi/unitcode", resource: "UnitCode" },
      { label: "Career", path: "/admin/tpqi/career", resource: "Career" },
      { label: "Level", path: "/admin/tpqi/level", resource: "Level" },
      { label: "CL Knowledge", path: "/admin/tpqi/clknowledge", resource: "ClKnowledge" },
      { label: "CL Detail", path: "/admin/tpqi/cldetail", resource: "ClDetail" },
      { label: "Career Level", path: "/admin/tpqi/careerlevel", resource: "CareerLevel" },
      { label: "CL Skill", path: "/admin/tpqi/clskill", resource: "ClSkill" },
      { label: "CL Unit Code", path: "/admin/tpqi/clunitcode", resource: "ClUnitCode" },
      { label: "Unit Occupational", path: "/admin/tpqi/unitoccupational", resource: "UnitOccupational" },
      { label: "Unit Sector", path: "/admin/tpqi/unitsector", resource: "UnitSector" },
      { label: "User Skill", path: "/admin/tpqi/userskill", resource: "UserSkill" },
      { label: "User Knowledge", path: "/admin/tpqi/userknowledge", resource: "UserKnowledge" },
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