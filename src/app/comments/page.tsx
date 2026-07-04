'use client';

import { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import Icon from '@/components/ui/Icon';
import { tl } from '@/lib/i18n';

interface DisplayComment {
  id: string; name: string; role: string; rating: number;
  body: string; pinned: boolean; createdAt: string;
}

export default function CommentsPage() {
  const { lang } = useApp();
  const [comments, setComments] = useState<DisplayComment[]>([]);
  const [form, setForm] = useState({ name: '', email: '', role: '', rating: 5, body: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/comments')
      .then(r => r.ok ? r.json() : { comments: [] })
      .then(d => setComments(d.comments || []))
      .catch(() => {});
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) setSubmitted(true);
    } catch { /* ignore */ }
  }, [form]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-black mb-6 gradient-text">{tl('comments', lang)}</h1>

      {/* Form */}
      {submitted ? (
        <div className="glass-card p-6 text-center text-accent-emerald font-bold mb-6">
          ✅ {tl('pending', lang)}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-card p-5 space-y-3 mb-8">
          <h2 className="text-sm font-bold mb-2">{tl('yourComment', lang)}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder={tl('name', lang)} required
              className="px-3 py-2 rounded-lg bg-bg-primary border border-border-theme text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder={tl('email', lang)} type="email" required
              className="px-3 py-2 rounded-lg bg-bg-primary border border-border-theme text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <input value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
            placeholder={tl('role', lang)}
            className="w-full px-3 py-2 rounded-lg bg-bg-primary border border-border-theme text-sm focus:outline-none focus:ring-1 focus:ring-primary" />

          {/* Rating */}
          <div className="flex items-center gap-1">
            <span className="text-sm me-2">{tl('rating', lang)}:</span>
            {[1,2,3,4,5].map(n => (
              <button key={n} type="button" onClick={() => setForm(p => ({ ...p, rating: n }))}
                className="text-lg transition">
                {n <= form.rating ? '⭐' : '☆'}
              </button>
            ))}
          </div>

          <textarea value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
            placeholder={tl('message', lang)} rows={3} required
            className="w-full px-3 py-2 rounded-lg bg-bg-primary border border-border-theme text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />

          <button type="submit"
            className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:brightness-110 transition">
            {tl('submit', lang)}
          </button>
        </form>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="glass-card p-8 text-center text-text-muted">
            {lang === 'fa' ? 'هنوز نظری ثبت نشده' : 'No comments yet'}
          </div>
        ) : (
          comments.map(c => (
            <div key={c.id} className={`glass-card p-4 ${c.pinned ? 'border-accent-amber/30' : ''}`}>
              {c.pinned && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent-amber bg-accent-amber/10 px-2 py-0.5 rounded-full mb-2">
                  📌 PINNED
                </span>
              )}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold">{c.name}</div>
                  {c.role && <div className="text-[10px] text-text-muted">{c.role}</div>}
                </div>
                <div className="ms-auto text-xs">
                  {'⭐'.repeat(c.rating)}
                </div>
              </div>
              <p className="text-sm text-text-secondary">{c.body}</p>
              <div className="text-[10px] text-text-muted mt-2">
                {new Date(c.createdAt).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
