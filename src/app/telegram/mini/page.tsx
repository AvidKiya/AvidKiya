'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass';
import { Brain, CheckSquare, Target, Send, KeyRound } from 'lucide-react';

type Task = { id:string; title:string; status:string; priority?:string };
type Goal = { id:string; title:string; progress?:number };

function tg() {
  if (typeof window === 'undefined') return null;
  return (window as any).Telegram?.WebApp || null;
}

export default function TelegramMiniAppPage() {
  const [license, setLicense] = useState('');
  const [token, setToken] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [capture, setCapture] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    tg()?.ready?.();
    const savedToken = localStorage.getItem('kiya_jwt') || '';
    const savedLicense = localStorage.getItem('kiya_license') || '';
    setToken(savedToken);
    setLicense(savedLicense);
  }, []);

  const auth = { Authorization: `Bearer ${token}` };
  const login = async () => {
    setStatus('Checking license…');
    const res = await fetch('/api/planner/auth/validate', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ code: license.toUpperCase() }) });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('kiya_jwt', data.data.token);
      localStorage.setItem('kiya_license', license.toUpperCase());
      localStorage.setItem('kiya_license_ok', '1');
      setToken(data.data.token);
      setStatus('Connected.');
      setTimeout(load, 100);
    } else setStatus(data.error || 'Invalid license');
  };

  const load = async () => {
    const jwt = token || localStorage.getItem('kiya_jwt') || '';
    if (!jwt) return;
    const [t, g] = await Promise.all([
      fetch('/api/planner/tasks', { headers:{ Authorization:`Bearer ${jwt}` } }).then(r=>r.json()).catch(()=>null),
      fetch('/api/planner/goals', { headers:{ Authorization:`Bearer ${jwt}` } }).then(r=>r.json()).catch(()=>null),
    ]);
    if (t?.success) setTasks(t.data || []);
    if (g?.success) setGoals(g.data || []);
  };

  const quickCapture = async () => {
    if (!capture.trim()) return;
    const res = await fetch('/api/planner/capture', { method:'POST', headers:{'Content-Type':'application/json', ...auth}, body: JSON.stringify({ text: capture }) });
    const data = await res.json();
    setStatus(data.success ? 'Captured.' : data.error || 'Failed');
    if (data.success) setCapture('');
  };

  useEffect(() => { if (token) load(); }, [token]);

  return <div className="min-h-screen max-w-md mx-auto px-4 py-5 space-y-4"><div className="text-center"><div className="w-14 h-14 mx-auto rounded-2xl bg-primary/12 text-primary flex items-center justify-center mb-3"><Brain size={26}/></div><h1 className="text-2xl font-black">KIYA Mini App</h1><p className="text-text-3 text-sm">Telegram-ready quick dashboard</p></div>{!token && <GlassCard className="!p-4 space-y-3"><label className="text-sm text-text-3">License</label><div className="relative"><KeyRound size={15} className="absolute left-3 top-3 text-text-3"/><input value={license} onChange={e=>setLicense(e.target.value)} placeholder="KIYA-XXXX-XXXX-XXXX" className="glass-input !ps-9 font-mono uppercase" dir="ltr"/></div><button onClick={login} className="glass-btn-primary w-full py-3">Connect</button></GlassCard>}<GlassCard className="!p-4 space-y-3"><div className="font-bold flex items-center gap-2"><Send size={16}/> Quick Capture</div><textarea value={capture} onChange={e=>setCapture(e.target.value)} rows={3} className="glass-input resize-none" placeholder="Write anything…"/><button onClick={quickCapture} disabled={!token} className="glass-btn-primary w-full py-3 disabled:opacity-50">Save</button>{status && <div className="text-xs text-text-3">{status}</div>}</GlassCard><div className="grid grid-cols-2 gap-3"><GlassCard className="!p-4"><div className="flex items-center gap-2 text-sm font-bold mb-2"><CheckSquare size={15}/> Tasks</div><div className="text-3xl font-black">{tasks.length}</div><div className="text-xs text-text-3">{tasks.filter(t=>t.status==='done'||t.status==='completed').length} done</div></GlassCard><GlassCard className="!p-4"><div className="flex items-center gap-2 text-sm font-bold mb-2"><Target size={15}/> Goals</div><div className="text-3xl font-black">{goals.length}</div><div className="text-xs text-text-3">active goals</div></GlassCard></div><GlassCard className="!p-4"><div className="font-bold mb-2">Open tasks</div><div className="space-y-2 text-sm">{tasks.filter(t=>t.status!=='done'&&t.status!=='completed').slice(0,5).map(t=><div key={t.id} className="flex justify-between border-b border-glass-border/60 pb-2"><span>{t.title}</span><span className="text-text-3">{t.priority}</span></div>)}{tasks.length===0 && <div className="text-text-3">No tasks yet.</div>}</div></GlassCard></div>;
}
