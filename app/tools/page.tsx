import { Metadata } from 'next';
import ToolsClient from './tools-client';
export const metadata = { title: 'ابزارها — اَوید کیا', description: 'ابزارهای آنلاین رایگان و حرفه‌ای' };
export default function Page(){ return <ToolsClient /> }
