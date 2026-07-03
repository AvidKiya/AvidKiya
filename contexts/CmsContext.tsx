'use client';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { defaultCmsState, migrateCms, type CmsState, type I18nText } from '@/lib/cms/schema';
import { resolveText } from '@/lib/i18n';
import { useApp } from './AppContext';

type SyncStatus = 'idle'|'loading'|'syncing'|'synced'|'offline'|'error';
interface CmsCtx { cms:CmsState; setCms:React.Dispatch<React.SetStateAction<CmsState>>; update:(path:string,value:any)=>void; updateText:(path:string,value:string,lang?:'fa'|'en')=>void; addToList:(path:string,value:any)=>void; removeFromList:(path:string,index:number)=>void; moveInList:(path:string,from:number,to:number)=>void; resolve:(value:I18nText|string|undefined|null)=>string; syncStatus:SyncStatus; isAdmin:boolean; setIsAdmin:(v:boolean)=>void; adminToken:string; setAdminToken:(v:string)=>void; refresh:()=>Promise<void>; saveNow:()=>Promise<void>; }
const CmsContext = createContext<CmsCtx | null>(null);
const clone = <T,>(v:T):T => typeof structuredClone === 'function' ? structuredClone(v) : JSON.parse(JSON.stringify(v));
function pathGet(obj:any, path:string) { return path.split('.').filter(Boolean).reduce((a,k)=>a?.[k], obj); }
function pathSet(obj:any, path:string, value:any) { const keys = path.split('.').filter(Boolean); let cur = obj; keys.slice(0,-1).forEach(k => { if (cur[k] == null) cur[k] = /^\d+$/.test(k) ? [] : {}; cur = cur[k]; }); cur[keys[keys.length-1]] = value; }

export function CmsProvider({ children }: { children:React.ReactNode }) {
  const { lang } = useApp();
  const [cms, setCms] = useState<CmsState>(defaultCmsState);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminTokenState] = useState('');
  const saveTimer = useRef<number | null>(null);
  const tokenRef = useRef('');
  useEffect(() => { try { const t = localStorage.getItem('avidkiya_admin_token') || ''; if (t) { setAdminTokenState(t); tokenRef.current = t; } } catch {} }, []);
  const setAdminToken = (v:string) => { tokenRef.current = v; setAdminTokenState(v); try { localStorage.setItem('avidkiya_admin_token', v); } catch {} };
  const refresh = useCallback(async () => {
    setSyncStatus('loading');
    try {
      const res = await fetch('/api/cms', { cache:'no-store' });
      if (res.ok) { const data = await res.json(); setCms(migrateCms(data.cms || data)); setSyncStatus('synced'); return; }
      throw new Error('api');
    } catch {
      try { const local = localStorage.getItem('avidkiya_cms'); if (local) setCms(migrateCms(JSON.parse(local))); setSyncStatus('offline'); } catch { setSyncStatus('offline'); }
    }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  const saveNow = useCallback(async () => {
    try { localStorage.setItem('avidkiya_cms', JSON.stringify(cms)); } catch {}
    if (!isAdmin || !tokenRef.current) return;
    setSyncStatus('syncing');
    try {
      const res = await fetch('/api/cms', { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${tokenRef.current}` }, body: JSON.stringify({ cms }) });
      if (!res.ok) throw new Error('save');
      setSyncStatus('synced');
    } catch { setSyncStatus('error'); }
  }, [cms, isAdmin]);
  useEffect(() => {
    try { localStorage.setItem('avidkiya_cms', JSON.stringify(cms)); } catch {}
    if (!isAdmin) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => { saveNow(); }, 800);
    return () => { if (saveTimer.current) window.clearTimeout(saveTimer.current); };
  }, [cms, isAdmin, saveNow]);
  const update = useCallback((path:string, value:any) => setCms(prev => { const next = clone(prev); pathSet(next, path, value); return next; }), []);
  const updateText = useCallback((path:string, value:string, l?:'fa'|'en') => setCms(prev => { const next = clone(prev); const old = pathGet(next, path); const obj = typeof old === 'object' && old ? old : { fa:String(old || ''), en:String(old || '') }; obj[l || lang] = value; pathSet(next, path, obj); return next; }), [lang]);
  const addToList = useCallback((path:string, value:any) => setCms(prev => { const next = clone(prev); const arr = pathGet(next, path); if (Array.isArray(arr)) arr.push(value); return next; }), []);
  const removeFromList = useCallback((path:string, index:number) => setCms(prev => { const next = clone(prev); const arr = pathGet(next, path); if (Array.isArray(arr)) arr.splice(index,1); return next; }), []);
  const moveInList = useCallback((path:string, from:number, to:number) => setCms(prev => { const next = clone(prev); const arr = pathGet(next, path); if (Array.isArray(arr) && arr[from]) { const [x] = arr.splice(from,1); arr.splice(Math.max(0, Math.min(to, arr.length)), 0, x); } return next; }), []);
  const value = useMemo(() => ({ cms, setCms, update, updateText, addToList, removeFromList, moveInList, resolve:(v:any)=>resolveText(v, lang), syncStatus, isAdmin, setIsAdmin, adminToken, setAdminToken, refresh, saveNow }), [cms, update, updateText, addToList, removeFromList, moveInList, lang, syncStatus, isAdmin, adminToken, refresh, saveNow]);
  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}
export function useCms() { const ctx = useContext(CmsContext); if (!ctx) throw new Error('useCms must be used inside CmsProvider'); return ctx; }
