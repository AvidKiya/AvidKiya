'use client';

import { useState, useEffect } from 'react';
import { useApp, useCms } from '@/contexts/AppContext';
import { Icon, getPlatformIcon } from '@/components/ui/Icon';

export default function AboutPage() {
  const { language } = useApp();
  const { cms, t } = useCms();
  const [metrics, setMetrics] = useState(cms.about.metrics.map(m => ({ ...m, current: 0 })));
  const [uptime, setUptime] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  
  // Animate metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(m => ({
        ...m,
        current: Math.min(100, Math.max(0, m.current + (Math.random() - 0.5) * 10))
      })));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Uptime counter
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setUptime(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSent(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSent(false), 3000);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };
  
  // Generate GitHub-style heatmap
  const heatmapData = Array.from({ length: 84 }, () => Math.random());
  
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Command Center Grid */}
        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Left Column - System Status */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="glass-card-strong p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Icon name="activity" size={18} className="text-[var(--accent-emerald)]" />
                {t(cms.about.statusTitle)}
              </h3>
              
              <div className="space-y-4">
                {cms.about.metrics.map((metric, i) => (
                  <div key={metric.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[var(--text-secondary)]">{t(metric.label)}</span>
                      <span style={{ color: metric.color }}>{metrics[i]?.current?.toFixed(0) || metric.percent}%</span>
                    </div>
                    <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${metrics[i]?.current || metric.percent}%`,
                          backgroundColor: metric.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="glass-card-strong p-6">
              <h3 className="font-bold mb-4">
                {language === 'fa' ? 'دسترسی سریع' : 'Quick Links'}
              </h3>
              
              <div className="space-y-2">
                {cms.about.quickLinks.map(link => (
                  <a
                    key={link.id}
                    href={link.url}
                    target={link.url.startsWith('http') ? '_blank' : undefined}
                    rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    {link.icon === 'github' ? (
                      getPlatformIcon('github', 18)
                    ) : (
                      <Icon name={link.icon} size={18} className="text-[var(--primary)]" />
                    )}
                    <span>{t(link.label)}</span>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Quote */}
            <div className="glass-card-strong p-6">
              <blockquote className="text-[var(--text-secondary)] italic text-sm leading-relaxed">
                {t(cms.about.quote)}
              </blockquote>
            </div>
          </div>
          
          {/* Center Column - Terminal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Terminal Card */}
            <div className="glass-card-strong overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-tertiary)] border-b border-[var(--border-color)]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
                </div>
                <span className="text-xs text-[var(--text-muted)] font-mono">
                  uptime: {formatUptime(uptime)}
                </span>
              </div>
              
              {/* Terminal Content */}
              <div className="p-6 font-mono text-sm space-y-3">
                <div className="text-[var(--accent-emerald)]">$ whoami</div>
                <div className="text-[var(--text-primary)] ps-4">
                  {t(cms.identity.fullName)} — {t(cms.identity.title)}
                </div>
                
                <div className="text-[var(--accent-emerald)]">$ cat welcome.txt</div>
                <div className="text-[var(--text-secondary)] ps-4">
                  {t(cms.about.welcomeBody)}
                </div>
                
                <div className="text-[var(--accent-emerald)]">$ ls skills/</div>
                <div className="flex flex-wrap gap-2 ps-4">
                  {cms.resume.skills.slice(0, 6).map(skill => (
                    <span key={skill.id} className="text-[var(--accent-cyan)]">{skill.name}</span>
                  ))}
                </div>
                
                <div className="flex items-center">
                  <span className="text-[var(--accent-emerald)]">$ </span>
                  <span className="w-2 h-4 bg-[var(--text-primary)] animate-pulse ms-1" />
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="glass-card-strong p-6">
              <h3 className="font-bold mb-4">
                {language === 'fa' ? 'ارسال پیام' : 'Send Message'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder={language === 'fa' ? 'نام' : 'Name'}
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--primary)] outline-none transition-colors"
                  />
                  <input
                    type="email"
                    placeholder={language === 'fa' ? 'ایمیل' : 'Email'}
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--primary)] outline-none transition-colors"
                  />
                </div>
                
                <input
                  type="text"
                  placeholder={language === 'fa' ? 'موضوع' : 'Subject'}
                  value={formData.subject}
                  onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--primary)] outline-none transition-colors"
                />
                
                <textarea
                  placeholder={language === 'fa' ? 'پیام شما...' : 'Your message...'}
                  value={formData.message}
                  onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--primary)] outline-none transition-colors resize-none"
                />
                
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 rounded-xl gradient-bg text-white font-bold hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {sending ? (
                    <Icon name="refresh" size={18} className="animate-spin mx-auto" />
                  ) : sent ? (
                    language === 'fa' ? '✓ ارسال شد' : '✓ Sent'
                  ) : (
                    language === 'fa' ? 'ارسال پیام' : 'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {/* Right Column - Activity */}
          <div className="space-y-6">
            {/* GitHub Heatmap */}
            <div className="glass-card-strong p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Icon name="git" size={18} className="text-[var(--primary)]" />
                {language === 'fa' ? 'فعالیت گیت‌هاب' : 'GitHub Activity'}
              </h3>
              
              <div className="grid grid-cols-12 gap-1">
                {heatmapData.map((val, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-sm"
                    style={{
                      backgroundColor: `rgba(var(--primary-rgb, 93, 122, 230), ${val * 0.8 + 0.1})`
                    }}
                  />
                ))}
              </div>
              
              <div className="flex items-center justify-between mt-3 text-xs text-[var(--text-muted)]">
                <span>{language === 'fa' ? 'کمتر' : 'Less'}</span>
                <span>{language === 'fa' ? 'بیشتر' : 'More'}</span>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="glass-card-strong p-6">
              <h3 className="font-bold mb-4">
                {language === 'fa' ? 'فعالیت اخیر' : 'Recent Activity'}
              </h3>
              
              <div className="space-y-3">
                {cms.about.recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center flex-shrink-0">
                      <Icon name={activity.icon} size={14} className="text-[var(--primary)]" />
                    </div>
                    <div>
                      <p className="text-sm">{t(activity.text)}</p>
                      <p className="text-xs text-[var(--text-muted)]">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Social Cards */}
            <div className="glass-card-strong p-6">
              <h3 className="font-bold mb-4">
                {language === 'fa' ? 'شبکه‌های اجتماعی' : 'Social'}
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                {cms.socials.filter(s => s.enabled).slice(0, 4).map(social => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--primary-glow)] transition-colors"
                  >
                    {getPlatformIcon(social.platform, 18)}
                    <span className="text-sm truncate">{t(social.label)}</span>
                  </a>
                ))}
              </div>
            </div>
            
            {/* CTA */}
            <a
              href="/projects"
              className="block glass-card-strong p-6 text-center hover:border-[var(--border-active)] transition-colors"
            >
              <Icon name="zap" size={24} className="text-[var(--accent-amber)] mx-auto mb-2" />
              <span className="font-bold">
                {language === 'fa' ? 'شروع پروژه' : 'Start a Project'}
              </span>
            </a>
          </div>
          
        </div>
      </div>
    </div>
  );
}
