import { Route } from "react-router-dom";
import { HomePage } from "@Pages/ExportPages";

const CompetencyRoutes = () => (
  <>
    <Route
      path="/"
      element={<HomePage />}
    />
  </>
);

export default CompetencyRoutes;
