'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass';

interface ChangelogEntry {
  version: string;
  date: string;
  type: 'feature' | 'fix' | 'improvement';
  changes: string[];
}

const changelog: ChangelogEntry[] = [
  {
    version: '2.0.0',
    date: '۱۴۰۳/۱۰/۱۵',
    type: 'feature',
    changes: [
      'رابط کاربری جدید با طراحی مدرن',
      'هوش مصنوعی پیشرفته برای برنامه‌ریزی',
      'ماژول سلامت جدید',
      'پشتیبانی از زبان فارسی',
    ],
  },
  {
    version: '1.5.0',
    date: '۱۴۰۳/۰۹/۲۰',
    type: 'feature',
    changes: [
      'ماژول مالی',
      'سیستم یادآوری',
      'بهبود عملکرد',
    ],
  },
  {
    version: '1.4.2',
    date: '۱۴۰۳/۰۹/۱۰',
    type: 'fix',
    changes: [
      'رفع مشکل همگام‌سازی',
      'بهبود پایداری',
    ],
  },
  {
    version: '1.4.0',
    date: '۱۴۰۳/۰۸/۲۵',
    type: 'improvement',
    changes: [
      'بهبود سرعت بارگذاری',
      'طراحی بهتر موبایل',
      'افزودن حالت تاریک',
    ],
  },
];

const typeLabels = {
  feature: 'ویژگی جدید',
  fix: 'رفع باگ',
  improvement: 'بهبود',
};

const typeColors = {
  feature: 'bg-green-500/20 text-green-400',
  fix: 'bg-red-500/20 text-red-400',
  improvement: 'bg-blue-500/20 text-blue-400',
};

export default function ChangelogPageContent() {
  const [filter, setFilter] = useState<'all' | 'feature' | 'fix' | 'improvement'>('all');

  const filteredChangelog = changelog.filter(
    (entry) => filter === 'all' || entry.type === filter
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black mb-2">تاریخچه تغییرات</h1>
        <p className="text-text-2">آخرین به‌روزرسانی‌ها و ویژگی‌های جدید</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {(['all', 'feature', 'fix', 'improvement'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === type
                ? 'bg-primary text-white'
                : 'bg-white/5 text-text-2 hover:bg-white/10'
            }`}
          >
            {type === 'all' ? 'همه' : typeLabels[type]}
          </button>
        ))}
      </div>

      {/* Entries */}
      <div className="space-y-6">
        {filteredChangelog.map((entry) => (
          <GlassCard key={entry.version}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-bold">v{entry.version}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${typeColors[entry.type]}`}>
                    {typeLabels[entry.type]}
                  </span>
                </div>
                <div className="text-sm text-text-3 mt-1">{entry.date}</div>
              </div>
            </div>
            <ul className="space-y-2">
              {entry.changes.map((change, i) => (
                <li key={i} className="flex items-start gap-2 text-text-2">
                  <span className="text-primary mt-1">•</span>
                  {change}
                </li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
