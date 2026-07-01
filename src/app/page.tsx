"use client";

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAudio } from '../hooks/useAudio';
import { AdminPanel } from '../components/AdminPanel';
import { GithubRepos } from '../components/GithubRepos';

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
  const { playHover, playClick } = useAudio();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  
  const [siteData, setSiteData] = useState({
    name: "AVID KIYA",
    title: "Senior AI Engineer",
    bio: "Architecting high-performance systems with Python and Node.js. Obsessed with clean code and distributed intelligence."
  });

  useEffect(() => {
    const saved = localStorage.getItem('kiya_site_data');
    if (saved) setSiteData(JSON.parse(saved));
  }, []);

  return (
    <div className="min-h-screen relative selection:bg-[#00FF41] selection:text-black overflow-x-hidden">
      <div className="mesh-gradient" />
      <AdminPanel />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-12 py-8 flex justify-between items-center mix-blend-difference">
         <div className="font-black text-xl tracking-tighter hover:scale-110 transition-transform cursor-pointer" onMouseEnter={playHover}>AK.</div>
         <div className="flex gap-12 text-[10px] uppercase font-bold tracking-[0.4em]">
            <a href="#work" className="hover:text-[#00FF41] transition-colors" onMouseEnter={playHover}>Work</a>
            <a href="#about" className="hover:text-[#00FF41] transition-colors" onMouseEnter={playHover}>About</a>
            <button onClick={() => window.print()} className="no-print opacity-40 hover:opacity-100">PRINT</button>
         </div>
      </nav>

      <main className="relative pt-40">
        
        {/* Huge Hero Section */}
        <section className="px-12 mb-60">
           <motion.div 
             initial={{ opacity: 0, y: 100 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
             className="space-y-4"
           >
              <pre className="ascii-header text-[#00FF41] text-[6px] md:text-xs no-print">
                {ASCII_BANNER}
              </pre>
              <h1 className="text-huge uppercase mt-12">{siteData.name.split(' ')[0]}<br/>{siteData.name.split(' ')[1]}</h1>
              <div className="flex justify-between items-end mt-12">
                 <p className="max-w-md text-white/40 font-mono text-sm leading-relaxed italic">
                   {siteData.bio}
                 </p>
                 <div className="text-right space-y-2">
                    <div className="text-[#00FF41] text-xs font-black uppercase tracking-widest">Available // 2026</div>
                    <div className="text-white/20 text-[9px] uppercase font-bold tracking-widest">TEHRAN_TIME {new Date().toLocaleTimeString()}</div>
                 </div>
              </div>
           </motion.div>
        </section>

        {/* Video / Visual Section */}
        <section className="px-6 mb-60 h-[80vh] relative group">
           <div className="absolute inset-0 bg-[#00FF41]/5 rounded-[3rem] overflow-hidden border border-white/5">
              <video 
                autoPlay loop muted playsInline 
                className="w-full h-full object-cover grayscale brightness-50 opacity-40 group-hover:scale-105 transition-transform duration-[2s]"
              >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-circuit-board-details-4431-large.mp4" type="video/mp4" />
              </video>
           </div>
           <div className="relative h-full flex flex-col justify-center items-center text-center p-12">
              <h2 className="text-4xl font-black uppercase tracking-[0.5em] mb-4">Engineering Reality</h2>
              <div className="w-24 h-1 bg-[#00FF41]" />
           </div>
        </section>

        {/* GitHub Work */}
        <section id="work" className="px-12 mb-60 space-y-20">
           <div className="flex justify-between items-center border-b border-white/10 pb-8">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Selected Artifacts</h2>
              <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-[#00FF41]">Code_Base</span>
           </div>
           <GithubRepos username="AvidKiya" />
        </section>

        {/* Final CTA */}
        <section className="px-12 py-60 text-center space-y-12">
           <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-tight">Ready to build<br/>the future?</h2>
           <a 
             href="mailto:AvidKiya@gmail.com" 
             onMouseEnter={playHover}
             onClick={playClick}
             className="inline-block px-12 py-6 border-2 border-white hover:bg-[#00FF41] hover:border-[#00FF41] hover:text-black transition-all rounded-full text-xs font-black uppercase tracking-[0.5em]"
           >
             Initialize Protocol
           </a>
        </section>
      </main>

      <footer className="px-12 py-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 font-mono text-[9px] uppercase tracking-[0.3em] text-white/20">
         <div>© 2026 AvidDevHub // Optimized for Performance</div>
         <div className="flex gap-12">
            <a href="https://github.com/AvidKiya" onMouseEnter={playHover} className="hover:text-white transition-colors">GitHub</a>
            <a href="https://linkedin.com/in/avidkiya" onMouseEnter={playHover} className="hover:text-white transition-colors">LinkedIn</a>
            <a href="https://t.me/avidkiya" onMouseEnter={playHover} className="hover:text-white transition-colors">Telegram</a>
         </div>
      </footer>
    </div>
  );
}
