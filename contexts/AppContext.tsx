"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getTranslation, TranslationKey } from "@/lib/i18n";

type Language = "fa" | "en";
type Theme = "dark" | "light";

interface AppContextValue {
  language: Language;
  theme: Theme;
  dir: "rtl" | "ltr";
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  t: (key: TranslationKey) => string;
  mounted: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

const LS_LANG = "avidkiya:lang";
const LS_THEME = "avidkiya:theme";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fa");
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Load prefs from localStorage on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(LS_LANG) as Language | null;
      const savedTheme = localStorage.getItem(LS_THEME) as Theme | null;
      if (savedLang === "fa" || savedLang === "en") setLanguageState(savedLang);
      if (savedTheme === "dark" || savedTheme === "light") setThemeState(savedTheme);
    } catch {}
    setMounted(true);
  }, []);

  // Reflect changes on <html>
  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    const dir = language === "fa" ? "rtl" : "ltr";
    html.setAttribute("lang", language);
    html.setAttribute("dir", dir);
    html.classList.remove("dark", "light");
    html.classList.add(theme);
    try {
      localStorage.setItem(LS_LANG, language);
      localStorage.setItem(LS_THEME, theme);
    } catch {}
  }, [language, theme, mounted]);

  const setLanguage = useCallback((lang: Language) => setLanguageState(lang), []);
  const setTheme = useCallback((th: Theme) => setThemeState(th), []);
  const toggleLanguage = useCallback(
    () => setLanguageState((p) => (p === "fa" ? "en" : "fa")),
    []
  );
  const toggleTheme = useCallback(
    () => setThemeState((p) => (p === "dark" ? "light" : "dark")),
    []
  );

  const t = useCallback((key: TranslationKey) => getTranslation(key, language), [language]);

  const value = useMemo<AppContextValue>(
    () => ({
      language,
      theme,
      dir: language === "fa" ? "rtl" : "ltr",
      setLanguage,
      setTheme,
      toggleLanguage,
      toggleTheme,
      t,
      mounted,
    }),
    [language, theme, setLanguage, setTheme, toggleLanguage, toggleTheme, t, mounted]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
