'use client';
import { useEffect, useState, useMemo } from 'react';
import { GlassCard } from '@/components/ui/glass';
import { AppIcon } from '@/components/ui/icons';
import { useCms } from '@/lib/cms/cms-context';
import { Star, GitFork, ExternalLink, Folder, FileCode, Search } from 'lucide-react';

interface GHRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics?: string[];
  updated_at: string;
  homepage?: string;
}

export default function ProjectsClient() {
  const { cms, t } = useCms();
  const [repos, setRepos] = useState<GHRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string>('');
  const [filter, setFilter] = useState('');
  const [tab, setTab] = useState<'all'|'featured'>('featured');

  useEffect(() => {
    const ghUser = cms.settings.githubUsername || 'avidkiya';
    fetch(`https://api.github.com/users/${ghUser}/repos?sort=updated&per_page=30`, {
      headers: { 'Accept': 'application/vnd.github+json' }
    })
      .then(r => r.json())
      .then((data: GHRepo[]) => {
        if (Array.isArray(data)) {
          setRepos(data.filter(r=>!r.full_name.includes('/.github')));
          setActive(data[0]?.name || '');
        }
      })
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, [cms.settings.githubUsername]);

  const custom = cms.projects.customProjects;
  const merged = useMemo(() => {
    const map = new Map(repos.map(r => [r.name.toLowerCase(), r]));
    const out = custom.map(c => {
      const gh = map.get(c.title.toLowerCase().replace(/\s+/g,'-'));
      return {
        id: c.id,
        name: c.title,
        description: c.description,
        language: c.language || gh?.language || 'TypeScript',
        stars: c.stars || gh?.stargazers_count || 0,
        url: c.url || gh?.html_url || '#',
        featured: c.featured,
        updated: gh?.updated_at || '',
      };
    });
    // add GH repos not in custom
    repos.forEach(r => {
      if (!out.find(o => o.name.toLowerCase() === r.name.toLowerCase())) {
        out.push({
          id: String(r.id),
          name: r.name,
          description: r.description || '',
          language: r.language || '',
          stars: r.stargazers_count,
          url: r.html_url,
          featured: (r.stargazers_count||0) > 5,
          updated: r.updated_at,
        });
      }
    });
    return out;
  }, [repos, custom]);

  const list = useMemo(() => {
    let l = tab === 'featured' ? merged.filter(m=>m.featured) : merged;
    if (filter) {
      const q = filter.toLowerCase();
      l = l.filter(x => x.name.toLowerCase().includes(q) || x.description.toLowerCase().includes(q));
    }
    return l.sort((a,b)=> (b.stars||0)-(a.stars||0));
  }, [merged, tab, filter]);

  const current = list.find(x => x.name === active) || list[0];

  return (
    <div className="max-w-[1250px] mx-auto px-3 md:px-6 py-5 md:py-8">
      {/* VS Code top bar */}
      <div className="glass-card !p-0 overflow-hidden mb-3">
        <div className="flex items-center gap-2 px-3 py-[9px] border-b border-glass-border text-[12px] text-text-3">
          <div className="flex gap-[6px]">
            <span className="w-[11px] h-[11px] rounded-full bg-rose/80"></span>
            <span className="w-[11px] h-[11px] rounded-full bg-amber/80"></span>
            <span className="w-[11px] h-[11px] rounded-full bg-emerald/80"></span>
          </div>
          <div className="flex-1 text-center">
            <span className="opacity-80">avidkiya — DevHub OS — Visual Studio Code</span>
          </div>
          <div className="text-[10.5px] hidden sm:block">UTF-8 • TypeScript • ⌘K</div>
        </div>

        <div className="flex min-h-[560px] max-h-[78vh]">
          {/* Sidebar — Explorer */}
          <div className="w-[240px] md:w-[290px] border-e border-glass-border hidden sm:flex flex-col bg-black/[0.035] dark:bg-white/[0.022]">
            <div className="px-3 py-[10px] text-[11px] font-[600] tracking-wider text-text-3 uppercase flex items-center justify-between">
              Explorer
              <AppIcon name="settings" size={13} className="opacity-60" />
            </div>
            <div className="px-3 pb-2">
              <div className="relative">
                <Search size={13} className="absolute left-[9px] rtl:right-[9px] rtl:left-auto top-[8px] text-text-3" />
                <input
                  value={filter}
                  onChange={e=>setFilter(e.target.value)}
                  placeholder={t('جستجو پروژه…','Search projects…')}
                  className="w-full bg-black/[0.05] dark:bg-white/[0.05] border border-glass-border rounded-[9px] py-[6px] ps-7 text-[12px] outline-none focus:ring-1 focus:ring-primary/40"
                />
              </div>
            </div>
            <div className="px-3 text-[11px] text-text-3 mb-1 flex gap-3">
              <button onClick={()=>setTab('featured')} className={tab==='featured' ? 'text-primary' : 'hover:text-text-2'}>★ Featured</button>
              <button onClick={()=>setTab('all')} className={tab==='all' ? 'text-primary' : 'hover:text-text-2'}>All</button>
              <span className="ms-auto">{list.length}</span>
            </div>
            <div className="flex-1 overflow-auto text-[13px]">
              <div className="px-3 py-1 text-[11px] text-text-3 flex items-center gap-1.5">
                <Folder size={13} className="text-amber" /> {t('پروژه‌ها','projects')}
              </div>
              {loading ? (
                <div className="px-4 py-3 text-text-3 text-[12px]">Loading…</div>
              ) : list.map(p => (
                <button
                  key={p.id}
                  onClick={()=>setActive(p.name)}
                  className={`w-full text-start px-4 py-[7px] flex items-center gap-[9px] text-[12.5px] transition-colors border-s-2 ${
                    current?.name === p.name
                      ? 'bg-primary/10 border-primary text-text'
                      : 'border-transparent hover:bg-white/[0.035] text-text-2'
                  }`}
                >
                  <FileCode size={14} className="text-cyan shrink-0" />
                  <span className="truncate">{p.name}</span>
                  <span className="ms-auto text-[10.5px] text-text-3 flex items-center gap-1">
                    <Star size={11} /> {p.stars}
                  </span>
                </button>
              ))}
              {!loading && list.length===0 && (
                <div className="px-4 py-6 text-text-3 text-[12px]">نتیجه‌ای یافت نشد</div>
              )}
            </div>
            <div className="border-t border-glass-border px-3 py-[8px] text-[11px] text-text-3 flex items-center justify-between">
              <span>main</span>
              <span className="flex items-center gap-1"><span className="w-[7px] h-[7px] rounded-full bg-emerald"></span> Live</span>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-glass-border text-[12px] overflow-x-auto">
              {current && (
                <div className="px-3 py-[9px] bg-black/[0.035] dark:bg-white/[0.035] border-e border-glass-border flex items-center gap-2 min-w-[180px]">
                  <FileCode size={14} className="text-cyan" />
                  <span className="truncate">{current.name}.md</span>
                  <span className="ms-auto text-[10px] text-text-3">●</span>
                </div>
              )}
              <div className="px-3 py-[9px] text-text-3">README.md ×</div>
            </div>

            {/* Code / Preview */}
            <div className="flex-1 p-4 md:p-6 overflow-auto">
              {!current ? (
                <div className="text-text-3 text-sm">Select a file from Explorer →</div>
              ) : (
                <div>
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                    <div>
                      <h1 className="text-[20px] md:text-[22px] font-[700] tracking-[-0.01em] flex items-center gap-2">
                        {current.name}
                        {current.featured && (
                          <span className="text-[10px] px-2 py-[3px] rounded-full bg-amber/15 text-amber">Featured</span>
                        )}
                      </h1>
                      <p className="text-text-2 text-[13.5px] mt-1.5 max-w-2xl leading-relaxed">{current.description}</p>
                    </div>
                    <a href={current.url} target="_blank" rel="noopener noreferrer" className="glass-btn !py-2 !px-3 text-[12.5px] flex items-center gap-1.5 shrink-0">
                      Open <ExternalLink size={13} />
                    </a>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[12px] text-text-3 mb-4 border-b border-glass-border pb-3">
                    <span className="flex items-center gap-1"><Star size={13} /> {current.stars} stars</span>
                    <span>{current.language}</span>
                    <span className="hidden sm:inline">MIT</span>
                    <span className="hidden sm:inline">Updated {current.updated ? new Date(current.updated).toLocaleDateString('fa-IR') : '—'}</span>
                  </div>

                  {/* Fake code block — liquid glass */}
                  <GlassCard className="!p-0 overflow-hidden font-mono text-[12.5px] leading-[1.7]">
                    <div className="px-4 py-[9px] border-b border-glass-border text-[11px] text-text-3 flex items-center justify-between">
                      <span>{current.name}/README.md</span>
                      <span>TS • 1.2kb</span>
                    </div>
                    <pre className="p-4 overflow-auto text-text-2" dir="ltr" style={{direction:'ltr', textAlign:'left'}}>
{`# ${current.name}

${current.description}

## Install
\`\`\`bash
pnpm add ${current.name.toLowerCase().replace(/\s+/g,'-')}
\`\`\`

## Usage
import { init } from '${current.name.toLowerCase()}'

const app = init({
  theme: 'liquid-glass',
  rtl: true,
  lang: 'fa'
})

## Features
- Edge-ready (Cloudflare)
- Type-safe
- iOS Liquid Glass UI
- Persian Calendar built-in

> Built by Avid Kiya — avidkiya.com
`}
                    </pre>
                  </GlassCard>

                  <div className="flex flex-wrap gap-2 mt-4 text-[11px]">
                    {['nextjs','typescript','cloudflare','tailwind','liquid-glass','fa-IR'].map(tg=>(
                      <span key={tg} className="px-[10px] py-[5px] rounded-full bg-white/[0.05] border border-glass-border text-text-3">#{tg}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Terminal */}
            <div className="border-t border-glass-border bg-black/[0.025] dark:bg-white/[0.018]">
              <div className="px-3 py-[7px] text-[11px] text-text-3 flex items-center gap-3 border-b border-glass-border/70">
                <span className="text-text-2">TERMINAL</span>
                <span>OUTPUT</span>
                <span>PROBLEMS</span>
                <span className="ms-auto">zsh</span>
              </div>
              <div className="px-3 py-[9px] font-mono text-[11.5px] text-emerald" dir="ltr">
                <span className="text-text-3">avidkiya@devhub</span> <span className="text-cyan">~/projects</span> $ pnpm dev
                <br />▲ Next.js 15.1.6 — <span className="text-text-2">http://localhost:3000</span>
                <br />✓ Ready
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* bottom grid — compact portfolio teasers */}
      <div className="grid md:grid-cols-3 gap-3">
        {merged.slice(0,3).map((p)=>(
          <GlassCard key={p.id+'-b'} className="!p-4">
            <div className="flex items-center justify-between mb-1">
              <div className="font-[600] text-[13.5px]">{p.name}</div>
              <AppIcon name="code" size={15} className="text-text-3" />
            </div>
            <div className="text-[12px] text-text-2 line-clamp-2 min-h-[34px]">{p.description}</div>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-text-3">
              <span className="flex items-center gap-1"><Star size={12} />{p.stars}</span>
              <span>{p.language}</span>
              <a href={p.url} target="_blank" className="ms-auto text-primary hover:underline">GitHub →</a>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
