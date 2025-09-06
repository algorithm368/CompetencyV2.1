import * as ExportPages from "@Pages/ExportPages";

export interface RouteItem {
  path: string;
  element: React.ReactNode;
  resource?: string;
}

export const adminRoutes: RouteItem[] = [
  { path: "/dashboard", element: <ExportPages.DashboardPage />, resource: "Dashboard" },
  { path: "/users", element: <ExportPages.UserPage />, resource: "User" },
  { path: "/logs", element: <ExportPages.LogPage />, resource: "Log" },
  { path: "/session", element: <ExportPages.SessionPage />, resource: "Session" },

  // SFIA
  { path: "/sfia/category", element: <ExportPages.CategoryPage />, resource: "Category" },
  { path: "/sfia/level", element: <ExportPages.LevelPage />, resource: "Level" },
  { path: "/sfia/subcategory", element: <ExportPages.SubcategoryPage />, resource: "Subcategory" },
  { path: "/sfia/description", element: <ExportPages.DescriptionPage />, resource: "Description" },

  // TPQI
  { path: "/tpqi/career", element: <ExportPages.CareerPage />, resource: "Career" },
  { path: "/roles", element: <ExportPages.RolePage />, resource: "Role" },
  { path: "/role-permissions", element: <ExportPages.RolePermissionManager />, resource: "RolePermission" },
  { path: "/permissions", element: <ExportPages.PermissionPage />, resource: "Permission" },
  { path: "/operations", element: <ExportPages.OperationPage />, resource: "Operation" },
  { path: "/user-roles", element: <ExportPages.UserRoleAssignmentPage />, resource: "UserRole" },

  // Assets
  { path: "/assets", element: <ExportPages.AssetPage />, resource: "Asset" },
  { path: "/asset-instances", element: <ExportPages.AssetInstancePage />, resource: "AssetInstance" },
  { path: "/user-asset-instances", element: <ExportPages.UserAssetInstanceAssignmentPage />, resource: "UserAssetInstance" },

  { path: "/tpqi/skill", element: <ExportPages.SkillPage />, resource: "Skill" },
  { path: "/tpqi/sector", element: <ExportPages.SectorPage />, resource: "Sector" },
  { path: "/tpqi/occupational", element: <ExportPages.OccupationalPage />, resource: "Occupational" },
  { path: "/tpqi/knowledge", element: <ExportPages.KnowledgePage />, resource: "Knowledge" },
  { path: "/tpqi/unitcode", element: <ExportPages.UnitCodePage />, resource: "UnitCode" },
];
