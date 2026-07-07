'use client';

import { useState, useEffect } from 'react';

export function SocialProof() {
  const [userCount, setUserCount] = useState(1247);

  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 text-sm text-text-2">
      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <span>
        <strong className="text-text-1">{userCount.toLocaleString()}</strong> نفر از KIYA استفاده می‌کنند
      </span>
    </div>
  );
}