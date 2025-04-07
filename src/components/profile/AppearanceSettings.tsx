import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "react-i18next";

export function AppearanceSettings() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("appearance.title")}</CardTitle>
        <CardDescription>{t("appearance.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <h3 className="text-base font-medium">
                {t("appearance.darkMode.title")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("appearance.darkMode.description")}
              </p>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) =>
                setTheme(checked ? "dark" : "light")
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AppearanceSettings;
