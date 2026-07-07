'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass';
import { EmptyState, LoadingSkeleton, ErrorState } from '@/components/ui/states';
import { AppIcon } from '@/components/ui/icons';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'inprogress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due?: string;
  createdAt: string;
}

const columns = [
  { id: 'todo', title: 'انجام نشده', color: 'text-yellow-400' },
  { id: 'inprogress', title: 'در حال انجام', color: 'text-blue-400' },
  { id: 'done', title: 'انجام شده', color: 'text-green-400' },
] as const;

const priorityColors = {
  low: 'bg-gray-500/20 text-gray-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  high: 'bg-red-500/20 text-red-400',
};

const priorityLabels = {
  low: 'کم',
  medium: 'متوسط',
  high: 'زیاد',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState<{ title: string; priority: Task['priority'] }>({ title: '', priority: 'medium' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // In production, fetch from API
      // const res = await fetch('/api/planner/tasks');
      // const data = await res.json();
      
      // Mock data
      setTasks([
        { id: '1', title: 'جلسه تیم', status: 'todo', priority: 'high', due: '۱۴۰۳/۱۰/۱۵', createdAt: new Date().toISOString() },
        { id: '2', title: 'کدنویسی پروژه', status: 'inprogress', priority: 'medium', createdAt: new Date().toISOString() },
        { id: '3', title: 'ارسال گزارش', status: 'done', priority: 'low', createdAt: new Date().toISOString() },
      ]);
      setLoading(false);
    } catch (err) {
      setError('خطا در بارگذاری وظایف');
      setLoading(false);
    }
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      status: 'todo',
      priority: newTask.priority,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [...prev, task]);
    setNewTask({ title: '', priority: 'medium' });
    setShowAddForm(false);
  };

  const moveTask = (taskId: string, newStatus: Task['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  if (loading) return <LoadingSkeleton count={5} />;
  if (error) return <ErrorState message={error} onRetry={fetchTasks} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">وظایف</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="glass-btn-primary px-4 py-2"
        >
          + وظیفه جدید
        </button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <GlassCard>
          <div className="flex gap-4">
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="عنوان وظیفه"
              className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
              autoFocus
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10"
            >
              <option value="low">کم</option>
              <option value="medium">متوسط</option>
              <option value="high">زیاد</option>
            </select>
            <button onClick={addTask} className="glass-btn-primary px-4 py-2">
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

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.id);

          return (
            <div key={column.id}>
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-2 h-2 rounded-full ${
                  column.id === 'todo' ? 'bg-yellow-400' :
                  column.id === 'inprogress' ? 'bg-blue-400' : 'bg-green-400'
                }`} />
                <h2 className={`font-bold ${column.color}`}>{column.title}</h2>
                <span className="text-text-3 text-sm">({columnTasks.length})</span>
              </div>

              <div className="space-y-3">
                {columnTasks.length === 0 ? (
                  <div className="text-center text-text-3 text-sm py-8 border border-dashed border-white/10 rounded-lg">
                    وظیفه‌ای نیست
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <GlassCard key={task.id} className="group">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-sm">{task.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
                          {priorityLabels[task.priority]}
                        </span>
                      </div>
                      {task.due && (
                        <div className="text-xs text-text-3 mb-3 flex items-center gap-1"><AppIcon name="calendar" size={12} /> {task.due}</div>
                      )}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {column.id !== 'done' && (
                          <button
                            onClick={() => moveTask(task.id, column.id === 'todo' ? 'inprogress' : 'done')}
                            className="text-xs text-primary hover:underline"
                          >
                            {column.id === 'todo' ? 'شروع' : 'تکمیل'}
                          </button>
                        )}
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-xs text-red-400 hover:underline"
                        >
                          حذف
                        </button>
                      </div>
                    </GlassCard>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {tasks.length === 0 && !showAddForm && (
        <EmptyState
          icon="clipboard"
          title="هنوز وظیفه‌ای ندارید"
          description="اولین وظیفه خود را اضافه کنید."
          action={{ label: '+ افزودن وظیفه', onClick: () => setShowAddForm(true) }}
        />
      )}
    </div>
  );
}