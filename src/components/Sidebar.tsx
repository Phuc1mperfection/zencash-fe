import { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  BarChart,
  Settings,
  Menu,
  X,
  LogOut,
  ArrowLeftRight,
  Paperclip,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const [isOpen, setIsOpen]  = useState(true);
  const { user, logout } = useAuth();

  // Giả định user đăng nhập

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex mt-14">
      <motion.div
        animate={{ width: isOpen ? 250 : 80 }}
        className="bg-[#001e2b] backdrop-blur-xl border-r border-white/20 shadow-xl h-screen p-4 text-white flex flex-col justify-between mt-2 rounded-lg"
      >
        {/* Sidebar Menu */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-xl font-bold ${!isOpen && "hidden"}`}></h1>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <nav className="flex flex-col gap-4">
            <SidebarItem
              icon={Home}
              text="Overview"
              to="/dashboard"
              isOpen={isOpen}
            />
            <SidebarItem
              icon={BarChart}
              text="Reports"
              to="/dashboard/reports"
              isOpen={isOpen}
            />
            <SidebarItem
              icon={ArrowLeftRight}
              text="Transactions"
              to="/dashboard/transactions"
              isOpen={isOpen}
            />
            <SidebarItem
              icon={Paperclip}
              text="Invoices"
              to="/dashboard/invoices"
              isOpen={isOpen}
            />
            <SidebarItem
              icon={Settings}
              text="Settings"
              to="/dashboard/settings"
              isOpen={isOpen}
            />
          </nav>
        </div>

        {/* User Profile Card */}
        <div className="border-t border-white/10 w-full mb-8">
          <div className="p-4 bg-white/5 rounded-lg backdrop-blur-sm">
            {isOpen ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00ed64] to-[#00684A] flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-white truncate max-w-[180px]">
                    {user?.username || "User"}
                  </p>
                  <p className="text-xs text-gray-300 truncate max-w-[180px]">
                    {user?.email || "email@example.com"}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors duration-200"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <User size={24} />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ComponentType<React.ComponentProps<"svg">>;
  text: string;
  to: string;
  isOpen: boolean;
}

const SidebarItem = ({ icon: Icon, text, to, isOpen }: SidebarItemProps) => {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
    >
      <Icon width={24} height={24} />
      {isOpen && <span>{text}</span>}
    </Link>
  );
};

export default Sidebar;
