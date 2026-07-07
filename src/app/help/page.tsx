'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass';


interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    question: 'KIYA Planner چیست؟',
    answer: 'KIYA Planner یک ابزار برنامه‌ریزی هوشمند با هوش مصنوعی است که به شما کمک می‌کند وظایف، اهداف، عادت‌ها و سلامت خود را مدیریت کنید.',
    category: 'شروع',
  },
  {
    question: 'چگونه شروع کنم؟',
    answer: 'ابتدا یک لایسنس KIYA دریافت کنید، سپس وارد برنامه شوید و اطلاعات خود را تکمیل کنید.',
    category: 'شروع',
  },
  {
    question: 'تفاوت پلن‌های مختلف چیست؟',
    answer: 'پلن Free محدودیت‌هایی دارد، پلن Pro امکانات کامل‌تری ارائه می‌دهد، Pro+AI هوش مصنوعی نامحدود دارد و Team برای تیم‌ها مناسب است.',
    category: 'KIYA Planner',
  },
  {
    question: 'آیا اطلاعات من امن است؟',
    answer: 'بله، تمام اطلاعات با رمزنگاری AES-256 ذخیره می‌شوند و ما هرگز اطلاعات شما را با اشخاص ثالث به اشتراک نمی‌گذاریم.',
    category: 'KIYA Planner',
  },
  {
    question: 'چگونه اشتراک خود را لغو کنم؟',
    answer: 'از بخش تنظیمات حساب خود می‌توانید اشتراک را لغو کنید. تا پایان دوره پرداخت شده، دسترسی شما فعال خواهد ماند.',
    category: 'حساب کاربری',
  },
  {
    question: 'آیا امکان بازگشت وجه وجود دارد؟',
    answer: 'بله، تا ۳۰ روز پس از خرید امکان بازگشت وجه وجود دارد.',
    category: 'حساب کاربری',
  },
];

const categories = ['همه', 'شروع', 'KIYA Planner', 'حساب کاربری', 'فروشگاه'];

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState('همه');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'همه' || faq.category === activeCategory;
    const matchesSearch = 
      faq.question.includes(searchQuery) || faq.answer.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black mb-2">مرکز راهنما</h1>
        <p className="text-text-2">پاسخ سوالات خود را پیدا کنید</p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="جستجو..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeCategory === cat
                ? 'bg-primary text-white'
                : 'bg-white/5 text-text-2 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        {filteredFaqs.map((faq, index) => (
          <GlassCard key={index}>
            <button
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              className="w-full text-right"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold">{faq.question}</h3>
                <span className="text-text-3">
                  {openFaq === index ? '−' : '+'}
                </span>
              </div>
              {openFaq === index && (
                <p className="mt-4 text-text-2">{faq.answer}</p>
              )}
            </button>
          </GlassCard>
        ))}
      </div>

      {filteredFaqs.length === 0 && (
        <div className="text-center text-text-3 py-12">
          نتیجه‌ای یافت نشد
        </div>
      )}

      {/* Contact Support */}
      <div className="mt-12 text-center">
        <GlassCard>
          <h2 className="font-bold mb-2">سوالی دارید؟</h2>
          <p className="text-text-2 mb-4">
            اگر پاسخ سوال خود را پیدا نکردید، با ما تماس بگیرید.
          </p>
          <a href="/contact" className="glass-btn-primary px-6 py-2">
            تماس با پشتیبانی
          </a>
        </GlassCard>
      </div>
    </div>
  );
}