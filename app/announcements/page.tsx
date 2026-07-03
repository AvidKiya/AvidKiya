"use client";
import { useCms } from "@/contexts/CmsContext";
import { useState } from "react";
export default function AnnouncementsPage(){
  const { cms, resolve, update } = useCms();
  const [tab,setTab] = useState<"active"|"archive"|"all">("active");
  const list = cms.announcements.filter(a=>{
    if(tab==="active") return !a.archived && !a.hidden;
    if(tab==="archive") return a.archived;
    return true;
  });

  const vote = async (annId:string, optId:string)=>{
    // local optimistic
    const idx = cms.announcements.findIndex(a=>a.id===annId);
    if(idx<0) return;
    const ann = JSON.parse(JSON.stringify(cms.announcements[idx]));
    ann.pollOptions = ann.pollOptions?.map((o:any)=> o.id===optId ? {...o, votes: o.votes+1} : o);
    const next = [...cms.announcements];
    next[idx]=ann;
    update("announcements", next);
  };

  return (
    <div>
      <h1 className="text-3xl font-black mb-6">اعلانات</h1>
      <div className="flex gap-2 mb-6">
        {(["active","archive","all"] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-bold border ${tab===t ? "bg-primary text-white border-primary" : "border-border hover:bg-bg-soft"}`}>{t}</button>
        ))}
      </div>
      <div className="space-y-5">
        {list.map(a=>(
          <div key={a.id} className="glass rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-black text-lg">{resolve(a.title)}</div>
                <div className="text-text-muted text-sm mt-1">{resolve(a.body)}</div>
              </div>
              {a.pinned && <span className="text-[10px] px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">PINNED</span>}
            </div>
            {a.type==="poll" && a.pollOptions && (
              <div className="mt-4 space-y-2">
                {a.pollOptions.map(o=>{
                  const total = a.pollOptions!.reduce((s,x)=>s+x.votes,0) || 1;
                  const pct = Math.round(o.votes/total*100);
                  return (
                    <button key={o.id} onClick={()=>vote(a.id, o.id)} className="w-full text-start">
                      <div className="flex justify-between text-xs mb-1"><span>{resolve(o.label)}</span><span>{pct}%</span></div>
                      <div className="h-2 bg-bg-soft rounded"><div className="h-2 bg-primary rounded" style={{width: pct+"%"}} /></div>
                    </button>
                  );
                })}
              </div>
            )}
            {a.type==="map" && a.mapLat && (
              <div className="mt-4 rounded-xl overflow-hidden border border-border">
                <iframe width="100%" height="260" style={{border:0}} loading="lazy" src={`https://www.openstreetmap.org/export/embed.html?bbox=${a.mapLng!-0.02}%2C${a.mapLat!-0.01}%2C${a.mapLng!+0.02}%2C${a.mapLat!+0.01}&layer=mapnik&marker=${a.mapLat}%2C${a.mapLng}`}></iframe>
              </div>
            )}
            {a.type==="image" && a.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={a.image} alt="" className="mt-4 rounded-xl max-h-80 object-cover w-full border border-border" />
            )}
          </div>
        ))}
        {!list.length && <div className="text-text-muted text-center py-10">موردی نیست</div>}
      </div>
    </div>
  );
}
