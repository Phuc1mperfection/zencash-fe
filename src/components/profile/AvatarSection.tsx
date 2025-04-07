import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface AvatarSectionProps {
  username?: string;
}

export function AvatarSection({ username }: AvatarSectionProps) {
  // Calculate fallback initial for Avatar
  const fallbackInitial = username ? username.charAt(0).toUpperCase() : "?";
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <Avatar className="h-24 w-24">
        {/* Replace with actual avatar URL if available */}
        <AvatarImage src={undefined} alt={username || "User"} />
        <AvatarFallback>{fallbackInitial}</AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">
          {t("profile.avatarSection.title")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {/* Add upload functionality later */}
          <Button variant="outline" size="sm" disabled>
            Upload new image
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive"
            disabled
          >
            Remove
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {/* JPG, GIF or PNG. 1MB max. (Upload not implemented) */}
        </p>
      </div>
    </div>
  );
}
