import { Metadata } from 'next';
import ResumeClient from './resume-client';

export const metadata: Metadata = {
  title: 'رزومه — اَوید کیا',
  description: 'رزومه حرفه‌ای اَوید کیا — Print optimized',
};

export default function Page(){ return <ResumeClient /> }
