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
  { path: "/sfia/sfiasummary", element:<ExportPages.SFIASummaryPage />, resource: "SFIASummary"},
  // { path: "/sfia/skill", element: <ExportPages.SFIASkillPage />, resource: "Skill" },


  // TPQI
  { path: "/tpqi/career", element: <ExportPages.CareerPage />, resource: "Career" },
  { path: "/roles", element: <ExportPages.RolePage />, resource: "Role" },
  { path: "/role-permissions", element: <ExportPages.RolePermissionManager />, resource: "RolePermission" },
  { path: "/permissions", element: <ExportPages.PermissionPage />, resource: "Permission" },
  { path: "/operations", element: <ExportPages.OperationPage />, resource: "Operation" },
  { path: "/user-roles", element: <ExportPages.UserRoleAssignmentPage />, resource: "UserRole" },
  { path: "/tpqi/skill", element: <ExportPages.SkillPage />, resource: "Skill" },
  { path: "/tpqi/sector", element: <ExportPages.SectorPage />, resource: "Sector" },
  { path: "/tpqi/occupational", element: <ExportPages.OccupationalPage />, resource: "Occupational" },
  { path: "/tpqi/knowledge", element: <ExportPages.KnowledgePage />, resource: "Knowledge" },
  { path: "/tpqi/unitcode", element: <ExportPages.UnitCodePage />, resource: "UnitCode" },
  { path: "/tpqi/career", element: <ExportPages.CareerPage />, resource: "Career" },
  { path: "/tpqi/level", element: <ExportPages.TPQILevelPage />, resource: "Level" },
  { path: "/tpqi/clknowledge", element: <ExportPages.ClKnowledgePage />, resource: "ClKnowledge" },
  { path: "/tpqi/cldetail", element: <ExportPages.ClDetailPage />, resource: "ClDetail" },
  { path: "/tpqi/careerlevel", element: <ExportPages.CareerLevelPage />, resource: "CareerLevel" },
  { path: "/tpqi/clskill", element: <ExportPages.ClSkillPage />, resource: "ClSkill" },
  { path: "/tpqi/clunitcode", element: <ExportPages.ClUnitCodePage />, resource: "ClUnitCode" },
  { path: "/tpqi/unitoccupational", element: <ExportPages.UnitOccupationalPage />, resource: "UnitOccupational" },
  { path: "/tpqi/unitsector", element: <ExportPages.UnitSectorPage />, resource: "UnitSector" },
  { path: "/tpqi/userskill", element: <ExportPages.UserSkillPage />, resource: "UserSkill" },
  { path: "/tpqi/userknowledge", element: <ExportPages.UserKnowledgePage />, resource: "UserKnowledge" },
  { path: "/tpqi/tpqisummary", element: <ExportPages.TpqiSummaryPage />, resource: "TPQISummary" },
  { path: "/tpqi/unitskill", element: <ExportPages.UnitSkillPage />, resource: "UnitSkill" },
  { path: "/tpqi/unitknowledge", element: <ExportPages.UnitKnowledgePage />, resource: "UnitKnowledge" },


  // Assets
  { path: "/assets", element: <ExportPages.AssetPage />, resource: "Asset" },
  { path: "/asset-instances", element: <ExportPages.AssetInstancePage />, resource: "AssetInstance" },
  { path: "/user-asset-instances", element: <ExportPages.UserAssetInstanceAssignmentPage />, resource: "UserAssetInstance" },
];
