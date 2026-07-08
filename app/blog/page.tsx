import { Metadata } from 'next';
import BlogClient from './blog-client';
export const metadata = { title: 'بلاگ — اَوید کیا', description: 'مقالات فنی، معماری سیستم، AI، رشد' };
export default function Page(){ return <BlogClient /> }
