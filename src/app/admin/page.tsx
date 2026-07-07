'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/kiya/panel');
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-text-3">در حال انتقال به پنل مدیریت...</p>
    </div>
  );
}