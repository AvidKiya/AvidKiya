"use client";

import React, { useState, useEffect } from 'react';
import { useOSStore } from '@/store/os-store';
import { WindowFrame } from './WindowFrame';
import { TerminalApp } from '../apps/TerminalApp';
import { PhotoshopApp } from '../apps/PhotoshopApp';
import { CameraApp } from '../apps/CameraApp';
import { motion, AnimatePresence } from 'framer-motion';

const IconTerminal = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
);
const IconDesign = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
);
const IconCamera = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
);
const IconFolder = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
);

const DesktopIcon = ({ id, label, icon: Icon }: { id: any, label: string, icon: any }) => {
  const openApp = useOSStore((state) => state.openApp);
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => openApp(id)}
      className="flex flex-col items-center gap-3 cursor-pointer group w-24"
    >
      <div className="w-16 h-16 bg-[#171717] text-[#21F1A8] flex items-center justify-center rounded-xl border border-[#21F1A8]/10 group-hover:border-[#21F1A8] group-hover:shadow-[0_0_15px_rgba(33,241,168,0.3)] transition-all duration-300">
        <Icon />
      </div>
      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#171717] dark:text-[#F0EDE4] bg-[#F0EDE4]/80 dark:bg-[#171717]/80 px-2 py-0.5 rounded shadow-sm">
        {label}
      </span>
    </motion.div>
  );
};

export const Desktop = () => {
  const { windows, theme, toggleTheme } = useOSStore();
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    setTimeout(() => setBooting(false), 1500);
  }, []);

  return (
    <div className={`h-screen w-screen relative overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'dark bg-[#0a0a0a]' : 'bg-[#F0EDE4]'}`}>
      
      {/* Boot Screen */}
      <AnimatePresence>
        {booting && (
          <motion.div 
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[10000] bg-black flex flex-col items-center justify-center text-[#21F1A8] font-mono"
          >
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-xl mb-4"
            >
              INITIALIZING KIYA OS...
            </motion.div>
            <div className="w-64 h-1 bg-[#21F1A8]/20 relative overflow-hidden">
               <motion.div 
                 initial={{ left: '-100%' }} 
                 animate={{ left: '100%' }} 
                 transition={{ repeat: Infinity, duration: 1 }}
                 className="absolute top-0 bottom-0 w-1/2 bg-[#21F1A8]"
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none grid grid-cols-12 grid-rows-12 gap-1 px-4 py-4">
        {Array.from({ length: 144 }).map((_, i) => (
          <div key={i} className="border border-current rounded-sm aspect-square" />
        ))}
      </div>

      {/* Header / Top Bar */}
      <header className="absolute top-0 left-0 right-0 h-10 border-b border-[#171717]/10 dark:border-[#F0EDE4]/10 flex items-center justify-between px-6 z-50 backdrop-blur-md">
         <div className="flex items-center gap-4 text-[11px] font-bold tracking-widest text-[#171717] dark:text-[#F0EDE4]">
            <span>AVID KIYA</span>
            <span className="opacity-30">/</span>
            <span className="text-[#21F1A8]">OS v2.0</span>
         </div>
         <div className="flex items-center gap-6 text-[11px] font-mono opacity-60">
            <span>CPU 12%</span>
            <span>MEM 2.4GB</span>
            <button onClick={toggleTheme} className="hover:text-[#21F1A8] transition-colors">{theme.toUpperCase()}</button>
         </div>
      </header>

      {/* Desktop Content */}
      <main className="pt-16 px-10 grid grid-cols-1 md:grid-cols-[200px_1fr] h-full">
        {/* Icons Sidebar */}
        <div className="flex flex-col gap-8">
          <DesktopIcon id="terminal" label="Shell" icon={IconTerminal} />
          <DesktopIcon id="photoshop" label="Creative" icon={IconDesign} />
          <DesktopIcon id="camera" label="Lens" icon={IconCamera} />
          <DesktopIcon id="projects" label="Vault" icon={IconFolder} />
        </div>

        {/* Windows Area */}
        <div className="relative">
          <WindowFrame id="terminal" title="Terminal - zsh">
            <TerminalApp />
          </WindowFrame>
          
          <WindowFrame id="photoshop" title="Photoshop CC - Workstation">
            <PhotoshopApp />
          </WindowFrame>

          <WindowFrame id="camera" title="Kiya Lens - DSLR Preview">
            <CameraApp />
          </WindowFrame>
        </div>
      </main>

      {/* Footer / Taskbar */}
      <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-fit h-14 bg-[#171717] rounded-2xl border border-[#21F1A8]/20 flex items-center px-4 gap-4 z-[9999] shadow-2xl">
         <div className="w-10 h-10 bg-[#21F1A8] rounded-lg flex items-center justify-center text-black font-black text-sm">AK</div>
         <div className="h-6 w-[1px] bg-[#F0EDE4]/10 mx-2" />
         <div className="flex gap-2">
           {Object.values(windows).filter(w => w.isOpen).map(w => (
             <motion.button 
               key={w.id} 
               layoutId={w.id}
               className={`px-4 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${w.isMinimized ? 'bg-white/5 text-white/30' : 'bg-[#21F1A8] text-black'}`}
             >
               {w.id}
             </motion.button>
           ))}
         </div>
         <div className="ml-auto pr-2 text-[10px] font-mono text-[#F0EDE4]/40">
           {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
         </div>
      </footer>
    </div>
  );
};
