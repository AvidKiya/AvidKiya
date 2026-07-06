'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass';

export const metadata = { title: 'اعلان‌ها — AvidKiya' };

interface Notification {
  id: string;
  type: 'expiry' | 'report' | 'streak' | 'comment' | 'product' | 'system';
  title: string;
  message?: string;
  read: boolean;
  createdAt: string;
}

const typeIcons: Record<string, string> = {
  expiry: '⏰',
  report: '📊',
  streak: '🔥',
  comment: '💬',
  product: '📦',
  system: '🔔',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'system',
      title: 'به KIYA Planner خوش آمدید!',
      message: 'از امکانات جدید لذت ببرید.',
      read: false,
      createdAt: '۱۴۰۳/۱۰/۱۵',
    },
    {
      id: '2',
      type: 'streak',
      title: '۵ روز streak!',
      message: 'تبریک! شما ۵ روز متوالی عادت ورزش را انجام دادید.',
      read: false,
      createdAt: '۱۴۰۳/۱۰/۱۴',
    },
    {
      id: '3',
      type: 'comment',
      title: 'نظر جدید',
      message: 'علی روی پروژه شما نظر گذاشت.',
      read: true,
      createdAt: '۱۴۰۳/۱۰/۱۰',
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black mb-2">اعلان‌ها</h1>
          {unreadCount > 0 && (
            <p className="text-text-2">{unreadCount} اعلان خوانده نشده</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="glass-btn px-4 py-2"
          >
            همه خوانده شد
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <GlassCard
            key={notif.id}
            className={!notif.read ? 'bg-primary/5 border-primary/20' : ''}
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl">{typeIcons[notif.type]}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold">{notif.title}</h3>
                  {!notif.read && (
                    <span className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
                {notif.message && (
                  <p className="text-text-2 text-sm">{notif.message}</p>
                )}
                <div className="text-xs text-text-3 mt-2">{notif.createdAt}</div>
              </div>
              {!notif.read && (
                <button
                  onClick={() => markAsRead(notif.id)}
                  className="text-xs text-primary hover:underline"
                >
                  خواندم
                </button>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center text-text-3 py-12">
          <div className="text-4xl mb-4">🔔</div>
          <p>اعلانی وجود ندارد</p>
        </div>
      )}
    </div>
  );
}