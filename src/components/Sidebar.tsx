import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  CircleUserRound,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Define props for Sidebar
interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: Dispatch<SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation(); // Get current location

  const handleLogout = () => {
    logout();
    setIsMobileOpen(false); // Close mobile sidebar on logout
  };

  const handleItemClick = () => {
    setIsMobileOpen(false); // Close mobile sidebar when an item is clicked
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location, setIsMobileOpen]);

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  const overlayVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  return (
    <>
      {/* Desktop Sidebar (Hidden on sm screens) */}
      <motion.div
        animate={{ width: isDesktopOpen ? 250 : 80 }}
        className="hidden sm:flex bg-[#001e2b]/80 backdrop-blur-xl border-r border-white/20 shadow-xl h-screen p-4 text-white flex-col mt-16 fixed left-0 top-0 z-40 rounded-lg"
        // Added fixed positioning, mt-16 for navbar height
      >
        {/* Desktop Toggle Button */}
        <button
          onClick={() => setIsDesktopOpen(!isDesktopOpen)}
          className="absolute -right-3 top-8 w-6 h-6 bg-[#00ed64] rounded-full flex items-center justify-center text-[#001e2b] shadow-md z-50"
        >
          {isDesktopOpen ? <X size={16} /> : <Menu size={16} />}
        </button>

        {/* Common Sidebar Content (used by both desktop and mobile) */}
        <SidebarContent
          isOpen={isDesktopOpen}
          handleLogout={handleLogout}
          handleItemClick={() => {}} // No need to close desktop sidebar on item click
          user={user}
        />
      </motion.div>

      {/* Mobile Sidebar (Overlay) - Renders based on isMobileOpen */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Overlay background */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 sm:hidden"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={overlayVariants}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileOpen(false)} // Close on overlay click
            />

            {/* Mobile Sidebar Content */}
            <motion.div
              className="fixed top-0 left-0 h-full w-64 bg-[#001e2b] p-4 text-white flex flex-col z-50 sm:hidden"
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              transition={{ type: "tween", duration: 0.3 }}
            >
              {/* Close button for mobile */}
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-white hover:bg-white/10"
              >
                <X size={24} />
              </button>
              {/* Use the common content component */}
              <SidebarContent
                isOpen={true} // Always open layout for mobile
                handleLogout={handleLogout}
                handleItemClick={handleItemClick} // Close mobile on item click
                user={user}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Extracted Sidebar Content Component
interface SidebarContentProps {
  isOpen: boolean;
  handleLogout: () => void;
  handleItemClick: () => void;
  user: { username?: string; email?: string } | null; // Define user type more specifically if available
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  isOpen,
  handleLogout,
  handleItemClick,
  user,
}) => (
  <div className="flex flex-col h-full">
    {/* Top Section: Logo/Title (optional) and Menu Items */}
    <div className="flex-1 mt-8">
      {" "}
      {/* Added margin-top */}
      {/* Optional: Add logo or title here if needed */}
      {isOpen && (
        <h1 className="text-xl font-bold mb-8 text-center text-[#00ed64]">
          Zen Cash
        </h1>
      )}
      <nav className="flex flex-col gap-2">
        <SidebarItem
          icon={Home}
          text="Overview"
          to="/dashboard"
          isOpen={isOpen}
          onClick={handleItemClick}
        />
        <SidebarItem
          icon={BarChart}
          text="Reports"
          to="/dashboard/reports"
          isOpen={isOpen}
          onClick={handleItemClick}
        />
        <SidebarItem
          icon={ArrowLeftRight}
          text="Transactions"
          to="/dashboard/transactions"
          isOpen={isOpen}
          onClick={handleItemClick}
        />
        <SidebarItem
          icon={Paperclip}
          text="Invoices"
          to="/dashboard/invoices"
          isOpen={isOpen}
          onClick={handleItemClick}
        />
        <SidebarItem
          icon={Settings}
          text="Settings"
          to="/dashboard/settings"
          isOpen={isOpen}
          onClick={handleItemClick}
        />
        <SidebarItem
          icon={CircleUserRound}
          text="Profile"
          to="/dashboard/profile"
          isOpen={isOpen}
          onClick={handleItemClick}
        />
      </nav>
    </div>

    {/* Bottom Section: User Profile Card */}
    <div
      className={`mb-4 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {" "}
      {/* Improved visibility transition */}
      <div className="p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
        {isOpen ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00ed64] to-[#00684A] flex items-center justify-center shadow-lg shadow-[#00ed64]/20">
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
          // Show only logout icon when closed
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors duration-200"
          >
            <LogOut size={20} />
          </button>
        )}
      </div>
    </div>
    {/* User Profile Card for collapsed state (Desktop only) */}
    {!isOpen && (
      <div className="mt-auto mb-4 flex justify-center">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full p-3 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors duration-200"
        >
          <LogOut size={20} />
        </button>
      </div>
    )}
  </div>
);

// Update SidebarItem Props to include onClick
interface SidebarItemProps {
  icon: React.ComponentType<React.ComponentProps<"svg">>;
  text: string;
  to: string;
  isOpen: boolean;
  onClick: () => void; // Added onClick prop
}

const SidebarItem = ({
  icon: Icon,
  text,
  to,
  isOpen,
  onClick,
}: SidebarItemProps) => {
  return (
    <Link
      to={to}
      onClick={onClick} // Call onClick when link is clicked
      className={`flex items-center gap-4 p-3 hover:bg-white/10 rounded-lg transition-all duration-200 hover:translate-x-1 ${
        !isOpen ? "justify-center" : ""
      }`}
    >
      <Icon width={24} height={24} />
      {isOpen && <span>{text}</span>}
    </Link>
  );
};

export default Sidebar;
