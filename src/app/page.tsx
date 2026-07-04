'use client';

import { Hero } from '@/components/dashboard/Hero';
import { PersianCalendar } from '@/components/ui/PersianCalendar';
import { ProjectGrid } from '@/components/dashboard/ProjectGrid';
import { StatsBar } from '@/components/dashboard/StatsBar';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <Hero />
      
      {/* Persian Calendar Section */}
      <section className="max-w-7xl mx-auto px-4">
        <PersianCalendar />
      </section>
      
      <ProjectGrid />
      <StatsBar />
    </div>
  );
}
