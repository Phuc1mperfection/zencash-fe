import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/use-Auth";

const AdminRoute = () => {
  const { isAuthenticated, hasRole, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = hasRole("ADMIN");
  const hasAdminRoleInUser = user?.roles
    ? Array.isArray(user.roles)
      ? user.roles.includes("ADMIN")
      : typeof user.roles === "object"
      ? Object.values(user.roles).includes("ADMIN")
      : false
    : false;

  const isAdminUser = isAdmin || hasAdminRoleInUser;

  if (!isAdminUser) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
