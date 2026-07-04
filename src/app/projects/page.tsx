'use client';

import { useState, useEffect } from 'react';
import { useApp, useCms } from '@/contexts/AppContext';
import { Icon, GitHubIcon } from '@/components/ui/Icon';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  size: number;
  updated_at: string;
  topics: string[];
}

type TabType = 'about' | 'skills' | 'contact';

export default function ProjectsPage() {
  const { language } = useApp();
  const { cms, t } = useCms();
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['Github', 'src']));
  
  // Fetch GitHub repos
  useEffect(() => {
    async function fetchRepos() {
      if (!cms.settings.githubUsername) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch(`https://api.github.com/users/${cms.settings.githubUsername}/repos?sort=updated&per_page=20`);
        if (res.ok) {
          const data = await res.json();
          setRepos(data);
        }
      } catch (error) {
        console.error('Failed to fetch repos:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRepos();
  }, [cms.settings.githubUsername]);
  
  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folder)) {
        next.delete(folder);
      } else {
        next.add(folder);
      }
      return next;
    });
  };
  
  const fileTree = [
    {
      name: 'Github',
      type: 'folder' as const,
      children: repos.map(r => ({ name: r.name, type: 'file' as const, repo: r }))
    },
    {
      name: 'src',
      type: 'folder' as const,
      children: [
        { name: 'About.md', type: 'file' as const },
        { name: 'Skills.json', type: 'file' as const },
        { name: 'Contact.sh', type: 'file' as const }
      ]
    }
  ];
  
  const tabs = [
    { id: 'about' as const, name: 'About.md', icon: 'file-text' },
    { id: 'skills' as const, name: 'Skills.json', icon: 'file-code' },
    { id: 'contact' as const, name: 'Contact.sh', icon: 'terminal' }
  ];
  
  const languageColors: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Go: '#00add8',
    Python: '#3572a5',
    Rust: '#dea584',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Shell: '#89e051'
  };
  
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* IDE Shell */}
        <div className="ide-shell overflow-hidden">
          
          {/* Title Bar */}
          <div className="ide-titlebar">
            <div className="flex gap-2">
              <div className="ide-traffic-light ide-traffic-red" />
              <div className="ide-traffic-light ide-traffic-yellow" />
              <div className="ide-traffic-light ide-traffic-green" />
            </div>
            <span className="flex-1 text-center text-xs text-gray-400">
              {cms.settings.githubUsername} — VS Code
            </span>
          </div>
          
          <div className="flex h-[calc(100vh-200px)] min-h-[600px]">
            
            {/* Activity Bar */}
            <div className="w-12 bg-[#333333] flex flex-col items-center py-2 gap-3">
              <button className="p-2 text-white hover:bg-[#505050] rounded">
                <Icon name="file" size={20} />
              </button>
              <button className="p-2 text-gray-500 hover:bg-[#505050] rounded">
                <Icon name="search" size={20} />
              </button>
              <button className="p-2 text-gray-500 hover:bg-[#505050] rounded">
                <Icon name="git" size={20} />
              </button>
              <button className="p-2 text-gray-500 hover:bg-[#505050] rounded">
                <Icon name="debug" size={20} />
              </button>
              <button className="p-2 text-gray-500 hover:bg-[#505050] rounded">
                <Icon name="extension" size={20} />
              </button>
            </div>
            
            {/* Explorer Sidebar */}
            <div className="w-60 ide-explorer overflow-y-auto">
              <div className="p-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Explorer
              </div>
              
              <div className="px-1">
                {fileTree.map(item => (
                  <div key={item.name}>
                    <button
                      onClick={() => toggleFolder(item.name)}
                      className="w-full flex items-center gap-1 px-2 py-1 text-sm text-gray-300 hover:bg-[#37373d] rounded"
                    >
                      <Icon 
                        name={expandedFolders.has(item.name) ? 'chevron-down' : 'chevron-right'} 
                        size={14} 
                      />
                      <Icon name="folder" size={14} className="text-[#dcb67a]" />
                      <span>{item.name}</span>
                    </button>
                    
                    {expandedFolders.has(item.name) && item.children && (
                      <div className="ms-4">
                        {item.children.map((child: { name: string; type: string; repo?: GitHubRepo }) => (
                          <button
                            key={child.name}
                            onClick={() => {
                              setSelectedFile(child.name);
                              if (child.name === 'About.md') setActiveTab('about');
                              else if (child.name === 'Skills.json') setActiveTab('skills');
                              else if (child.name === 'Contact.sh') setActiveTab('contact');
                            }}
                            className={`w-full flex items-center gap-1 px-2 py-1 text-sm hover:bg-[#37373d] rounded ${
                              selectedFile === child.name ? 'bg-[#37373d] text-white' : 'text-gray-400'
                            }`}
                          >
                            <Icon name="file-text" size={14} className="text-gray-500" />
                            <span className="truncate">{child.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Editor Area */}
            <div className="flex-1 flex flex-col ide-editor">
              
              {/* Tabs */}
              <div className="flex bg-[#252526] border-b border-[#3c3c3c]">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm border-r border-[#3c3c3c] ${
                      activeTab === tab.id
                        ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]'
                        : 'text-gray-500 hover:bg-[#2d2d2d]'
                    }`}
                  >
                    <Icon name={tab.icon} size={14} />
                    {tab.name}
                  </button>
                ))}
              </div>
              
              {/* Editor Content */}
              <div className="flex-1 overflow-y-auto p-6">
                
                {/* About Tab - GitHub Projects */}
                {activeTab === 'about' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">
                      # {language === 'fa' ? 'پروژه‌های گیت‌هاب' : 'GitHub Projects'}
                    </h2>
                    
                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <Icon name="refresh" size={24} className="animate-spin text-gray-500" />
                      </div>
                    ) : repos.length === 0 ? (
                      <p className="text-gray-500">
                        {language === 'fa' ? 'پروژه‌ای یافت نشد' : 'No projects found'}
                      </p>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-4">
                        {repos.map(repo => (
                          <a
                            key={repo.id}
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-4 bg-[#252526] rounded-lg border border-[#3c3c3c] hover:border-[#007acc] transition-colors group"
                          >
                            {/* Preview Image */}
                            <div className="aspect-video mb-3 rounded overflow-hidden bg-[#1e1e1e]">
                              <img
                                src={`https://opengraph.githubassets.com/1/${repo.full_name}`}
                                alt={repo.name}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                            
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-bold text-white group-hover:text-[#007acc] transition-colors">
                                  {repo.name}
                                </h3>
                                <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                                  {repo.description || (language === 'fa' ? 'بدون توضیحات' : 'No description')}
                                </p>
                              </div>
                              <GitHubIcon size={20} className="text-gray-500 flex-shrink-0" />
                            </div>
                            
                            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                              {repo.language && (
                                <span className="flex items-center gap-1">
                                  <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: languageColors[repo.language] || '#666' }}
                                  />
                                  {repo.language}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Icon name="star" size={12} />
                                {repo.stargazers_count}
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon name="git-branch" size={12} />
                                {repo.forks_count}
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Skills Tab */}
                {activeTab === 'skills' && (
                  <div>
                    <pre className="text-sm text-gray-300 font-mono">
                      <code>{`{
  "languages": [`}</code>
                    </pre>
                    
                    <div className="my-4 space-y-4 ps-8">
                      {cms.resume.skills.filter(s => s.category === 'Languages').map(skill => (
                        <div key={skill.id}>
                          <div className="flex justify-between mb-1">
                            <span className="text-white font-mono">"{skill.name}"</span>
                            <span className="text-[#ce9178] font-mono">{skill.percent}%</span>
                          </div>
                          <div className="h-2 bg-[#3c3c3c] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#007acc] rounded-full transition-all duration-500"
                              style={{ width: `${skill.percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <pre className="text-sm text-gray-300 font-mono">
                      <code>{`  ],
  "databases": [`}</code>
                    </pre>
                    
                    <div className="my-4 space-y-4 ps-8">
                      {cms.resume.skills.filter(s => s.category === 'Databases').map(skill => (
                        <div key={skill.id}>
                          <div className="flex justify-between mb-1">
                            <span className="text-white font-mono">"{skill.name}"</span>
                            <span className="text-[#ce9178] font-mono">{skill.percent}%</span>
                          </div>
                          <div className="h-2 bg-[#3c3c3c] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#4ec9b0] rounded-full transition-all duration-500"
                              style={{ width: `${skill.percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <pre className="text-sm text-gray-300 font-mono">
                      <code>{`  ],
  "devops": [`}</code>
                    </pre>
                    
                    <div className="my-4 space-y-4 ps-8">
                      {cms.resume.skills.filter(s => s.category === 'DevOps').map(skill => (
                        <div key={skill.id}>
                          <div className="flex justify-between mb-1">
                            <span className="text-white font-mono">"{skill.name}"</span>
                            <span className="text-[#ce9178] font-mono">{skill.percent}%</span>
                          </div>
                          <div className="h-2 bg-[#3c3c3c] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#dcdcaa] rounded-full transition-all duration-500"
                              style={{ width: `${skill.percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <pre className="text-sm text-gray-300 font-mono">
                      <code>{`  ]
}`}</code>
                    </pre>
                  </div>
                )}
                
                {/* Contact Tab */}
                {activeTab === 'contact' && (
                  <div className="font-mono text-sm">
                    <div className="text-[#6a9955]"># Contact Information</div>
                    <br />
                    <div className="text-[#569cd6]">echo</div>
                    <span className="text-[#ce9178]"> "📧 Email: {cms.identity.email}"</span>
                    <br /><br />
                    
                    <div className="text-[#6a9955]"># Social Links</div>
                    <br />
                    {cms.socials.filter(s => s.enabled).map(social => (
                      <div key={social.id} className="mb-2">
                        <span className="text-[#569cd6]">open</span>
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#ce9178] hover:underline ms-2"
                        >
                          "{social.url}"
                        </a>
                      </div>
                    ))}
                  </div>
                )}
                
              </div>
              
              {/* Terminal Panel */}
              <div className="h-32 ide-terminal overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-1 bg-[#252526] border-b border-[#3c3c3c]">
                  <span className="text-xs text-gray-400">TERMINAL</span>
                </div>
                <div className="p-3 text-sm font-mono">
                  <div className="text-[#4ec9b0]">$ npm run build</div>
                  <div className="text-gray-400">✓ Compiled successfully</div>
                  <div className="text-[#6a9955]">✓ All tests passed</div>
                  <div className="flex items-center">
                    <span className="text-[#4ec9b0]">$ </span>
                    <span className="w-2 h-4 bg-white animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
            
          </div>
          
          {/* Status Bar */}
          <div className="ide-statusbar flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span>✓ {language === 'fa' ? 'بدون خطا' : 'No errors'}</span>
              <span>UTF-8</span>
            </div>
            <div className="flex items-center gap-4">
              <span>TypeScript</span>
              <span>Ln 1, Col 1</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
