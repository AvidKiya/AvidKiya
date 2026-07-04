'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Lang, Theme } from '@/lib/i18n';
import type { CmsState } from '@/lib/cms/schema';
import { defaultCmsState } from '@/lib/cms/schema';
import { resolve as resolveText } from '@/lib/i18n';
import type { I18nText } from '@/lib/cms/schema';

interface AppContextValue {
  lang: Lang;
  theme: Theme;
  setLang: (l: Lang) => void;
  setTheme: (t: Theme) => void;
  toggleLang: () => void;
  toggleTheme: () => void;
  cms: CmsState;
  setCms: React.Dispatch<React.SetStateAction<CmsState>>;
  resolve: (text: I18nText | string | undefined) => string;
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  updateCms: (path: string, value: unknown) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fa');
  const [theme, setThemeState] = useState<Theme>('dark');
  const [cms, setCms] = useState<CmsState>(defaultCmsState);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Read from localStorage
    const savedLang = localStorage.getItem('ak-lang') as Lang | null;
    const savedTheme = localStorage.getItem('ak-theme') as Theme | null;
    if (savedLang) setLangState(savedLang);
    if (savedTheme) setThemeState(savedTheme);
    setHydrated(true);

    // Load CMS data from API
    fetch('/api/cms')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.state) setCms(data.state); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    localStorage.setItem('ak-lang', lang);
  }, [lang, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('ak-theme', theme);
  }, [theme, hydrated]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggleLang = useCallback(() => setLangState(p => p === 'fa' ? 'en' : 'fa'), []);
  const toggleTheme = useCallback(() => setThemeState(p => p === 'dark' ? 'light' : 'dark'), []);

  const resolve = useCallback((text: I18nText | string | undefined) => resolveText(text as I18nText, lang), [lang]);

  const updateCms = useCallback((path: string, value: unknown) => {
    setCms(prev => {
      const next = structuredClone(prev);
      const keys = path.split('.');
      let obj: Record<string, unknown> = next as unknown as Record<string, unknown>;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (obj[k] === undefined || obj[k] === null) obj[k] = {};
        obj = obj[k] as Record<string, unknown>;
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }, []);

  return (
    <AppContext.Provider value={{
      lang, theme, setLang, setTheme, toggleLang, toggleTheme,
      cms, setCms, resolve, isAdmin, setIsAdmin, editMode, setEditMode, updateCms,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
