import { Metadata } from 'next';
import ProjectsClient from './projects-client';

export const metadata: Metadata = {
  title: 'پروژه‌ها — اَوید کیا',
  description: 'پروژه‌های GitHub و سفارشی — VS Code Style Explorer',
};

export default function Page(){ return <ProjectsClient /> }
