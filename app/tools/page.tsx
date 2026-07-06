'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass';

export const metadata = { title: 'ابزارها — AvidKiya' };

interface Tool {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  isPro: boolean;
}

const tools: Tool[] = [
  {
    id: '1',
    title: 'تبدیل فرمت',
    description: 'تبدیل JSON, YAML, XML',
    url: '/tools/formatter',
    category: 'توسعه',
    isPro: false,
  },
  {
    id: '2',
    title: 'ژنراتور رمز',
    description: 'ساخت رمز عبور قوی',
    url: '/tools/password',
    category: 'امنیت',
    isPro: false,
  },
  {
    id: '3',
    title: 'مولد UUID',
    description: 'ساخت UUID v4',
    url: '/tools/uuid',
    category: 'توسعه',
    isPro: false,
  },
  {
    id: '4',
    title: 'ابزار AI',
    description: 'ابزارهای هوش مصنوعی پیشرفته',
    url: '/tools/ai',
    category: 'هوش مصنوعی',
    isPro: true,
  },
];

const categories = ['همه', ...new Set(tools.map((t) => t.category))];

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState('همه');

  const filteredTools = selectedCategory === 'همه'
    ? tools
    : tools.filter((t) => t.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black mb-2">ابزارها</h1>
        <p className="text-text-2">ابزارهای مفید برای توسعه‌دهندگان</p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              selectedCategory === cat
                ? 'bg-primary text-white'
                : 'bg-white/5 text-text-2 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <GlassCard key={tool.id}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold">{tool.title}</h3>
              {tool.isPro && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                  Pro
                </span>
              )}
            </div>
            <p className="text-text-2 text-sm mb-4">{tool.description}</p>
            <div className="text-xs text-text-3 mb-4">{tool.category}</div>
            <a
              href={tool.url}
              className="glass-btn w-full py-2 text-center block"
            >
              استفاده
            </a>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}