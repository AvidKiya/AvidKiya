"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { DEFAULT_CMS_STATE, type CmsState, type I18nText } from "@/lib/cms/schema";
import { translations, type Locale } from "@/lib/i18n";

type CmsUpdatePath = string;

interface CmsContextType {
  state: CmsState;
  locale: Locale;
  setLocale: (l: Locale) => void;
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  t: (...keys: string[]) => string;
  update: (path: string, value: any) => void;
  updateText: (path: string, fa?: string, en?: string) => void;
  addToList: (path: string, item: any) => void;
  removeFromList: (path: string, index: number) => void;
  moveInList: (path: string, from: number, to: number) => void;
  resolve: (text: I18nText) => string;
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;
  login: (password: string) => boolean;
  logout: () => void;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  saveState: () => Promise<void>;
  syncStatus: "idle" | "syncing" | "synced" | "error";
  loadState: () => Promise<void>;
}

const CmsContext = createContext<CmsContextType | null>(null);

function getNested(obj: any, path: string): any {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

function setNested(obj: any, path: string, value: any): any {
  const parts = path.split(".");
  const last = parts.pop()!;
  let target = obj;
  for (const part of parts) {
    if (target[part] === undefined) target[part] = {};
    target = target[part];
  }
  target[last] = value;
  return obj;
}

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CmsState>(DEFAULT_CMS_STATE);
  const [locale, setLocaleState] = useState<Locale>("fa");
  const [theme, setThemeState] = useState<"dark" | "light">("dark");
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "synced" | "error">("idle");

  // Load from KV or defaults
  const loadState = useCallback(async () => {
    try {
      const res = await fetch("/api/cms");
      if (res.ok) {
        const data = await res.json();
        setState(data);
      }
    } catch {
      // Use defaults
    }

    // Load locale/theme from localStorage
    if (typeof window !== "undefined") {
      const savedLocale = localStorage.getItem("avidkiya-locale") as Locale | null;
      const savedTheme = localStorage.getItem("avidkiya-theme") as "dark" | "light" | null;
      if (savedLocale) setLocaleState(savedLocale);
      if (savedTheme) setThemeState(savedTheme);
      else if (DEFAULT_CMS_STATE.settings.defaultTheme) {
        setThemeState(DEFAULT_CMS_STATE.settings.defaultTheme);
      }
    }
  }, []);

  useEffect(() => {
    loadState();
  }, [loadState]);

  // Apply theme class to HTML
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (theme === "light") {
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
      }
      localStorage.setItem("avidkiya-theme", theme);
    }
  }, [theme]);

  // Apply RTL/LTR
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.dir = locale === "fa" ? "rtl" : "ltr";
      document.documentElement.lang = locale;
      localStorage.setItem("avidkiya-locale", locale);
    }
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
  }, []);

  const setTheme = useCallback((t: "dark" | "light") => {
    setThemeState(t);
  }, []);

  const translate = useCallback(
    (...keys: string[]): string => {
      let val: any = translations[locale];
      for (const key of keys) {
        val = val?.[key];
      }
      return typeof val === "string" ? val : keys.join(".");
    },
    [locale]
  );

  const resolve = useCallback(
    (text: I18nText): string => {
      if (!text) return "";
      return text[locale] || text.fa || text.en || "";
    },
    [locale]
  );

  const update = useCallback((path: string, value: any) => {
    setState((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      setNested(next, path, value);
      return next;
    });
  }, []);

  const updateText = useCallback((path: string, fa?: string, en?: string) => {
    setState((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (en !== undefined) {
        setNested(next, path, { fa: fa || "", en });
      } else if (fa !== undefined) {
        setNested(next, path, fa);
      }
      return next;
    });
  }, []);

  const addToList = useCallback((path: string, item: any) => {
    setState((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const list = getNested(next, path);
      if (Array.isArray(list)) {
        list.push(item);
      }
      return next;
    });
  }, []);

  const removeFromList = useCallback((path: string, index: number) => {
    setState((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const list = getNested(next, path);
      if (Array.isArray(list)) {
        list.splice(index, 1);
      }
      return next;
    });
  }, []);

  const moveInList = useCallback((path: string, from: number, to: number) => {
    setState((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const list = getNested(next, path);
      if (Array.isArray(list)) {
        const [item] = list.splice(from, 1);
        list.splice(to, 0, item);
      }
      return next;
    });
  }, []);

  const login = useCallback((password: string) => {
    if (password === state.settings.adminPassword) {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, [state.settings.adminPassword]);

  const logout = useCallback(() => {
    setIsAdmin(false);
    setEditMode(false);
  }, []);

  // Debounced save to KV
  const saveTimer = React.useRef<NodeJS.Timeout | null>(null);
  const saveState = useCallback(async () => {
    if (!isAdmin) return;
    setSyncStatus("syncing");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/cms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(state),
        });
        if (res.ok) {
          setSyncStatus("synced");
        } else {
          setSyncStatus("error");
        }
      } catch {
        setSyncStatus("error");
      }
    }, 800);
  }, [state, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      saveState();
    }
  }, [state, isAdmin, saveState]);

  return (
    <CmsContext.Provider
      value={{
        state,
        locale,
        setLocale,
        theme,
        setTheme,
        t: translate,
        update,
        updateText,
        addToList,
        removeFromList,
        moveInList,
        resolve,
        isAdmin,
        setIsAdmin,
        login,
        logout,
        editMode,
        setEditMode,
        saveState,
        syncStatus,
        loadState,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
}

export function useCms(): CmsContextType {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used within CmsProvider");
  return ctx;
}
