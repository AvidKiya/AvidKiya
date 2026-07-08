'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass';

interface Announcement {
  id: string;
  title: string;
  body: string;
  type: 'news' | 'poll' | 'image' | 'text';
  date: string;
  pinned?: boolean;
  archived?: boolean;
}

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'نسخه جدید KIYA Planner منتشر شد!',
    body: 'نسخه ۲.۰ با امکانات جدید هوش مصنوعی و طراحی بهبود یافته منتشر شد.',
    type: 'news',
    date: '۱۴۰۳/۱۰/۱۵',
    pinned: true,
  },
  {
    id: '2',
    title: 'نظرسنجی: چه امکاناتی را ترجیح می‌دهید؟',
    body: 'به ما بگویید چه امکاناتی برای شما مهم‌تر است.',
    type: 'poll',
    date: '۱۴۰۳/۱۰/۱۰',
  },
  {
    id: '3',
    title: 'برنامه‌نویسی وب: دوره رایگان',
    body: 'دوره رایگان برنامه‌نویسی وب با React و Next.js شروع شد.',
    type: 'news',
    date: '۱۴۰۳/۱۰/۰۵',
    archived: true,
  },
];

export default function AnnouncementsPageContent() {
  const [activeTab, setActiveTab] = useState<'active' | 'archived' | 'all'>('active');

  const filteredAnnouncements = mockAnnouncements.filter((a) => {
    if (activeTab === 'active') return !a.archived;
    if (activeTab === 'archived') return a.archived;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black mb-2">اعلان‌ها</h1>
        <p className="text-text-2">آخرین اخبار و به‌روزرسانی‌ها</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        {(['active', 'archived', 'all'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab
                ? 'bg-primary text-white'
                : 'bg-white/5 text-text-2 hover:bg-white/10'
            }`}
          >
            {tab === 'active' ? 'فعال' : tab === 'archived' ? 'بایگانی' : 'همه'}
          </button>
        ))}
      </div>

      {/* Announcements */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <GlassCard key={announcement.id}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {announcement.pinned && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                      ثابت شده
                    </span>
                  )}
                  <span className="text-xs text-text-3">{announcement.date}</span>
                </div>
                <h3 className="font-bold mb-2">{announcement.title}</h3>
                <p className="text-text-2">{announcement.body}</p>
              </div>
              <span className="text-xs text-text-3 ml-4">
                {announcement.type === 'news' ? 'اخبار' : 
                 announcement.type === 'poll' ? 'نظرسنجی' : 'متن'}
              </span>
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredAnnouncements.length === 0 && (
        <div className="text-center text-text-3 py-12">
          اعلانی وجود ندارد
        </div>
      )}
    </div>
  );
}
