"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import {
  currentPersianDate,
  nextOccasion,
  occasionFor,
  toFaDigits,
} from "@/lib/persian-calendar";
import Icon from "./Icon";

/**
 * Compact date/time widget showing:
 *  - Live clock (HH:MM:SS)
 *  - Jalali date + Achaemenid year
 *  - Today's ancient occasion (if any) — otherwise, next upcoming one
 */
export default function PersianClock({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { language } = useApp();
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const pd = currentPersianDate(now);
  const time = now.toLocaleTimeString(language === "fa" ? "fa-IR" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const today = occasionFor(pd.m, pd.d);
  const upcoming = today ? null : nextOccasion(pd);

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs font-mono">
        <Icon name="event" size={12} color="var(--primary)" />
        <span style={{ color: "var(--on-surface)" }}>
          {language === "fa"
            ? `${toFaDigits(pd.d)} ${pd.mName} ${pd.yFa} · ${toFaDigits(time)}`
            : `${pd.dow} · ${pd.d} ${pd.mName} ${pd.y} · ${time}`}
        </span>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <div
            className="text-[10px] uppercase opacity-70 tracking-widest"
            style={{ color: "var(--on-surface-variant)" }}
          >
            {language === "fa" ? "تاریخ و ساعت" : "Date & Time"}
          </div>
          <div
            className="text-lg font-bold"
            style={{ color: "var(--on-surface)" }}
          >
            {language === "fa"
              ? `${pd.dow} ${toFaDigits(pd.d)} ${pd.mName} ${pd.yFa}`
              : `${pd.dow} · ${pd.d} ${pd.mName} ${pd.y}`}
          </div>
          <div
            className="text-xs opacity-70 mt-0.5"
            style={{ color: "var(--on-surface-variant)" }}
          >
            {language === "fa"
              ? `سال ${toFaDigits(pd.ac)} تقویم شاهنشاهی هخامنشی`
              : `Year ${pd.ac} Iranian Achaemenid calendar`}
          </div>
        </div>
        <div
          className="text-3xl md:text-4xl font-bold font-mono grad-text"
        >
          {language === "fa" ? toFaDigits(time) : time}
        </div>
      </div>

      {(today || upcoming) && (
        <div
          className="mt-2 pt-2 border-t flex items-center gap-2 text-xs"
          style={{ borderColor: "var(--outline-variant)" }}
        >
          <span style={{ color: today ? "var(--primary)" : "var(--on-surface-variant)" }}>
            {today ? "🎉" : "🗓"}
          </span>
          <div className="flex-1">
            <div
              className="font-bold"
              style={{ color: today ? "var(--primary)" : "var(--on-surface)" }}
            >
              {today
                ? language === "fa"
                  ? today.title_fa
                  : today.title_en
                : language === "fa"
                ? "مناسبت پیش‌رو: " + (upcoming?.title_fa ?? "")
                : "Upcoming: " + (upcoming?.title_en ?? "")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
