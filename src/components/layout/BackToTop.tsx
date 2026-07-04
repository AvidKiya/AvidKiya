'use client';

import { useEffect, useState } from 'react';
import Icon from '@/components/ui/Icon';

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 z-50 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:brightness-110 transition no-print"
      style={{ insetInlineEnd: '1.5rem' }}
      aria-label="Back to top"
    >
      <Icon name="arrow-up" size={18} />
    </button>
  );
}
