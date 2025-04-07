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
        <div className="space-y-2">
                <h3 className="text-base font-medium">Theme</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      theme === "light" ? "border-primary ring-1 ring-primary" : "border-border"
                    }`}
                    onClick={() => setTheme("light")}
                  >
                    <div className="h-24 bg-card rounded-md mb-2 border"></div>
                    <p className="text-center text-sm font-medium">Light</p>
                  </div>
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      theme === "dark" ? "border-primary ring-1 ring-primary" : "border-border"
                    }`}
                    onClick={() => setTheme("dark")}
                  >
                    <div className="h-24 bg-zinc-800 rounded-md mb-2 border border-zinc-700"></div>
                    <p className="text-center text-sm font-medium">Dark</p>
                  </div>
                </div>
              </div>
      </CardContent>
    </Card>
  );
}

export default AppearanceSettings;
