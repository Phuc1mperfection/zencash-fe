import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-Auth";
import { useNavigate } from "react-router-dom";

import { SidebarProps } from "./types";
import { sidebarVariants, overlayVariants } from "./animations";
import SidebarContent from "./SidebarContent";
const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const [isDesktopOpen, setIsDesktopOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Xử lý responsive - sử dụng useCallback để tránh tạo hàm mới mỗi khi render
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    if (width < 1024) {
      setIsDesktopOpen(false);
    }
  }, []);

  // Xử lý logout với useCallback
  const handleLogout = useCallback(() => {
    logout();
    setIsMobileOpen(false);
    navigate("/");
  }, [logout, navigate, setIsMobileOpen]);

  // Handler khi click vào menu item với useCallback
  const handleItemClick = useCallback(() => {
    setIsMobileOpen(false);
  }, [setIsMobileOpen]);

  // Sử dụng useEffect để xử lý responsive
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Đóng sidebar khi chuyển route
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location, setIsMobileOpen]);

  // Tối ưu hiệu năng animation bằng cách sử dụng tùy chọn layout="position"
  return (
    <>
      {/* Desktop Sidebar - Ẩn trên màn hình nhỏ */}
      <motion.div
        animate={{ width: isDesktopOpen ? 250 : 80 }}
        layout="position"
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="hidden sm:flex bg-white/60 dark:bg-slate-900/10 text-slate-900 dark:text-white  border-r border-slate-200 dark:border-slate-800  dark:shadow-slate-900/20 h-screen p-4 flex-col fixed top-0 z-50 rounded-lg transition-all duration-300"
      >
        {/* Desktop Toggle Button */}
        <button
          onClick={() => setIsDesktopOpen(!isDesktopOpen)}
          className="absolute -right-3 top-8 w-6 h-6 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center text-white shadow-md z-50 transition-colors duration-200"
        >
          {isDesktopOpen ? <X size={16} /> : <Menu size={16} />}
        </button>

        {/* Desktop Sidebar Content */}
        <SidebarContent
          isOpen={isDesktopOpen}
          handleLogout={handleLogout}
          handleItemClick={handleItemClick}
          user={user}
        />
      </motion.div>

      {/* Mobile Sidebar với Overlay - Chỉ render khi cần thiết */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Overlay background */}
            <motion.div
              className="fixed inset-0 bg-black/50  z-40 sm:hidden"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={overlayVariants}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Mobile Sidebar Content */}
            <motion.div
              className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 flex flex-col z-50 sm:hidden transition-all duration-300"
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              transition={{ type: "tween", duration: 0.2 }}
            >
              {/* Close button for mobile */}
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors duration-200"
              >
                <X size={24} />
              </button>

              {/* Mobile Sidebar Content */}
              <SidebarContent
                isOpen={true}
                handleLogout={handleLogout}
                handleItemClick={handleItemClick}
                user={user}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;

