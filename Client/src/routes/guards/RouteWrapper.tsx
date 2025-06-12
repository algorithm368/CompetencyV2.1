import React from "react";
import { Routes } from "react-router-dom";

interface RouteWrapperProps {
  routes: React.ReactNode;
}

const RouteWrapper: React.FC<RouteWrapperProps> = ({ routes }) => {
  return <Routes>{routes}</Routes>;
};

export default RouteWrapper;
