import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Landing from "./pages/Landing";
import useAutoRefreshToken from "./hooks/useAutoRefreshToken";
import { useAuth } from "./hooks/use-Auth";
import { ChatAssistant } from "./components/chat/ChatAssistant";
import Sidebar from "./components/sidebar/Sidebar";

function App() {
  // Tự động refresh token
  useAutoRefreshToken();

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
    <div className="relative min-h-screen w-full bg-gradient-to-bl from-[#f0ebe3]  via-emerald-500 via-90% to-emerald-300  dark:bg-gradient-to-b dark:from-[#001e2b] dark:to-[#023430]">
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
            <Route path="/" element={<Landing />} />{" "}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard/*" element={<Dashboard />} />
            </Route>
          </Routes>
        </main>
        {isAuthenticated ? (
          <div className="fixed bottom-4 right-4 z-50">
            <ChatAssistant />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
