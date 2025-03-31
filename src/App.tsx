import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Landing from "./pages/Landing";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster />
        <div className="min-h-screen bg-gradient-to-b from-[#001e2b] to-[#023430]">
          {/* Fixed Navbar */}
          <div className="fixed top-0 left-0 right-0 z-50">
            <Navbar />
          </div>

          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />

            {/* Protected routes */}
            <Route
              path="/dashboard/*"
              element={
                <PrivateRoute>
                  <div className="flex h-screen pt-16">
                    {" "}
                    {/* Add padding-top to account for fixed navbar */}
                    {/* Fixed Sidebar */}
                    <div className="fixed left-0 top-16 h-[calc(100vh-64px)] z-40">
                      <Sidebar />
                    </div>
                    {/* Scrollable Main Content */}
                    <div className="flex-1 ml-64 overflow-auto">
                      {" "}
                      {/* Add margin-left to account for fixed sidebar */}
                      <main className="p-6">
                        <Dashboard />
                      </main>
                    </div>
                  </div>
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
