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
import LanguageSelector from "@/components/LanguageSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/utils/toast";
import { useEffect, useState, useCallback } from "react";
import { convertCurrency } from "@/services/currencyService";
import { changeCurrency } from "@/hooks/useCurrency";
import { memo, useMemo } from "react";
import { ThemeOption } from "./ThemeOption";

export function AppearanceSettings() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  useEffect(() => {
    // Lấy currency từ localStorage (nếu có)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.currency) {
        setSelectedCurrency(parsedUser.currency);
      }
    }
  }, []);

  const handleCurrencyChange = useCallback(
    async (newCurrency: string) => {
      try {
        await convertCurrency(newCurrency);
        changeCurrency(newCurrency);
        setSelectedCurrency(newCurrency);
        showToast.success(
          t("settings.currencyChangeSuccess", { currency: newCurrency })
        );
      } catch (error) {
        showToast.error("Failed to change currency");
        console.error("Error changing currency:", error);
      }
    },
    [t]
  );
  const currencyOptions = useMemo(
    () => [
      { value: "USD", label: "USD - US Dollar" },
      { value: "VND", label: "VND - Vietnamese Dong" },
    ],
    []
  );

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
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
            <ThemeOption
              currentTheme={theme}
              themeKey="light"
              onClick={setTheme}
            />
            <ThemeOption
              currentTheme={theme}
              themeKey="dark"
              onClick={setTheme}
            />
          </div>
        </div>
        <div className="mt-6">
          <LanguageSelector />
        </div>
        <div>
          <h2 className=" font-semibold mt-4">{t("settings.currency")}</h2>
          <Select
            value={selectedCurrency}
            onValueChange={(value) => handleCurrencyChange(String(value))}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencyOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(AppearanceSettings);
