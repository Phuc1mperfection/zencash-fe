import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import avatarService from "@/services/avatarService";
import { useAuth } from "@/hooks/use-Auth";
import { useToast } from "@/hooks/use-toast";

interface AvatarSectionProps {
  username?: string;
  onAvatarChange?: (filename: string) => void;
}

export function AvatarSection({
  username,
  onAvatarChange,
}: AvatarSectionProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Calculate fallback initial for Avatar
  const fallbackInitial = username ? username.charAt(0).toUpperCase() : "?";

  // Get avatar URL if available
  const avatarUrl = user?.avatar
    ? avatarService.getAvatarUrl(user.avatar)
    : null;

  const handleFileClick = () => {
    // Trigger click on the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/svg+xml",
    ];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description:
          "Please select a valid image file (JPG, PNG, GIF, or SVG).",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (1MB max)
    if (file.size > 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 1MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload the file
      const filename = await avatarService.uploadAvatar(file);

      // Call the callback if provided
      if (onAvatarChange) {
        onAvatarChange(filename);
      }

      toast({
        title: "Avatar updated",
        description: "Your avatar has been updated successfully.",
      });
    } catch (error) {
      console.error("Avatar upload failed:", error);
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = () => {
    // Set avatar to default (which is "hinh-cute-meo.jpg" as mentioned in the prompt)
    if (onAvatarChange) {
      onAvatarChange("hinh-cute-meo.jpg");
      toast({
        title: "Avatar removed",
        description: "Your avatar has been reset to default.",
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl || undefined} alt={username || "User"} />
        <AvatarFallback>{fallbackInitial}</AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">
          {t("profile.avatarSection.title")}
        </h3>
        <div className="flex flex-wrap gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/png, image/jpeg, image/gif, image/svg+xml"
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleFileClick}
            disabled={isUploading}
          >
            {isUploading
              ? t("common.uploading")
              : t("profile.avatarSection.upload")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive"
            onClick={handleRemoveAvatar}
            disabled={
              isUploading ||
              !user?.avatar ||
              user.avatar === "hinh-cute-meo.jpg"
            }
          >
            {t("profile.avatarSection.remove")}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          JPG, GIF, PNG or SVG. 1MB max.
        </p>
      </div>
    </div>
  );
}
