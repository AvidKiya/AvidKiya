'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass';
import { EmptyState, LoadingSkeleton, ErrorState } from '@/components/ui/states';

interface Project {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
}

const statusLabels = {
  active: 'فعال',
  completed: 'تکمیل شده',
  archived: 'بایگانی',
};

const statusColors = {
  active: 'text-green-400',
  completed: 'text-blue-400',
  archived: 'text-text-3',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'archived'>('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/planner/projects', {
        headers: { Authorization: `Bearer ${localStorage.getItem('kiya_token') || ''}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.data || []);
      }
      setLoading(false);
    } catch (err) {
      setProjects([
        { id: '1', name: 'AvidKiya Platform', status: 'active', createdAt: new Date().toISOString() },
        { id: '2', name: 'KIYA Planner', status: 'active', createdAt: new Date().toISOString() },
      ]);
      setLoading(false);
    }
  };

  const addProject = async () => {
    if (!newProject.trim()) return;
    try {
      const res = await fetch('/api/planner/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('kiya_token') || ''}`,
        },
        body: JSON.stringify({ name: newProject }),
      });
      if (res.ok) {
        const data = await res.json();
        setProjects((prev) => [...prev, data.data]);
      }
    } catch {
      setProjects((prev) => [
        ...prev,
        { id: `p-${Date.now()}`, name: newProject, status: 'active', createdAt: new Date().toISOString() },
      ]);
    }
    setNewProject('');
    setShowAddForm(false);
  };

  const updateStatus = async (id: string, status: Project['status']) => {
    try {
      await fetch('/api/planner/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('kiya_token') || ''}`,
        },
        body: JSON.stringify({ id, status }),
      });
    } catch {}
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  const deleteProject = async (id: string) => {
    try {
      await fetch(`/api/planner/projects?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('kiya_token') || ''}` },
      });
    } catch {}
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const filteredProjects = filter === 'all' ? projects : projects.filter((p) => p.status === filter);

  if (loading) return <LoadingSkeleton count={3} />;
  if (error) return <ErrorState message={error} onRetry={fetchProjects} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">پروژه‌ها</h1>
        <button onClick={() => setShowAddForm(true)} className="glass-btn-primary px-4 py-2">
          + پروژه جدید
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'active', 'completed', 'archived'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              filter === f ? 'bg-primary text-white' : 'bg-white/5 text-text-2 hover:bg-white/10'
            }`}
          >
            {f === 'all' ? 'همه' : statusLabels[f]}
          </button>
        ))}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <GlassCard>
          <div className="flex gap-4">
            <input
              type="text"
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              placeholder="نام پروژه"
              className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && addProject()}
            />
            <button onClick={addProject} className="glass-btn-primary px-4 py-2">
              افزودن
            </button>
            <button onClick={() => setShowAddForm(false)} className="glass-btn px-4 py-2">
              انصراف
            </button>
          </div>
        </GlassCard>
      )}

      {/* Projects List */}
      <div className="space-y-3">
        {filteredProjects.map((project) => (
          <GlassCard key={project.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">📁</span>
                <div>
                  <div className="font-bold">{project.name}</div>
                  <span className={`text-xs ${statusColors[project.status]}`}>
                    {statusLabels[project.status]}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {project.status !== 'completed' && (
                  <button
                    onClick={() => updateStatus(project.id, 'completed')}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    تکمیل
                  </button>
                )}
                {project.status !== 'archived' && (
                  <button
                    onClick={() => updateStatus(project.id, 'archived')}
                    className="text-xs text-text-3 hover:underline"
                  >
                    بایگانی
                  </button>
                )}
                <button
                  onClick={() => deleteProject(project.id)}
                  className="text-xs text-red-400 hover:underline"
                >
                  حذف
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredProjects.length === 0 && !showAddForm && (
        <EmptyState
          icon="📁"
          title="هنوز پروژه‌ای ندارید"
          description="اولین پروژه خود را اضافه کنید."
          action={{ label: '+ افزودن پروژه', onClick: () => setShowAddForm(true) }}
        />
      )}
    </div>
  );
}