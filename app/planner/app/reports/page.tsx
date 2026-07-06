'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass';

type ReportPeriod = 'daily' | 'weekly' | 'monthly';

const periodLabels = {
  daily: 'روزانه',
  weekly: 'هفتگی',
  monthly: 'ماهانه',
};

export default function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>('weekly');

  const reportData = {
    tasks: { completed: 12, total: 15, rate: 80 },
    habits: { completed: 25, total: 35, rate: 71 },
    energy: { average: 7.5, trend: 'up' },
    mood: { average: 8, trend: 'stable' },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">گزارش‌ها</h1>
        <div className="flex gap-2">
          {(Object.keys(periodLabels) as ReportPeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                period === p
                  ? 'bg-primary text-white'
                  : 'bg-white/5 text-text-2 hover:bg-white/10'
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Task Report */}
      <GlassCard>
        <h2 className="font-bold mb-4">وظایف</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-text-2">تکمیل شده</span>
              <span className="text-sm font-bold">{reportData.tasks.completed}/{reportData.tasks.total}</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${reportData.tasks.rate}%` }}
              />
            </div>
          </div>
          <div className="text-2xl font-bold text-primary">{reportData.tasks.rate}%</div>
        </div>
      </GlassCard>

      {/* Habits Report */}
      <GlassCard>
        <h2 className="font-bold mb-4">عادت‌ها</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-text-2">انجام شده</span>
              <span className="text-sm font-bold">{reportData.habits.completed}/{reportData.habits.total}</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${reportData.habits.rate}%` }}
              />
            </div>
          </div>
          <div className="text-2xl font-bold text-green-400">{reportData.habits.rate}%</div>
        </div>
      </GlassCard>

      {/* Energy & Mood */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard>
          <h2 className="font-bold mb-4">انرژی</h2>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-400 mb-2">{reportData.energy.average}</div>
            <div className="text-sm text-text-2">میانگین</div>
            <div className={`text-sm mt-2 ${reportData.energy.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {reportData.energy.trend === 'up' ? '↑ رو به بالا' : '↓ رو به پایین'}
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="font-bold mb-4">حال</h2>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">{reportData.mood.average}</div>
            <div className="text-sm text-text-2">میانگین</div>
            <div className="text-sm mt-2 text-text-3">→ ثابت</div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}