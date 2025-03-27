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
  Paperclip
} from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  // Giả định user đăng nhập
  const user = {
    name: "Nguyễn Hồng Phúc",
    email: "phucnguyen@example.com",
    avatar: "https://i.pravatar.cc/100",
  };

  const handleLogout = () => {
    console.log("Đăng xuất...");
    // Xử lý logout ở đây, có thể dùng localStorage.clear() hoặc gọi API logout
  };

  return (
    <div className="flex mt-14">
      <motion.div
        animate={{ width: isOpen ? 250 : 80 }}
        className="bg-[#001e2b] h-screen p-4 text-white flex flex-col justify-between"
      >
        {/* Sidebar Menu */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-xl font-bold ${!isOpen && "hidden"}`}></h1>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#00334e]"
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
        <div className="border-t border-gray-300/30 w-full mt-64"></div>
        <div className="mb-10 bg-[#00334e] p-3 rounded-sm flex flex-col items-center">
          {isOpen ? (
            <>
              <img
                src={user.avatar}
                alt="User Avatar"
                className="w-16 h-16 rounded-full border-2 border-white"
              />
              <div className="text-center mt-2">
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-gray-300">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="mt-3 flex items-center gap-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center">
              <Settings size={32} />
            </div>
          )}
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
      className="flex items-center gap-4 p-2 hover:bg-[#00334e] rounded-lg"
    >
      <Icon width={24} height={48} />
      {isOpen && <span>{text}</span>}
    </Link>
  );
};

export default Sidebar;
