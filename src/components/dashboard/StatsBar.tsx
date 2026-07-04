'use client';

import { useApp } from '@/contexts/AppContext';
import Icon from '@/components/ui/Icon';

export default function StatsBar() {
  const { resolve, cms } = useApp();

  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cms.dashboard.stats.map(stat => (
          <div key={stat.id} className="glass-card p-4 text-center hover:border-primary/30 transition">
            <Icon name={stat.icon} size={20} className="mx-auto mb-2 text-primary" />
            <div className="text-2xl font-black gradient-text">{stat.value}</div>
            <div className="text-xs text-text-secondary mt-1">{resolve(stat.label)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
