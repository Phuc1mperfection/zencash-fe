import { Routes, Route, Navigate } from "react-router-dom";
import Reports from "./Reports";
import Settings from "./Settings";
import Overview from "./Overview";
import { Transactions } from "./Transactions";
import { Invoices } from "./Invoices";

const Dashboard = () => {
  return (
    <div className="flex-1 h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <Routes>
            {/* Redirect from /dashboard to /dashboard/overview */}
            <Route path="/" element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="reports" element={<Reports />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="settings" element={<Settings />} />
            <Route path="invoices" element={<Invoices />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
