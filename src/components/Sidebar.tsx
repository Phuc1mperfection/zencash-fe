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
  CircleUserRound,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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
        className="hidden sm:flex bg-white/60 dark:bg-slate-900/10 text-slate-900 dark:text-white backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-slate-900/20 h-screen p-4 flex-col  fixed  top-0 z-50 rounded-lg transition-all duration-300"
        // Added light mode background/text and transitions
      >
        {/* Desktop Toggle Button - Colors seem fine */}
        <button
          onClick={() => setIsDesktopOpen(!isDesktopOpen)}
          className="absolute -right-3 top-8 w-6 h-6 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center text-white shadow-md z-50 transition-colors duration-200"
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
            {/* Overlay background - Remains dark */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 sm:hidden"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={overlayVariants}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileOpen(false)} // Close on overlay click
            />

            {/* Mobile Sidebar Content */}
            <motion.div
              className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 flex flex-col z-50 sm:hidden transition-all duration-300"
              // Added light mode background/text and transitions
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              transition={{ type: "tween", duration: 0.3 }}
            >
              {/* Close button for mobile */}
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors duration-200"
                // Adjusted colors for light/dark
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
}) => {
  // Calculate fallback initial for Avatar
  const fallbackInitial = user?.username
    ? user.username.charAt(0).toUpperCase()
    : "?";

  return (
    <div className="flex flex-col h-full">
      {/* Top Section: Logo/Title (optional) and Menu Items */}
      <div className="flex-1 mt-8">
        {/* Optional: Add logo or title here if needed */}
        {isOpen && (
          <h1 className="text-xl font-bold mb-8 text-center text-primary dark:text-primary">
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

      {/* Bottom Section: User Profile Card - Renders differently based on isOpen */}
      <div className="mt-auto mb-4">
        {" "}
        {/* Wrapper div */}
        {isOpen ? (
          // Use Card component when sidebar is open
          <Card className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm dark:shadow-slate-900/20 transition-all duration-300  ">
            {/* Adjusted card background/border for light/dark */}
            <CardContent className="p-4 flex flex-col items-center space-y-3">
              <Avatar className="w-16 h-16 border-2 border-primary/50">
                {/* Fallback gradient likely fine for both modes */}
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-2xl">
                  {fallbackInitial}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[180px] transition-colors duration-300">
                  {/* Adjusted text color */}
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px] transition-colors duration-300">
                  {/* Adjusted text color */}
                  {user?.email || "email@example.com"}
                </p>
              </div>
              {/* Logout button destructive variant likely ok, colors are explicit */}
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors duration-200"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </CardContent>
          </Card>
        ) : (
          // Show only logout icon button when closed
          <div className="flex justify-center">
            <button
              onClick={handleLogout}
              // Destructive colors likely fine for both modes
              className="flex items-center justify-center w-full p-3 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors duration-200"
              aria-label="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// SidebarItem Component (Updated styles for light/dark)
interface SidebarItemProps {
  icon: React.ComponentType<React.ComponentProps<"svg">>;
  text: string;
  to: string;
  isOpen: boolean;
  onClick: () => void;
}

const SidebarItem = ({
  icon: Icon,
  text,
  to,
  isOpen,
  onClick,
}: SidebarItemProps) => {
  const location = useLocation();
  // Simplified isActive logic slightly
  const isActive =
    location.pathname === to ||
    (to === "/dashboard" && location.pathname.startsWith("/dashboard/"));

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 hover:translate-x-1 ${
        !isOpen ? "justify-center" : ""
      } ${
        isActive
          ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary font-semibold" // Active state styles
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800" // Normal state styles
      }`}
    >
      {/* Icon color inherits from text color */}
      <Icon width={24} height={24} />
      {isOpen && <span className="truncate">{text}</span>}
    </Link>
  );
};

export default Sidebar;
