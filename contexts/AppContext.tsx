'use client';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Lang, Theme } from '@/lib/cms/schema';

interface AppCtx { lang: Lang; theme: Theme; setLang: (v:Lang)=>void; setTheme:(v:Theme)=>void; toggleTheme:()=>void; }
const AppContext = createContext<AppCtx | null>(null);
export function AppProvider({ children, defaultLang='fa', defaultTheme='dark' }: { children: React.ReactNode; defaultLang?: Lang; defaultTheme?: Theme }) {
  const [lang, setLangState] = useState<Lang>(defaultLang);
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  useEffect(() => {
    try {
      const l = (localStorage.getItem('avidkiya_lang') as Lang) || defaultLang;
      const t = (localStorage.getItem('avidkiya_theme') as Theme) || defaultTheme;
      setLangState(l === 'en' ? 'en' : 'fa');
      setThemeState(t === 'light' ? 'light' : 'dark');
    } catch {}
  }, [defaultLang, defaultTheme]);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
    document.documentElement.dir = 'ltr';
    const root = document.getElementById('app-root');
    if (root) root.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
    document.body.classList.toggle('lang-fa', lang === 'fa');
    document.body.classList.toggle('lang-en', lang === 'en');
    try { localStorage.setItem('avidkiya_lang', lang); } catch {}
  }, [lang]);
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('avidkiya_theme', theme); } catch {}
  }, [theme]);
  const value = useMemo(() => ({ lang, theme, setLang:(v:Lang)=>setLangState(v), setTheme:(v:Theme)=>setThemeState(v), toggleTheme:()=>setThemeState(t=>t==='dark'?'light':'dark') }), [lang, theme]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() { const ctx = useContext(AppContext); if (!ctx) throw new Error('useApp must be used inside AppProvider'); return ctx; }
