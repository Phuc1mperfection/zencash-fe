import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className }) => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, getAvailableLanguages } =
    useLanguage();
  const languages = getAvailableLanguages();

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-base font-medium">{t("settings.language")}</h3>
 
      <Select
        value={currentLanguage}
        onValueChange={(value) => changeLanguage(value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t("settings.selectLanguage")} />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
