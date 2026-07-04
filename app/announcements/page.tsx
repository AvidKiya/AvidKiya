'use client';

import { useState } from 'react';
import { useApp, useCms } from '@/contexts/AppContext';
import { Icon } from '@/components/ui/Icon';
import type { Announcement } from '@/lib/cms/schema';

type TabType = 'active' | 'archive' | 'all';

export default function AnnouncementsPage() {
  const { language } = useApp();
  const { cms, t } = useCms();
  const [activeTab, setActiveTab] = useState<TabType>('active');
  
  const now = new Date();
  
  const filterAnnouncements = (announcements: Announcement[]): Announcement[] => {
    return announcements.filter(a => {
      if (a.hidden) return false;
      
      // Check expiry
      if (a.expiresAt && new Date(a.expiresAt) < now) {
        return activeTab === 'archive' || activeTab === 'all';
      }
      
      if (activeTab === 'active') return !a.archived;
      if (activeTab === 'archive') return a.archived;
      return true;
    });
  };
  
  const announcements = filterAnnouncements(cms.announcements);
  const pinnedAnnouncements = announcements.filter(a => a.pinned);
  const regularAnnouncements = announcements.filter(a => !a.pinned);
  
  const tabs = [
    { id: 'active' as const, label: language === 'fa' ? 'فعال' : 'Active' },
    { id: 'archive' as const, label: language === 'fa' ? 'آرشیو' : 'Archive' },
    { id: 'all' as const, label: language === 'fa' ? 'همه' : 'All' }
  ];
  
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black gradient-text mb-4">
            {language === 'fa' ? 'اعلانات' : 'Announcements'}
          </h1>
          <p className="text-[var(--text-secondary)]">
            {language === 'fa' ? 'آخرین اخبار و اطلاعیه‌ها' : 'Latest news and updates'}
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-xl font-medium transition-colors ${
                activeTab === tab.id
                  ? 'gradient-bg text-white'
                  : 'glass-card hover:border-[var(--border-active)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Announcements List */}
        <div className="space-y-6">
          {/* Pinned */}
          {pinnedAnnouncements.map(announcement => (
            <AnnouncementCard key={announcement.id} announcement={announcement} pinned />
          ))}
          
          {/* Regular */}
          {regularAnnouncements.map(announcement => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
          
          {announcements.length === 0 && (
            <div className="text-center py-12 text-[var(--text-muted)]">
              <Icon name="bell" size={48} className="mx-auto mb-4 opacity-50" />
              <p>{language === 'fa' ? 'اعلانی وجود ندارد' : 'No announcements'}</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}

interface AnnouncementCardProps {
  announcement: Announcement;
  pinned?: boolean;
}

function AnnouncementCard({ announcement, pinned }: AnnouncementCardProps) {
  const { language } = useApp();
  const { t } = useCms();
  const [votes, setVotes] = useState<Record<string, number>>({});
  
  const handleVote = (optionId: string) => {
    setVotes(prev => ({
      ...prev,
      [optionId]: (prev[optionId] || 0) + 1
    }));
  };
  
  const totalVotes = announcement.pollOptions?.reduce((sum, opt) => sum + (votes[opt.id] || opt.votes), 0) || 0;
  
  return (
    <div className={`glass-card-strong p-6 ${pinned ? 'ring-2 ring-[var(--accent-amber)]' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          {pinned && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--accent-amber)]/20 text-[var(--accent-amber)] text-xs font-medium mb-2">
              <Icon name="star" size={12} />
              {language === 'fa' ? 'پین شده' : 'Pinned'}
            </span>
          )}
          <h2 className="text-xl font-bold">{t(announcement.title)}</h2>
        </div>
        <span className="text-sm text-[var(--text-muted)]">
          {new Date(announcement.createdAt).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')}
        </span>
      </div>
      
      {/* Content based on type */}
      {announcement.type === 'news' && (
        <div>
          {announcement.image && (
            <img
              src={announcement.image}
              alt={t(announcement.title)}
              className="w-full rounded-xl mb-4 max-h-80 object-cover"
            />
          )}
          <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
            {t(announcement.content)}
          </p>
        </div>
      )}
      
      {announcement.type === 'text' && (
        <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
          {t(announcement.content)}
        </p>
      )}
      
      {announcement.type === 'image' && announcement.image && (
        <img
          src={announcement.image}
          alt={t(announcement.title)}
          className="w-full rounded-xl max-h-[500px] object-contain bg-[var(--bg-tertiary)]"
        />
      )}
      
      {announcement.type === 'poll' && announcement.pollOptions && (
        <div className="space-y-3">
          <p className="text-[var(--text-secondary)] mb-4">{t(announcement.content)}</p>
          
          {announcement.pollOptions.map(option => {
            const optionVotes = votes[option.id] || option.votes;
            const percentage = totalVotes > 0 ? (optionVotes / totalVotes) * 100 : 0;
            
            return (
              <button
                key={option.id}
                onClick={() => handleVote(option.id)}
                className="w-full p-3 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--primary-glow)] transition-colors text-start relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 bg-[var(--primary)] opacity-20 transition-all"
                  style={{ width: `${percentage}%` }}
                />
                <div className="relative flex justify-between">
                  <span>{t(option.text)}</span>
                  <span className="text-[var(--text-muted)]">{percentage.toFixed(0)}%</span>
                </div>
              </button>
            );
          })}
          
          <p className="text-xs text-[var(--text-muted)] text-center mt-2">
            {language === 'fa' ? `${totalVotes} رای` : `${totalVotes} votes`}
          </p>
        </div>
      )}
      
      {announcement.type === 'map' && announcement.mapLat && announcement.mapLng && (
        <div className="rounded-xl overflow-hidden h-64">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${announcement.mapLng - 0.01}%2C${announcement.mapLat - 0.01}%2C${announcement.mapLng + 0.01}%2C${announcement.mapLat + 0.01}&layer=mapnik&marker=${announcement.mapLat}%2C${announcement.mapLng}`}
          />
        </div>
      )}
    </div>
  );
}
