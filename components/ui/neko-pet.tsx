'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    createNeko?: (options?: Record<string, unknown>) => any;
    neko?: any;
  }
}

function meow() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(740, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.34);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.055, ctx.currentTime + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.38);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
    setTimeout(() => ctx.close?.(), 520);
  } catch {}
}

function loadScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.createNeko) return resolve();
    const existing = document.querySelector<HTMLScriptElement>('script[data-neko-pet="true"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = '/neko-pet.js';
    script.async = true;
    script.dataset.nekoPet = 'true';
    script.onload = () => resolve();
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export function NekoPet() {
  const nekoRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    let cleanupClick: (() => void) | null = null;

    loadScript().then(() => {
      if (cancelled || !window.createNeko) return;
      if (window.neko?.destroy) window.neko.destroy();
      const neko = window.createNeko({
        speed: 20,
        fps: 90,
        behaviorMode: 0,
        idleThreshold: 6,
        allowBehaviorChange: true,
      });
      nekoRef.current = neko;
      window.neko = neko;
      if (neko.element) {
        neko.element.classList.add('ak-neko-pet');
        neko.element.setAttribute('title', 'Neko pet — برای تغییر رفتار کلیک کن');
        neko.element.style.transform = 'scale(1.75)';
        neko.element.style.transformOrigin = '50% 100%';
        const onClick = () => meow();
        neko.element.addEventListener('mousedown', onClick);
        cleanupClick = () => neko.element?.removeEventListener('mousedown', onClick);
      }
    }).catch(() => {});

    return () => {
      cancelled = true;
      cleanupClick?.();
      if (nekoRef.current?.destroy) nekoRef.current.destroy();
      if (window.neko === nekoRef.current) window.neko = undefined;
    };
  }, []);

  return null;
}
