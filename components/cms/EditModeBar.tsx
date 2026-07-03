"use client";
import { useCms } from "@/contexts/CmsContext";
import { useApp } from "@/contexts/AppContext";
import { useEffect, useState } from "react";

export function EditModeBar(){
  const { editMode, setEditMode, syncStatus, isAdmin } = useCms();
  const [panelTrigger, setPanelTrigger] = useState(false);

  useEffect(()=>{
    const checkHash = ()=>{
      if(window.location.hash === "#kiya/panel"){
        // open admin
        window.location.href = "/admin";
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return ()=> window.removeEventListener("hashchange", checkHash);
  }, []);

  if(!isAdmin) return null;

  return (
    <div className="fixed bottom-4 inset-x-0 flex justify-center z-50 pointer-events-none no-print">
      <div className="pointer-events-auto glass rounded-2xl px-4 py-2 flex items-center gap-4 text-xs shadow-glow">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={editMode} onChange={e=>setEditMode(e.target.checked)} />
          <span>✎ Edit Mode</span>
        </label>
        <span className={`px-2 py-1 rounded-full text-[10px] ${
          syncStatus==="syncing" ? "bg-amber-500/20 text-amber-400" :
          syncStatus==="synced" ? "bg-success/20 text-success" :
          syncStatus==="error" ? "bg-danger/20 text-danger" : "bg-bg-soft text-text-muted"
        }`}>
          {syncStatus==="syncing" ? "syncing…" : syncStatus==="synced" ? "synced" : syncStatus==="error" ? "error" : syncStatus==="offline" ? "offline" : "idle"}
        </span>
        <a href="/admin" className="px-3 py-1 rounded-lg bg-primary text-white font-bold">Admin</a>
      </div>
    </div>
  );
}
