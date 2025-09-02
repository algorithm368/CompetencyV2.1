import * as ExportPages from "@Pages/ExportPages";
import { Route } from "react-router-dom";

export const adminRoutes = (
  <>
    {/* Main */}
    <Route path="/dashboard" element={<ExportPages.DashboardPage />} />
    <Route path="/users" element={<ExportPages.UserPage />} />
    <Route path="/logs" element={<ExportPages.LogPage />} />
    <Route path="/session" element={<ExportPages.SessionPage />} />

    {/* SFIA */}
    <Route path="/sfia/category" element={<ExportPages.CategoryPage />} />
    <Route path="/sfia/level" element={<ExportPages.LevelPage />} />
    <Route path="/sfia/subcategory" element={<ExportPages.SubcategoryPage />} />
    <Route path="/sfia/description" element={<ExportPages.DescriptionPage />} />

    {/* TPQI */}
    <Route path="/tpqi/career" element={<ExportPages.CareerPage />} />
    {/* RBAC */}
    <Route path="/roles" element={<ExportPages.RolePage />} />
    <Route path="/role-permissions" element={<ExportPages.RolePermissionManager />} />
    <Route path="/permissions" element={<ExportPages.PermissionPage />} />
    <Route path="/operations" element={<ExportPages.OperationPage />} />
    <Route path="/user-roles" element={<ExportPages.UserRoleAssignmentPage />} />

    {/* Assets */}
    <Route path="/assets" element={<ExportPages.AssetPage />} />
    <Route path="/asset-instances" element={<ExportPages.AssetInstancePage />} />
    <Route path="/user-asset-instances" element={<ExportPages.UserAssetInstanceAssignmentPage />} />

    <Route path="/tpqi/skill" element={<ExportPages.SkillPage />} />
    <Route path="/tpqi/sector" element={<ExportPages.SectorPage />} />
    <Route path="/tpqi/occupational" element={<ExportPages.OccupationalPage />} />
    <Route path="/tpqi/knowledge" element={<ExportPages.KnowledgePage />} />
    <Route path="/tpqi/unitcode" element={<ExportPages.UnitCodePage />} />
  </>
);
