'use client';

import { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import Icon from '@/components/ui/Icon';
import { tl } from '@/lib/i18n';

export default function AboutPage() {
  const { lang, resolve, cms } = useApp();
  const a = cms.about;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left column - System Status */}
        <div className="space-y-4">
          <div className="glass-card p-4">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <Icon name="cpu" size={14} className="text-primary" />
              {resolve(a.statusTitle)}
            </h3>
            <div className="space-y-3">
              {a.metrics.map(m => (
                <MetricBar key={m.id} label={resolve(m.label)} color={m.color} basePercent={m.percent} />
              ))}
            </div>
          </div>

          <div className="glass-card p-4">
            <h3 className="text-sm font-bold mb-3">{lang === 'fa' ? 'لینک‌های سریع' : 'Quick Links'}</h3>
            <div className="space-y-1">
              {a.quickLinks.map(q => (
                <a key={q.id} href={q.url} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-text-secondary hover:text-primary hover:bg-primary/5 transition">
                  <Icon name={q.icon} size={14} />
                  {resolve(q.label)}
                </a>
              ))}
            </div>
          </div>

          <div className="glass-card p-4">
            <p className="text-sm text-text-secondary italic leading-relaxed">{resolve(a.quote)}</p>
          </div>
        </div>

        {/* Center column - Terminal */}
        <div className="lg:col-span-2">
          <div className="glass-card-strong overflow-hidden">
            {/* Terminal chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-bg-card-solid border-b border-border-theme">
              <span className="mac-dot mac-dot-red" />
              <span className="mac-dot mac-dot-yellow" />
              <span className="mac-dot mac-dot-green" />
              <UptimeCounter />
            </div>

            <div className="p-5 space-y-4">
              {/* Init lines */}
              <div className="font-mono text-xs space-y-1" dir="ltr">
                <div className="text-accent-emerald">✓ System initialized</div>
                <div className="text-accent-emerald">✓ Loading profile data...</div>
                <div className="text-accent-emerald">✓ Rendering portfolio v1.0.0</div>
                <div className="text-accent-amber">→ Welcome!</div>
              </div>

              {/* Welcome */}
              <div className="border-t border-border-theme pt-4">
                <h2 className="text-xl font-bold mb-2">{resolve(a.welcomeTitle)}</h2>
                <p className="text-sm text-text-secondary leading-relaxed">{resolve(a.welcomeBody)}</p>
              </div>

              {/* Mini projects */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {a.miniProjects.map(p => (
                  <div key={p.id} className="glass-card p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold">{resolve(p.title)}</h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono">{p.tech}</span>
                    </div>
                    <p className="text-xs text-text-secondary">{resolve(p.description)}</p>
                  </div>
                ))}
              </div>

              {/* Contact form */}
              <ContactForm />
            </div>
          </div>
        </div>

        {/* Right column - Activity */}
        <div className="space-y-4">
          {/* GitHub heatmap */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <Icon name="bar-chart" size={14} className="text-accent-emerald" />
              {lang === 'fa' ? 'فعالیت گیت‌هاب' : 'GitHub Activity'}
            </h3>
            <GHHeatmap />
          </div>

          {/* Recent activity */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-bold mb-3">{lang === 'fa' ? 'فعالیت اخیر' : 'Recent Activity'}</h3>
            <div className="space-y-2">
              {a.recentActivity.map(act => (
                <div key={act.id} className="flex items-start gap-2 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <div className="text-text-secondary">{resolve(act.text)}</div>
                    <div className="text-text-muted text-[10px]">{act.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="glass-card p-4 text-center">
            <a href={`mailto:${cms.identity.email}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:brightness-110 transition">
              <Icon name="zap" size={14} />
              {lang === 'fa' ? 'شروع پروژه' : 'Start a Project'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricBar({ label, color, basePercent }: { label: string; color: string; basePercent: number }) {
  const [percent, setPercent] = useState(basePercent);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(prev => Math.max(10, Math.min(95, prev + (Math.random() * 10 - 5))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-text-secondary">{label}</span>
        <span className="text-xs font-mono text-text-muted">{Math.round(percent)}%</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-primary/10">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${percent}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function UptimeCounter() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(i);
  }, []);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return (
    <span className="text-[10px] text-text-muted ms-3 font-mono" dir="ltr">
      uptime {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
    </span>
  );
}

function GHHeatmap() {
  const cells = Array.from({ length: 84 }, (_, i) => ({
    key: i,
    opacity: Math.random() > 0.6 ? 0.15 + Math.random() * 0.85 : 0.05,
  }));
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }} dir="ltr">
      {cells.map(c => (
        <div key={c.key} className="aspect-square rounded-sm" style={{ backgroundColor: `rgba(52, 211, 153, ${c.opacity})` }} />
      ))}
    </div>
  );
}

function ContactForm() {
  const { lang } = useApp();
  const [form, setForm] = useState({ name: '', email: '', subject: '', body: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSent(true);
      setForm({ name: '', email: '', subject: '', body: '' });
    } catch { /* ignore */ }
  }, [form]);

  if (sent) {
    return (
      <div className="border-t border-border-theme pt-4 text-center text-accent-emerald text-sm font-bold">
        ✅ {tl('successSubmit', lang)}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-border-theme pt-4 space-y-3">
      <h3 className="text-sm font-bold flex items-center gap-2">
        <Icon name="send" size={14} className="text-primary" />
        {tl('sendMessage', lang)}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
          placeholder={tl('name', lang)} required
          className="px-3 py-2 rounded-lg bg-bg-primary border border-border-theme text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          placeholder={tl('email', lang)} type="email" required
          className="px-3 py-2 rounded-lg bg-bg-primary border border-border-theme text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
      <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
        placeholder={tl('subject', lang)}
        className="w-full px-3 py-2 rounded-lg bg-bg-primary border border-border-theme text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
      <textarea value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
        placeholder={tl('message', lang)} rows={3} required
        className="w-full px-3 py-2 rounded-lg bg-bg-primary border border-border-theme text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
      <button type="submit"
        className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:brightness-110 transition">
        {tl('submit', lang)}
      </button>
    </form>
  );
}
