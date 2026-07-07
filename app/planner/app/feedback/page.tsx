'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass';
import { ThumbsUp, Bug, Star, Check } from 'lucide-react';

interface FeatureRequest {
  id: string;
  title: string;
  votes: number;
  voted: boolean;
}

const initialRequests: FeatureRequest[] = [
  { id: '1', title: 'همگام‌سازی با Google Calendar', votes: 42, voted: false },
  { id: '2', title: 'اپلیکیشن موبایل native', votes: 37, voted: false },
  { id: '3', title: 'Knowledge Graph بصری‌تر', votes: 21, voted: false },
  { id: '4', title: 'حالت تیم / اشتراک‌گذاری پروژه', votes: 15, voted: false },
];

export default function FeedbackPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [bugText, setBugText] = useState('');
  const [bugSubmitted, setBugSubmitted] = useState(false);
  const [nps, setNps] = useState<number | null>(null);
  const [npsSubmitted, setNpsSubmitted] = useState(false);

  const vote = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, votes: r.voted ? r.votes - 1 : r.votes + 1, voted: !r.voted } : r))
    );
  };

  const submitBug = () => {
    if (!bugText.trim()) return;
    setBugSubmitted(true);
    setBugText('');
    setTimeout(() => setBugSubmitted(false), 3000);
  };

  const submitNps = (score: number) => {
    setNps(score);
    setNpsSubmitted(true);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">بازخورد محصول</h1>
      <p className="text-text-2 text-sm">نظرت برامون مهمه — بهش فکر می‌کنیم و توی نقشه راه اضافه می‌کنیم.</p>

      {/* Feature voting */}
      <GlassCard>
        <div className="flex items-center gap-2 font-bold mb-4">
          <ThumbsUp size={16} className="text-primary" />
          چه قابلیتی کم داری؟
        </div>
        <div className="space-y-2">
          {requests
            .slice()
            .sort((a, b) => b.votes - a.votes)
            .map((r) => (
              <div key={r.id} className="flex items-center justify-between glass-card !p-3 text-sm">
                <span>{r.title}</span>
                <button
                  onClick={() => vote(r.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition ${
                    r.voted ? 'bg-primary/15 text-primary' : 'bg-white/5 text-text-2 hover:bg-white/10'
                  }`}
                >
                  <ThumbsUp size={12} /> {r.votes}
                </button>
              </div>
            ))}
        </div>
      </GlassCard>

      {/* Bug report */}
      <GlassCard>
        <div className="flex items-center gap-2 font-bold mb-4">
          <Bug size={16} className="text-rose" />
          چه مشکلی داری؟
        </div>
        {bugSubmitted ? (
          <div className="text-emerald text-sm py-4 text-center flex items-center justify-center gap-1.5"><Check size={14} /> ممنون! گزارشت ثبت شد و بررسی می‌کنیم.</div>
        ) : (
          <>
            <textarea
              value={bugText}
              onChange={(e) => setBugText(e.target.value)}
              placeholder="مشکلی که دیدی رو توضیح بده…"
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none resize-none text-sm mb-3"
            />
            <button onClick={submitBug} className="glass-btn-primary px-5 py-2 text-sm">
              ارسال گزارش
            </button>
          </>
        )}
      </GlassCard>

      {/* NPS */}
      <GlassCard>
        <div className="flex items-center gap-2 font-bold mb-2">
          <Star size={16} className="text-amber" />
          چقدر KIYA رو به یک دوست پیشنهاد می‌دی؟
        </div>
        {npsSubmitted ? (
          <div className="text-emerald text-sm py-2 flex items-center gap-1.5"><Check size={14} /> ممنون از امتیازت ({nps}/10)</div>
        ) : (
          <div className="flex flex-wrap gap-2 mt-3">
            {Array.from({ length: 11 }, (_, i) => i).map((n) => (
              <button
                key={n}
                onClick={() => submitNps(n)}
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-primary/15 hover:text-primary text-sm transition flex items-center justify-center"
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
