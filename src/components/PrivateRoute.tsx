import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Remove children from props if it exists, or define without props
const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();

  // If authenticated, render the child route using Outlet
  // If not, redirect to login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
