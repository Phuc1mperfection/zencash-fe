import { memo } from "react";
import {
  Home,
  BarChart,
  Settings,
  ArrowLeftRight,

  CircleUserRound,
  Wallet,
  Archive,
} from "lucide-react";
import { SidebarContentProps } from "./types";
import SidebarItem from "./SidebarItem";
import UserProfile from "./UserProfile";

// Tách danh sách menu items ra khỏi component để tránh việc tạo lại array mỗi lần render
const menuItems = [
  {
    icon: Home,
    text: "Overview",
    to: "/dashboard",
    translationKey: "sidebar.overview",
  },

  {
    icon: Wallet,
    text: "Budget",
    to: "/dashboard/budget",
    translationKey: "sidebar.budget",
  },
  {
    icon: Archive,
    text: "Categories",
    to: "/dashboard/categories",
    translationKey: "sidebar.categories",
  },
  {
    icon: ArrowLeftRight,
    text: "Transactions",
    to: "/dashboard/transactions",
    translationKey: "sidebar.transactions",
  },
  {
    icon: BarChart,
    text: "Reports",
    to: "/dashboard/reports",
    translationKey: "sidebar.reports",
  },
  {
    icon: CircleUserRound,
    text: "Profile",
    to: "/dashboard/profile",
    translationKey: "sidebar.profile",
  },
  {
    icon: Settings,
    text: "Settings",
    to: "/dashboard/settings",
    translationKey: "sidebar.settings",
  },
];

const SidebarContent = memo(
  ({ isOpen, handleLogout, handleItemClick, user }: SidebarContentProps) => {

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
            {menuItems.map((item) => (
              <SidebarItem
                key={item.to}
                icon={item.icon}
                text={item.text}
                to={item.to}
                isOpen={isOpen}
                onClick={handleItemClick}
                translationKey={item.translationKey}
              />
            ))}
          </nav>
        </div>

        {/* Bottom Section: User Profile Card */}
        <div className="mt-auto mb-4">
          <UserProfile user={user} isOpen={isOpen} onLogout={handleLogout} />
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Chỉ re-render khi các prop quan trọng thay đổi
    return (
      prevProps.isOpen === nextProps.isOpen &&
      prevProps.user?.username === nextProps.user?.username &&
      prevProps.user?.email === nextProps.user?.email
    );
  }
);

SidebarContent.displayName = "SidebarContent";

export default SidebarContent;
