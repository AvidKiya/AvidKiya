'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass';
import { EmptyState, LoadingSkeleton, ErrorState } from '@/components/ui/states';

interface Goal {
  id: string;
  title: string;
  level: 'annual' | 'quarterly' | 'weekly';
  progress: number;
  createdAt: string;
}

const levelLabels = {
  annual: 'سالانه',
  quarterly: 'فصلی',
  weekly: 'هفتگی',
};

const levelColors = {
  annual: 'text-purple-400',
  quarterly: 'text-blue-400',
  weekly: 'text-green-400',
};

function ProgressRing({ progress, size = 80 }: { progress: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={8}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={8}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        className="text-primary transition-all duration-500"
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-text-1 text-sm font-bold"
        transform={`rotate(90 ${size / 2} ${size / 2})`}
      >
        {progress}%
      </text>
    </svg>
  );
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', level: 'weekly' as const });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      // Mock data
      setGoals([
        { id: '1', title: 'یادگیری React', level: 'annual', progress: 60, createdAt: new Date().toISOString() },
        { id: '2', title: 'ورزش روزانه', level: 'weekly', progress: 80, createdAt: new Date().toISOString() },
        { id: '3', title: 'تکمیل پروژه X', level: 'quarterly', progress: 45, createdAt: new Date().toISOString() },
      ]);
      setLoading(false);
    } catch (err) {
      setError('خطا در بارگذاری اهداف');
      setLoading(false);
    }
  };

  const addGoal = () => {
    if (!newGoal.title.trim()) return;

    const goal: Goal = {
      id: `goal-${Date.now()}`,
      title: newGoal.title,
      level: newGoal.level,
      progress: 0,
      createdAt: new Date().toISOString(),
    };

    setGoals((prev) => [...prev, goal]);
    setNewGoal({ title: '', level: 'weekly' });
    setShowAddForm(false);
  };

  const updateProgress = (goalId: string, delta: number) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, progress: Math.max(0, Math.min(100, g.progress + delta)) }
          : g
      )
    );
  };

  const deleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  if (loading) return <LoadingSkeleton count={3} />;
  if (error) return <ErrorState message={error} onRetry={fetchGoals} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">اهداف</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="glass-btn-primary px-4 py-2"
        >
          + هدف جدید
        </button>
      </div>

      {/* Add Goal Form */}
      {showAddForm && (
        <GlassCard>
          <div className="flex gap-4">
            <input
              type="text"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              placeholder="عنوان هدف"
              className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
              autoFocus
            />
            <select
              value={newGoal.level}
              onChange={(e) => setNewGoal({ ...newGoal, level: e.target.value as Goal['level'] })}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10"
            >
              <option value="weekly">هفتگی</option>
              <option value="quarterly">فصلی</option>
              <option value="annual">سالانه</option>
            </select>
            <button onClick={addGoal} className="glass-btn-primary px-4 py-2">
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

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <GlassCard key={goal.id}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold">{goal.title}</h3>
                <span className={`text-xs ${levelColors[goal.level]}`}>
                  {levelLabels[goal.level]}
                </span>
              </div>
              <ProgressRing progress={goal.progress} />
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => updateProgress(goal.id, -10)}
                className="glass-btn px-3 py-1 text-sm"
                disabled={goal.progress <= 0}
              >
                -
              </button>
              <button
                onClick={() => updateProgress(goal.id, 10)}
                className="glass-btn px-3 py-1 text-sm"
                disabled={goal.progress >= 100}
              >
                +
              </button>
              <button
                onClick={() => deleteGoal(goal.id)}
                className="glass-btn px-3 py-1 text-sm text-red-400 mr-auto"
              >
                حذف
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {goals.length === 0 && !showAddForm && (
        <EmptyState
          icon="🎯"
          title="هنوز هدفی ندارید"
          description="اولین هدف خود را اضافه کنید."
          action={{ label: '+ افزودن هدف', onClick: () => setShowAddForm(true) }}
        />
      )}
    </div>
  );
}