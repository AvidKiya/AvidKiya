import { Metadata } from 'next';
import ServicesClient from './services-client';
export const metadata = { title: 'خدمات فریلنسری — اَوید کیا', description: 'توسعه Next.js، معماری Cloudflare، AI Agent' };
export default function Page(){ return <ServicesClient /> }
