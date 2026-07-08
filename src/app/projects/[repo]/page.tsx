'use client';

import { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GlassCard } from '@/components/ui/glass';
import { useCms } from '@/lib/cms/cms-context';
import { ExternalLink, Star, GitFork, ArrowLeft } from 'lucide-react';

interface GHRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  homepage?: string;
}

export default function ProjectDetailsPage({ params }: { params: Promise<{ repo: string }> }) {
  const { repo } = use(params);
  const { cms, t } = useCms();
  const [gh, setGh] = useState<GHRepo | null>(null);
  const [loading, setLoading] = useState(true);
  const slug = decodeURIComponent(repo).toLowerCase();

  const custom = useMemo(() => cms.projects.customProjects.find(p => p.id.toLowerCase() === slug || p.title.toLowerCase().replace(/\s+/g, '-') === slug), [cms.projects.customProjects, slug]);

  useEffect(() => {
    const ghUser = cms.settings.githubUsername;
    if (!ghUser) { setLoading(false); return; }
    fetch(`https://api.github.com/repos/${ghUser}/${slug}`, { headers: { Accept: 'application/vnd.github+json' } })
      .then(r => r.ok ? r.json() : null)
      .then((data: GHRepo | null) => setGh(data))
      .catch(() => setGh(null))
      .finally(() => setLoading(false));
  }, [cms.settings.githubUsername, slug]);

  if (!loading && !gh && !custom) return notFound();

  const title = custom?.title || gh?.name || repo;
  const description = custom?.description || gh?.description || '';
  const url = custom?.url || gh?.html_url || '#';
  const stars = custom?.stars ?? gh?.stargazers_count ?? 0;
  const language = custom?.language || gh?.language || '—';
  const forks = gh?.forks_count ?? 0;
  const updated = gh?.updated_at ? new Date(gh.updated_at).toLocaleDateString('en-US') : '—';

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <Link href="/projects" className="text-[12.5px] text-text-3 hover:text-text inline-flex items-center gap-1 mb-5"><ArrowLeft size={14}/> {t('بازگشت به پروژه‌ها','Back to projects')}</Link>
      <GlassCard className="!p-6 md:!p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[11px] text-primary font-[700] uppercase tracking-wider mb-2">Project</div>
            <h1 className="text-[28px] md:text-[38px] font-[900] tracking-[-0.02em] mb-3">{title}</h1>
            <p className="text-text-2 leading-relaxed max-w-2xl">{description || t('بدون توضیح','No description')}</p>
          </div>
          <a href={url} target="_blank" rel="noopener noreferrer" className="glass-btn-primary px-4 py-2.5 inline-flex items-center gap-2 text-[13px]">Open <ExternalLink size={15}/></a>
        </div>

        <div className="grid sm:grid-cols-4 gap-3 mt-7">
          <Stat label="Stars" value={String(stars)} icon={<Star size={15}/>} />
          <Stat label="Forks" value={String(forks)} icon={<GitFork size={15}/>} />
          <Stat label="Language" value={language} />
          <Stat label="Updated" value={updated} />
        </div>

        {gh?.full_name && (
          <div className="mt-7 rounded-[18px] overflow-hidden border border-glass-border bg-white/[0.03]">
            <img src={`https://opengraph.githubassets.com/1/${gh.full_name}`} alt={`${title} preview`} className="w-full block" />
          </div>
        )}
      </GlassCard>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return <div className="glass-card !p-3"><div className="text-[11px] text-text-3 flex items-center gap-1.5 mb-1">{icon}{label}</div><div className="font-[800] text-[15px] truncate">{value}</div></div>;
}
