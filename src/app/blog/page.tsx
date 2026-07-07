import { Metadata } from 'next';
import BlogClient from './blog-client';

export const metadata: Metadata = {
  title: 'بلاگ — اَوید کیا',
  description: 'معماری سیستم • AI • طراحی • رشد — هفته‌ای یک مقاله عمیق',
};

export default function Page(){ return <BlogClient /> }
