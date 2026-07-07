'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from './ui/glass';
import { AppIcon } from './ui/icons';

interface Notification {
  id: string;
  type: string;
  title: string;
  message?: string;
  read: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // In production, fetch from API
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'system',
        title: 'به KIYA Planner خوش آمدید!',
        message: 'از امکانات جدید لذت ببرید.',
        read: false,
        createdAt: new Date().toISOString(),
      },
    ];
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter((n) => !n.read).length);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <AppIcon name="bell" size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 z-50">
          <GlassCard>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">اعلان‌ها</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary hover:underline"
                >
                  همه خوانده شد
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <p className="text-text-3 text-center py-4">اعلانی وجود ندارد</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      notif.read ? 'bg-white/5' : 'bg-primary/10'
                    }`}
                  >
                    <div className="font-bold text-sm">{notif.title}</div>
                    {notif.message && (
                      <div className="text-xs text-text-2 mt-1">{notif.message}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  );
}