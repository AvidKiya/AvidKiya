'use client';

import { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import Icon from '@/components/ui/Icon';
import type { CmsState, Comment, ContactMessage, Announcement } from '@/lib/cms/schema';
import { defaultCmsState } from '@/lib/cms/schema';

type Section = 'overview' | 'identity' | 'socials' | 'dashboard' | 'about' | 'projects' | 'resume' |
  'gifts' | 'announcements' | 'comments' | 'shop' | 'messages' | 'media' | 'settings';

const SECTIONS: { key: Section; label: string; icon: string }[] = [
  { key: 'overview', label: 'نمای کلی', icon: 'dashboard' },
  { key: 'identity', label: 'هویت', icon: 'user' },
  { key: 'socials', label: 'شبکه‌های اجتماعی', icon: 'link' },
  { key: 'dashboard', label: 'صفحه اصلی', icon: 'home' },
  { key: 'about', label: 'درباره من', icon: 'info' },
  { key: 'projects', label: 'پروژه‌ها', icon: 'code' },
  { key: 'resume', label: 'رزومه', icon: 'file-text' },
  { key: 'gifts', label: 'هدیه‌ها', icon: 'gift' },
  { key: 'announcements', label: 'اعلان‌ها', icon: 'bell' },
  { key: 'comments', label: 'نظرات', icon: 'message-square' },
  { key: 'shop', label: 'فروشگاه', icon: 'shopping-bag' },
  { key: 'messages', label: 'پیام‌ها', icon: 'mail' },
  { key: 'media', label: 'رسانه', icon: 'music' },
  { key: 'settings', label: 'تنظیمات', icon: 'settings' },
];

export default function AdminPage() {
  const { cms, setCms, isAdmin, setIsAdmin } = useApp();
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [section, setSection] = useState<Section>('overview');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [diagnostics, setDiagnostics] = useState({ api: false, token: false, kv: false });

  // Check diagnostics on login page
  useEffect(() => {
    if (!isAdmin) {
      fetch('/api/cms')
        .then(r => {
          setDiagnostics(prev => ({ ...prev, api: r.ok }));
          return r.json();
        })
        .then(d => {
          setDiagnostics(prev => ({ ...prev, token: !!d, kv: !!d }));
        })
        .catch(() => {});
    }
  }, [isAdmin]);

  const handleLogin = useCallback(async () => {
    setError('');
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.ok) {
        setIsAdmin(true);
        localStorage.setItem('ak-admin-token', token);
      } else {
        setError(data.error || 'Invalid token');
      }
    } catch {
      setError('Connection error');
    }
  }, [token, setIsAdmin]);

  // Auto-login from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ak-admin-token');
    if (saved) {
      setToken(saved);
      fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: saved }),
      }).then(r => r.json()).then(d => {
        if (d.ok) setIsAdmin(true);
      }).catch(() => {});
    }
  }, [setIsAdmin]);

  const saveCms = useCallback(async () => {
    setSyncStatus('syncing');
    try {
      const adminToken = localStorage.getItem('ak-admin-token') || token;
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ state: cms }),
      });
      setSyncStatus(res.ok ? 'synced' : 'error');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch {
      setSyncStatus('error');
    }
  }, [cms, token]);

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(cms, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'avidkiya-cms-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [cms]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string) as CmsState;
          setCms(data);
        } catch { alert('Invalid JSON'); }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [setCms]);

  // Login screen
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="glass-card-strong p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/20 border-2 border-primary flex items-center justify-center mb-4">
            <Icon name="shield" size={24} className="text-primary" />
          </div>
          <h1 className="text-xl font-black mb-2">Admin Panel</h1>

          {/* Diagnostics */}
          <div className="text-xs space-y-1 mb-4 text-start">
            <div className="flex items-center gap-2">
              <span className={diagnostics.api ? 'text-accent-emerald' : 'text-accent-rose'}>
                {diagnostics.api ? '✅' : '❌'}
              </span>
              <span>API reachable</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={diagnostics.token ? 'text-accent-emerald' : 'text-accent-rose'}>
                {diagnostics.token ? '✅' : '❌'}
              </span>
              <span>TOKEN set</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={diagnostics.kv ? 'text-accent-emerald' : 'text-accent-rose'}>
                {diagnostics.kv ? '✅' : '❌'}
              </span>
              <span>KV bound</span>
            </div>
          </div>

          <input type="password" value={token} onChange={e => setToken(e.target.value)}
            placeholder="ADMIN_TOKEN"
            className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-theme text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary mb-3"
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          {error && <p className="text-accent-rose text-xs mb-3">{error}</p>}
          <button onClick={handleLogin}
            className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:brightness-110 transition">
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Mobile sidebar toggle */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-4 z-50 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg"
        style={{ insetInlineEnd: '1rem' }}>
        <Icon name="menu" size={20} />
      </button>

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'fixed inset-0 z-50' : 'hidden'} lg:block lg:relative lg:z-auto`}>
        {sidebarOpen && <div className="absolute inset-0 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}
        <div className="relative w-56 h-full bg-bg-card-solid border-e border-border-theme overflow-y-auto p-2">
          <div className="p-3 mb-2">
            <h2 className="text-sm font-black">پنل مدیریت</h2>
          </div>
          {SECTIONS.map(s => (
            <button key={s.key} onClick={() => { setSection(s.key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition ${
                section === s.key ? 'bg-primary/15 text-primary font-bold' : 'text-text-secondary hover:bg-primary/5'
              }`}>
              <Icon name={s.icon} size={14} />
              {s.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <h2 className="text-lg font-bold">{SECTIONS.find(s => s.key === section)?.label}</h2>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              syncStatus === 'syncing' ? 'bg-accent-amber/20 text-accent-amber' :
              syncStatus === 'synced' ? 'bg-accent-emerald/20 text-accent-emerald' :
              syncStatus === 'error' ? 'bg-accent-rose/20 text-accent-rose' :
              'bg-primary/10 text-text-muted'
            }`}>
              {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'synced' ? 'Saved ✓' : syncStatus === 'error' ? 'Error' : 'Ready'}
            </span>
            <button onClick={saveCms} className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:brightness-110 transition">
              💾 Save
            </button>
            <button onClick={handleExport} className="px-3 py-1.5 rounded-lg border border-border-theme text-xs hover:bg-primary/5 transition">
              📦 Export
            </button>
            <button onClick={handleImport} className="px-3 py-1.5 rounded-lg border border-border-theme text-xs hover:bg-primary/5 transition">
              📥 Import
            </button>
          </div>
        </div>

        {/* Section content */}
        {section === 'overview' && <OverviewSection />}
        {section === 'identity' && <IdentitySection />}
        {section === 'socials' && <SocialsSection />}
        {section === 'settings' && <SettingsSection />}
        {section === 'comments' && <CommentsAdminSection />}
        {section === 'messages' && <MessagesAdminSection />}
        {section === 'announcements' && <AnnouncementsAdminSection />}
        {['dashboard', 'about', 'projects', 'resume', 'gifts', 'shop', 'media'].includes(section) && (
          <div className="glass-card p-6 text-center text-text-muted">
            <p className="text-sm">این بخش از طریق export/import JSON قابل ویرایش است.</p>
            <p className="text-xs mt-2">فایل JSON را Export کنید، ویرایش کنید، و Import کنید.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Admin Sub-sections ── */

function OverviewSection() {
  const { cms } = useApp();
  const cards = [
    { label: 'پروژه‌ها', value: cms.dashboard.projects.length + cms.projects.customProjects.length, icon: 'folder' },
    { label: 'اعلان‌ها', value: cms.announcements.length, icon: 'bell' },
    { label: 'نظرات', value: cms.comments.length, icon: 'message-square' },
    { label: 'پیام‌ها', value: cms.messages.length, icon: 'mail' },
    { label: 'محصولات', value: cms.shop.products.length, icon: 'shopping-bag' },
    { label: 'مشترکین خبرنامه', value: cms.newsletter.subscribers.length, icon: 'users' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {cards.map(c => (
        <div key={c.label} className="glass-card p-4 text-center">
          <Icon name={c.icon} size={20} className="mx-auto mb-2 text-primary" />
          <div className="text-2xl font-black">{c.value}</div>
          <div className="text-xs text-text-secondary">{c.label}</div>
        </div>
      ))}
    </div>
  );
}

function IdentitySection() {
  const { cms, updateCms } = useApp();
  const id = cms.identity;

  return (
    <div className="glass-card p-5 space-y-4 max-w-xl">
      <FieldPair label="نام (فارسی)" value={id.fullName.fa} onChange={v => updateCms('identity.fullName.fa', v)} />
      <FieldPair label="Name (EN)" value={id.fullName.en} onChange={v => updateCms('identity.fullName.en', v)} />
      <FieldPair label="عنوان (فارسی)" value={id.title.fa} onChange={v => updateCms('identity.title.fa', v)} />
      <FieldPair label="Title (EN)" value={id.title.en} onChange={v => updateCms('identity.title.en', v)} />
      <FieldPair label="ایمیل" value={id.email} onChange={v => updateCms('identity.email', v)} />
      <FieldPair label="مکان (فارسی)" value={id.location.fa} onChange={v => updateCms('identity.location.fa', v)} />
      <FieldPair label="Location (EN)" value={id.location.en} onChange={v => updateCms('identity.location.en', v)} />
      <FieldPair label="سال‌های تجربه" value={String(id.yearsExperience)} onChange={v => updateCms('identity.yearsExperience', Number(v))} />
      <FieldPair label="Handle" value={id.handle} onChange={v => updateCms('identity.handle', v)} />
    </div>
  );
}

function SocialsSection() {
  const { cms, updateCms } = useApp();

  return (
    <div className="space-y-3 max-w-xl">
      {cms.socials.map((s, i) => (
        <div key={s.id} className="glass-card p-4 space-y-2">
          <FieldPair label="Platform" value={s.platform} onChange={v => updateCms(`socials.${i}.platform`, v)} />
          <FieldPair label="URL" value={s.url} onChange={v => updateCms(`socials.${i}.url`, v)} />
          <FieldPair label="لیبل فارسی" value={s.label.fa} onChange={v => updateCms(`socials.${i}.label.fa`, v)} />
          <FieldPair label="Label EN" value={s.label.en} onChange={v => updateCms(`socials.${i}.label.en`, v)} />
        </div>
      ))}
    </div>
  );
}

function SettingsSection() {
  const { cms, updateCms, setIsAdmin } = useApp();
  const [newPassword, setNewPassword] = useState('');

  const changePassword = async () => {
    if (!newPassword) return;
    const adminToken = localStorage.getItem('ak-admin-token') || '';
    try {
      await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ newToken: newPassword }),
      });
      localStorage.setItem('ak-admin-token', newPassword);
      alert('Password changed successfully');
    } catch { alert('Error'); }
  };

  return (
    <div className="glass-card p-5 space-y-4 max-w-xl">
      <FieldPair label="GitHub Username" value={cms.settings.githubUsername} onChange={v => updateCms('settings.githubUsername', v)} />
      <div>
        <label className="block text-xs text-text-muted mb-1">زبان پیش‌فرض</label>
        <select value={cms.settings.defaultLanguage} onChange={e => updateCms('settings.defaultLanguage', e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-bg-primary border border-border-theme text-sm">
          <option value="fa">فارسی</option>
          <option value="en">English</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-text-muted mb-1">تم پیش‌فرض</label>
        <select value={cms.settings.defaultTheme} onChange={e => updateCms('settings.defaultTheme', e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-bg-primary border border-border-theme text-sm">
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>
      <hr className="border-border-theme" />
      <div>
        <label className="block text-xs text-text-muted mb-1">تغییر رمز عبور</label>
        <div className="flex gap-2">
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
            placeholder="رمز جدید"
            className="flex-1 px-3 py-2 rounded-lg bg-bg-primary border border-border-theme text-sm font-mono" />
          <button onClick={changePassword} className="px-4 py-2 rounded-lg bg-accent-rose text-white text-xs font-bold">
            تغییر
          </button>
        </div>
      </div>
      <button onClick={() => { setIsAdmin(false); localStorage.removeItem('ak-admin-token'); }}
        className="w-full py-2 rounded-lg border border-accent-rose/30 text-accent-rose text-sm hover:bg-accent-rose/10 transition">
        خروج از پنل
      </button>
    </div>
  );
}

function CommentsAdminSection() {
  const { cms, updateCms } = useApp();

  return (
    <div className="space-y-3">
      {cms.comments.length === 0 ? (
        <div className="glass-card p-6 text-center text-text-muted">نظری ثبت نشده</div>
      ) : (
        cms.comments.map((c: Comment, i: number) => (
          <div key={c.id} className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm">{c.name} ({c.email})</span>
              <div className="flex gap-2">
                <button onClick={() => updateCms(`comments.${i}.approved`, !c.approved)}
                  className={`text-xs px-2 py-1 rounded ${c.approved ? 'bg-accent-emerald/20 text-accent-emerald' : 'bg-accent-amber/20 text-accent-amber'}`}>
                  {c.approved ? '✅ تأیید شده' : '⏳ در انتظار'}
                </button>
                <button onClick={() => updateCms(`comments.${i}.pinned`, !c.pinned)}
                  className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                  {c.pinned ? '📌 پین' : 'پین؟'}
                </button>
              </div>
            </div>
            <p className="text-sm text-text-secondary">{c.body}</p>
            <div className="text-[10px] text-text-muted mt-1">{'⭐'.repeat(c.rating)} | {c.role} | {new Date(c.createdAt).toLocaleDateString('fa-IR')}</div>
          </div>
        ))
      )}
    </div>
  );
}

function MessagesAdminSection() {
  const { cms, updateCms } = useApp();

  return (
    <div className="space-y-3">
      {cms.messages.length === 0 ? (
        <div className="glass-card p-6 text-center text-text-muted">پیامی دریافت نشده</div>
      ) : (
        cms.messages.map((m: ContactMessage, i: number) => (
          <div key={m.id} className={`glass-card p-4 ${m.read ? '' : 'border-primary/30'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm">{m.name} ({m.email})</span>
              <button onClick={() => updateCms(`messages.${i}.read`, true)}
                className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                {m.read ? '✓ خوانده شده' : 'علامت خوانده'}
              </button>
            </div>
            {m.subject && <div className="text-xs font-bold text-text-secondary mb-1">{m.subject}</div>}
            <p className="text-sm text-text-secondary">{m.body}</p>
            <div className="text-[10px] text-text-muted mt-1">{new Date(m.createdAt).toLocaleDateString('fa-IR')}</div>
          </div>
        ))
      )}
    </div>
  );
}

