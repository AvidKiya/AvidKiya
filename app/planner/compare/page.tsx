'use client';

import { GlassCard } from '@/components/ui/glass';

interface Feature {
  name: string;
  kiya: boolean | string;
  notion: boolean | string;
  obsidian: boolean | string;
  clickup: boolean | string;
  todoist: boolean | string;
}

const features: Feature[] = [
  { name: 'هوش مصنوعی', kiya: '✓', notion: '✓', obsidian: '✗', clickup: '✓', todoist: '✗' },
  { name: 'برنامه‌ریزی روزانه', kiya: '✓', notion: '✓', obsidian: '✓', clickup: '✓', todoist: '✓' },
  { name: 'ردیابی عادت', kiya: '✓', notion: '✗', obsidian: '✓', clickup: '✗', todoist: '✓' },
  { name: 'مدیریت مالی', kiya: '✓', notion: '✗', obsidian: '✓', clickup: '✗', todoist: '✗' },
  { name: 'ردیابی سلامت', kiya: '✓', notion: '✗', obsidian: '✗', clickup: '✗', todoist: '✗' },
  { name: 'پشتیبانی فارسی', kiya: '✓', notion: '✓', obsidian: '✓', clickup: '✗', todoist: '✗' },
  { name: 'قیمت', kiya: 'رایگان+', notion: 'رایگان+', obsidian: 'رایگان', clickup: 'رایگان+', todoist: 'رایگان+' },
  { name: 'آنلاین/آفلاین', kiya: 'هر دو', notion: 'آنلاین', obsidian: 'آفلاین', clickup: 'آنلاین', todoist: 'هر دو' },
];

export default function ComparePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black mb-2">مقایسه KIYA با رقبا</h1>
        <p className="text-text-2">چرا KIYA بهترین انتخاب است؟</p>
      </div>

      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-right py-3 px-4">امکانات</th>
                <th className="text-center py-3 px-4 text-primary font-bold">KIYA</th>
                <th className="text-center py-3 px-4">Notion</th>
                <th className="text-center py-3 px-4">Obsidian</th>
                <th className="text-center py-3 px-4">ClickUp</th>
                <th className="text-center py-3 px-4">Todoist</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr key={feature.name} className="border-b border-white/5">
                  <td className="py-3 px-4 text-text-2">{feature.name}</td>
                  <td className="text-center py-3 px-4">
                    <span className={feature.kiya === '✓' ? 'text-green-400' : feature.kiya === '✗' ? 'text-red-400' : 'text-primary font-bold'}>
                      {feature.kiya === '✓' ? '✓' : feature.kiya === '✗' ? '✗' : feature.kiya}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={feature.notion === '✓' ? 'text-green-400' : feature.notion === '✗' ? 'text-red-400' : ''}>
                      {feature.notion === '✓' ? '✓' : feature.notion === '✗' ? '✗' : feature.notion}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={feature.obsidian === '✓' ? 'text-green-400' : feature.obsidian === '✗' ? 'text-red-400' : ''}>
                      {feature.obsidian === '✓' ? '✓' : feature.obsidian === '✗' ? '✗' : feature.obsidian}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={feature.clickup === '✓' ? 'text-green-400' : feature.clickup === '✗' ? 'text-red-400' : ''}>
                      {feature.clickup === '✓' ? '✓' : feature.clickup === '✗' ? '✗' : feature.clickup}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={feature.todoist === '✓' ? 'text-green-400' : feature.todoist === '✗' ? 'text-red-400' : ''}>
                      {feature.todoist === '✓' ? '✓' : feature.todoist === '✗' ? '✗' : feature.todoist}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* CTA */}
      <div className="text-center mt-12">
        <GlassCard>
          <h2 className="text-xl font-bold mb-4">آماده شروع هستید؟</h2>
          <p className="text-text-2 mb-6">
            همین حالا KIYA را رایگان امتحان کنید.
          </p>
          <a href="/planner" className="glass-btn-primary px-8 py-3">
            شروع رایگان
          </a>
        </GlassCard>
      </div>
    </div>
  );
}