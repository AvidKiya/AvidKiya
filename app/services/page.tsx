import { Metadata } from 'next';
import ServicesClient from './services-client';

export const metadata: Metadata = {
  title: 'خدمات فریلنسری — اَوید کیا',
  description: 'طراحی و توسعه سیستم‌های مقیاس‌پذیر — Next.js • Cloudflare Edge • AI Agents',
};

export default function Page(){ return <ServicesClient /> }
