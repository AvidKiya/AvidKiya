import { Metadata } from 'next';
import PlannerLandingClient from './planner-landing-client';

export const metadata: Metadata = {
  title: 'KIYA Planner — مغز دوم تو',
  description: 'سیستم مدیریت زندگی AI — وظایف، اهداف، عادات، دانش، مالی، سلامت — با لایسنس',
  openGraph: {
    title: 'KIYA Planner — مغز دوم AI',
    description: 'مدیریت زندگی با AI — ثبت سریع، چت هوشمند، بینش خودکار',
  }
};

export default function Page(){ return <PlannerLandingClient /> }
