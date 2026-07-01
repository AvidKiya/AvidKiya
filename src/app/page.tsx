"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GithubRepos } from '../components/GithubRepos';
import { AdminPanel } from '../components/AdminPanel';

const ASCII_LOGO = `
   ▄▀█ █░█ █ █▀▄   █▄▀ █ █▄█ ▄▀█
   █▀█ ▀▄▀ █ █▄▀   █░█ █ ░█░ █▀█
   ░░░ A V I D   D E V H U B ░░░
`;

const ASCII_BANNER = `
╔────────────────────────────────────────────────────────────╗
│ █████╗ ██╗   ██╗██╗██████╗     ██╗  ██╗██╗██╗   ██╗ █████╗ │
│██╔══██╗██║   ██║██║██╔══██╗    ██║ ██╔╝██║╚██╗ ██╔╝██╔══██╗│
│███████║██║   ██║██║██║  ██║    █████╔╝ ██║ ╚████╔╝ ███████║│
│██╔══██║╚██╗ ██╔╝██║██║  ██║    ██╔═██╗ ██║  ╚██╔╝  ██╔══██║│
│██║  ██║ ╚████╔╝ ██║██████╔╝    ██║  ██╗██║   ██║   ██║  ██║│
│╚═╝  ╚═╝  ╚═══╝  ╚═╝╚═════╝     ╚═╝  ╚═╝╚═╝   ╚═╝   ╚═╝  ╚═╝│
╚────────────────────────────────────────────────────────────╝
`;

export default function Home() {
  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen selection:bg-accent-python selection:text-white pb-32">
      <AdminPanel />
      
      {/* Header Section */}
      <header className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div className="flex justify-between items-start">
           <pre className="ascii-header text-accent-python text-[10px] md:text-sm">
             {ASCII_LOGO}
           </pre>
           <button 
             onClick={handlePrint}
             className="no-print bg-[#161b22] border border-[#30363d] px-6 py-3 rounded text-[10px] font-bold uppercase tracking-widest hover:border-accent-python transition-all"
           >
             Download CV [PDF]
           </button>
        </div>

        <div className="overflow-x-auto">
          <pre className="ascii-header text-white/90 text-[7px] md:text-xs tracking-tighter md:tracking-normal">
            {ASCII_BANNER}
          </pre>
        </div>
      </header>

      {/* Main Info */}
      <main className="max-w-5xl mx-auto px-6 space-y-32">
        
        {/* Intro */}
        <section className="grid md:grid-cols-[1fr_300px] gap-12 items-center">
           <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[#3776ab1a] border border-[#3776ab33] rounded-full">
                 <div className="w-2 h-2 rounded-full bg-accent-python animate-pulse"></div>
                 <span className="text-accent-python text-[10px] font-bold uppercase tracking-widest font-mono">Senior Software Architect</span>
              </div>
              <h2 className="text-5xl font-black text-white leading-tight">Building scalable<br/>intelligent systems.</h2>
              <p className="text-white/50 text-base font-mono leading-relaxed max-w-xl">
                 Expert in <span className="text-accent-python">Python (FastAPI/Django)</span> and <span className="text-accent-node">Node.js</span>. 
                 Specializing in high-concurrency architectures, AI orchestration, and cloud-native solutions. 
                 Driven by clean code and the zen of development.
              </p>
              <div className="flex gap-12 pt-4">
                 <div className="space-y-1">
                    <div className="text-[10px] text-white/30 uppercase tracking-widest">Experience</div>
                    <div className="text-white font-bold font-mono">6+ Years</div>
                 </div>
                 <div className="space-y-1">
                    <div className="text-[10px] text-white/30 uppercase tracking-widest">Completed</div>
                    <div className="text-white font-bold font-mono">42+ Projects</div>
                 </div>
              </div>
           </div>
           
           <div className="relative group">
              <div className="absolute inset-0 bg-accent-python/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-[#30363d] group-hover:border-accent-python transition-all duration-500">
                 <img src="/me.png" className="w-full h-full object-cover grayscale brightness-110" />
              </div>
           </div>
        </section>

        {/* Tech Stack */}
        <section className="space-y-12">
           <div className="flex items-center gap-6">
              <h3 className="text-white/20 text-xs uppercase tracking-[1em] whitespace-nowrap font-black">Core Stack</h3>
              <div className="w-full h-[1px] bg-[#30363d]" />
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <TechItem name="Python" level="Master" color="#3776ab" />
              <TechItem name="Node.js" level="Advanced" color="#68a063" />
              <TechItem name="PostgreSQL" level="Scalable" color="#336791" />
              <TechItem name="AI Models" level="Expert" color="#ffffff" />
           </div>
        </section>

        {/* GitHub Integration */}
        <section className="space-y-12">
           <div className="flex items-center gap-6">
              <h3 className="text-white/20 text-xs uppercase tracking-[1em] whitespace-nowrap font-black">Live Repositories</h3>
              <div className="w-full h-[1px] bg-[#30363d]" />
           </div>
           <GithubRepos username="AvidKiya" />
        </section>

      </main>

      <footer className="max-w-5xl mx-auto px-6 mt-40 pt-12 border-t border-[#30363d] flex flex-col md:flex-row justify-between items-center gap-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
         <div>© 2026 Avid Kiya // Systems Architect</div>
         <div className="flex gap-8">
            <a href="https://github.com/AvidKiya" className="hover:text-accent-python transition-colors">Github</a>
            <a href="https://linkedin.com/in/avidkiya" className="hover:text-accent-python transition-colors">LinkedIn</a>
            <a href="https://t.me/avidkiya" className="hover:text-accent-python transition-colors">Telegram</a>
         </div>
      </footer>
    </div>
  );
}

const TechItem = ({ name, level, color }: { name: string, level: string, color: string }) => (
  <div className="p-6 code-card rounded-xl group relative overflow-hidden">
     <div className="absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: color }}></div>
     <div className="text-white font-bold mb-1">{name}</div>
     <div className="text-[10px] uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: color }}>{level}</div>
  </div>
);
