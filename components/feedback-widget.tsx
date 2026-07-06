'use client';

import { useState } from 'react';
import { GlassCard } from './ui/glass';

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    // In production, send to API
    setSubmitted(true);
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
      setRating(0);
      setMessage('');
    }, 2000);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-40 glass-btn-primary px-4 py-2 text-sm shadow-lg"
      >
        💬 نظر شما
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-80">
      <GlassCard>
        {submitted ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-2">🙏</div>
            <p className="font-bold">ممنون از نظر شما!</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm">نظر شما</h3>
              <button onClick={() => setOpen(false)} className="text-text-3 hover:text-text-1">×</button>
            </div>

            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-text-3'}`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="نظر یا پیشنهاد شما..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none text-sm mb-3 resize-none"
            />

            <button
              onClick={submit}
              disabled={!rating}
              className="glass-btn-primary w-full py-2 text-sm"
            >
              ارسال نظر
            </button>
          </>
        )}
      </GlassCard>
    </div>
  );
}