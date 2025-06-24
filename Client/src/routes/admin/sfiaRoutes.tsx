import React from "react";
import { Route } from "react-router-dom";
import { CategoryPage, SubcategoryPage, LevelPage } from "@Pages/ExportPages";

const SfIaRoutes: React.FC = () => (
  <>
    <Route
      path="category"
      element={<CategoryPage />}
    />
    <Route
      path="subcategory"
      element={<SubcategoryPage />}
    />
    <Route
      path="level"
      element={<LevelPage />}
    />
  </>
);

export default SfIaRoutes;
