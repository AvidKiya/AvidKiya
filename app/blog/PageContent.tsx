'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
}

const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'معرفی KIYA Planner',
    excerpt: 'آشنایی با ابزار برنامه‌ریزی هوشمند KIYA',
    category: 'معرفی',
    tags: ['KIYA', 'برنامه‌ریزی'],
    publishedAt: '۱۴۰۳/۱۰/۱۵',
    readTime: 5,
  },
  {
    id: '2',
    title: '۱۰ عادت موفقیت',
    excerpt: 'عادت‌هایی که افراد موفق هر روز انجام می‌دهند',
    category: ' productivity',
    tags: ['عادت', 'موفقیت'],
    publishedAt: '۱۴۰۳/۱۰/۱۰',
    readTime: 8,
  },
  {
    id: '3',
    title: 'آموزش React پیشرفته',
    excerpt: 'نکات و ترفندهای پیشرفته React',
    category: 'آموزش',
    tags: ['React', 'JavaScript'],
    publishedAt: '۱۴۰۳/۱۰/۰۵',
    readTime: 12,
  },
];

const categories = ['همه', ...new Set(mockPosts.map((p) => p.category))];

export default function BlogPageContent() {
  const [selectedCategory, setSelectedCategory] = useState('همه');

  const filteredPosts = selectedCategory === 'همه'
    ? mockPosts
    : mockPosts.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black mb-2">بلاگ</h1>
        <p className="text-text-2">مقالات و آموزش‌ها</p>
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

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <GlassCard key={post.id}>
            <div className="h-40 bg-white/5 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-4xl">📝</span>
            </div>
            <div className="text-xs text-text-3 mb-1">{post.category}</div>
            <h3 className="font-bold mb-2">{post.title}</h3>
            <p className="text-text-2 text-sm mb-4">{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {post.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-xs bg-white/10 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-xs text-text-3">{post.readTime} دقیقه</span>
            </div>
            <div className="text-xs text-text-3 mt-3">{post.publishedAt}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
