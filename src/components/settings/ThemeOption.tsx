import { memo } from "react";
export const ThemeOption = memo(function ThemeOption({
  currentTheme,
  themeKey,
  onClick,
}: {
  currentTheme: string;
  themeKey: "light" | "dark";
  onClick: (theme: "light" | "dark") => void;
}) {
  const isActive = currentTheme === themeKey;
  const themeName = themeKey.charAt(0).toUpperCase() + themeKey.slice(1);

  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isActive ? "border-primary ring-1 ring-primary" : "border-border"
      }`}
      onClick={() => onClick(themeKey)}
    >
      <div
        className={`h-24 rounded-md mb-2 border transition-all will-change-transform ${
          themeKey === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-card"
        }`}
      />

      <p className="text-center text-sm font-medium">{themeName}</p>
    </div>
  );
});
