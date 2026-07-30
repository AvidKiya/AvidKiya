'use client';

import { useEffect, useRef, useState } from 'react';

const STORAGE = 'avidkiya_orange_cat_position';

type Pos = { x: number; y: number };

export function OrangeCatPet() {
  const [pos, setPos] = useState<Pos>({ x: 120, y: 520 });
  const [dragging, setDragging] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const dir = useRef(1);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE);
      if (saved) setPos(JSON.parse(saved));
      else setPos({ x: Math.max(40, window.innerWidth - 180), y: Math.min(560, window.innerHeight - 170) });
    } catch {}
  }, []);

  useEffect(() => {
    if (dragging) return;
    const id = window.setInterval(() => {
      setPos(p => {
        const maxX = Math.max(80, window.innerWidth - 110);
        const maxY = Math.max(140, window.innerHeight - 110);
        let nx = p.x + dir.current * (18 + Math.random() * 18);
        let ny = p.y + (Math.random() - 0.5) * 12;
        if (nx > maxX || nx < 30) { dir.current *= -1; nx = Math.max(30, Math.min(maxX, nx)); }
        ny = Math.max(110, Math.min(maxY, ny));
        const next = { x: nx, y: ny };
        try { localStorage.setItem(STORAGE, JSON.stringify(next)); } catch {}
        return next;
      });
      setSleeping(Math.random() > 0.72);
    }, 1800);
    return () => window.clearInterval(id);
  }, [dragging]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    setSleeping(false);
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const next = {
      x: Math.max(12, Math.min(window.innerWidth - 96, e.clientX - offset.current.x)),
      y: Math.max(74, Math.min(window.innerHeight - 96, e.clientY - offset.current.y)),
    };
    setPos(next);
    try { localStorage.setItem(STORAGE, JSON.stringify(next)); } catch {}
  };
  const onPointerUp = () => setDragging(false);

  return (
    <div
      className={`orange-cat-pet ${dragging ? 'is-dragging' : ''} ${sleeping ? 'is-sleeping' : ''}`}
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDoubleClick={() => setSleeping(s => !s)}
      title="گربه نارنجی اَوید — بگیر و جابه‌جایش کن"
      aria-label="گربه نارنجی قابل جابه‌جایی"
    >
      <div className="cat-tail" />
      <div className="cat-body">
        <span className="stripe s1" />
        <span className="stripe s2" />
        <span className="stripe s3" />
      </div>
      <div className="cat-head">
        <span className="ear left" />
        <span className="ear right" />
        <span className="eye left" />
        <span className="eye right" />
        <span className="nose" />
        <span className="whisker w1" />
        <span className="whisker w2" />
      </div>
      <div className="cat-paw p1" />
      <div className="cat-paw p2" />
      <div className="cat-shadow" />
    </div>
  );
}
