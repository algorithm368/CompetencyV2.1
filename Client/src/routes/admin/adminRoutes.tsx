import * as ExportPages from "@Pages/ExportPages";
import { Route } from "react-router-dom";

export const adminRoutes = (
  <>
    <Route path="/dashboard" element={<ExportPages.DashboardPage />} />
    <Route path="/users" element={<ExportPages.UserPage />} />
    <Route path="/permissions" element={<ExportPages.AdminRbacPage />} />

    <Route path="/sfia/category" element={<ExportPages.CategoryPage />} />
    <Route path="/sfia/level" element={<ExportPages.LevelPage />} />
    <Route path="/sfia/subcategory" element={<ExportPages.SubcategoryPage />} />
    <Route path="/sfia/description" element={<ExportPages.DescriptionPage />} />

    <Route path="/tpqi/skill" element={<ExportPages.SkillPage />} />
    <Route path="/tpqi/sector" element={<ExportPages.SectorPage />} />
    <Route path="/tpqi/occupational" element={<ExportPages.OccupationalPage />} />
    <Route path="/tpqi/knowledge" element={<ExportPages.KnowledgePage />} />
    <Route path="/tpqi/unitcode" element={<ExportPages.UnitCodePage />} />
    <Route path="/tpqi/career" element={<ExportPages.CareerPage />} />
    <Route path="/tpqi/level" element={<ExportPages.TPQILevelPage />} />
    <Route path="/tpqi/clknowledge" element={<ExportPages.ClKnowledgePage />} />
    <Route path="/tpqi/cldetail" element={<ExportPages.ClDetailPage />} />
    <Route path="/tpqi/careerlevel" element={<ExportPages.CareerLevelPage />} />
    <Route path="/tpqi/clskill" element={<ExportPages.ClSkillPage />} />
    <Route path="/tpqi/clunitcode" element={<ExportPages.ClUnitCodePage />} />
    <Route path="/tpqi/unitoccupational" element={<ExportPages.UnitOccupationalPage />} />
    <Route path="/tpqi/unitsector" element={<ExportPages.UnitSectorPage />} />
    <Route path="/tpqi/userskill" element={<ExportPages.UserSkillPage />} />
    <Route path="/tpqi/userknowledge" element={<ExportPages.UserKnowledge />} />
  </>
);
