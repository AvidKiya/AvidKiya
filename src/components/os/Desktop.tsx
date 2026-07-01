"use client";

import React, { useEffect } from 'react';
import { useOSStore } from '@/store/os-store';
import { WindowFrame } from './WindowFrame';
import { TerminalApp } from '../apps/TerminalApp';
import { PhotoshopApp } from '../apps/PhotoshopApp';
import { CameraApp } from '../apps/CameraApp';
import { motion } from 'framer-motion';

const DesktopIcon = ({ id, label, icon }: { id: any, label: string, icon: string }) => {
  const openApp = useOSStore((state) => state.openApp);
  
  return (
    <motion.div 
      whileHover={{ scale: 1.1 }}
      onDoubleClick={() => openApp(id)}
      className="flex flex-col items-center gap-2 cursor-pointer w-24 p-2 group"
    >
      <div className="w-16 h-16 bg-primary/10 border-2 border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary transition-all">
        <span className="text-2xl">{icon}</span>
      </div>
      <span className="text-[10px] uppercase font-mono bg-black/50 px-2 py-0.5 text-white">{label}</span>
    </motion.div>
  );
};

export const Desktop = () => {
  const { windows, theme, toggleTheme } = useOSStore();

  useEffect(() => {
    // Sync dark mode class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <main className="h-screen w-screen bg-background relative overflow-hidden p-6 select-none">
      {/* Background Wallpaper/Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(var(--foreground) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Grid of Icons */}
      <div className="grid grid-flow-col grid-rows-[repeat(auto-fill,120px)] gap-4">
        <DesktopIcon id="terminal" label="Terminal" icon=">_" />
        <DesktopIcon id="photoshop" label="Photoshop" icon="PS" />
        <DesktopIcon id="camera" label="Camera" icon="📷" />
        <DesktopIcon id="projects" label="Projects" icon="📂" />
      </div>

      {/* Windows Rendering */}
      <WindowFrame id="terminal" title="Terminal - KiyaOS@Bash">
        <TerminalApp />
      </WindowFrame>
      
      <WindowFrame id="photoshop" title="Photoshop CC - Portfolio.psd">
        <PhotoshopApp />
      </WindowFrame>

      <WindowFrame id="camera" title="Kiya Lens v2.0 - DSLR Mode">
        <CameraApp />
      </WindowFrame>

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/80 backdrop-blur-md border-t border-primary/20 flex items-center px-4 justify-between z-[9999]">
         <div className="flex gap-4 items-center h-full">
            <button className="bg-primary text-black px-4 h-8 font-bold text-xs uppercase hover:bg-white transition-colors" onClick={() => alert('Kiya OS v1.0.0')}>
              Kiya
            </button>
            <div className="h-4 w-[1px] bg-white/20 mx-2" />
            {/* active app indicators */}
            <div className="flex gap-2">
              {Object.values(windows).filter(w => w.isOpen).map(w => (
                <div key={w.id} className="w-8 h-8 border border-primary/40 flex items-center justify-center text-[10px] text-primary">
                  {w.id.substring(0,2).toUpperCase()}
                </div>
              ))}
            </div>
         </div>

         <div className="flex gap-4 items-center font-mono text-[11px] text-white/50">
            <button onClick={toggleTheme} className="hover:text-primary">{theme.toUpperCase()}</button>
            <span>EN</span>
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
         </div>
      </div>
    </main>
  );
};
