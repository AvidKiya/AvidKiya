'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass';
import { EmptyState, LoadingSkeleton, ErrorState } from '@/components/ui/states';

interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  streak: number;
  createdAt: string;
}

interface HabitLog {
  habitId: string;
  date: string;
  completed: boolean;
}

const frequencyLabels = {
  daily: 'روزانه',
  weekly: 'هفتگی',
  monthly: 'ماهانه',
};

function HeatmapCalendar({ logs }: { logs: HabitLog[] }) {
  const today = new Date();
  const weeks = 12;
  const days = weeks * 7;

  const getLogForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return logs.find((l) => l.date === dateStr);
  };

  const getColor = (log: HabitLog | undefined) => {
    if (!log) return 'bg-white/5';
    return log.completed ? 'bg-green-500' : 'bg-red-500/50';
  };

  const dayLabels = ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'];

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1">
        <div className="flex flex-col gap-1 mr-2">
          {dayLabels.map((day, i) => (
            <div key={i} className="w-6 h-6 flex items-center justify-center text-xs text-text-3">
              {day}
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {Array.from({ length: weeks }).map((_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const date = new Date(today);
                date.setDate(date.getDate() - (days - (weekIndex * 7 + dayIndex)));
                const log = getLogForDate(date);
                const isToday = date.toISOString().split('T')[0] === today.toISOString().split('T')[0];

                return (
                  <div
                    key={dayIndex}
                    className={`w-6 h-6 rounded-sm ${getColor(log)} ${
                      isToday ? 'ring-2 ring-primary' : ''
                    }`}
                    title={date.toLocaleDateString('fa-IR')}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-text-3">
        <span>کمتر</span>
        <div className="w-4 h-4 rounded-sm bg-white/5" />
        <div className="w-4 h-4 rounded-sm bg-green-500/30" />
        <div className="w-4 h-4 rounded-sm bg-green-500/60" />
        <div className="w-4 h-4 rounded-sm bg-green-500" />
        <span>بیشتر</span>
      </div>
    </div>
  );
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', frequency: 'daily' as const });

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      // Mock data
      setHabits([
        { id: '1', name: 'ورزش', frequency: 'daily', streak: 5, createdAt: new Date().toISOString() },
        { id: '2', name: 'مطالعه', frequency: 'daily', streak: 3, createdAt: new Date().toISOString() },
        { id: '3', name: 'نوشتن', frequency: 'weekly', streak: 2, createdAt: new Date().toISOString() },
      ]);

      // Generate mock logs
      const mockLogs: HabitLog[] = [];
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        if (Math.random() > 0.3) {
          mockLogs.push({
            habitId: '1',
            date: date.toISOString().split('T')[0],
            completed: Math.random() > 0.2,
          });
        }
      }
      setLogs(mockLogs);

      setLoading(false);
    } catch (err) {
      setError('خطا در بارگذاری عادت‌ها');
      setLoading(false);
    }
  };

  const addHabit = () => {
    if (!newHabit.name.trim()) return;

    const habit: Habit = {
      id: `habit-${Date.now()}`,
      name: newHabit.name,
      frequency: newHabit.frequency,
      streak: 0,
      createdAt: new Date().toISOString(),
    };

    setHabits((prev) => [...prev, habit]);
    setNewHabit({ name: '', frequency: 'daily' });
    setShowAddForm(false);
  };

  const checkIn = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const existingLog = logs.find((l) => l.habitId === habitId && l.date === today);

    if (existingLog) {
      setLogs((prev) =>
        prev.map((l) =>
          l.habitId === habitId && l.date === today
            ? { ...l, completed: !l.completed }
            : l
        )
      );
    } else {
      setLogs((prev) => [
        ...prev,
        { habitId, date: today, completed: true },
      ]);
    }

    // Update streak
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const todayLog = logs.find(
          (l) => l.habitId === habitId && l.date === today
        );
        return {
          ...h,
          streak: todayLog?.completed ? h.streak - 1 : h.streak + 1,
        };
      })
    );
  };

  const deleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    setLogs((prev) => prev.filter((l) => l.habitId !== habitId));
  };

  const isCompletedToday = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return logs.some((l) => l.habitId === habitId && l.date === today && l.completed);
  };

  if (loading) return <LoadingSkeleton count={3} />;
  if (error) return <ErrorState message={error} onRetry={fetchHabits} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">عادت‌ها</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="glass-btn-primary px-4 py-2"
        >
          + عادت جدید
        </button>
      </div>

      {/* Heatmap */}
      <GlassCard>
        <h2 className="font-bold mb-4">تقویم فعالیت</h2>
        <HeatmapCalendar logs={logs} />
      </GlassCard>

      {/* Add Habit Form */}
      {showAddForm && (
        <GlassCard>
          <div className="flex gap-4">
            <input
              type="text"
              value={newHabit.name}
              onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
              placeholder="نام عادت"
              className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
              autoFocus
            />
            <select
              value={newHabit.frequency}
              onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value as Habit['frequency'] })}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10"
            >
              <option value="daily">روزانه</option>
              <option value="weekly">هفتگی</option>
              <option value="monthly">ماهانه</option>
            </select>
            <button onClick={addHabit} className="glass-btn-primary px-4 py-2">
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

      {/* Habits List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits.map((habit) => (
          <GlassCard key={habit.id}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold">{habit.name}</h3>
                <span className="text-xs text-text-3">{frequencyLabels[habit.frequency]}</span>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{habit.streak}</div>
                <div className="text-xs text-text-3">روز streak</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => checkIn(habit.id)}
                className={`flex-1 py-2 rounded-lg transition-colors ${
                  isCompletedToday(habit.id)
                    ? 'bg-green-500/20 text-green-400'
                    : 'glass-btn'
                }`}
              >
                {isCompletedToday(habit.id) ? '✓ انجام شد' : 'ثبت امروز'}
              </button>
              <button
                onClick={() => deleteHabit(habit.id)}
                className="glass-btn px-3 py-2 text-red-400"
              >
                حذف
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {habits.length === 0 && !showAddForm && (
        <EmptyState
          icon="🔥"
          title="هنوز عادتی ندارید"
          description="اولین عادت خود را اضافه کنید و streak خود را شروع کنید."
          action={{ label: '+ افزودن عادت', onClick: () => setShowAddForm(true) }}
        />
      )}
    </div>
  );
}