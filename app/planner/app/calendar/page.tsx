'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass';
import { EmptyState } from '@/components/ui/states';

interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
}

const authHeader = () => ({ Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('kiya_jwt') || '' : ''}` });

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const demo: Event[] = [
      { id: '1', title: 'جلسه تیم', date: new Date().toISOString().split('T')[0], time: '10:00' },
      { id: '2', title: 'ورزش', date: new Date().toISOString().split('T')[0], time: '18:00' },
    ];
    try {
      const res = await fetch('/api/planner/calendar', { headers: authHeader() });
      if (res.ok) {
        const data = await res.json();
        setEvents(data.data && data.data.length > 0 ? data.data : demo);
      } else {
        setEvents(demo);
      }
    } catch {
      setEvents(demo);
    }
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const addEvent = async () => {
    if (!newEvent.title || !newEvent.date) return;

    try {
      const res = await fetch('/api/planner/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ title: newEvent.title, date: newEvent.date, time: newEvent.time || undefined }),
      });
      if (res.ok) {
        const data = await res.json();
        setEvents((prev) => [...prev, data.data]);
      } else {
        const event: Event = { id: `event-${Date.now()}`, title: newEvent.title, date: newEvent.date, time: newEvent.time || undefined };
        setEvents((prev) => [...prev, event]);
      }
    } catch {
      const event: Event = { id: `event-${Date.now()}`, title: newEvent.title, date: newEvent.date, time: newEvent.time || undefined };
      setEvents((prev) => [...prev, event]);
    }
    setNewEvent({ title: '', date: '', time: '' });
    setShowAddForm(false);
  };

  const deleteEvent = async (id: string) => {
    try {
      await fetch(`/api/planner/calendar?id=${id}`, { method: 'DELETE', headers: authHeader() });
    } catch {}
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const getEventsForDate = (date: string) => {
    return events.filter((e) => e.date === date);
  };

  const monthNames = [
    'ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن',
    'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">تقویم</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="glass-btn-primary px-4 py-2"
        >
          + رویداد جدید
        </button>
      </div>

      {/* Add Event Form */}
      {showAddForm && (
        <GlassCard>
          <div className="flex gap-4">
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder="عنوان رویداد"
              className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
            />
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10"
            />
            <input
              type="time"
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10"
            />
            <button onClick={addEvent} className="glass-btn-primary px-4 py-2">
              افزودن
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="glass-btn px-4 py-2"
            >
              انصراف
            </button>
          </div>
        </GlassCard>
      )}

      {/* Calendar Header */}
      <GlassCard>
        <div className="flex justify-between items-center mb-4">
          <button onClick={prevMonth} className="glass-btn px-3 py-1">
            ←
          </button>
          <h2 className="font-bold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button onClick={nextMonth} className="glass-btn px-3 py-1">
            →
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'].map((day) => (
            <div key={day} className="text-center text-sm text-text-3 py-2">
              {day}
            </div>
          ))}

          {/* Empty cells for days before first day of month */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-20" />
          ))}

          {/* Days of month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = getEventsForDate(dateStr);
            const isToday = dateStr === new Date().toISOString().split('T')[0];

            return (
              <div
                key={day}
                className={`h-20 p-1 border border-white/5 rounded-lg ${
                  isToday ? 'bg-primary/10 border-primary' : ''
                }`}
              >
                <div className={`text-sm mb-1 ${isToday ? 'text-primary font-bold' : ''}`}>
                  {day}
                </div>
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className="text-xs bg-primary/20 text-primary px-1 py-0.5 rounded mb-0.5 truncate"
                  >
                    {event.time && `${event.time} `}{event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-text-3">+{dayEvents.length - 2} more</div>
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Upcoming Events */}
      <div>
        <h2 className="font-bold mb-4">رویدادهای آینده</h2>
        <div className="space-y-2">
          {events
            .filter((e) => e.date >= new Date().toISOString().split('T')[0])
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 5)
            .map((event) => (
              <GlassCard key={event.id}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold">{event.title}</div>
                    <div className="text-sm text-text-3">
                      {event.date} {event.time && `- ${event.time}`}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    حذف
                  </button>
                </div>
              </GlassCard>
            ))}
        </div>
      </div>
    </div>
  );
}