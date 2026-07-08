'use client';

import { useEffect, useState } from 'react';

const KEY = 'kiya_offline_queue_v1';
type Queued = { url: string; method: string; headers?: Record<string,string>; body?: string; createdAt: string };

function readQueue(): Queued[] { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }
function writeQueue(q: Queued[]) { try { localStorage.setItem(KEY, JSON.stringify(q.slice(-100))); } catch {} }

export function OfflineSync() {
  const [online, setOnline] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setOnline(navigator.onLine);
    setCount(readQueue().length);

    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      const method = (init?.method || 'GET').toUpperCase();
      const isPlannerMutation = url.startsWith('/api/planner/') && ['POST','PUT','DELETE'].includes(method) && !url.includes('/sync');
      if (isPlannerMutation && !navigator.onLine) {
        const headers: Record<string,string> = {};
        if (init?.headers && !(init.headers instanceof Headers) && !Array.isArray(init.headers)) Object.assign(headers, init.headers as Record<string,string>);
        const q = readQueue();
        q.push({ url, method, headers, body: typeof init?.body === 'string' ? init.body : undefined, createdAt: new Date().toISOString() });
        writeQueue(q); setCount(q.length); setOnline(false);
        return new Response(JSON.stringify({ success: true, offline: true, queued: true }), { status: 202, headers: { 'Content-Type': 'application/json' } });
      }
      return originalFetch(input as any, init);
    };

    const flush = async () => {
      setOnline(navigator.onLine);
      const q = readQueue(); setCount(q.length);
      if (!navigator.onLine || q.length === 0) return;
      const token = localStorage.getItem('kiya_jwt') || '';
      try {
        const res = await originalFetch('/api/planner/sync', { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify({ requests: q }) });
        if (res.ok) { writeQueue([]); setCount(0); }
      } catch {}
    };
    window.addEventListener('online', flush);
    window.addEventListener('offline', () => { setOnline(false); setCount(readQueue().length); });
    flush();
    return () => { window.fetch = originalFetch; window.removeEventListener('online', flush); };
  }, []);

  if (online && count === 0) return null;
  return <div className="fixed bottom-3 inset-x-3 md:left-auto md:right-4 md:w-[360px] z-[200] glass-card !p-3 text-[12px] text-text-2 border-amber/30 bg-amber/10">{online ? `Syncing ${count} offline change(s)…` : `Offline — ${count} change(s) will sync automatically.`}</div>;
}
