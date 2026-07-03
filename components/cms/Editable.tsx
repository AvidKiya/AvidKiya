"use client";
import { useCms } from "@/contexts/CmsContext";
import { useApp } from "@/contexts/AppContext";
import { useState } from "react";

export function Editable({ path, children, multiline=false, className="" }:{ path: string; children: React.ReactNode; multiline?: boolean; className?: string }){
  const { editMode, isAdmin, updateText, cms, resolve, lang } = useCms();
  const [editing, setEditing] = useState(false);
  const canEdit = editMode && isAdmin;

  const value = (()=> {
    const keys = path.split('.');
    let cur: any = cms;
    for(const k of keys) cur = cur?.[k];
    if(!cur) return '';
    if(typeof cur === 'string') return cur;
    return cur[lang] ?? cur.fa ?? cur.en ?? '';
  })();

  if(!canEdit){
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={`relative inline-block edit-outline ${className}`}>
      <span className="edit-pencil" onClick={()=>setEditing(!editing)}>✎</span>
      {editing ? (
        multiline ? (
          <textarea
            autoFocus
            defaultValue={value}
            onBlur={(e)=>{ updateText(path, lang, e.target.value); setEditing(false); }}
            className="bg-bg-soft border border-primary rounded px-2 py-1 text-sm min-w-[200px] w-full"
            rows={3}
          />
        ) : (
          <input
            autoFocus
            defaultValue={value}
            onBlur={(e)=>{ updateText(path, lang, e.target.value); setEditing(false); }}
            onKeyDown={(e)=>{ if(e.key==='Enter'){ (e.target as HTMLInputElement).blur(); }}}
            className="bg-bg-soft border border-primary rounded px-2 py-1 text-sm"
          />
        )
      ) : (
        <span onClick={()=>setEditing(true)} className="cursor-text">{children}</span>
      )}
    </span>
  );
}
