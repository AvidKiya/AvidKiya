"use client";
import { useCms } from "@/contexts/CmsContext";
export function ListItem({ children, path, index }:{ children: React.ReactNode; path: string; index: number }){
  const { editMode, isAdmin, moveInList, removeFromList } = useCms();
  if(!(editMode && isAdmin)) return <>{children}</>;
  return (
    <div className="relative edit-outline">
      <div className="absolute -top-3 end-0 z-30 flex gap-1 text-[10px]">
        <button onClick={()=> moveInList(path, index, Math.max(0,index-1))} className="bg-bg-elev border border-border px-1.5 rounded">↑</button>
        <button onClick={()=> moveInList(path, index, index+1)} className="bg-bg-elev border border-border px-1.5 rounded">↓</button>
        <button onClick={()=> removeFromList(path, index)} className="bg-danger/20 text-danger px-1.5 rounded">🗑</button>
      </div>
      {children}
    </div>
  );
}
export function AddButton({ onClick, label="+" }:{ onClick: ()=>void; label?: string }){
  const { editMode, isAdmin } = useCms();
  if(!(editMode && isAdmin)) return null;
  return <button onClick={onClick} className="text-xs px-3 py-1.5 rounded-lg border border-dashed border-primary text-primary hover:bg-primary/10">{label} افزودن</button>;
}
