"use client";

import React, { useState, useEffect } from 'react';

export const GithubRepos = ({ username }: { username: string }) => {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRepos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username]);

  if (loading) return <div className="text-white/20 animate-pulse font-mono uppercase text-xs tracking-widest">Fetching Repositories...</div>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repos.map(repo => (
        <a 
          key={repo.id} 
          href={repo.html_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="code-card p-6 rounded-lg group"
        >
          <div className="flex justify-between items-start mb-4">
            <svg className="w-5 h-5 text-accent-python" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0-2-2V5a2 2 0 0 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            <div className="flex gap-2">
               <span className="text-[10px] bg-[#30363d] px-2 py-0.5 rounded text-white/60">{repo.language || 'Code'}</span>
            </div>
          </div>
          <h4 className="text-white font-bold mb-2 group-hover:text-accent-python transition-colors">{repo.name}</h4>
          <p className="text-white/40 text-xs line-clamp-2 h-8 font-mono mb-4">{repo.description || 'No description provided.'}</p>
          <div className="flex items-center gap-4 text-[10px] text-white/30 font-mono">
             <span>★ {repo.stargazers_count}</span>
             <span>Fork {repo.forks_count}</span>
          </div>
        </a>
      ))}
    </div>
  );
};
