"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CameraApp = () => {
  const [isShuttering, setIsShuttering] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);

  const photos = [
    'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=1200'
  ];

  const takePhoto = () => {
    setIsShuttering(true);
    setTimeout(() => {
      setIsShuttering(false);
      setCurrentPhoto((prev) => (prev + 1) % photos.length);
    }, 100);
  };

  return (
    <div className="h-full bg-black flex flex-col items-center justify-center relative overflow-hidden group font-mono">
      {/* Viewfinder UI */}
      <div className="absolute inset-0 border-[40px] border-black/80 pointer-events-none z-20 flex flex-col justify-between p-8">
        <div className="flex justify-between items-start text-[#21F1A8] text-[10px] uppercase font-bold tracking-widest opacity-60">
           <div className="flex flex-col gap-1">
              <span>AF-S</span>
              <span>RAW 14bit</span>
           </div>
           <div className="text-right">
              <span>999+</span>
              <div className="w-12 h-4 border border-[#21F1A8] mt-1 relative overflow-hidden">
                <div className="absolute top-0 bottom-0 left-0 w-[80%] bg-[#21F1A8]" />
              </div>
           </div>
        </div>
        
        <div className="flex justify-between items-end text-[#21F1A8] text-xs font-bold tracking-[0.2em] mb-4">
           <span>1/250</span>
           <span className="text-2xl">F 2.8</span>
           <span>ISO 100</span>
        </div>
      </div>

      {/* Shutter Animation */}
      <AnimatePresence>
        {isShuttering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white z-[100]"
          />
        )}
      </AnimatePresence>

      {/* Central Viewport */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none z-10" 
             style={{ backgroundImage: 'radial-gradient(circle, transparent 30%, black 100%)' }} />
        
        <motion.div 
          key={currentPhoto}
          initial={{ scale: 1.1, filter: 'blur(20px)' }}
          animate={{ scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${photos[currentPhoto]}')` }}
        />
        
        {/* Focusing Marks */}
        <div className="absolute w-64 h-64 border border-white/10 flex items-center justify-center pointer-events-none">
           <div className="w-4 h-4 border-t border-l border-[#21F1A8] absolute top-0 left-0" />
           <div className="w-4 h-4 border-t border-r border-[#21F1A8] absolute top-0 right-0" />
           <div className="w-4 h-4 border-b border-l border-[#21F1A8] absolute bottom-0 left-0" />
           <div className="w-4 h-4 border-b border-r border-[#21F1A8] absolute bottom-0 right-0" />
           <div className="w-1 h-1 bg-red-500 rounded-full" />
        </div>
      </div>

      {/* Trigger Button Overlay */}
      <div className="absolute inset-0 z-30 cursor-pointer" onClick={takePhoto} />

      <div className="absolute bottom-14 z-40 text-white/20 text-[8px] uppercase tracking-[1em]">Click anywhere to capture</div>
    </div>
  );
};
