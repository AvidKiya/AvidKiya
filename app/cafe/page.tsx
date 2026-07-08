import { Metadata } from 'next';
import CafeClient from './cafe-client';

export const metadata: Metadata = {
  title: 'کافی‌نت آنلاین — خدمات مجازی کیانت',
  description: 'کافی‌نت ۱۰۰٪ مجازی — ثبت‌نام کنکور، وام ازدواج، اظهارنامه مالیاتی، طراحی رزومه و ده‌ها خدمت دیگر بدون نیاز به حضور',
  openGraph: {
    title: 'کافی‌نت آنلاین — خدمات مجازی کیانت',
    description: 'همه خدمات کافی‌نت از خانه یا محل کار — سریع، شفاف، حرفه‌ای',
  }
};

export default function Page() {
  return <CafeClient />;
}
