"use client";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useCms } from "@/contexts/CmsContext";
import { useApp } from "@/contexts/AppContext";
import { fetchGithubRepos, GithubRepo, githubOgImage } from "@/lib/github";

export default function ProjectsPage(){
  const { cms, resolve } = useCms();
  const { dir, lang } = useApp();
  const [tab, setTab] = useState<"about"|"skills"|"contact"|"github">("about");
  const [ghRepos, setGhRepos] = useState<GithubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GithubRepo | null>(null);
  const [explorerOpen, setExplorerOpen] = useState({ src: true, github: true });

  useEffect(()=>{ fetchGithubRepos(cms.settings.githubUsername).then(setGhRepos); }, [cms.settings.githubUsername]);

  return (
    <div className="glass rounded-[20px] overflow-hidden border border-border shadow-xl">
      {/* Title bar */}
      <div className="h-10 bg-[#0f1218] border-b border-border flex items-center px-4 text-xs text-text-muted gap-2">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]"></span>
        <span className="w-3 h-3 rounded-full bg-[#febc2e]"></span>
        <span className="w-3 h-3 rounded-full bg-[#28c840]"></span>
        <span className="ms-3 font-mono">avidkiya — {tab}.md</span>
      </div>
      <div className="flex min-h-[680px]">
        {/* Activity bar */}
        <div className="w-12 bg-[#0b0e14] border-e border-border flex flex-col items-center py-3 gap-5 text-text-faint">
          <Icon name="folder" />
          <Icon name="search" />
          <Icon name="git_branch" />
          <Icon name="bug" />
          <Icon name="puzzle" />
        </div>
        {/* Explorer */}
        <div className="w-[260px] bg-[#11141c] border-e border-border hidden md:block">
          <div className="text-[11px] text-text-faint px-3 py-2 uppercase tracking-wider">Explorer</div>
          <div className="px-2 text-sm space-y-1">
            <button onClick={()=>setExplorerOpen(o=>({...o, src: !o.src}))} className="flex items-center gap-1 w-full text-left px-2 py-1 hover:bg-white/5 rounded">
              <Icon name="expand_more" size={14} /> <Icon name="folder" size={14} /> src
            </button>
            {explorerOpen.src && (
              <div className="ms-5 space-y-1 text-text-muted text-[13px]">
                <button onClick={()=>setTab("about")} className={`block w-full text-start px-2 py-1 rounded ${tab==="about"?"bg-white/10 text-text":"hover:bg-white/5"}`}>About.md</button>
                <button onClick={()=>setTab("skills")} className={`block w-full text-start px-2 py-1 rounded ${tab==="skills"?"bg-white/10 text-text":"hover:bg-white/5"}`}>Skills.json</button>
                <button onClick={()=>setTab("contact")} className={`block w-full text-start px-2 py-1 rounded ${tab==="contact"?"bg-white/10 text-text":"hover:bg-white/5"}`}>Contact.sh</button>
              </div>
            )}
            <button onClick={()=>setExplorerOpen(o=>({...o, github: !o.github}))} className="flex items-center gap-1 w-full text-left px-2 py-1 hover:bg-white/5 rounded mt-2">
              <Icon name="expand_more" size={14} /> <Icon name="folder" size={14} /> github
            </button>
            {explorerOpen.github && (
              <div className="ms-5 space-y-1 text-text-muted text-[13px] max-h-[380px] overflow-auto">
                {ghRepos.slice(0,24).map(r=>(
                  <button key={r.id} onClick={()=>{ setTab("github"); setSelectedRepo(r); }} className="block w-full text-start px-2 py-1 rounded hover:bg-white/5 truncate">
                    {r.name}
                  </button>
                ))}
                {!ghRepos.length && <div className="text-[11px] text-text-faint px-2">loading…</div>}
              </div>
            )}
          </div>
        </div>
        {/* Editor */}
        <div className="flex-1 bg-[#0d1117] flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-border text-xs overflow-x-auto">
            {[
              {id:"about", label:"About.md"},
              {id:"skills", label:"Skills.json"},
              {id:"contact", label:"Contact.sh"},
              {id:"github", label: selectedRepo ? selectedRepo.name + ".md" : "github.md"},
            ].map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id as any)} className={`px-4 py-2 border-e border-border ${tab===t.id ? "bg-[#0d1117] text-text" : "bg-[#0b0e14] text-text-muted"}`}>{t.label}</button>
            ))}
          </div>
          <div className="flex-1 p-5 md:p-7 overflow-auto">
            {tab==="about" && (
              <div>
                <h2 className="text-xl font-black mb-4">Projects</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {cms.dashboard.projects.map(p=>(
                    <div key={p.id} className="bg-[#11141c] border border-border rounded-xl p-4">
                      <div className="font-bold">{resolve(p.title)}</div>
                      <div className="text-sm text-text-muted mt-1">{resolve(p.description)}</div>
                      <div className="text-[11px] mt-2 text-text-faint">{p.tags.join(" • ")}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tab==="skills" && (
              <div>
                <h2 className="text-xl font-black mb-4">skills.json</h2>
                <div className="space-y-3 font-mono text-sm">
                  {cms.resume.skills.map(sk=>(
                    <div key={sk.id}>
                      <div className="flex justify-between text-xs mb-1"><span>"{sk.name}"</span><span>{sk.percent}%</span></div>
                      <div className="h-2 bg-[#1b1f2a] rounded"><div className="h-2 rounded bg-primary" style={{width: sk.percent+"%"}} /></div>
                    </div>
                  ))}
                </div>
                <pre className="mt-6 text-[11px] text-text-faint bg-black/30 p-3 rounded-lg overflow-auto">{JSON.stringify(Object.fromEntries(cms.resume.skills.map(s=>[s.name, s.percent])), null, 2)}</pre>
              </div>
            )}
            {tab==="contact" && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-[#11141c] border border-border rounded-xl p-4">📧 {cms.identity.email}</div>
                {cms.socials.filter(s=>s.enabled).map(s=>(
                  <a key={s.id} href={s.url} target="_blank" className="bg-[#11141c] border border-border rounded-xl p-4 hover:border-primary block">
                    {resolve(s.label)} → {s.handle}
                  </a>
                ))}
              </div>
            )}
            {tab==="github" && (
              <div>
                {!selectedRepo ? (
                  <div>
                    <h2 className="text-xl font-black mb-4">GitHub Repositories ({ghRepos.length})</h2>
                    <div className="grid md:grid-cols-2 gap-4 max-h-[520px] overflow-auto pr-2">
                      {ghRepos.map(r=>(
                        <button key={r.id} onClick={()=>setSelectedRepo(r)} className="text-start bg-[#11141c] border border-border rounded-xl p-4 hover:border-primary">
                          <div className="font-bold text-primary">{r.name}</div>
                          <div className="text-xs text-text-muted mt-1 line-clamp-2">{r.description}</div>
                          <div className="text-[11px] text-text-faint mt-2">★ {r.stargazers_count} • {r.language} • {new Date(r.updated_at).toLocaleDateString()}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <button onClick={()=>setSelectedRepo(null)} className="text-xs text-text-muted mb-3">← back</button>
                    <h2 className="text-2xl font-black">{selectedRepo.full_name}</h2>
                    <p className="text-text-muted mt-2">{selectedRepo.description}</p>
                    <div className="flex gap-4 text-xs mt-3 text-text-faint">
                      <span>⭐ {selectedRepo.stargazers_count}</span>
                      <span>⑂ {selectedRepo.forks_count}</span>
                      <span>{selectedRepo.language}</span>
                      <span>{selectedRepo.size} KB</span>
                    </div>
                    <img src={githubOgImage(selectedRepo.full_name)} alt="" className="mt-4 rounded-xl border border-border max-w-full" />
                    <a href={selectedRepo.html_url} target="_blank" className="inline-block mt-4 px-4 py-2 rounded-xl bg-primary text-white font-bold text-sm">Open in GitHub →</a>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Terminal */}
          <div className="border-t border-border bg-[#0b0e14] text-[12px] font-mono p-3 text-success">
            <div>avid@kiya ~ $ ls projects</div>
            <div className="text-text-muted">{ghRepos.slice(0,5).map(r=>r.name).join("  ")}</div>
            <div>avid@kiya ~ $ <span className="animate-pulse">█</span></div>
          </div>
          {/* status bar */}
          <div className="h-6 bg-[#0a5dc2] text-white text-[11px] flex items-center px-3 justify-between">
            <span>main ●</span>
            <span>Ln 42, Col 7 • UTF-8 • TypeScript</span>
            <span>⚡ AvidKiya OS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
