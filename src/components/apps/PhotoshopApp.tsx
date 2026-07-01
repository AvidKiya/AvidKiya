"use client";

import React from 'react';

const TOOLS = ['Move', 'Brush', 'Pen', 'Text', 'Crop', 'Select', 'Eraser'];

export const PhotoshopApp = () => {
  return (
    <div className="flex h-full bg-[#1e1e1e] text-[#d4d4d4] font-mono select-none">
      {/* Sidebar Toolbar */}
      <div className="w-12 border-r border-black flex flex-col items-center py-4 gap-4 bg-[#252526]">
        {TOOLS.map(tool => (
          <div key={tool} className="w-8 h-8 flex items-center justify-center hover:bg-primary hover:text-black cursor-pointer border border-transparent hover:border-white text-[10px]" title={tool}>
            {tool[0]}
          </div>
        ))}
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 bg-black p-8 flex items-center justify-center overflow-hidden">
        <div className="bg-white w-[80%] aspect-[4/3] shadow-2xl relative overflow-hidden flex items-center justify-center text-black">
           <div className="absolute top-2 left-2 text-[10px] opacity-20 uppercase font-bold tracking-[0.2em]">Graphic Design Showcase</div>
           <div className="text-center p-4">
              <h2 className="text-2xl font-bold mb-2">Portfolio Artwork</h2>
              <p className="text-xs opacity-60">Creative visual design by Avid Kiya</p>
           </div>
           {/* Add your project images here */}
        </div>
      </div>

      {/* Right Panels */}
      <div className="w-48 border-l border-black bg-[#252526] flex flex-col text-[11px]">
        <div className="p-2 border-b border-black uppercase bg-[#333333]">Layers</div>
        <div className="flex-1 p-2 space-y-1 overflow-auto">
          {['Background', 'Main Shape', 'Text Layer', 'Adjustment Layer'].map(layer => (
            <div key={layer} className="flex items-center gap-2 p-1 hover:bg-[#37373d]">
              <div className="w-3 h-3 border border-white/20"></div>
              {layer}
            </div>
          ))}
        </div>
        <div className="p-2 border-t border-black uppercase bg-[#333333]">Properties</div>
        <div className="h-32 p-2 opacity-50">
          W: 1920px<br/>H: 1080px<br/>DPI: 300
        </div>
      </div>
    </div>
  );
};
