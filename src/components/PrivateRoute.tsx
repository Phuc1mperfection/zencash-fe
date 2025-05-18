import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/use-Auth";
import LoadingScreen from "../components/LoadingScreen"; // Import thêm dòng này

const PrivateRoute = () => {
  const { isAuthenticated, user } = useAuth();

  if (user === null) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
