import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/use-Auth";

const PrivateRoute = () => {
  const { isAuthenticated, user } = useAuth();

  // Nếu chưa kiểm tra xong authentication, hiển thị màn hình loading
  if (user === null) {
    return <div>Loading...</div>; // 🔹 Tránh nhấp nháy khi F5
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
