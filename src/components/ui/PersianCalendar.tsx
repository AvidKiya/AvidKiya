'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import {
  toJalaali,
  getHakhameneshiYear,
  getPersianMonthName,
  getPersianWeekdayName,
  getTodayOccasion,
  getNextOccasion,
  toPersianDigits,
  jalaaliMonthLength,
  toGregorian,
  getPersianWeekday,
  PERSIAN_WEEKDAYS_FA,
  PERSIAN_WEEKDAYS_EN
} from '@/lib/persian-calendar';

export function PersianCalendar() {
  const { language } = useApp();
  const [now, setNow] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  const jalali = toJalaali(now);
  const hakhameneshiYear = getHakhameneshiYear(jalali.jy);
  const weekday = getPersianWeekday(now);
  const todayOccasion = getTodayOccasion(jalali.jm, jalali.jd, language);
  const nextOccasion = !todayOccasion ? getNextOccasion(jalali.jm, jalali.jd, language) : null;
  
  // Get calendar days
  const monthLength = jalaaliMonthLength(jalali.jy, jalali.jm);
  const firstDayOfMonth = toGregorian(jalali.jy, jalali.jm, 1);
  const firstWeekday = getPersianWeekday(firstDayOfMonth);
  
  const calendarDays: (number | null)[] = [];
  // Add empty cells for days before the 1st
  for (let i = 0; i < firstWeekday; i++) {
    calendarDays.push(null);
  }
  // Add days of the month
  for (let d = 1; d <= monthLength; d++) {
    calendarDays.push(d);
  }
  
  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return language === 'fa' 
      ? `${toPersianDigits(hours)}:${toPersianDigits(minutes)}:${toPersianDigits(seconds)}`
      : `${hours}:${minutes}:${seconds}`;
  };
  
  const weekdays = language === 'fa' ? PERSIAN_WEEKDAYS_FA : PERSIAN_WEEKDAYS_EN;
  
  return (
    <div className="glass-card-strong p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Section 1: Clock */}
        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[var(--bg-tertiary)]">
          <div className="text-5xl font-black tracking-wider gradient-text font-mono">
            {formatTime(now)}
          </div>
          <div className="mt-2 text-sm text-[var(--text-muted)]">
            {language === 'fa' ? 'ساعت زنده' : 'Live Clock'}
          </div>
        </div>
        
        {/* Section 2: Today's Date & Occasion */}
        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[var(--bg-tertiary)]">
          {/* Weekday */}
          <div className="text-lg font-medium text-[var(--text-secondary)]">
            {getPersianWeekdayName(weekday, language, true)}
          </div>
          
          {/* Date */}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-black gradient-text">
              {language === 'fa' ? toPersianDigits(jalali.jd) : jalali.jd}
            </span>
            <span className="text-2xl font-bold text-[var(--text-primary)]">
              {getPersianMonthName(jalali.jm, language)}
            </span>
            <span className="text-xl text-[var(--text-secondary)]">
              {language === 'fa' ? toPersianDigits(jalali.jy) : jalali.jy}
            </span>
          </div>
          
          {/* Hakhameneshi Year */}
          <div className="mt-2 text-sm text-[var(--accent-amber)]">
            {language === 'fa' 
              ? `سال هخامنشی: ${toPersianDigits(hakhameneshiYear)}`
              : `Hakhameneshi Year: ${hakhameneshiYear}`}
          </div>
          
          {/* Occasion */}
          <div className="mt-3 px-4 py-2 rounded-full bg-[var(--primary-glow)] border border-[var(--primary)]">
            {todayOccasion ? (
              <span className="text-sm font-medium text-[var(--primary)]">
                🎉 {todayOccasion}
              </span>
            ) : nextOccasion ? (
              <span className="text-sm text-[var(--text-secondary)]">
                {language === 'fa' 
                  ? `${nextOccasion.title} در ${toPersianDigits(nextOccasion.daysLeft)} روز`
                  : `${nextOccasion.title} in ${nextOccasion.daysLeft} days`}
              </span>
            ) : null}
          </div>
        </div>
        
        {/* Section 3: Full Month Calendar */}
        <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
          {/* Month Header */}
          <div className="text-center mb-3">
            <span className="font-bold text-[var(--text-primary)]">
              {getPersianMonthName(jalali.jm, language)} {language === 'fa' ? toPersianDigits(jalali.jy) : jalali.jy}
            </span>
          </div>
          
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdays.map((day, i) => (
              <div
                key={i}
                className={`text-center text-xs font-medium py-1 ${
                  i === 6 ? 'text-[var(--accent-rose)]' : 'text-[var(--text-muted)]'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => {
              if (day === null) {
                return <div key={i} className="aspect-square" />;
              }
              
              const isToday = day === jalali.jd;
              const dayDate = toGregorian(jalali.jy, jalali.jm, day);
              const dayWeekday = getPersianWeekday(dayDate);
              const isFriday = dayWeekday === 6;
              
              return (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm transition-colors ${
                    isToday
                      ? 'gradient-bg text-white font-bold'
                      : isFriday
                        ? 'text-[var(--accent-rose)] hover:bg-[var(--bg-secondary)]'
                        : 'hover:bg-[var(--bg-secondary)]'
                  }`}
                >
                  {language === 'fa' ? toPersianDigits(day) : day}
                </div>
              );
            })}
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default PersianCalendar;
