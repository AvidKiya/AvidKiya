"use client";
import { useCms } from "@/contexts/CmsContext";
import { Icon } from "@/components/ui/Icon";

export function ProjectGrid(){
  const { cms, resolve } = useCms();
  const items = cms.dashboard.projects;
  return (
    <div className="grid md:grid-cols-2 gap-5">
      {items.map(p=>(
        <div key={p.id} className="glass rounded-[22px] p-5 hover:shadow-glow transition group">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-black text-lg">{resolve(p.title)}</h3>
            {p.stars ? <span className="text-xs text-amber-400 flex items-center gap-1"><Icon name="star" size={13} /> {p.stars}</span> : null}
          </div>
          <p className="text-sm text-text-muted mb-4">{resolve(p.description)}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {p.tags.map(t=> <span key={t} className="text-[10px] px-2 py-1 rounded-full bg-bg-soft border border-border">{t}</span>)}
          </div>
          <div className="flex gap-3 text-xs">
            {p.githubUrl && <a href={p.githubUrl} target="_blank" className="text-primary hover:underline">GitHub →</a>}
            {p.demoUrl && <a href={p.demoUrl} target="_blank" className="text-text-muted hover:underline">Demo</a>}
          </div>
        </div>
      ))}
    </div>
  );
}
