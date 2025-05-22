import { Routes, Route, Navigate } from "react-router-dom";
import Reports from "./Reports";
import Settings from "./Settings";
import Overview from "./Overview";
import { Transactions } from "./Transactions";
import Profile from "./Profile";
import Budget from "./Budget";
import { Categories } from "./Categories";
import {GoalSpending} from "./GoalSpending";
const Dashboard = () => {
  return (
    <div className="flex-1 h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/50 dark:bg-slate-900/50  rounded-xl border border-slate-200 dark:border-slate-800  dark:shadow-slate-900/20 p-6 transition-all duration-300">
          <Routes>
            {/* Redirect from /dashboard to /dashboard/overview */}
            <Route path="/" element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="reports" element={<Reports />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="budget" element={<Budget />} />
            <Route path="categories" element={<Categories/>} />
            <Route path="goalspending" element={<GoalSpending/>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
