import { Metadata } from 'next';
import DateConverterClient from './date-converter-client';

export const metadata: Metadata = {
  title: 'مبدل تاریخ — اَوید کیا',
  description: 'تبدیل تاریخ شمسی به میلادی، شاهنشاهی و یزدگردی — بدون ثبت‌نام، کاملاً client-side',
};

export default function Page() {
  return <DateConverterClient />;
}
