'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CmsState, defaultCmsState, I18nText } from '@/lib/cms/schema';

type Language = 'fa' | 'en';
type Theme = 'dark' | 'light';

interface AppContextType {
  // Language & Theme
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  dir: 'rtl' | 'ltr';
  
  // CMS State
  cms: CmsState;
  setCms: React.Dispatch<React.SetStateAction<CmsState>>;
  updateCms: (path: string, value: unknown) => void;
  updateText: (path: string, lang: Language, value: string) => void;
  addToList: <T>(path: string, item: T) => void;
  removeFromList: (path: string, index: number) => void;
  moveInList: (path: string, from: number, to: number) => void;
  
  // Helpers
  resolve: (text: I18nText | string | undefined) => string;
  t: (text: I18nText | string | undefined) => string;
  
  // Edit Mode
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  
  // Auth
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
  adminToken: string;
  setAdminToken: (token: string) => void;
  
  // Sync
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error' | 'offline';
  setSyncStatus: (status: 'idle' | 'syncing' | 'synced' | 'error' | 'offline') => void;
  
  // Loading
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Get nested value by path
function getByPath(obj: unknown, path: string): unknown {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined) return undefined;
    if (typeof current === 'object' && current !== null) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return current;
}

// Set nested value by path
function setByPath(obj: unknown, path: string, value: unknown): unknown {
  const keys = path.split('.');
  const result = JSON.parse(JSON.stringify(obj));
  let current = result;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] === undefined) {
      current[key] = isNaN(Number(keys[i + 1])) ? {} : [];
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  return result;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fa');
  const [theme, setThemeState] = useState<Theme>('dark');
  const [cms, setCms] = useState<CmsState>(defaultCmsState);
  const [editMode, setEditMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error' | 'offline'>('idle');
  const [isLoading, setIsLoading] = useState(true);

  const dir = language === 'fa' ? 'rtl' : 'ltr';

  // Initialize from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('avidkiya-lang') as Language | null;
    const savedTheme = localStorage.getItem('avidkiya-theme') as Theme | null;
    const savedToken = localStorage.getItem('avidkiya-admin-token');
    
    if (savedLang) setLanguageState(savedLang);
    if (savedTheme) setThemeState(savedTheme);
    if (savedToken) setAdminToken(savedToken);
    
    // Fetch CMS data
    fetchCmsData();
  }, []);

  // Apply theme and direction to document
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [theme, dir, language]);

  const fetchCmsData = async () => {
    try {
      const res = await fetch('/api/cms');
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setCms({ ...defaultCmsState, ...data.data });
        }
      }
    } catch (error) {
      console.log('Using default CMS data');
    } finally {
      setIsLoading(false);
    }
  };

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('avidkiya-lang', lang);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('avidkiya-theme', newTheme);
  }, []);

  const resolve = useCallback((text: I18nText | string | undefined): string => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    return text[language] || text.en || text.fa || '';
  }, [language]);

  const updateCms = useCallback((path: string, value: unknown) => {
    setCms(prev => setByPath(prev, path, value) as CmsState);
  }, []);

  const updateText = useCallback((path: string, lang: Language, value: string) => {
    setCms(prev => {
      const current = getByPath(prev, path) as I18nText | undefined;
      const updated: I18nText = current && typeof current === 'object' 
        ? { ...current, [lang]: value }
        : { fa: lang === 'fa' ? value : '', en: lang === 'en' ? value : '' };
      return setByPath(prev, path, updated) as CmsState;
    });
  }, []);

  const addToList = useCallback(<T,>(path: string, item: T) => {
    setCms(prev => {
      const list = (getByPath(prev, path) as T[] | undefined) || [];
      return setByPath(prev, path, [...list, item]) as CmsState;
    });
  }, []);

  const removeFromList = useCallback((path: string, index: number) => {
    setCms(prev => {
      const list = (getByPath(prev, path) as unknown[] | undefined) || [];
      const updated = list.filter((_, i) => i !== index);
      return setByPath(prev, path, updated) as CmsState;
    });
  }, []);

  const moveInList = useCallback((path: string, from: number, to: number) => {
    setCms(prev => {
      const list = [...((getByPath(prev, path) as unknown[] | undefined) || [])];
      const [item] = list.splice(from, 1);
      list.splice(to, 0, item);
      return setByPath(prev, path, list) as CmsState;
    });
  }, []);

  const value: AppContextType = {
    language,
    setLanguage,
    theme,
    setTheme,
    dir,
    cms,
    setCms,
    updateCms,
    updateText,
    addToList,
    removeFromList,
    moveInList,
    resolve,
    t: resolve,
    editMode,
    setEditMode,
    isAdmin,
    setIsAdmin,
    adminToken,
    setAdminToken,
    syncStatus,
    setSyncStatus,
    isLoading
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export function useLanguage() {
  const { language, setLanguage, dir, t, resolve } = useApp();
  return { language, setLanguage, dir, t, resolve };
}

export function useTheme() {
  const { theme, setTheme } = useApp();
  return { theme, setTheme };
}

export function useCms() {
  const { cms, setCms, updateCms, updateText, addToList, removeFromList, moveInList, t, editMode, isAdmin } = useApp();
  return { cms, setCms, updateCms, updateText, addToList, removeFromList, moveInList, t, editMode, isAdmin };
}
