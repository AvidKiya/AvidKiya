'use client';
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { CmsState } from './types';
import { defaultCmsState } from './default-state';

type Lang = 'fa' | 'en';
type Theme = 'dark' | 'light';

interface CmsContextValue {
  cms: CmsState;
  lang: Lang;
  theme: Theme;
  isRTL: boolean;
  editMode: boolean;
  setLang: (l: Lang) => void;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  toggleLang: () => void;
  setEditMode: (v: boolean) => void;
  t: (fa: string, en: string) => string;
  tf: (obj: {fa:string; en:string} | undefined) => string;
  updateCms: (patch: Partial<CmsState>) => void;
  saveCms: () => void;
  syncStatus: 'synced'|'syncing'|'offline'|'error';
  exportJson: () => void;
  importJson: (file: File) => Promise<void>;
}

const CmsContext = createContext<CmsContextValue | null>(null);
const STORAGE_KEY = 'avidkiya_cms_v1';
const LANG_KEY = 'avidkiya_lang';
const THEME_KEY = 'avidkiya_theme';

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [cms, setCms] = useState<CmsState>(defaultCmsState);
  const [lang, setLangState] = useState<Lang>(defaultCmsState.settings.defaultLanguage);
  const [theme, setThemeState] = useState<Theme>('dark');
  const [editMode, setEditModeState] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced'|'syncing'|'offline'|'error'>('synced');
  const [mounted, setMounted] = useState(false);

  // hydrate
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CmsState;
        // Older releases shipped demo/Persian sample data. Keep only user data that
        // matches the current blank CMS version; otherwise boot as a clean site.
        if (parsed.version === defaultCmsState.version) setCms(parsed);
        else localStorage.removeItem(STORAGE_KEY);
      }
      const l = localStorage.getItem(LANG_KEY) as Lang | null;
      const th = localStorage.getItem(THEME_KEY) as Theme | null;
      if (l) setLangState(l);
      if (th) setThemeState(th);
      // detect admin hash
      if (typeof window !== 'undefined' && window.location.hash.includes('kiya/panel')) {
        setEditModeState(true);
      }
    } catch {}
  }, []);

  // auto-save debounce
  useEffect(() => {
    if (!mounted) return;
    setSyncStatus('syncing');
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cms));
        fetch('/api/cms', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cms),
          keepalive: true,
        }).catch(() => {});
        setSyncStatus('synced');
      } catch { setSyncStatus('error'); }
    }, 800);
    return () => clearTimeout(t);
  }, [cms, mounted]);

  // apply theme / lang to html
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.toggle('light', theme === 'light');
    root.classList.toggle('dark', theme === 'dark');
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
    localStorage.setItem(LANG_KEY, lang);
    localStorage.setItem(THEME_KEY, theme);
    if (editMode) document.body.classList.add('edit-mode');
    else document.body.classList.remove('edit-mode');
  }, [theme, lang, editMode, mounted]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggleTheme = useCallback(() => setThemeState(t => t === 'dark' ? 'light' : 'dark'), []);
  const toggleLang = useCallback(() => setLangState(l => l === 'fa' ? 'en' : 'fa'), []);
  const setEditMode = useCallback((v: boolean) => setEditModeState(v), []);

  const t = useCallback((fa: string, en: string) => lang === 'fa' ? fa : en, [lang]);
  const tf = useCallback((obj: {fa:string; en:string} | undefined) => {
    if (!obj) return '';
    return lang === 'fa' ? obj.fa : obj.en;
  }, [lang]);

  const updateCms = useCallback((patch: Partial<CmsState>) => {
    setCms(c => ({ ...c, ...patch }));
  }, []);

  const saveCms = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cms));
      fetch('/api/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cms),
        keepalive: true,
      }).catch(() => {});
      setSyncStatus('synced');
    } catch { setSyncStatus('error'); }
  }, [cms]);

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(cms, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `avidkiya-cms-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [cms]);

  const importJson = useCallback(async (file: File) => {
    const text = await file.text();
    const data = JSON.parse(text);
    setCms(data);
  }, []);

  const value = useMemo(() => ({
    cms, lang, theme, isRTL: lang === 'fa',
    editMode, setLang, setTheme, toggleTheme, toggleLang, setEditMode,
    t, tf, updateCms, saveCms, syncStatus, exportJson, importJson
  }), [cms, lang, theme, editMode, setLang, setTheme, toggleTheme, toggleLang, setEditMode, t, tf, updateCms, saveCms, syncStatus, exportJson, importJson]);

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error('useCms must be inside CmsProvider');
  return ctx;
}
