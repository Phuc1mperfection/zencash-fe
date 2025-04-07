import AppearanceSettings from "@/components/profile/AppearanceSettings";
import LanguageSelector from "@/components/LanguageSelector";
import { useTranslation } from "react-i18next";

export const Settings = () => {
    const { t } = useTranslation();
  
  return (
    <div>
      <h1 className="text-2xl font-bold">
      {t("settings.title")}
      </h1>
      <p>Customize your preferences and account settings.</p>

      <div className="mt-6">
        <AppearanceSettings />
      </div>

      <div className="mt-6">
        <LanguageSelector />
      </div>
    </div>
  );
};

export default Settings;
