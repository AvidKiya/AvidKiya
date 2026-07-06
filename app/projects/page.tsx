import { Metadata } from 'next';
import ProjectsClient from './projects-client';

export const metadata: Metadata = {
  title: 'پروژه‌ها — اَوید کیا',
  description: 'پروژه‌های متن‌باز اَوید کیا — VS Code Style',
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
