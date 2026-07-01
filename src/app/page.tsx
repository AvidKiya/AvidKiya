"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { PixelName } from '../components/PixelName';

const NavLink = ({ href, index, children }: { href: string; index: string; children: React.ReactNode }) => (
  <a href={href} className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/60 hover:text-primary transition-all">
    <span className="text-primary font-bold">{index}.</span>
    <span className="group-hover:translate-x-1 transition-transform duration-200">{children}</span>
  </a>
);

export default function Home() {
  return (
    <div className="min-h-screen relative crt matrix-grid overflow-x-hidden selection:bg-primary selection:text-black">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 border-b border-primary/20 backdrop-blur-md px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center gap-1 font-mono text-sm glow-text">
            <span className="opacity-50">&gt;.</span>
            <span className="font-black">avid.kiya</span>
            <span className="text-white/30">@</span>
            <span>portfolio:~$</span>
            <span className="w-2 h-4 bg-primary animate-pulse ml-2" />
          </div>
          
          <div className="flex flex-wrap gap-8 mt-6 md:mt-0">
            <NavLink href="#about" index="0">About</NavLink>
            <NavLink href="#projects" index="1">Projects</NavLink>
            <NavLink href="#experience" index="2">Experience</NavLink>
            <NavLink href="#contact" index="3">Contact</NavLink>
            <div className="flex items-center gap-2 ml-4">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#00FF41] animate-pulse" />
              <span className="text-primary text-[9px] uppercase tracking-widest font-black">Available</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 pt-40 pb-20">
        <section id="about" className="grid md:grid-cols-[1fr_400px] gap-20 items-start">
          <div className="space-y-16">
            {/* The Pixel Header Box */}
            <div className="pixel-header-box p-12 md:p-16">
               <PixelName />
               <p className="mt-8 text-center text-[10px] md:text-xs uppercase tracking-[0.7em] text-primary/70 font-mono italic">
                 Senior AI & Backend Developer
               </p>
            </div>

            {/* Information Grid */}
            <div className="space-y-8 font-mono">
              <div className="flex items-center gap-4">
                 <h3 className="text-primary text-xs uppercase tracking-[0.5em] font-black">Portfolio Information:</h3>
                 <div className="flex-1 h-[1px] bg-primary/20" />
              </div>
              <div className="grid grid-cols-[160px_1fr] gap-y-4 text-sm">
                <span className="text-white/20 uppercase text-[9px] tracking-widest self-center">Name:</span>
                <span className="text-white/90 font-bold">Avid Kiya</span>
                
                <span className="text-white/20 uppercase text-[9px] tracking-widest self-center">Location:</span>
                <span className="text-white/90">Tehran, Iran</span>
                
                <span className="text-white/20 uppercase text-[9px] tracking-widest self-center">Profession:</span>
                <span className="text-primary font-black uppercase">Senior AI Engineer</span>
                
                <span className="text-white/20 uppercase text-[9px] tracking-widest self-center">Status:</span>
                <span className="text-primary flex items-center gap-2 font-bold uppercase italic">
                   Active Intelligence <span className="w-4 h-1 bg-primary animate-bounce" />
                </span>
              </div>
            </div>

            <div className="max-w-2xl border-l-[3px] border-primary/30 pl-10 space-y-6 py-4 bg-primary/5">
               <h2 className="text-primary text-2xl font-black uppercase tracking-tight italic">Welcome to the Nexus.</h2>
               <p className="text-white/50 leading-relaxed text-base font-mono">
                  I specialize in architecting high-performance backend systems and integrating
                  state-of-the-art AI models into production environments. My work sits at the
                  intersection of complex data engineering and elegant user experiences.
               </p>
            </div>
          </div>

          {/* Portrait Container */}
          <div className="relative group">
            <div className="absolute inset-0 border-2 border-primary translate-x-6 translate-y-6 transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0" />
            <div className="relative aspect-[3/4] bg-black border-2 border-primary/50 overflow-hidden shadow-2xl">
               <img 
                 src="/me.png" 
                 alt="Avid Kiya" 
                 className="w-full h-full object-cover dither-effect opacity-80 mix-blend-screen"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
               {/* Decorative overlays */}
               <div className="absolute top-4 right-4 text-primary text-[8px] font-black uppercase tracking-tighter text-right">
                  Scan: 042<br/>Res: 1080p
               </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="mt-40 space-y-16">
           <div className="flex items-center gap-6">
              <h2 className="text-primary text-sm uppercase tracking-[1.5em] whitespace-nowrap font-black">Featured Projects</h2>
              <div className="w-full h-[2px] bg-primary/10" />
           </div>

           <div className="grid md:grid-cols-2 gap-10">
              <ProjectBox 
                title="KIYA Neural Core"
                tag="AI Infrastructure"
                desc="Scalable LLM serving layer with real-time context management and sub-100ms latency for agentic workflows."
                metrics={[{l: 'LATENCY', v: '45ms'}, {l: 'UPTIME', v: '99.9%'}]}
              />
              <ProjectBox 
                title="Titan Protocol"
                tag="Backend / Security"
                desc="Distributed security architecture for decentralized networks, utilizing zero-knowledge proofs for identity verification."
                metrics={[{l: 'USERS', v: '12K+'}, {l: 'VERIFIED', v: '1.2M'}]}
              />
           </div>
        </section>
      </main>

      {/* Industrial Footer */}
      <footer className="bg-black/50 border-t border-primary/20 mt-20 py-20 px-8">
         <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
               <div className="text-primary font-black text-lg tracking-widest italic">AVID KIYA // 2026</div>
               <div className="text-white/20 text-[9px] uppercase tracking-[0.5em] font-mono">
                 &gt; Handcrafted with Code and Passion<br/>
                 &gt; Version 3.0.0 Stable // Port: 443
               </div>
            </div>
            
            <div className="flex flex-wrap gap-12 md:justify-end items-center">
               <SocialLink href="https://github.com/AvidKiya">Github</SocialLink>
               <SocialLink href="https://linkedin.com/in/avidkiya">LinkedIn</SocialLink>
               <SocialLink href="https://t.me/avidkiya">Telegram</SocialLink>
               <div className="px-6 py-2 border border-primary text-primary text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(0,255,65,0.2)]">
                  Tehran Hub
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}

const ProjectBox = ({ title, tag, desc, metrics }: { title: string; tag: string; desc: string; metrics: any[] }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glow-border bg-black/40 p-10 flex flex-col gap-8 group hover:bg-primary/5 transition-all duration-300"
  >
    <div className="flex justify-between items-start">
      <div className="space-y-3">
        <h3 className="text-3xl font-black text-primary uppercase tracking-tighter">{title}</h3>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-primary text-black text-[9px] font-black uppercase tracking-widest">{tag}</span>
          <span className="px-3 py-1 border border-primary/40 text-primary text-[9px] font-black uppercase tracking-widest italic">Encrypted</span>
        </div>
      </div>
      <span className="text-[10px] text-white/10 font-mono tracking-widest group-hover:text-primary/40 transition-colors">07.2026</span>
    </div>

    <p className="text-white/40 text-xs font-mono leading-relaxed h-12">
      {desc}
    </p>

    <div className="grid grid-cols-2 gap-6 mt-4">
       {metrics.map((m, i) => (
         <div key={i} className="bg-white/5 p-6 border border-white/5 group-hover:border-primary/20 transition-all">
            <div className="text-[8px] text-white/20 uppercase tracking-widest mb-1 font-black">{m.l}</div>
            <div className="text-primary text-xl font-black font-mono">{m.v}</div>
         </div>
       ))}
    </div>
  </motion.div>
);

const SocialLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-primary transition-all relative group">
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300" />
  </a>
);
