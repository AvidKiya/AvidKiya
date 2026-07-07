'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass';
import { EmptyState, LoadingSkeleton, ErrorState } from '@/components/ui/states';
import { AppIcon, type IconName } from '@/components/ui/icons';

interface HealthLog {
  id: string;
  type: 'sleep' | 'exercise' | 'energy' | 'mood';
  value: number;
  date: string;
  createdAt: string;
}

const healthTypes: Record<HealthLog['type'], { label: string; icon: IconName; unit: string; max: number; color: string }> = {
  sleep: { label: 'خواب', icon: 'sleep', unit: 'ساعت', max: 12, color: 'text-purple-400' },
  exercise: { label: 'ورزش', icon: 'activity', unit: 'دقیقه', max: 120, color: 'text-green-400' },
  energy: { label: 'انرژی', icon: 'zap', unit: '/10', max: 10, color: 'text-yellow-400' },
  mood: { label: 'حال', icon: 'smile', unit: '/10', max: 10, color: 'text-blue-400' },
};

export default function HealthPage() {
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLog, setNewLog] = useState<{
    type: HealthLog['type'];
    value: string;
    date: string;
  }>({
    type: 'sleep',
    value: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      // Mock data
      const mockLogs: HealthLog[] = [];
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        mockLogs.push(
          { id: `h-${i}-1`, type: 'sleep', value: 6 + Math.random() * 3, date: dateStr, createdAt: new Date().toISOString() },
          { id: `h-${i}-2`, type: 'energy', value: 5 + Math.random() * 5, date: dateStr, createdAt: new Date().toISOString() },
          { id: `h-${i}-3`, type: 'mood', value: 5 + Math.random() * 5, date: dateStr, createdAt: new Date().toISOString() },
        );
      }
      setLogs(mockLogs);
      setLoading(false);
    } catch (err) {
      setError('خطا در بارگذاری لاگ‌ها');
      setLoading(false);
    }
  };

  const addLog = () => {
    if (!newLog.value) return;

    const log: HealthLog = {
      id: `health-${Date.now()}`,
      type: newLog.type,
      value: Number(newLog.value),
      date: newLog.date,
      createdAt: new Date().toISOString(),
    };

    setLogs((prev) => [log, ...prev]);
    setNewLog({ type: 'sleep', value: '', date: new Date().toISOString().split('T')[0] });
    setShowAddForm(false);
  };

  const deleteLog = (id: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const getWeeklyAverage = (type: HealthLog['type']) => {
    const weekLogs = logs.filter((l) => l.type === type);
    if (weekLogs.length === 0) return 0;
    const sum = weekLogs.reduce((acc, l) => acc + l.value, 0);
    return Math.round((sum / weekLogs.length) * 10) / 10;
  };

  const getLogsByType = (type: HealthLog['type']) => {
    return logs.filter((l) => l.type === type).slice(0, 7);
  };

  if (loading) return <LoadingSkeleton count={4} />;
  if (error) return <ErrorState message={error} onRetry={fetchLogs} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">سلامت</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="glass-btn-primary px-4 py-2"
        >
          + لاگ جدید
        </button>
      </div>

      {/* Weekly Averages */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.keys(healthTypes) as Array<keyof typeof healthTypes>).map((type) => (
          <GlassCard key={type}>
            <div className="text-center">
              <div className="flex justify-center mb-2"><AppIcon name={healthTypes[type].icon} size={26} className={healthTypes[type].color} /></div>
              <div className="text-sm text-text-2">{healthTypes[type].label}</div>
              <div className={`text-2xl font-bold ${healthTypes[type].color}`}>
                {getWeeklyAverage(type)}
              </div>
              <div className="text-xs text-text-3">میانگین هفتگی</div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Add Log Form */}
      {showAddForm && (
        <GlassCard>
          <div className="flex gap-4">
            <select
              value={newLog.type}
              onChange={(e) => setNewLog({ ...newLog, type: e.target.value as HealthLog['type'] })}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10"
            >
              {Object.entries(healthTypes).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <input
              type="number"
              value={newLog.value}
              onChange={(e) => setNewLog({ ...newLog, value: e.target.value })}
              placeholder={`مقدار (${healthTypes[newLog.type].unit})`}
              className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
            />
            <button onClick={addLog} className="glass-btn-primary px-4 py-2">
              افزودن
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="glass-btn px-4 py-2"
            >
              انصراف
            </button>
          </div>
        </GlassCard>
      )}

      {/* Health Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Object.keys(healthTypes) as Array<keyof typeof healthTypes>).map((type) => {
          const typeLogs = getLogsByType(type);
          const info = healthTypes[type];

          return (
            <GlassCard key={type}>
              <div className="flex items-center gap-2 mb-4">
                <AppIcon name={info.icon} size={20} className={info.color} />
                <h3 className="font-bold">{info.label}</h3>
              </div>

              {typeLogs.length === 0 ? (
                <div className="text-center text-text-3 py-8">
                  لاگی ثبت نشده
                </div>
              ) : (
                <div className="space-y-2">
                  {typeLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-text-3">{log.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${info.color}`}>
                          {log.value.toFixed(1)} {info.unit}
                        </span>
                        <button
                          onClick={() => deleteLog(log.id)}
                          className="text-red-400 hover:text-red-300 text-xs"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      {logs.length === 0 && !showAddForm && (
        <EmptyState
          icon="heart"
          title="هنوز لاگی ندارید"
          description="سلامت خود را روزانه ثبت کنید."
          action={{ label: '+ افزودن لاگ', onClick: () => setShowAddForm(true) }}
        />
      )}
    </div>
  );
}