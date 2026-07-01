"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  title: string;
  category: string;
  description: string;
  metrics: { label: string; value: string }[];
}

const TopNav = () => (
  <nav className="flex flex-col md:flex-row justify-between items-start md:items-center px-8 py-6 border-b border-[#00ff411a] sticky top-0 bg-black/80 backdrop-blur-sm z-50 font-mono text-sm">
    <div className="flex items-center gap-1">
      <span className="text-[#00ff41]">&gt;.</span>
      <span className="text-[#00ff41] font-bold">avid.kiya</span>
      <span className="text-white/40">@</span>
      <span className="text-[#00ff41]">portfolio:~$</span>
      <span className="w-2 h-4 bg-[#00ff41] animate-pulse ml-1" />
    </div>
    
    <div className="flex flex-wrap gap-8 mt-4 md:mt-0 uppercase tracking-widest text-[11px]">
      <a href="#about" className="hover:text-[#00ff41] transition-colors flex items-center gap-2">
        <span className="text-[#00ff41]">#</span> About
      </a>
      <a href="#projects" className="hover:text-[#00ff41] transition-colors flex items-center gap-2">
        <span className="text-[#00ff41]">#</span> Projects
      </a>
      <a href="#experience" className="hover:text-[#00ff41] transition-colors flex items-center gap-2">
        <span className="text-[#00ff41]">#</span> Experience
      </a>
      <a href="#contact" className="hover:text-[#00ff41] transition-colors flex items-center gap-2">
        <span className="text-[#00ff41]">#</span> Contact
      </a>
      <div className="flex items-center gap-2 ml-4">
        <div className="w-2 h-2 rounded-full bg-[#00ff41] shadow-[0_0_8px_#00ff41]" />
        <span className="text-[#00ff41] text-[10px]">Available</span>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <section className="px-8 py-16 md:py-28 max-w-7xl mx-auto grid md:grid-cols-[1fr_350px] gap-16 items-start">
    <div className="space-y-12">
      <div className="relative inline-block border-2 border-[#00ff41] p-1 shadow-[0_0_30px_rgba(0,255,65,0.15)]">
         <div className="border border-[#00ff41]/30 p-8 md:p-12 bg-black">
            <h1 className="text-6xl md:text-9xl font-extrabold text-[#00ff41] tracking-tighter leading-none uppercase">
              AVID<br/>KIYA
            </h1>
            <p className="mt-6 text-xs md:text-sm uppercase tracking-[0.6em] text-[#00ff41]/60 font-mono">
              Senior AI & Backend Developer's Portfolio
            </p>
         </div>
      </div>

      <div className="space-y-6 max-w-lg font-mono">
        <h3 className="text-[#00ff41] text-sm uppercase tracking-widest border-b border-[#00ff41]/20 pb-2 inline-block">Portfolio Information:</h3>
        <div className="grid grid-cols-[140px_1fr] gap-y-3 text-sm">
          <span className="text-white/30 uppercase text-[10px] tracking-widest">Name:</span>
          <span className="text-white/90">Avid Kiya</span>
          <span className="text-white/30 uppercase text-[10px] tracking-widest">Based in:</span>
          <span className="text-white/90">Tehran, Iran</span>
          <span className="text-white/30 uppercase text-[10px] tracking-widest">Profession:</span>
          <span className="text-[#00ff41]">Senior AI Engineer</span>
          <span className="text-white/30 uppercase text-[10px] tracking-widest">Availability:</span>
          <span className="text-[#00ff41] flex items-center gap-2">
             From August <span className="w-1 h-3 bg-[#00ff41] animate-pulse" />
          </span>
        </div>
      </div>

      <div className="max-w-2xl space-y-6 border-l-2 border-[#00ff41]/20 pl-8">
         <h2 className="text-[#00ff41] text-xl font-bold uppercase tracking-tight">Welcome to Avid Kiya's Developer Portfolio!</h2>
         <p className="text-white/50 leading-relaxed text-sm md:text-base font-mono">
            Exploring the boundaries of artificial intelligence and scalable backend systems. 
            I build high-performance architectures, integrate large language models, 
            and design intuitive technical interfaces.
         </p>
      </div>
    </div>

    <div className="relative group">
      <div className="absolute inset-0 border-2 border-[#00ff41] translate-x-4 translate-y-4 transition-transform group-hover:translate-x-0 group-hover:translate-y-0" />
      <div className="relative aspect-[4/5] bg-[#111] overflow-hidden border border-[#00ff41]/20">
         <img 
           src="/me.png" 
           alt="Avid Kiya" 
           className="w-full h-full object-cover grayscale contrast-[1.3] brightness-[1.1] dither-green opacity-80"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff41]/5 to-transparent pointer-events-none" />
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-60" />
      </div>
    </div>
  </section>
);

