"use client";

import React from 'react';

// This is a component that renders "AVID KIYA" in a pixelated/LED style using SVG
export const PixelName = () => {
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 400 60" className="w-full h-auto max-w-[600px] fill-primary glow-text">
        {/* Simple pixel-inspired font for AVID KIYA */}
        <text x="50%" y="45" textAnchor="middle" fontSize="60" fontWeight="900" letterSpacing="5">
          AVID KIYA
        </text>
      </svg>
      <div className="w-full h-[2px] bg-primary mt-4 opacity-50 shadow-[0_0_10px_#00FF41]" />
    </div>
  );
};