function AnnouncementsAdminSection() {
  const { cms, updateCms } = useApp();

  return (
    <div className="space-y-3">
      {cms.announcements.map((a: Announcement, i: number) => (
        <div key={a.id} className="glass-card p-4">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <span className="font-bold text-sm">{a.title.fa || a.title.en}</span>
            <div className="flex gap-1">
              <button onClick={() => updateCms(`announcements.${i}.pinned`, !a.pinned)}
                className={`text-[10px] px-2 py-0.5 rounded ${a.pinned ? 'bg-accent-amber/20 text-accent-amber' : 'bg-primary/10 text-text-muted'}`}>
                📌
              </button>
              <button onClick={() => updateCms(`announcements.${i}.archived`, !a.archived)}
                className={`text-[10px] px-2 py-0.5 rounded ${a.archived ? 'bg-accent-rose/20 text-accent-rose' : 'bg-primary/10 text-text-muted'}`}>
                📦
              </button>
              <button onClick={() => updateCms(`announcements.${i}.hidden`, !a.hidden)}
                className={`text-[10px] px-2 py-0.5 rounded ${a.hidden ? 'bg-accent-rose/20 text-accent-rose' : 'bg-primary/10 text-text-muted'}`}>
                👁
              </button>
            </div>
          </div>
          <div className="text-xs text-text-muted">{a.type} | {new Date(a.createdAt).toLocaleDateString('fa-IR')}</div>
        </div>
      ))}
    </div>
  );
}

function FieldPair({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs text-text-muted mb-1">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-bg-primary border border-border-theme text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
    </div>
  );
}
