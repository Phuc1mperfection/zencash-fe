import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Landing from "./pages/Landing";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  const showSidebar = isAuthenticated && isDashboardRoute;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#001e2b] to-[#023430]">

      <div className="flex">
        {showSidebar && (
          <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
          />
        )}
        <Navbar />
        <main
          className={`flex-1 transition-all duration-300 ${
            showSidebar ? "sm:ml-[80px]" : ""
          } ${isAuthenticated ? "pt-16" : ""}`}
        >
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard/*" element={<Dashboard />} />
            </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
