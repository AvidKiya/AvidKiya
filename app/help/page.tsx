import Link from 'next/link';
import { HelpCircle, Mail, Search, ShoppingBag, Wrench } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass';

export const metadata = { title: 'راهنما — اَوید کیا' };

export default function Page(){
  const items = [
    { q:'چطور پروژه سفارش بدهم؟', a:'از صفحه تماس فرم درخواست را پر کنید و هدف، زمان‌بندی و بودجه تقریبی را بنویسید.', icon: Mail },
    { q:'ابزارهای سایت نیاز به ثبت‌نام دارند؟', a:'خیر، ابزارهای عمومی داخل مرورگر اجرا می‌شوند و برای کارهای روزانه آماده‌اند.', icon: Wrench },
    { q:'محصولات فروشگاه چطور تحویل می‌شوند؟', a:'بعد از نهایی شدن سفارش، فایل یا لینک دسترسی دیجیتال برای شما ارسال می‌شود.', icon: ShoppingBag },
    { q:'کجا دنبال محتوا بگردم؟', a:'از جستجوی بالای سایت یا صفحه بلاگ برای پیدا کردن مقاله، پروژه و ابزار استفاده کنید.', icon: Search },
  ];
  return <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-14">
    <div className="text-center max-w-2xl mx-auto mb-8">
      <div className="w-12 h-12 rounded-[16px] bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4"><HelpCircle size={24}/></div>
      <h1 className="text-3xl md:text-4xl font-black tracking-[-0.03em] mb-3">راهنما</h1>
      <p className="text-text-2 text-sm leading-8">پاسخ سریع به سؤال‌های پرتکرار درباره همکاری، ابزارها، فروشگاه و محتوای سایت.</p>
    </div>
    <div className="grid md:grid-cols-2 gap-4">
      {items.map(item=>{ const Icon=item.icon; return <GlassCard key={item.q} className="!p-5"><Icon className="text-primary mb-3" size={22}/><h2 className="font-bold mb-2">{item.q}</h2><p className="text-sm text-text-2 leading-7">{item.a}</p></GlassCard> })}
    </div>
    <div className="text-center mt-7"><Link href="/contact" className="glass-btn-primary inline-flex !py-3 !px-5">هنوز سؤال دارید؟ پیام بدهید</Link></div>
  </div>;
}
