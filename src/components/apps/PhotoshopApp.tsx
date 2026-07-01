"use client";

import React from 'react';

const TOOLS = [
  { n: 'Select', i: 'S' },
  { n: 'Move', i: 'V' },
  { n: 'Brush', i: 'B' },
  { n: 'Pen', i: 'P' },
  { n: 'Type', i: 'T' },
  { n: 'Crop', i: 'C' },
  { n: 'Eraser', i: 'E' },
  { n: 'Gradient', i: 'G' },
];

export const PhotoshopApp = () => {
  return (
    <div className="flex h-full bg-[#2c2c2c] text-[#d4d4d4] font-mono select-none overflow-hidden">
      {/* Sidebar Toolbar */}
      <div className="w-10 border-r border-white/5 flex flex-col items-center py-4 gap-2 bg-[#333333]">
        {TOOLS.map(tool => (
          <div key={tool.n} className="w-7 h-7 flex items-center justify-center hover:bg-[#21F1A8] hover:text-black rounded transition-all cursor-pointer text-[10px] font-bold border border-white/5" title={tool.n}>
            {tool.i}
          </div>
        ))}
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 bg-[#1e1e1e] p-12 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Rulers */}
        <div className="absolute top-0 left-10 right-0 h-5 bg-[#333] border-b border-black text-[8px] flex items-center px-2 opacity-30">
          0...100...200...300...400...500...600...700...800
        </div>
        <div className="absolute top-5 left-0 bottom-0 w-5 bg-[#333] border-r border-black text-[8px] flex flex-col items-center py-2 opacity-30">
          0<br/>.<br/>1<br/>0<br/>0
        </div>

        <div className="bg-[#F0EDE4] w-[90%] max-w-2xl aspect-video shadow-2xl relative flex items-center justify-center text-black border-[12px] border-[#333]">
           <div className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Kiya Design System</div>
           <div className="text-center">
              <h2 className="text-4xl font-black mb-1 italic">CREATIVE</h2>
              <div className="h-1 w-24 bg-[#21F1A8] mx-auto mb-4" />
              <p className="text-[10px] uppercase tracking-[0.5em] font-bold">Avid Kiya Portfolio</p>
           </div>
        </div>
      </div>

      {/* Right Panels */}
      <div className="w-56 border-l border-white/5 bg-[#333333] flex flex-col text-[10px] font-bold">
        <div className="p-2 border-b border-white/5 uppercase bg-[#252525] tracking-widest text-[#21F1A8]">Layers</div>
        <div className="flex-1 p-3 space-y-2 overflow-auto">
          {['Text Layer', 'Highlight', 'Main Object', 'Background Color', 'Noise Texture'].map((layer, i) => (
            <div key={layer} className={`flex items-center gap-3 p-2 rounded ${i === 0 ? 'bg-[#444] border border-white/10' : 'opacity-40 hover:opacity-100 hover:bg-[#3d3d3d]'} transition-all`}>
              <div className="w-4 h-4 bg-[#555] rounded-sm" />
              <span className="truncate uppercase">{layer}</span>
              <div className="ml-auto opacity-30">👁</div>
            </div>
          ))}
        </div>
        <div className="p-2 border-t border-white/5 uppercase bg-[#252525] tracking-widest text-[#21F1A8]">Info</div>
        <div className="p-4 space-y-2 opacity-50 font-mono text-[9px]">
          <div>X: 1920.00 px</div>
          <div>Y: 1080.00 px</div>
          <div>RGB: 33, 241, 168</div>
        </div>
      </div>
    </div>
  );
};
