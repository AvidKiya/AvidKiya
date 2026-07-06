'use client';
import dynamic from 'next/dynamic';

const AdminGateInner = dynamic(() => import('./admin-gate'), { ssr: false });

export function AdminGate() {
  return <AdminGateInner />;
}
