"use client";
import { useEffect, useState } from "react";
import { nowJalali, formatJalali, getWeekdayFa, achaemenidYear, getEvent, getUpcomingEvent, buildMonthGrid, fullEventList } from "@/lib/persian-calendar";
import { faDigits } from "@/lib/i18n";

export function PersianClock(){
  const [time, setTime] = useState(new Date());
  useEffect(()=>{
    const t = setInterval(()=> setTime(new Date()), 1000);
    return ()=> clearInterval(t);
  },[]);
  const j = nowJalali();
  const weekday = getWeekdayFa(time);
  const event = getEvent(j.jm, j.jd);
  const upcoming = getUpcomingEvent(j.jm, j.jd);
  const timeStr = faDigits(time.toLocaleTimeString("fa-IR", { hour12: false }));
  const grid = buildMonthGrid(j.jy, j.jm, j.jd);
  const weekdaysShort = ["ش","ی","د","س","چ","پ","ج"];

  return (
    <div className="glass rounded-[28px] p-5 md:p-7 shadow-glow">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Clock */}
        <div className="xl:col-span-1 flex flex-col items-center justify-center text-center glass rounded-2xl p-6 bg-bg-soft/40">
          <div className="text-xs text-text-faint mb-2">ساعت زنده تهران</div>
          <div className="text-4xl md:text-5xl font-black tracking-wider fa-num text-gradient">{timeStr}</div>
          <div className="mt-3 text-sm text-text-muted">Asia/Tehran • +3:30</div>
          <div className="mt-4 text-[11px] px-3 py-1.5 rounded-full bg-success/10 text-success border border-success/20">● LIVE</div>
        </div>

        {/* Today + event */}
        <div className="xl:col-span-1 glass rounded-2xl p-6">
          <div className="text-xs text-text-faint mb-1">{weekday}</div>
          <div className="text-2xl font-black">{faDigits(formatJalali(j.jy, j.jm, j.jd))}</div>
          <div className="text-sm text-text-muted mt-1">هخامنشی: {faDigits(achaemenidYear(j.jy))}</div>
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm">
            <div className="text-[11px] text-amber-400 mb-1">مناسبت امروز</div>
            <div className="font-bold">{event || "—"}</div>
            {!event && <div className="text-xs text-text-muted mt-1">نزدیک‌ترین: {upcoming}</div>}
          </div>
          <div className="mt-4 text-[11px] text-text-faint max-h-32 overflow-auto space-y-1">
            {fullEventList.slice(0,8).map((e,i)=>(
              <div key={i} className="flex justify-between"><span>{e.title}</span><span>{faDigits(e.day)} {e.month}</span></div>
            ))}
          </div>
        </div>

        {/* Full month calendar */}
        <div className="xl:col-span-1 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="font-bold">{formatJalali(j.jy, j.jm, 1).split(" ").slice(1).join(" ")}</div>
            <div className="text-xs text-text-faint">{faDigits(j.jy)}</div>
          </div>
          <div className="grid grid-cols-7 text-[11px] text-text-faint mb-2 text-center">
            {weekdaysShort.map(w=><div key={w}>{w}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {grid.map((c,idx)=>(
              <div key={idx} className={`aspect-square flex items-center justify-center rounded-lg text-sm ${c.today ? "bg-primary text-white font-black shadow" : c.day ? "hover:bg-bg-soft bg-bg-elev/60" : "opacity-0"}`}>
                {c.day ? faDigits(c.day) : ""}
              </div>
            ))}
          </div>
          <div className="mt-3 text-[10px] text-text-faint">امروز با کادر آبی مشخص شده • تقویم شمسی / هخامنشی</div>
        </div>
      </div>
    </div>
  );
}