const ProjectCard = ({ title, category, description, metrics }: ProjectCardProps) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="border border-[#00ff41]/10 bg-[#080808] p-8 flex flex-col gap-6 group hover:border-[#00ff41]/40 transition-all shadow-2xl"
  >
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-[#00ff41] uppercase tracking-tighter">{title}</h3>
        <div className="flex gap-2">
          <span className="px-2 py-0.5 bg-[#00ff41] text-black text-[9px] font-bold uppercase">{category}</span>
          <span className="px-2 py-0.5 border border-[#00ff41]/30 text-[#00ff41] text-[9px] font-bold uppercase">Security</span>
        </div>
      </div>
      <span className="text-[10px] text-white/20 font-mono tracking-widest">2026.07</span>
    </div>
    <p className="text-white/40 text-xs font-mono leading-relaxed h-12 line-clamp-2">
      {description}
    </p>
    <div className="grid grid-cols-2 gap-4 mt-auto border-t border-[#00ff41]/5 pt-6">
       {metrics.map((m, i) => (
         <div key={i} className="bg-white/5 p-4 rounded-sm border border-white/5">
            <div className="text-[9px] text-white/20 uppercase tracking-tighter mb-1">{m.label}</div>
            <div className="text-[#00ff41] text-lg font-bold font-mono">{m.value}</div>
         </div>
       ))}
    </div>
  </motion.div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden matrix-bg selection:bg-[#00ff41] selection:text-black">
      <div className="crt-overlay" />
      <TopNav />
      <main className="pb-32">
        <Hero />
        <section id="projects" className="px-8 max-w-7xl mx-auto space-y-12">
           <div className="flex items-center gap-6">
              <h2 className="text-[#00ff41] text-xs uppercase tracking-[1em] whitespace-nowrap">Featured Projects</h2>
              <div className="w-full h-[1px] bg-[#00ff41]/10" />
           </div>
           <div className="grid md:grid-cols-2 gap-8">
              <ProjectCard 
                title="DeFiVault Protocol"
                category="AI Finance"
                description="Explore my journey as a Senior Web3 Developer specializing in blockchain technologies, DeFi protocols, and decentralized applications."
                metrics={[{label: 'TVL', value: '$2.3M'}, {label: 'APY', value: '15.6%'}]}
              />
              <ProjectCard 
                title="Neural Core API"
                category="LLM Infra"
                description="High-performance backend for real-time AI agents, managing distributed contexts and vector memory at scale."
                metrics={[{label: 'Latency', value: '12ms'}, {label: 'Req/s', value: '1.2k'}]}
              />
           </div>
        </section>
      </main>
      <footer className="px-8 py-12 border-t border-[#00ff41]/10 bg-black/50 backdrop-blur-md">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-2">
               <div className="text-[#00ff41] font-mono text-xs tracking-widest uppercase">© Avid Kiya | 2026 | v2.1.0</div>
               <div className="text-white/20 text-[9px] uppercase tracking-tighter">Handcrafted with Next.js & Framer Motion</div>
            </div>
            <div className="flex gap-8 items-center font-mono text-[10px] uppercase tracking-widest">
               <a href="https://github.com/AvidKiya" className="hover:text-[#00ff41] transition-colors">Github</a>
               <a href="https://linkedin.com/in/avidkiya" className="hover:text-[#00ff41] transition-colors">Linkedin</a>
               <a href="https://t.me/avidkiya" className="hover:text-[#00ff41] transition-colors">Telegram</a>
               <div className="flex items-center gap-2 text-[#00ff41] border border-[#00ff41]/20 px-3 py-1 ml-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse" />
                  Made In Tehran
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}
