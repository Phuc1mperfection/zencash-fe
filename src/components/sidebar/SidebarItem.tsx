import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { memo } from "react";
import { SidebarItemProps } from "./types";
import { cn } from "@/lib/utils";

// Wrap the component with React.memo to prevent unnecessary re-renders
const SidebarItem = memo(
  ({
    icon: Icon,
    text,
    to,
    isOpen,
    onClick,
    translationKey,
  }: SidebarItemProps) => {
    const location = useLocation();
    const { t } = useTranslation();

    // Kiểm tra nếu item đang active
    const isActive =
      location.pathname === to ||
      (to === "/dashboard" && location.pathname.startsWith("/dashboard/"));

    // Sử dụng translation key nếu có
    const displayText = translationKey ? t(translationKey) : text;

    return (
      <Link
        to={to}
        onClick={onClick}
        className={cn(
          "flex items-center gap-4 p-3 rounded-md transition-colors",
          !isOpen ? "justify-center" : "",
          isActive
            ? "bg-accent text-accent-foreground font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
        )}
      >
        <Icon className="h-5 w-5" />
        {isOpen && <span className="truncate">{displayText}</span>}
      </Link>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function to prevent unnecessary re-renders
    return (
      prevProps.isOpen === nextProps.isOpen &&
      prevProps.to === nextProps.to &&
      prevProps.text === nextProps.text
    );
  }
);

SidebarItem.displayName = "SidebarItem";

export default SidebarItem;
