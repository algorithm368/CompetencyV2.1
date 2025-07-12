import * as ExportPages from "@Pages/ExportPages";
import { Route } from "react-router-dom";

export const adminRoutes = (
  <>
    <Route path="/dashboard" element={<ExportPages.DashboardPage />} />
    <Route path="/users" element={<ExportPages.UserPage />} />
    <Route path="/permissions" element={<ExportPages.PermissionPage />} />

    <Route path="/sfia/category" element={<ExportPages.CategoryPage />} />
    <Route path="/sfia/level" element={<ExportPages.LevelPage />} />
    <Route path="/sfia/subcategory" element={<ExportPages.SubcategoryPage />} />
    <Route path="/sfia/description" element={<ExportPages.DescriptionPage />} />

    <Route path="/tpqi/career" element={<ExportPages.CareerPage />} />
  </>
);
