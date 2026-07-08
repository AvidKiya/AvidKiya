'use client';
import { useCms } from '@/lib/cms/cms-context';
import { GlassCard } from '@/components/ui/glass';
import { useState, useMemo } from 'react';
import { serviceCategories, type ServiceCategory } from '@/lib/cafe-services';
import {
  Scale, GraduationCap, TrendingUp, Landmark, Car, Palette, Shield,
  Search, Clock, CheckCircle2, ArrowLeft, ShieldCheck, FileCheck2,
  Wallet, UploadCloud, MessageSquareText, Sparkles, Star, ChevronDown,
  Brain
} from 'lucide-react';
import Link from 'next/link';

const iconMap: Record<string, React.ElementType> = {
  'scale': Scale,
  'graduation-cap': GraduationCap,
  'trending-up': TrendingUp,
  'landmark': Landmark,
  'car': Car,
  'palette': Palette,
  'shield': Shield,
};

const FEATURES = [
  { icon: ShieldCheck, title: 'بدون نیاز به حضور', desc: 'همه‌چیز از خونه یا محل کارتون انجام می‌شه، دقیقاً مثل مراجعه به یک کافی‌نت واقعی.' },
  { icon: FileCheck2, title: 'تحویل فایل PDF نهایی', desc: 'خروجی هر سفارش، یک فایل PDF مرتب و آماده چاپ یا ارسال است.' },
  { icon: Clock, title: 'تحویل سریع', desc: 'بیشتر سفارش‌ها بین چند ساعت تا حداکثر ۲ روز کاری آماده می‌شن.' },
  { icon: Wallet, title: 'قیمت شفاف', desc: 'پیش از ثبت سفارش، هزینه دقیق کار رو می‌بینید؛ بدون هیچ هزینه پنهانی.' },
];

const STEPS = [
  { icon: Sparkles, title: 'انتخاب خدمت', desc: 'از بین ده‌ها خدمت کافی‌نتی، همونی که نیاز دارید رو انتخاب کنید.' },
  { icon: UploadCloud, title: 'ثبت سفارش و ارسال مدارک', desc: 'توضیحات و فایل موردنیاز رو آپلود می‌کنید.' },
  { icon: MessageSquareText, title: 'انجام کار توسط اپراتور', desc: 'تیم کیانت با دقت سفارش شما رو بررسی و اجرا می‌کنه.' },
  { icon: FileCheck2, title: 'دریافت فایل PDF تحویلی', desc: 'از صفحه پیگیری سفارش، فایل نهایی رو دانلود می‌کنید.' },
];

const TESTIMONIALS = [
  { name: 'سارا محمدی', role: 'دانشجوی ارشد', text: 'پایان‌نامه‌مو نصف شب برای تایپ فرستادم، صبح فایل ورد و PDF آماده بود. دقیقاً مثل این بود که برم کافی‌نت محل ولی راحت‌تر!', rating: 5 },
  { name: 'علی رضایی', role: 'کارمند اداره', text: 'ثبت‌نام سامانه دولتی که همیشه گیر می‌کردم رو کیانت برام انجام داد. کد رهگیری داشتم و همه چیز شفاف بود.', rating: 5 },
  { name: 'نگار احمدی', role: 'صاحب فروشگاه', text: 'طراحی کارت ویزیت و پک استوری رو سفارش دادم، خیلی حرفه‌ای تحویل گرفتم.', rating: 5 },
];

function formatPrice(price: number): string {
  return price.toLocaleString('fa-IR');
}

