import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// import ProtectedRoute from "./guards/ProtectedRoute";
// import ErrorBoundary from "./guards/ErrorBoundary";
import RouteWrapper from "./guards/RouteWrapper";

import { adminRoutes } from "./admin/adminRoutes";
import { sfiaRoutes } from "./sfiaRoutes";
import { tpqiRoutes } from "./tpqiRoutes";
import { competencyRoutes } from "./competencyRoutes";

import {
  HomePage,
  ResultsPage,
  CompetencyDetailPage,
  ProfilePage,
  AboutPage,
} from "@Pages/ExportPages";

const AppRoutes: React.FC = () => (
  // <ErrorBoundary>
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Navigate to="/home" replace />} />
    <Route path="/results" element={<ResultsPage />} />
    <Route path="/home" element={<HomePage />} />
    <Route path="/competency/:source/:id" element={<CompetencyDetailPage />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/about" element={<AboutPage />} />

    {/* Protected Routes */}
    {/* <Route element={<ProtectedRoute />}> */}
    <Route>
      {/* Admin Module */}
      <Route path="admin/*" element={<RouteWrapper routes={adminRoutes} />} />

      {/* SFIA Module */}
      <Route path="sfia/*" element={<RouteWrapper routes={sfiaRoutes} />} />

      {/* TPQI Module */}
      <Route path="tpqi/*" element={<RouteWrapper routes={tpqiRoutes} />} />

      {/* Competency Module */}
      {/* <Route
        path="competency/*"
        element={<RouteWrapper routes={competencyRoutes} />}
      /> */}

      {/* Fallback (Error 403 / NotFound) */}
      {/* <Route path="error403" element={<ErrorSection7 />} />
        <Route path="*" element={<NotFoundPage />} /> */}
    </Route>
  </Routes>
  // </ErrorBoundary>
);

export default AppRoutes;
