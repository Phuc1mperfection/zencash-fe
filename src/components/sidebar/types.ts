import { Dispatch, SetStateAction } from "react";

// Interface cho props của component Sidebar chính
export interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: Dispatch<SetStateAction<boolean>>;
}

// Interface cho props của component SidebarContent
export interface SidebarContentProps {
  isOpen: boolean;
  handleLogout: () => void;
  handleItemClick: () => void;
  user: { username?: string; email?: string } | null;
}

// Interface cho props của component SidebarItem
export interface SidebarItemProps {
  icon: React.ComponentType<React.ComponentProps<"svg">>;
  text: string;
  to: string;
  isOpen: boolean;
  onClick: () => void;
  translationKey?: string;
}

// Interface cho props của component UserProfile
export interface UserProfileProps {
  user: { username?: string; email?: string } | null;
  isOpen: boolean;
  onLogout: () => void;
}