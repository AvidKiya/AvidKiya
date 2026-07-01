"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useOSStore } from '@/store/os-store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface WindowFrameProps {
  id: any;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({ id, title, children, icon }) => {
  const { windows, closeApp, minimizeApp, focusApp, focusedWindow } = useOSStore();
  const win = windows[id as keyof typeof windows];

  if (!win || !win.isOpen || win.isMinimized) return null;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      drag
      dragMomentum={false}
      onPointerDown={() => focusApp(id)}
      style={{ zIndex: win.zIndex }}
      className={cn(
        "absolute min-w-[300px] min-h-[200px] bg-background border-2 border-primary overflow-hidden flex flex-col",
        focusedWindow === id ? "shadow-[0_0_20px_rgba(33,241,168,0.3)]" : "opacity-90"
      )}
    >
      {/* Window Header */}
      <div className="bg-primary text-primary-foreground px-3 py-1 flex items-center justify-between cursor-move select-none font-mono text-sm">
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => minimizeApp(id)} className="hover:bg-primary-foreground/20 px-2">_</button>
          <button onClick={() => closeApp(id)} className="hover:bg-red-500 hover:text-white px-2">X</button>
        </div>
      </div>
      
      {/* Window Content */}
      <div className="flex-1 overflow-auto relative">
        {children}
      </div>
    </motion.div>
  );
};
