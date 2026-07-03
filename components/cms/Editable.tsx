'use client';
import React, { useState } from 'react';
import { useCms } from '@/contexts/CmsContext';
export function Editable({ path, children, as='span', className='' }: { path:string; children?:React.ReactNode; as?:React.ElementType; className?:string }) {
  const { cms, isAdmin, updateText, resolve } = useCms();
  const [editing, setEditing] = useState(false);
  const value = path.split('.').reduce<any>((a,k)=>a?.[k], cms as any);
  const text = children ?? resolve(value);
  const Tag = as as any;
  if (!isAdmin || !cms.settings.editMode) return <Tag className={className}>{text}</Tag>;
  if (editing) return <input autoFocus className="input my-1" defaultValue={String(resolve(value))} onBlur={(e)=>{ updateText(path, e.target.value); setEditing(false); }} onKeyDown={(e)=>{ if(e.key==='Enter') (e.currentTarget as HTMLInputElement).blur(); if(e.key==='Escape') setEditing(false); }} />;
  return <Tag className={`editable ${className}`} onDoubleClick={()=>setEditing(true)}><button type="button" className="edit-pencil no-print" onClick={()=>setEditing(true)}>✎</button>{text}</Tag>;
}
export function AddButton({ onClick, label='+' }: { onClick:()=>void; label?:string }) { const { isAdmin, cms } = useCms(); if (!isAdmin || !cms.settings.editMode) return null; return <button className="btn btn-outline no-print" onClick={onClick}>✎ {label}</button>; }
