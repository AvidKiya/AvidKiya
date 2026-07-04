'use client';

export default function BackgroundLayers() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Grid */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      {/* Gradient glow top-right */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)' }} />
      {/* Gradient glow bottom-left */}
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, var(--accent-emerald) 0%, transparent 70%)' }} />
    </div>
  );
}
