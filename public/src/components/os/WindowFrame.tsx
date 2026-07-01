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
}

export const WindowFrame: React.FC<WindowFrameProps> = ({ id, title, children }) => {
  const { windows, closeApp, minimizeApp, focusApp, focusedWindow } = useOSStore();
  const win = windows[id as keyof typeof windows];

  if (!win || !win.isOpen || win.isMinimized) return null;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: 20 }}
      drag
      dragMomentum={false}
      onPointerDown={() => focusApp(id)}
      style={{ zIndex: win.zIndex }}
      className={cn(
        "absolute w-full max-w-4xl h-[70vh] bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden flex flex-col shadow-2xl",
        focusedWindow === id ? "border-[#21F1A8]/50 ring-1 ring-[#21F1A8]/20" : "opacity-80 scale-[0.98]"
      )}
    >
      {/* Window Header */}
      <div className="bg-[#121212] px-4 py-3 flex items-center justify-between cursor-move select-none border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <button onClick={() => closeApp(id)} className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all shadow-sm" />
            <button onClick={() => minimizeApp(id)} className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-110 transition-all shadow-sm" />
            <button className="w-3 h-3 rounded-full bg-[#28c840] opacity-50 cursor-not-allowed shadow-sm" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#F0EDE4]/60 ml-4">{title}</span>
        </div>
      </div>
      
      {/* Window Content */}
      <div className="flex-1 overflow-auto bg-black/20">
        {children}
      </div>
    </motion.div>
  );
};
