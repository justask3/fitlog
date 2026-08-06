import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { useSettings, useUpdateSettings } from "@/queries/settings";
import type { FontStyle } from "@/queries/settings";
import {
  lightColors,
  darkColors,
  lightCategoryColors,
  darkCategoryColors,
  defaultTypography,
  pixelTypography,
  PIXEL_FONT,
} from "./index";

export type ThemeMode = "system" | "light" | "dark";

type ThemeContextValue = {
  colors: typeof lightColors;
  categoryColors: typeof lightCategoryColors;
  mode: "light" | "dark";
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  typography: typeof defaultTypography;
  fontStyle: FontStyle;
  setFontStyle: (style: FontStyle) => void;
  /** For one-off inline text styles that don't go through `typography` — undefined in the default Style. */
  fontFamily: string | undefined;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const { data: settingsRow } = useSettings();
  const updateSettings = useUpdateSettings();

  const themeMode: ThemeMode = (settingsRow?.themeMode as ThemeMode) ?? "system";
  const mode: "light" | "dark" =
    themeMode === "system" ? (systemScheme === "dark" ? "dark" : "light") : themeMode;
  const fontStyle: FontStyle = (settingsRow?.fontStyle as FontStyle) ?? "default";

  // `updateSettings.mutate` is a stable callback from React Query; the
  // mutation result object itself is not, and including it directly here
  // would recreate `value` (and cascade a re-render through every consumer
  // in the app) on every render of this provider, not just when the
  // resolved theme actually changes.
  const mutate = updateSettings.mutate;
  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: mode === "dark" ? darkColors : lightColors,
      categoryColors: mode === "dark" ? darkCategoryColors : lightCategoryColors,
      mode,
      themeMode,
      setThemeMode: (next) => mutate({ themeMode: next }),
      typography: fontStyle === "pixel" ? pixelTypography : defaultTypography,
      fontStyle,
      setFontStyle: (next) => mutate({ fontStyle: next }),
      fontFamily: fontStyle === "pixel" ? PIXEL_FONT : undefined,
    }),
    [mode, themeMode, fontStyle, mutate]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeModeProvider");
  }
  return ctx;
}
