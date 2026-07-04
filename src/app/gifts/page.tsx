'use client';

import { useApp } from '@/contexts/AppContext';
import Icon from '@/components/ui/Icon';
import { tl } from '@/lib/i18n';

export default function GiftsPage() {
  const { lang, resolve, cms } = useApp();
  const g = cms.gifts;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-black mb-6 gradient-text">{resolve(g.title)}</h1>
      <p className="text-sm text-text-secondary mb-8">{resolve(g.subtitle)}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* My gift to you */}
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Icon name="gift" size={18} className="text-accent-emerald" />
            {tl('myGiftToYou', lang)}
          </h2>
          <div className="space-y-3">
            {g.downloads.length === 0 ? (
              <div className="glass-card p-6 text-center text-text-muted text-sm">
                {lang === 'fa' ? 'به زودی...' : 'Coming soon...'}
              </div>
            ) : (
              g.downloads.map(d => (
                <a key={d.id} href={d.url} download={d.filename}
                  className="glass-card p-4 flex items-center gap-3 hover:border-accent-emerald/30 transition block">
                  <div className="w-10 h-10 rounded-lg bg-accent-emerald/10 flex items-center justify-center shrink-0">
                    <Icon name={d.icon || 'download'} size={18} className="text-accent-emerald" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold truncate">{resolve(d.title)}</h3>
                    <p className="text-xs text-text-secondary truncate">{resolve(d.description)}</p>
                  </div>
                  <Icon name="download" size={16} className="text-accent-emerald shrink-0" />
                </a>
              ))
            )}
          </div>
        </div>

        {/* Your gift to me */}
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Icon name="heart" size={18} className="text-accent-rose" />
            {tl('yourGiftToMe', lang)}
          </h2>
          <div className="space-y-3">
            {g.donationLinks.length === 0 ? (
              <div className="glass-card p-6 text-center text-text-muted text-sm">
                {lang === 'fa' ? 'به زودی...' : 'Coming soon...'}
              </div>
            ) : (
              g.donationLinks.map(d => (
                <a key={d.id} href={d.url} target="_blank" rel="noopener noreferrer"
                  className="glass-card p-4 flex items-center gap-3 hover:border-accent-rose/30 transition block"
                  style={{ borderColor: `${d.color}20` }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${d.color}15` }}>
                    <Icon name={d.icon || 'heart'} size={18} style={{ color: d.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold">{resolve(d.label)}</h3>
                    <p className="text-xs text-text-secondary">{d.platform}</p>
                  </div>
                  <Icon name="external-link" size={14} className="text-text-muted shrink-0" />
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
