import React from "react";
import { Routes, Route } from "react-router-dom";

export interface RouteItem {
  path: string;
  element: React.ReactNode;
  children?: RouteItem[];
}

interface RouteWrapperProps {
  routes: RouteItem[];
  fallbackPath?: string;
}

const RouteWrapper: React.FC<RouteWrapperProps> = ({ routes }) => {
  const renderRoutes = (routesList: RouteItem[]) =>
    routesList.map((route) => (
      <Route key={route.path} path={route.path} element={route.element}>
        {route.children && renderRoutes(route.children)}
      </Route>
    ));

  return <Routes>{renderRoutes(routes)}</Routes>;
};

export default RouteWrapper;
