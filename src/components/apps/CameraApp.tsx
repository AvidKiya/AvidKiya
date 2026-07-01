"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CameraApp = () => {
  const [isShuttering, setIsShuttering] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);

  const takePhoto = () => {
    setIsShuttering(true);
    setTimeout(() => {
      setIsShuttering(false);
      setCurrentPhoto((prev) => (prev + 1) % 3);
    }, 150);
  };

  return (
    <div className="h-full bg-black flex items-center justify-center relative overflow-hidden group">
      {/* Shutter Animation */}
      <AnimatePresence>
        {isShuttering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white z-50"
          />
        )}
      </AnimatePresence>

      {/* Lens Body */}
      <div className="relative w-80 h-80 rounded-full border-8 border-[#333] shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center bg-[#111] overflow-hidden">
        {/* Inner Lens Glass */}
        <div className="w-[90%] h-[90%] rounded-full bg-[#0a0a0a] relative flex items-center justify-center overflow-hidden">
           <motion.div 
             key={currentPhoto}
             initial={{ scale: 1.2, filter: 'blur(10px)' }}
             animate={{ scale: 1, filter: 'blur(0px)' }}
             className="w-full h-full bg-cover bg-center opacity-40"
             style={{ backgroundImage: `url('https://picsum.photos/id/${10 + currentPhoto}/800/800')` }}
           />
           <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent pointer-events-none" />
        </div>
        
        {/* Aperture UI */}
        <div className="absolute inset-0 border-[40px] border-[#222]/80 rounded-full pointer-events-none" />
      </div>

      {/* Camera UI Controls */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-8 text-white/50 text-[10px] uppercase font-mono tracking-widest">
          <div>ISO 100</div>
          <button 
            onClick={takePhoto}
            className="w-12 h-12 rounded-full border-4 border-white/20 flex items-center justify-center hover:border-primary hover:text-primary transition-colors bg-white/5"
          >
            ●
          </button>
          <div>F 2.8</div>
      </div>
    </div>
  );
};
