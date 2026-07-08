'use client';
import { useEffect } from 'react';
import { useCms } from '@/lib/cms/cms-context';
import { useRouter } from 'next/navigation';

export default function AdminGateClient() {
  const { setEditMode } = useCms();
  const router = useRouter();

  useEffect(() => {
    const check = () => {
      const hash = window.location.hash;
      if (hash.includes('kiya/panel')) {
        // درخواست رمز ساده
        const pass = sessionStorage.getItem('ak_admin_ok') ? 'admin' : prompt('رمز مدیر:');
        if (pass === 'admin') {
          sessionStorage.setItem('ak_admin_ok', '1');
          setEditMode(true);
          router.push('/kiya/panel');
        } else if (pass !== null) {
          alert('رمز اشتباه است');
          history.replaceState(null, '', window.location.pathname);
        }
      }
    };
    check();
    window.addEventListener('hashchange', check);
    return () => window.removeEventListener('hashchange', check);
  }, [setEditMode, router]);

  return null;
}
