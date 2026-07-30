'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AdminGate() {
  const router = useRouter();
  useEffect(() => {
    const check = () => {
      if (window.location.hash.includes('kiya/panel')) {
        history.replaceState(null, '', window.location.pathname);
        router.push('/kiya/login?next=/kiya/panel');
      }
    };
    check();
    window.addEventListener('hashchange', check);
    return () => window.removeEventListener('hashchange', check);
  }, [router]);
  return null;
}

export default AdminGate;
