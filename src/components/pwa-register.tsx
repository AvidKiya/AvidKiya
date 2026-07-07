'use client';
import { useEffect } from 'react';

// Registers the PWA service worker (public/sw.js).
// Silent no-op on unsupported browsers or during SSR.
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV !== 'production') return;

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Silent fail — offline/PWA support is a progressive enhancement
      });
    };

    window.addEventListener('load', register);
    return () => window.removeEventListener('load', register);
  }, []);

  return null;
}
