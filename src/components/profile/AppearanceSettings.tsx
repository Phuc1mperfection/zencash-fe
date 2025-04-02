import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme"; // Use the hook we created

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize how ZenCash looks.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <h3 className="text-base font-medium">Dark Mode</h3>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark mode.
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

        {/* Optional: Add Theme selection if you have multiple themes */}
        {/* <div className="space-y-2">
          <h3 className="text-base font-medium">Theme</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
             Theme options here
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}

export default AppearanceSettings;