export default function CafeClient() {
  const { t } = useCms();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(serviceCategories[0]?.slug || null);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return serviceCategories;
    const q = searchQuery.toLowerCase();
    return serviceCategories
      .map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          cat.title.toLowerCase().includes(q)
        )
      }))
      .filter(cat => cat.items.length > 0);
  }, [searchQuery]);

  const totalServices = serviceCategories.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-7 md:py-10">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 glass-card !rounded-full !px-4 !py-2 text-[12.5px] text-text-2 mb-5">
          <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
          {t('کافی‌نت ۱۰۰٪ مجازی — همیشه در دسترس', 'Café-Net 100% Virtual — Always Available')}
        </div>
        <h1 className="text-[28px] md:text-[38px] font-[800] tracking-[-0.02em] leading-tight mb-4">
          {t('کیانت؛ کافی‌نتی که', 'KIANET; The Café That')}
          <br />
          <span className="gradient-text">{t('هیچ‌وقت درش بسته نمی‌شه', 'Never Closes')}</span>
        </h1>
        <p className="text-text-2 text-[14px] md:text-[15px] leading-relaxed max-w-2xl mx-auto">
          {t(
            'از ثبت‌نام کنکور و وام ازدواج گرفته تا اظهارنامه مالیاتی و طراحی کارت ویزیت — همه رو آنلاین و بدون مراجعه حضوری از «کیانت» بگیرید.',
            'From university registration to tax declarations and business card design — all online, no in-person visit needed.'
          )}
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <Link href="#services" className="glass-btn-primary !py-2.5 !px-6 text-[13.5px]">
            {t('مشاهده خدمات', 'View Services')}
          </Link>
          <Link href="/cafe/order" className="glass-btn !py-2.5 !px-6 text-[13.5px]">
            {t('ثبت سفارش', 'Place Order')}
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mb-12">
        {[
          { n: `+${formatPrice(2500)}`, l: t('سفارش موفق', 'Orders Done') },
          { n: '۴.۹ / ۵', l: t('رضایت مشتری', 'Satisfaction') },
          { n: '۲۴/۷', l: t('ثبت سفارش آنلاین', 'Online 24/7') },
        ].map(s => (
          <GlassCard key={s.l} className="!p-4 text-center">
            <div className="text-[18px] md:text-[20px] font-black">{s.n}</div>
            <div className="text-[11px] text-text-3 mt-1">{s.l}</div>
          </GlassCard>
        ))}
      </div>

      {/* Features */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-14">
        {FEATURES.map((f, i) => (
          <GlassCard key={f.title} className="!p-5">
            <div className="w-10 h-10 rounded-[13px] bg-primary/10 text-primary flex items-center justify-center mb-3">
              <f.icon size={19} />
            </div>
            <h3 className="font-bold text-[14px] mb-1">{f.title}</h3>
            <p className="text-[12px] text-text-2 leading-relaxed">{f.desc}</p>
          </GlassCard>
        ))}
      </div>

      {/* How it works */}
      <div className="mb-14">
        <div className="text-center mb-8">
          <span className="text-[12px] font-medium text-primary">{t('فرآیند سفارش', 'Order Process')}</span>
          <h2 className="text-[22px] md:text-[26px] font-[800] mt-1">
            {t('دقیقاً مثل رفتن به کافی‌نت، فقط از راه دور', 'Just like going to a café, but remote')}
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {STEPS.map((step, i) => (
            <GlassCard key={step.title} className="!p-5 relative">
              <span className="text-[36px] font-black text-white/[0.06] absolute top-3 right-4">{`0${i + 1}`}</span>
              <div className="w-10 h-10 rounded-[13px] bg-primary/10 text-primary flex items-center justify-center mb-3 relative z-10">
                <step.icon size={19} />
              </div>
              <h3 className="font-bold text-[13.5px] mb-1">{step.title}</h3>
              <p className="text-[12px] text-text-2 leading-relaxed">{step.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="mb-14">
        <div className="text-center mb-6">
          <span className="text-[12px] font-medium text-primary">{t('تعرفه خدمات', 'Service Tariffs')}</span>
          <h2 className="text-[22px] md:text-[26px] font-[800] mt-1">
            {t(`${totalServices} خدمت در ${serviceCategories.length} دسته`, `${totalServices} services in ${serviceCategories.length} categories`)}
          </h2>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-6">
          <div className="relative">
            <Search size={17} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('جستجو در خدمات...', 'Search services...')}
              className="glass-input !pr-11 text-[13.5px]"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button
            onClick={() => { setActiveCategory(null); }}
            className={`glass-card !rounded-full !px-4 !py-2 text-[12.5px] cursor-pointer transition-all ${
              !activeCategory ? 'ring-1 ring-primary/50 text-primary' : ''
            }`}
          >
            {t('همه', 'All')}
          </button>
          {serviceCategories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => { setActiveCategory(cat.slug); setExpandedCategory(cat.slug); }}
              className={`glass-card !rounded-full !px-4 !py-2 text-[12.5px] cursor-pointer transition-all ${
                activeCategory === cat.slug ? 'ring-1 ring-primary/50 text-primary' : ''
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Categories Accordion */}
        <div className="space-y-3">
          {filteredCategories
            .filter(cat => !activeCategory || cat.slug === activeCategory)
            .map(cat => {
              const Icon = iconMap[cat.icon] || Sparkles;
              const isExpanded = expandedCategory === cat.slug;
              return (
                <GlassCard key={cat.slug} className="!p-0 overflow-hidden" hover={false}>
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : cat.slug)}
                    className="w-full flex items-center justify-between p-5 cursor-pointer text-right"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-[13px] bg-gradient-to-br ${cat.color} flex items-center justify-center text-primary`}>
                        <Icon size={19} />
                      </div>
                      <div>
                        <div className="font-bold text-[14.5px]">{cat.title}</div>
                        <div className="text-[11.5px] text-text-3 mt-0.5">{cat.tagline}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-text-3 glass-card !rounded-full !px-2.5 !py-1">
                        {cat.items.length} {t('خدمت', 'services')}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-text-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="border-t border-glass-border p-4">
                      <div className="grid gap-2.5">
                        {cat.items.map(item => (
                          <div
                            key={item.slug}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl bg-white/[0.03] p-4 hover:bg-white/[0.06] transition-colors"
                          >
                            <div className="flex-1">
                              <div className="font-medium text-[13.5px] mb-0.5">{item.title}</div>
                              <div className="text-[11.5px] text-text-3">{item.description}</div>
                            </div>
                            <div className="flex items-center gap-4 shrink-0">
                              <div className="text-left">
                                <div className="text-[13px] font-bold text-primary">{formatPrice(item.price)} <span className="text-[10px] text-text-3 font-normal">{t('تومان', 'T')}</span></div>
                                <div className="text-[10.5px] text-text-3 flex items-center gap-1">
                                  <Clock size={11} /> {item.deliveryTime}
                                </div>
                              </div>
                              <Link
                                href={`/cafe/order?category=${cat.slug}&service=${item.slug}`}
                                className="glass-btn !px-3 !py-2 text-[11.5px] whitespace-nowrap"
                              >
                                {t('سفارش', 'Order')}
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </GlassCard>
              );
            })}
        </div>
      </div>

      {/* Testimonials */}
      <div className="mb-14">
        <div className="text-center mb-6">
          <span className="text-[12px] font-medium text-primary">{t('نظرات مشتریان', 'Customer Reviews')}</span>
          <h2 className="text-[22px] md:text-[26px] font-[800] mt-1">
            {t('مشتری‌های کیانت چی می‌گن؟', 'What customers say about KIANET?')}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((tm, i) => (
            <GlassCard key={tm.name} className="!p-5">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: tm.rating }).map((_, j) => (
                  <Star key={j} size={13} className="fill-amber text-amber" />
                ))}
              </div>
              <p className="text-[12.5px] text-text-2 leading-relaxed mb-4">"{tm.text}"</p>
              <div className="border-t border-glass-border pt-3">
                <div className="text-[13px] font-bold">{tm.name}</div>
                <div className="text-[11px] text-text-3">{tm.role}</div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-14">
        <div className="text-center mb-6">
          <span className="text-[12px] font-medium text-primary">{t('سوالات متداول', 'FAQ')}</span>
          <h2 className="text-[22px] md:text-[26px] font-[800] mt-1">
            {t('هر سوالی که ممکنه داشته باشید', 'Everything you might want to know')}
          </h2>
        </div>
        <div className="max-w-2xl mx-auto space-y-3">
          {[
            { q: 'چطور سفارش بدم؟', a: 'خدمت مورد نظرتون رو انتخاب کنید، توضیحات و مدارک لازم رو از طریق فرم تماس ارسال کنید. تیم ما کمتر از ۱۲ ساعت پاسخ می‌ده.' },
            { q: 'آیا اطلاعات شخصی من امنه؟', a: 'بله، تمام اطلاعات شما رمزنگاری شده و فقط برای انجام سفارش استفاده می‌شه. ما از استانداردهای امنیتی بالا استفاده می‌کنیم.' },
            { q: 'زمان تحویل چقدره؟', a: 'بیشتر سفارش‌ها بین ۱۰ دقیقه تا ۴۸ ساعت آماده می‌شن. زمان دقیق هر خدمت در کنار تعرفه ذکر شده.' },
            { q: 'آیا امکان پرداخت اقساطی وجود داره؟', a: 'برای سفارش‌های بالای ۵ میلیون تومان، امکان پرداخت اقساطی وجود داره. با ما تماس بگیرید.' },
          ].map((faq, i) => (
            <FaqItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>

      {/* Cross-promotion: Planner */}
      <div className="mb-14">
        <Link href="/planner" className="group block">
          <GlassCard className="!p-6 md:!p-8 bg-gradient-to-br from-violet/5 to-primary/5 hover:shadow-glass-lg transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-[18px] bg-violet/15 text-violet flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Brain size={28} />
                </div>
                <div>
                  <div className="text-[11px] text-violet font-medium mb-1">KIYA PLANNER</div>
                  <h3 className="text-[18px] md:text-[20px] font-[800] mb-2">
                    {t('مغز دوم AI — مدیریت زندگی هوشمند', 'AI Second Brain — Smart Life Management')}
                  </h3>
                  <p className="text-[13px] text-text-2 leading-relaxed">
                    {t(
                      'وظایف، اهداف، عادات، دانش، مالی و سلامت — با دستیار AI داخلی',
                      'Tasks, goals, habits, knowledge, finance & health — with built-in AI assistant'
                    )}
                  </p>
                </div>
              </div>
              <div className="glass-btn !px-5 !py-2.5 text-[13px] whitespace-nowrap self-start md:self-center">
                {t('مشاهده پلنر', 'View Planner')} <ArrowLeft size={14} className="inline mr-1" />
              </div>
            </div>
          </GlassCard>
        </Link>
      </div>

      {/* CTA */}
      <GlassCard className="!p-8 md:!p-10 text-center max-w-2xl mx-auto">
        <h3 className="text-[20px] md:text-[24px] font-[800] mb-2">
          {t('آماده شروع هستید؟', 'Ready to get started?')}
        </h3>
        <p className="text-text-2 text-[13.5px] mb-5">
          {t('همین الان سفارش بدید — کمتر از ۱۲ ساعت پاسخ می‌دهیم', 'Order now — we respond within 12 hours')}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/cafe/order" className="glass-btn-primary !py-3 !px-6 text-[14px]">
            {t('ثبت سفارش جدید', 'Place New Order')} <ArrowLeft size={15} className="inline mr-1" />
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <GlassCard className="!p-0 overflow-hidden" hover={false}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 cursor-pointer text-right"
      >
        <span className="font-medium text-[13.5px]">{question}</span>
        <ChevronDown size={17} className={`text-text-3 transition-transform shrink-0 mr-3 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="border-t border-glass-border px-5 pb-5 pt-3">
          <p className="text-[12.5px] text-text-2 leading-relaxed">{answer}</p>
        </div>
      )}
    </GlassCard>
  );
}
