import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Reports from "./Reports";
import Settings from "./Settings";
import Overview from "./Overview";
import { Transactions } from "./Transactions";
import { Invoices } from "./Invoices";


const Dashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 mt-16">
        <Routes>
          <Route path="overview" element={ <Overview/>} />
          <Route path="Reports" element={<Reports/>} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="settings" element={<Settings/>} />
          <Route path="invoices" element={<Invoices/>} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
