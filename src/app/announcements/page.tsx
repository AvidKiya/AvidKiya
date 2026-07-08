'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass';
import { useCms } from '@/lib/cms/cms-context';

export default function AnnouncementsPage() {
  const { cms, t } = useCms();
  const [activeTab, setActiveTab] = useState<'active' | 'archived' | 'all'>('active');
  const filteredAnnouncements = cms.announcements.filter((a) => {
    if (activeTab === 'active') return !a.archived;
    if (activeTab === 'archived') return a.archived;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black mb-2">{t('اعلان‌ها','Announcements')}</h1>
        <p className="text-text-2">{t('آخرین اخبار و به‌روزرسانی‌ها','Latest news and updates')}</p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        {(['active', 'archived', 'all'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg transition-colors ${activeTab === tab ? 'bg-primary text-white' : 'bg-white/5 text-text-2 hover:bg-white/10'}`}>
            {tab === 'active' ? t('فعال','Active') : tab === 'archived' ? t('بایگانی','Archived') : t('همه','All')}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <GlassCard key={announcement.id}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {announcement.pinned && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">{t('ثابت شده','Pinned')}</span>}
                  <span className="text-xs text-text-3">{announcement.date}</span>
                </div>
                <h3 className="font-bold mb-2">{announcement.title}</h3>
                <p className="text-text-2">{announcement.body}</p>
              </div>
              <span className="text-xs text-text-3 ml-4">{announcement.type === 'news' ? t('اخبار','News') : announcement.type === 'poll' ? t('نظرسنجی','Poll') : t('متن','Text')}</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredAnnouncements.length === 0 && <div className="text-center text-text-3 py-12">{t('اعلانی وجود ندارد','No announcements yet')}</div>}
    </div>
  );
}
