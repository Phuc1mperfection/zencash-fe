import { useTranslation } from "react-i18next";
import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { UserProfileProps } from "./types";

const UserProfile = memo(({ user, isOpen, onLogout }: UserProfileProps) => {
  const { t } = useTranslation();

  // Tạo fallback avatar dựa trên tên người dùng
  const fallbackInitial = user?.username
    ? user.username.charAt(0).toUpperCase()
    : "?";

  // Nếu sidebar đang mở rộng, hiển thị đầy đủ card
  if (isOpen) {
    return (
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-4 flex flex-col items-center space-y-3">
          <Avatar className="w-16 h-16 border-2 border-primary/50">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {fallbackInitial}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="font-semibold text-foreground truncate max-w-[180px]">
              {user?.username || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate max-w-[180px]">
              {user?.email || "email@example.com"}
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={onLogout}
            className="w-full flex items-center gap-2"
          >
            <LogOut size={16} />
            {t("common.logout")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Nếu sidebar đang thu gọn, chỉ hiển thị nút logout
  return (
    <div className="flex justify-center">
      <button
        onClick={onLogout}
        className="flex items-center justify-center w-full p-3 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
        aria-label={t("common.logout")}
      >
        <LogOut size={20} />
      </button>
    </div>
  );
});

UserProfile.displayName = "UserProfile";

export default UserProfile;
