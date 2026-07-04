'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import Icon from '@/components/ui/Icon';
import { tl } from '@/lib/i18n';

interface GHRepo {
  id: number; name: string; full_name: string; description: string;
  html_url: string; language: string; stargazers_count: number;
  forks_count: number; size: number; updated_at: string; fork: boolean;
}

const ACTIVITY_ICONS = ['folder', 'search', 'git-branch', 'bug', 'puzzle'];
const TABS = ['about', 'skills', 'contact'] as const;
type Tab = typeof TABS[number];

export default function ProjectsPage() {
  const { lang, resolve, cms } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('about');
  const [repos, setRepos] = useState<GHRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIcon, setActiveIcon] = useState(0);
  const username = cms.settings.githubUsername || 'avidkiya';

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}/repos?per_page=30&sort=updated`)
      .then(r => r.ok ? r.json() : [])
      .then((data: GHRepo[]) => {
        setRepos(data.filter(r => !r.fork));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username]);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4">
      <div className="glass-card-strong overflow-hidden" style={{ borderRadius: 12 }}>
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-bg-card-solid border-b border-border-theme">
          <span className="mac-dot mac-dot-red" />
          <span className="mac-dot mac-dot-yellow" />
          <span className="mac-dot mac-dot-green" />
          <span className="text-xs text-text-muted ms-3 font-mono" dir="ltr">~/avidkiya/portfolio</span>
        </div>

        <div className="flex min-h-[70vh]">
          {/* Activity bar */}
          <div className="hidden sm:flex flex-col items-center w-12 bg-bg-card-solid border-e border-border-theme py-2 gap-1 shrink-0">
            {ACTIVITY_ICONS.map((icon, i) => (
              <button key={icon} onClick={() => setActiveIcon(i)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition ${
                  activeIcon === i ? 'text-primary bg-primary/10' : 'text-text-muted hover:text-text-primary'
                }`}>
                <Icon name={icon} size={18} />
              </button>
            ))}
          </div>

          {/* Explorer sidebar */}
          <div className="hidden md:block w-56 bg-bg-card-solid border-e border-border-theme p-3 shrink-0">
            <div className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-bold">
              {lang === 'fa' ? 'کاوشگر' : 'EXPLORER'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-text-secondary px-1">
                <Icon name="chevron-down" size={12} />
                <Icon name="folder" size={12} className="text-accent-amber" />
                <span>src</span>
              </div>
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`w-full flex items-center gap-1.5 text-xs px-1 ps-6 py-0.5 rounded transition ${
                    activeTab === tab ? 'text-primary bg-primary/10' : 'text-text-secondary hover:text-text-primary'
                  }`}>
                  <Icon name="file-text" size={12} />
                  <span>{tab === 'about' ? 'About.md' : tab === 'skills' ? 'Skills.json' : 'Contact.sh'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Editor area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Tabs */}
            <div className="flex border-b border-border-theme bg-bg-card-solid overflow-x-auto">
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-medium border-b-2 transition whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-text-secondary hover:text-text-primary'
                  }`}>
                  {tab === 'about' ? 'About.md' : tab === 'skills' ? 'Skills.json' : 'Contact.sh'}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 p-4 md:p-6 overflow-auto">
              {activeTab === 'about' && (
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Icon name="folder" size={18} className="text-accent-amber" />
                    {tl('allProjects', lang)}
                  </h2>
                  {loading ? (
                    <div className="text-text-muted text-sm">{tl('loading', lang)}</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {repos.map(repo => (
                        <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer"
                          className="glass-card p-4 hover:border-primary/30 transition group block">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-bold text-sm group-hover:text-primary transition truncate">{repo.name}</h3>
                            {repo.language && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0">{repo.language}</span>
                            )}
                          </div>
                          <p className="text-xs text-text-secondary line-clamp-2 mb-2">{repo.description || 'No description'}</p>
                          <div className="flex items-center gap-3 text-[10px] text-text-muted">
                            <span className="flex items-center gap-0.5"><Icon name="star" size={10} /> {repo.stargazers_count}</span>
                            <span className="flex items-center gap-0.5"><Icon name="git-fork" size={10} /> {repo.forks_count}</span>
                          </div>
                        </a>
                      ))}
                      {/* Custom projects */}
                      {cms.projects.customProjects.map(p => (
                        <div key={p.id} className="glass-card p-4 hover:border-primary/30 transition">
                          <h3 className="font-bold text-sm mb-1">{resolve(p.title)}</h3>
                          <p className="text-xs text-text-secondary line-clamp-2 mb-2">{resolve(p.description)}</p>
                          <div className="flex flex-wrap gap-1">
                            {p.tech.map(t => (
                              <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">{t}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'skills' && (
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Icon name="bar-chart" size={18} className="text-accent-cyan" />
                    {tl('skills', lang)}
                  </h2>
                  <div className="space-y-3 max-w-lg">
                    {cms.resume.skills.map(skill => (
                      <div key={skill.id}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-mono font-medium">{skill.name}</span>
                          <span className="text-xs text-text-muted">{skill.percent}%</span>
                        </div>
                        <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${skill.percent}%`, background: `linear-gradient(90deg, var(--primary), var(--accent-cyan))` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* JSON preview */}
                  <div className="mt-6 p-4 rounded-lg bg-bg-card-solid border border-border-theme font-mono text-xs overflow-auto" dir="ltr">
                    <pre className="text-text-secondary">{JSON.stringify(
                      Object.fromEntries(cms.resume.skills.map(s => [s.name, `${s.percent}%`])),
                      null, 2
                    )}</pre>
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Icon name="terminal" size={18} className="text-accent-emerald" />
                    {tl('contact', lang)}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a href={`mailto:${cms.identity.email}`}
                      className="glass-card p-4 hover:border-primary/30 transition flex items-center gap-3">
                      <Icon name="mail" size={20} className="text-primary" />
                      <div>
                        <div className="text-sm font-bold">{lang === 'fa' ? 'ایمیل' : 'Email'}</div>
                        <div className="text-xs text-text-secondary font-mono">{cms.identity.email}</div>
                      </div>
                    </a>
                    {cms.socials.filter(s => s.visible).map(s => (
                      <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                        className="glass-card p-4 hover:border-primary/30 transition flex items-center gap-3">
                        <Icon name={s.icon || 'link'} size={20} className="text-primary" />
                        <div>
                          <div className="text-sm font-bold">{resolve(s.label)}</div>
                          <div className="text-xs text-text-secondary">{s.platform}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Terminal panel */}
            <div className="border-t border-border-theme bg-bg-card-solid p-3">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="terminal" size={12} className="text-accent-emerald" />
                <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Terminal</span>
              </div>
              <div className="font-mono text-xs space-y-1" dir="ltr">
                <div><span className="text-accent-emerald">$</span> <span className="text-text-secondary">git status</span></div>
                <div className="text-accent-emerald">On branch main — Your branch is up to date</div>
                <div><span className="text-accent-emerald">$</span> <span className="text-text-secondary">echo &quot;Thanks for visiting!&quot;</span></div>
                <div className="text-accent-amber">Thanks for visiting!</div>
              </div>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-3 py-1 bg-primary text-white text-[10px]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Icon name="git-branch" size={10} /> main</span>
            <span>UTF-8</span>
          </div>
          <div className="flex items-center gap-3">
            <span>TypeScript</span>
            <span>Ln 1, Col 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
