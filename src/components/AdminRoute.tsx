import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/use-Auth";

const AdminRoute = () => {
  const { isAuthenticated, hasRole, user } = useAuth();


  // Check for admin role using hasRole which now handles various role formats
  const isAdmin = hasRole("ADMIN");

  // Fallback check for roles in user object directly if needed
  const hasAdminRoleInUser = user?.roles
    ? Array.isArray(user.roles)
      ? user.roles.includes("ADMIN")
      : typeof user.roles === "object"
      ? Object.values(user.roles).includes("ADMIN")
      : false
    : false;

  // Final admin check combining both methods
  const isAdminUser = isAdmin || hasAdminRoleInUser;
  if (!isAuthenticated || !isAdminUser) {//nếu không xác thực hoặc không phải admin
    return <Navigate to="/unauthorized" replace />;
  }
  // If user is authenticated and has admin role, render the children
  return <Outlet />;
  
};

export default AdminRoute;
