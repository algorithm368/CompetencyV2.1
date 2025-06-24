import * as ExportPages from "@Pages/ExportPages";
import { Route } from "react-router-dom";

export const adminRoutes = (
  <>
    <Route
      path="/sfia/category"
      element={<ExportPages.CategoryPage />}
    />
    <Route
      path="/sfia/level"
      element={<ExportPages.LevelPage />}
    />
    <Route
      path="/sfia/subcategory"
      element={<ExportPages.SubcategoryPage />}
    />
  </>
);
