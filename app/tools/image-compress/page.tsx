import { Metadata } from 'next';
import ImageCompressClient from './image-compress-client';

export const metadata: Metadata = {
  title: 'فشرده‌ساز تصویر — اَوید کیا',
  description: 'کم‌حجم‌سازی تصویر کاملاً در مرورگر شما (client-side) — بدون آپلود به سرور',
};

export default function Page() {
  return <ImageCompressClient />;
}
