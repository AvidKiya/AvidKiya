"use client";
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { CmsState, defaultCms, I18nText } from "@/lib/cms/schema";
import { Lang } from "@/lib/cms/schema";
import { migrateCms } from "@/lib/cms/schema";

type CmsCtx = {
  cms: CmsState;
  lang: Lang;
  resolve: (t: I18nText | string | undefined)=>string;
  update: (path: string, value: any)=>void;
  updateText: (path: string, lang: Lang, value: string)=>void;
  addToList: (path: string, item: any)=>void;
  removeFromList: (path: string, index: number)=>void;
  moveInList: (path: string, from: number, to: number)=>void;
  editMode: boolean;
  setEditMode: (b:boolean)=>void;
  syncStatus: "idle"|"syncing"|"synced"|"offline"|"error";
  isAdmin: boolean;
  setIsAdmin: (b:boolean)=>void;
  refresh: ()=>Promise<void>;
};

const Ctx = createContext<CmsCtx | null>(null);

function getAt(obj:any, path:string){
  return path.split('.').reduce((o,k)=> o?.[k], obj);
}
function setAt(obj:any, path:string, value:any){
  const keys = path.split('.');
  const last = keys.pop()!;
  const target = keys.reduce((o,k)=>{
    if(o[k]===undefined) o[k]={};
    return o[k];
  }, obj);
  target[last] = value;
}

export function CmsProvider({ children, appLang }: { children: React.ReactNode, appLang: Lang }) {
  const [cms, setCms] = useState<CmsState>(defaultCms);
  const [editMode, setEditMode] = useState(false);
  const [syncStatus, setSyncStatus] = useState<CmsCtx["syncStatus"]>("idle");
  const [isAdmin, setIsAdmin] = useState(false);
  const saveTimer = useRef<any>(null);

  const refresh = async ()=>{
    try {
      const r = await fetch('/api/cms', { cache: 'no-store' });
      if(r.ok){
        const data = await r.json();
        if(data?.cms) setCms(migrateCms(data.cms));
      }
    } catch {}
  };

  useEffect(()=>{ refresh(); }, []);

  useEffect(()=>{
    if(typeof window !== 'undefined'){
      const token = localStorage.getItem('ak_admin_token');
      setIsAdmin(!!token);
    }
  }, []);

  const pushSave = (next: CmsState)=>{
    if(!isAdmin) return;
    setSyncStatus("syncing");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async ()=>{
      try {
        const token = localStorage.getItem('ak_admin_token');
        const r = await fetch('/api/cms', { method: 'POST', headers: { 'Content-Type':'application/json', 'x-admin-token': token || '' }, body: JSON.stringify({ cms: next }) });
        setSyncStatus(r.ok ? "synced" : "error");
        setTimeout(()=> setSyncStatus("idle"), 1200);
      } catch {
        setSyncStatus("offline");
      }
    }, 800);
  };

  const update = (path:string, value:any)=>{
    setCms(prev=>{
      const next = structuredClone(prev);
      setAt(next, path, value);
      pushSave(next);
      return next;
    });
  };

  const updateText = (path:string, l:Lang, value:string)=>{
    const current = getAt(cms, path);
    const nextVal: I18nText = typeof current === 'object' ? { ...current, [l]: value } : { fa: l==='fa'?value:'', en: l==='en'?value:'' };
    update(path, nextVal);
  };

  const addToList = (path:string, item:any)=>{
    const list = getAt(cms, path) || [];
    update(path, [...list, item]);
  };
  const removeFromList = (path:string, index:number)=>{
    const list = [...(getAt(cms, path) || [])];
    list.splice(index,1);
    update(path, list);
  };
  const moveInList = (path:string, from:number, to:number)=>{
    const list = [...(getAt(cms, path) || [])];
    const [m] = list.splice(from,1);
    list.splice(to,0,m);
    update(path, list);
  };

  const resolve = (t: I18nText | string | undefined)=>{
    if(!t) return '';
    if(typeof t === 'string') return t;
    return t[appLang] ?? t.fa ?? t.en ?? '';
  };

  return <Ctx.Provider value={{ cms, lang: appLang, resolve, update, updateText, addToList, removeFromList, moveInList, editMode, setEditMode, syncStatus, isAdmin, setIsAdmin, refresh }}>
    {children}
  </Ctx.Provider>
}

export const useCms = ()=>{
  const v = useContext(Ctx);
  if(!v) throw new Error("CmsProvider missing");
  return v;
};
