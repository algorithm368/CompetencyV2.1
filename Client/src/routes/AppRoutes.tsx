import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RouteWrapper from "./guards/RouteWrapper";

import { adminRoutes } from "./admin/adminRoutes";
import { sfiaRoutes } from "./sfiaRoutes";
import { tpqiRoutes } from "./tpqiRoutes";
// import { competencyRoutes } from "./competencyRoutes";

import { HomePage, ResultsPage, CompetencyDetailPage, ProfilePage, AboutPage } from "@Pages/ExportPages";

const AppRoutes: React.FC = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route
        path="/competency/:source/:id"
        element={<CompetencyDetailPage />}
      />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/about" element={<AboutPage />} />

      {/* Protected Routes */}
      <Route>
        {/* Admin Module */}
        <Route path="admin/*" element={<RouteWrapper routes={adminRoutes} />} />

        {/* SFIA Module */}
        <Route path="sfia/*" element={<RouteWrapper routes={sfiaRoutes} />} />

        {/* TPQI Module */}
        <Route path="tpqi/*" element={<RouteWrapper routes={tpqiRoutes} />} />
      </Route>
    </Routes>
  </Suspense>
);

export default AppRoutes;
