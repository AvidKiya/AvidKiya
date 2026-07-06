'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass';
import { LoadingSkeleton, ErrorState } from '@/components/ui/states';

interface Project {
  id: string;
  name: string;
  description: string;
  language?: string;
  stars?: number;
  url?: string;
  featured: boolean;
}

export const metadata = { title: 'پروژه‌ها — AvidKiya' };

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'AvidKiya Platform',
    description: 'پلتفرم شخصی با KIYA Planner',
    language: 'TypeScript',
    stars: 42,
    url: 'https://github.com/avidkiya/avidkiya-platform',
    featured: true,
  },
  {
    id: '2',
    name: 'React Dashboard',
    description: 'داشبورد مدیریتی با React',
    language: 'TypeScript',
    stars: 28,
    url: 'https://github.com/avidkiya/react-dashboard',
    featured: true,
  },
  {
    id: '3',
    name: 'CLI Tool',
    description: 'ابزار خط فرمان برای مدیریت پروژه',
    language: 'Go',
    stars: 15,
    url: 'https://github.com/avidkiya/cli-tool',
    featured: false,
  },
];

const languageColors: Record<string, string> = {
  TypeScript: 'bg-blue-500',
  JavaScript: 'bg-yellow-500',
  Python: 'bg-green-500',
  Go: 'bg-cyan-500',
  Rust: 'bg-orange-500',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'featured'>('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // In production, fetch from GitHub API
      setProjects(mockProjects);
      setLoading(false);
    } catch (err) {
      setError('خطا در بارگذاری پروژه‌ها');
      setLoading(false);
    }
  };

  const filteredProjects = filter === 'featured'
    ? projects.filter((p) => p.featured)
    : projects;

  if (loading) return <LoadingSkeleton count={5} />;
  if (error) return <ErrorState message={error} onRetry={fetchProjects} />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black mb-2">پروژه‌ها</h1>
        <p className="text-text-2">مجموعه‌ای از پروژه‌های من</p>
      </div>

      {/* Filter */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-primary text-white'
              : 'bg-white/5 text-text-2 hover:bg-white/10'
          }`}
        >
          همه
        </button>
        <button
          onClick={() => setFilter('featured')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'featured'
              ? 'bg-primary text-white'
              : 'bg-white/5 text-text-2 hover:bg-white/10'
          }`}
        >
          ویژه
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <GlassCard key={project.id}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold">{project.name}</h3>
              {project.featured && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                  ویژه
                </span>
              )}
            </div>
            <p className="text-text-2 text-sm mb-4">{project.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {project.language && (
                  <span className="flex items-center gap-1 text-sm">
                    <span className={`w-3 h-3 rounded-full ${languageColors[project.language] || 'bg-gray-500'}`} />
                    {project.language}
                  </span>
                )}
                {project.stars && (
                  <span className="text-sm text-text-3">⭐ {project.stars}</span>
                )}
              </div>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm hover:underline"
                >
                  مشاهده →
                </a>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}