import { Metadata } from 'next';
import ToolsClient from './tools-client';

export const metadata: Metadata = {
  title: 'ابزارها — اَوید کیا',
  description: 'ابزارهای آنلاین رایگان و حرفه‌ای — بدون ثبت‌نام، حریم‌محور',
};

export default function Page(){ return <ToolsClient /> }
