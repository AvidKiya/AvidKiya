'use client';

import { useEffect, useState } from 'react';

export function PushRegister() {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return;
    if (Notification.permission === 'default' && localStorage.getItem('kiya_push_prompted') !== '1') {
      const t = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(t);
    }
  }, []);

  const enable = async () => {
    localStorage.setItem('kiya_push_prompted', '1');
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') { setVisible(false); return; }
    setStatus('Push enabled locally.');
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        const token = localStorage.getItem('kiya_jwt') || '';
        await fetch('/api/push/subscriptions', { method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body: JSON.stringify({ subscription: sub.toJSON() }) });
      }
    } catch {}
    setTimeout(() => setVisible(false), 1500);
  };

  if (!visible) return null;
  return <div className="fixed bottom-16 inset-x-3 md:left-auto md:right-4 md:w-[360px] z-[210] glass-card !p-4 text-[12px]"><div className="font-bold mb-1">Enable notifications?</div><p className="text-text-3 mb-3">Get KIYA reminders and reports in your browser.</p><div className="flex gap-2"><button onClick={enable} className="glass-btn-primary px-3 py-2">Enable</button><button onClick={()=>{localStorage.setItem('kiya_push_prompted','1');setVisible(false)}} className="glass-btn px-3 py-2">Later</button></div>{status && <div className="text-emerald mt-2">{status}</div>}</div>;
}
