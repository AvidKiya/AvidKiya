'use client';
import dynamic from 'next/dynamic';

const PortfolioApp = dynamic(() => import('@/components/PortfolioApp'), { ssr: false });

// Admin page just redirects to main page which opens admin panel
export default function AdminPage() {
  return <PortfolioApp />;
}
