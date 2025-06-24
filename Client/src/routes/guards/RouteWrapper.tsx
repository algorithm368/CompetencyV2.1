import React from "react";
import { Routes } from "react-router-dom";

interface RouteWrapperProps {
  routes: React.ReactNode;
}

export default function RouteWrapper({ routes }: RouteWrapperProps) {
  return <Routes>{routes}</Routes>;
}
