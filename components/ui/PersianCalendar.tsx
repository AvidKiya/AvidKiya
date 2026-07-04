"use client";

import React, { useState, useEffect } from "react";
import { useCms } from "@/contexts/CmsContext";
import { toPersianDigits, getPersianDate, getHakhmaneshiYear } from "@/lib/persian-calendar";

export function PersianClock() {
  const { locale } = useCms();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const persian = getPersianDate(now);
  const hakhYear = getHakhmaneshiYear(persian.year);

  const formatTime = () => {
    const h = now.getHours().toString().padStart(2, "0");
    const m = now.getMinutes().toString().padStart(2, "0");
    const s = now.getSeconds().toString().padStart(2, "0");
    const time = `${h}:${m}:${s}`;
    return locale === "fa" ? toPersianDigits(time) : time;
  };

  return (
    <div className="text-center space-y-1">
      <div className="text-4xl font-mono font-black tracking-wider gradient-text">
        {formatTime()}
      </div>
      <div className="text-sm text-[var(--color-text-muted)]">
        {locale === "fa" ? (
          <>
            {persian.dayName}، {toPersianDigits(persian.day)} {persian.monthName} {toPersianDigits(persian.year)}
            <span className="block text-xs mt-0.5">
              سال هخامنشی: {toPersianDigits(hakhYear)}
            </span>
          </>
        ) : (
          <>
            {persian.dayName}, {persian.day} {persian.monthName} {persian.year}
            <span className="block text-xs mt-0.5">
              Achaemenid Year: {hakhYear}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export function PersianCalendarFull() {
  const { locale } = useCms();
  const [viewMonth, setViewMonth] = useState(() => {
    const p = getPersianDate();
    return { year: p.year, month: p.month };
  });

  const p = getPersianDate();
  const isCurrentMonth = viewMonth.year === p.year && viewMonth.month === p.month;

  const prevMonth = () => {
    let m = viewMonth.month - 1;
    let y = viewMonth.year;
    if (m < 1) { m = 12; y--; }
    setViewMonth({ year: y, month: m });
  };

  const nextMonth = () => {
    let m = viewMonth.month + 1;
    let y = viewMonth.year;
    if (m > 12) { m = 1; y++; }
    setViewMonth({ year: y, month: m });
  };

  // Build calendar grid
  const daysInMonth = (() => {
    if (viewMonth.month <= 6) return 31;
    if (viewMonth.month <= 11) return 30;
    // Leap year check for month 12
    const epbase = viewMonth.year - (viewMonth.year >= 0 ? 474 : 473);
    const epyear = 474 + ((epbase % 2820) + 2820) % 2820;
    return ((epyear * 8 + 21) % 33 < 8) ? 30 : 29;
  })();

  // Get first day of week (0=شنبه)
  const { persianToGregorian: p2g } = require("@/lib/persian-calendar");
  const firstG = p2g(viewMonth.year, viewMonth.month, 1);
  const firstDayOfWeek = (firstG.getDay() + 1) % 7;

  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) week.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  const monthNames = locale === "fa"
    ? ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"]
    : ["Farvardin","Ordibehesht","Khordad","Tir","Mordad","Shahrivar","Mehr","Aban","Azar","Dey","Bahman","Esfand"];

  const weekDays = locale === "fa" ? ["ش","ی","د","س","چ","پ","ج"] : ["S","M","T","W","T","F","S"];

  return (
    <div className="glass p-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-[var(--color-bg-alt)] transition">
          {locale === "fa" ? "‹" : "›"}
        </button>
        <h3 className="font-bold text-sm">
          {monthNames[viewMonth.month - 1]} {locale === "fa" ? toPersianDigits(viewMonth.year) : viewMonth.year}
        </h3>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-[var(--color-bg-alt)] transition">
          {locale === "fa" ? "›" : "‹"}
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {weekDays.map((d, i) => (
          <div key={i} className="text-xs font-bold text-[var(--color-text-subtle)] py-1">{d}</div>
        ))}
        {weeks.flat().map((day, idx) => {
          const isToday = isCurrentMonth && day === p.day;
          return (
            <div
              key={idx}
              className={`
                text-xs py-1.5 rounded-lg transition relative
                ${!day ? "invisible" : ""}
                ${isToday
                  ? "bg-[var(--color-primary)] text-white font-bold"
                  : day && locale === "fa"
                    ? "hover:bg-[var(--color-bg-alt)]"
                    : day ? "hover:bg-[var(--color-bg-alt)]" : ""
                }
              `}
            >
              {day ? (locale === "fa" ? toPersianDigits(day) : day) : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}
