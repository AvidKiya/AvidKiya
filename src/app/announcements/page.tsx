'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import Icon from '@/components/ui/Icon';
import { tl } from '@/lib/i18n';

type TabKey = 'active' | 'archive' | 'all';

export default function AnnouncementsPage() {
  const { lang, resolve, cms } = useApp();
  const [tab, setTab] = useState<TabKey>('active');

  const now = new Date().toISOString();
  const allAnns = cms.announcements.filter(a => !a.hidden);
  const active = allAnns.filter(a => !a.archived && (!a.expiresAt || a.expiresAt > now));
  const archived = allAnns.filter(a => a.archived || (a.expiresAt && a.expiresAt <= now));

  const items = tab === 'active' ? active : tab === 'archive' ? archived : allAnns;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-black mb-6 gradient-text">{tl('announcements', lang)}</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 glass-card p-1 w-fit" style={{ borderRadius: 10 }}>
        {(['active', 'archive', 'all'] as TabKey[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
              tab === t ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
            }`}>
            {tl(t, lang)} {t === 'active' ? `(${active.length})` : t === 'archive' ? `(${archived.length})` : `(${allAnns.length})`}
          </button>
        ))}
      </div>

      {/* Announcements */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="glass-card p-8 text-center text-text-muted">{lang === 'fa' ? 'هنوز اعلانی نیست' : 'No announcements yet'}</div>
        ) : (
          items.map(ann => (
            <div key={ann.id} className={`glass-card p-5 ${ann.pinned ? 'border-accent-amber/30' : ''}`}>
              {ann.pinned && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent-amber bg-accent-amber/10 px-2 py-0.5 rounded-full mb-2">
                  📌 {lang === 'fa' ? 'سنجاق شده' : 'PINNED'}
                </span>
              )}
              <h3 className="text-lg font-bold mb-2">{resolve(ann.title)}</h3>

              {ann.type === 'news' && (
                <div>
                  {ann.image && <img src={ann.image} alt="" className="w-full rounded-lg mb-3 max-h-60 object-cover" />}
                  <p className="text-sm text-text-secondary whitespace-pre-wrap">{resolve(ann.body)}</p>
                </div>
              )}

              {ann.type === 'text' && (
                <p className="text-sm text-text-secondary whitespace-pre-wrap">{resolve(ann.body)}</p>
              )}

              {ann.type === 'image' && ann.image && (
                <img src={ann.image} alt="" className="w-full rounded-lg max-h-96 object-cover" />
              )}

              {ann.type === 'poll' && ann.pollOptions && (
                <PollView options={ann.pollOptions} annId={ann.id} />
              )}

              {ann.type === 'map' && ann.mapLat !== undefined && ann.mapLng !== undefined && (
                <iframe
                  className="w-full h-60 rounded-lg border-0"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${(ann.mapLng || 0) - 0.02},${(ann.mapLat || 0) - 0.02},${(ann.mapLng || 0) + 0.02},${(ann.mapLat || 0) + 0.02}&layer=mapnik&marker=${ann.mapLat},${ann.mapLng}`}
                  loading="lazy"
                />
              )}

              <div className="text-[10px] text-text-muted mt-3">
                {new Date(ann.createdAt).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function PollView({ options, annId }: { options: { id: string; text: { fa: string; en: string }; votes: number }[]; annId: string }) {
  const { lang, resolve } = useApp();
  const [voted, setVoted] = useState(false);
  const total = options.reduce((s, o) => s + o.votes, 0) || 1;

  const handleVote = async (optId: string) => {
    if (voted) return;
    setVoted(true);
    try {
      await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'poll-vote', annId, optId }),
      });
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-2">
      {options.map(opt => {
        const pct = Math.round((opt.votes / total) * 100);
        return (
          <button key={opt.id} onClick={() => handleVote(opt.id)}
            disabled={voted}
            className="w-full relative rounded-lg border border-border-theme p-3 text-start overflow-hidden hover:border-primary/30 transition disabled:cursor-default">
            <div className="absolute inset-y-0 inset-inline-start-0 bg-primary/10 transition-all"
              style={{ width: voted ? `${pct}%` : '0%' }} />
            <div className="relative flex justify-between items-center">
              <span className="text-sm">{resolve(opt.text)}</span>
              {voted && <span className="text-xs text-text-muted">{pct}%</span>}
            </div>
          </button>
        );
      })}
      <div className="text-xs text-text-muted">{total} {tl('vote', lang)}</div>
    </div>
  );
}
