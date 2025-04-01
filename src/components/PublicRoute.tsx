import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PublicRoute component: Redirects if authenticated, otherwise renders child routes
const PublicRoute = () => {
  const { isAuthenticated } = useAuth();

  // If user IS authenticated, redirect them away from public routes (like login/signup)
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is NOT authenticated, allow access to the child route (Login, Signup)
  return <Outlet />;
};

export default PublicRoute;
