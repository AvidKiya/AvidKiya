'use client';

import { useEffect, useMemo, useState } from 'react';
import { GlassCard } from '@/components/ui/glass';

type ReportPeriod = 'daily' | 'weekly' | 'monthly';
const periodLabels = { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };
const authHeader = () => ({ Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('kiya_jwt') || '' : ''}` });

export default function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>('weekly');
  const [tasks, setTasks] = useState<any[]>([]);
  const [habits, setHabits] = useState<any[]>([]);
  const [habitLogs, setHabitLogs] = useState<any[]>([]);
  const [health, setHealth] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/planner/tasks', { headers: authHeader() }).then(r=>r.json()).catch(()=>null),
      fetch('/api/planner/habits', { headers: authHeader() }).then(r=>r.json()).catch(()=>null),
      fetch('/api/planner/health', { headers: authHeader() }).then(r=>r.json()).catch(()=>null),
    ]).then(([t,h,he]) => { if(t?.success) setTasks(t.data||[]); if(h?.success){ setHabits(h.data.habits||[]); setHabitLogs(h.data.logs||[]); } if(he?.success) setHealth(he.data.logs||[]); });
  }, []);

  const data = useMemo(() => {
    const days = period === 'daily' ? 1 : period === 'weekly' ? 7 : 30;
    const since = Date.now() - days * 86400000;
    const recentTasks = tasks.filter(t => new Date(t.updatedAt || t.createdAt || Date.now()).getTime() >= since);
    const completedTasks = tasks.filter(t => t.status === 'done' || t.status === 'completed').length;
    const recentHabitLogs = habitLogs.filter(l => new Date(l.date || Date.now()).getTime() >= since);
    const completedHabitLogs = recentHabitLogs.filter(l => l.completed).length;
    const recentHealth = health.filter(l => new Date(l.date || Date.now()).getTime() >= since);
    const avg = (type:string) => { const rows=recentHealth.filter(l=>l.type===type); return rows.length ? Math.round((rows.reduce((s,l)=>s+Number(l.value||0),0)/rows.length)*10)/10 : 0; };
    return { tasks: { completed: completedTasks, total: tasks.length, rate: tasks.length ? Math.round(completedTasks/tasks.length*100) : 0, recent: recentTasks.length }, habits: { completed: completedHabitLogs, total: recentHabitLogs.length, rate: recentHabitLogs.length ? Math.round(completedHabitLogs/recentHabitLogs.length*100) : 0, totalHabits: habits.length }, energy: { average: avg('energy') }, mood: { average: avg('mood') } };
  }, [period, tasks, habits, habitLogs, health]);

  return <div className="space-y-6"><div className="flex justify-between items-center"><h1 className="text-2xl font-bold">Reports</h1><div className="flex gap-2">{(Object.keys(periodLabels) as ReportPeriod[]).map(p=><button key={p} onClick={()=>setPeriod(p)} className={`px-4 py-2 rounded-lg transition-colors ${period===p?'bg-primary text-white':'bg-white/5 text-text-2 hover:bg-white/10'}`}>{periodLabels[p]}</button>)}</div></div><ReportCard title="Tasks" completed={data.tasks.completed} total={data.tasks.total} rate={data.tasks.rate} color="bg-primary"/><ReportCard title="Habits" completed={data.habits.completed} total={data.habits.total} rate={data.habits.rate} color="bg-green-500"/><div className="grid grid-cols-2 gap-4"><Metric title="Energy" value={data.energy.average || '—'} color="text-yellow-400"/><Metric title="Mood" value={data.mood.average || '—'} color="text-blue-400"/></div></div>;
}
function ReportCard({title, completed,total,rate,color}:{title:string;completed:number;total:number;rate:number;color:string}){return <GlassCard><h2 className="font-bold mb-4">{title}</h2><div className="flex items-center gap-4"><div className="flex-1"><div className="flex justify-between mb-2"><span className="text-sm text-text-2">Completed</span><span className="text-sm font-bold">{completed}/{total}</span></div><div className="h-3 bg-white/10 rounded-full overflow-hidden"><div className={`h-full ${color} rounded-full transition-all`} style={{width:`${rate}%`}}/></div></div><div className="text-2xl font-bold text-primary">{rate}%</div></div></GlassCard>}
function Metric({title,value,color}:{title:string;value:any;color:string}){return <GlassCard><h2 className="font-bold mb-4">{title}</h2><div className="text-center"><div className={`text-4xl font-bold ${color} mb-2`}>{value}</div><div className="text-sm text-text-2">Average</div></div></GlassCard>}
