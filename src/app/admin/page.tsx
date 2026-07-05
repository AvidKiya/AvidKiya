'use client';

import { useState, useEffect, useCallback } from 'react';
import { useApp, useCms } from '@/contexts/AppContext';
import { Icon } from '@/components/ui/Icon';
import type { CmsState } from '@/lib/cms/schema';

type Section = 
  | 'overview'
  | 'identity'
  | 'socials'
  | 'dashboard'
  | 'about'
  | 'projects'
  | 'resume'
  | 'gifts'
  | 'announcements'
  | 'comments'
  | 'shop'
  | 'messages'
  | 'media'
  | 'settings';

const sections: { id: Section; labelFa: string; labelEn: string; icon: string }[] = [
  { id: 'overview', labelFa: 'نمای کلی', labelEn: 'Overview', icon: 'home' },
  { id: 'identity', labelFa: 'هویت', labelEn: 'Identity', icon: 'user' },
  { id: 'socials', labelFa: 'شبکه‌های اجتماعی', labelEn: 'Socials', icon: 'link' },
  { id: 'dashboard', labelFa: 'صفحه اصلی', labelEn: 'Dashboard', icon: 'home' },
  { id: 'about', labelFa: 'درباره من', labelEn: 'About', icon: 'info' },
  { id: 'projects', labelFa: 'پروژه‌ها', labelEn: 'Projects', icon: 'folder' },
  { id: 'resume', labelFa: 'رزومه', labelEn: 'Resume', icon: 'file-text' },
  { id: 'gifts', labelFa: 'هدیه‌ها', labelEn: 'Gifts', icon: 'gift' },
  { id: 'announcements', labelFa: 'اعلان‌ها', labelEn: 'Announcements', icon: 'bell' },
  { id: 'comments', labelFa: 'نظرات', labelEn: 'Comments', icon: 'message-square' },
  { id: 'shop', labelFa: 'فروشگاه', labelEn: 'Shop', icon: 'shopping-bag' },
  { id: 'messages', labelFa: 'پیام‌ها', labelEn: 'Messages', icon: 'mail' },
  { id: 'media', labelFa: 'رسانه', labelEn: 'Media', icon: 'image' },
  { id: 'settings', labelFa: 'تنظیمات', labelEn: 'Settings', icon: 'settings' }
];

export default function AdminPage() {
  const { language, isAdmin, setIsAdmin, adminToken, setAdminToken, syncStatus, setSyncStatus } = useApp();
  const { cms, setCms, updateCms, t } = useCms();
  
  const [hasAccess, setHasAccess] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loginToken, setLoginToken] = useState('');
  const [loginError, setLoginError] = useState('');
  const [connectionWarning, setConnectionWarning] = useState('');
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);
  
  // Check location for hidden access - accept hash (#kiya/panel) or pathname (/kiya/panel)
  useEffect(() => {
    const checkAccess = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      if (hash === '#kiya/panel' || path === '/kiya/panel' || path === '/kiya/panel/') {
        setHasAccess(true);
        // Check saved token
        const savedToken = localStorage.getItem('avidkiya-admin-token');
        if (savedToken) {
          verifyToken(savedToken);
        }
      } else {
        setHasAccess(false);
      }
    };

    checkAccess();
    window.addEventListener('hashchange', checkAccess);
    // also listen for pushState/popstate changes (client-side navigation)
    window.addEventListener('popstate', checkAccess);
    return () => {
      window.removeEventListener('hashchange', checkAccess);
      window.removeEventListener('popstate', checkAccess);
    };
  }, []);
  
  const verifyToken = async (token: string) => {
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setIsAuthorized(true);
          setIsAdmin(true);
          setAdminToken(token);
          localStorage.setItem('avidkiya-admin-token', token);
          localStorage.setItem('avidkiya-admin-token-local', token);
          setConnectionWarning('');

          // Check if first login with default password
          if (token === 'admin' && !localStorage.getItem('avidkiya-password-changed')) {
            setShowPasswordChange(true);
          }
        } else {
          setLoginError(language === 'fa' ? 'رمز عبور نادرست' : 'Invalid password');
        }
        return;
      }

      if (res.status === 401) {
        setLoginError(language === 'fa' ? 'رمز عبور نادرست' : 'Invalid password');
        return;
      }

      throw new Error('verify-failed');
    } catch {
      const localToken = localStorage.getItem('avidkiya-admin-token-local');
      const isDefaultLocalToken = token === 'admin';
      if (localToken === token || isDefaultLocalToken) {
        setIsAuthorized(true);
        setIsAdmin(true);
        setAdminToken(token);
        localStorage.setItem('avidkiya-admin-token-local', token);
        setConnectionWarning(language === 'fa' ? 'در حالت آفلاین: ویرایش محلی ذخیره می‌شود.' : 'Offline mode: local edits will be stored in browser.');
      } else {
        setLoginError(language === 'fa' ? 'خطا در اتصال' : 'Connection error');
      }
    }
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    await verifyToken(loginToken);
  };
  
  const handleLogout = () => {
    setIsAuthorized(false);
    setIsAdmin(false);
    setAdminToken('');
    localStorage.removeItem('avidkiya-admin-token');
    window.location.hash = '';
    window.location.href = '/kiya/panel';
  };
  
  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 4) {
      alert(language === 'fa' ? 'رمز باید حداقل ۴ کاراکتر باشد' : 'Password must be at least 4 characters');
      return;
    }
    
    // Save new password and mark as changed
    localStorage.setItem('avidkiya-admin-token', newPassword);
    localStorage.setItem('avidkiya-password-changed', 'true');
    setAdminToken(newPassword);
    setShowPasswordChange(false);
    setPasswordChanged(true);
    alert(language === 'fa' ? 'رمز عبور تغییر کرد. از این پس از رمز جدید استفاده کنید.' : 'Password changed. Use the new password from now on.');
  };
  
  const saveCms = useCallback(async () => {
    setSyncStatus('syncing');
    let savedLocally = false;

    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(cms)
      });
      
      if (res.ok) {
        setSyncStatus('synced');
        setTimeout(() => setSyncStatus('idle'), 2000);
        savedLocally = true;
      } else {
        throw new Error('api-error');
      }
    } catch {
      if (typeof window !== 'undefined') {
        localStorage.setItem('avidkiya-cms', JSON.stringify(cms));
        savedLocally = true;
        setConnectionWarning(language === 'fa' ? 'API در دسترس نیست. تغییرات به‌صورت محلی ذخیره شد.' : 'API unavailable. Changes saved locally.');
      }
      setSyncStatus('error');
    }

    if (savedLocally) {
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('idle'), 2000);
    }
  }, [adminToken, cms, language, setSyncStatus]);
  
  const exportData = () => {
    const blob = new Blob([JSON.stringify(cms, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `avidkiya-cms-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        setCms(data as CmsState);
        saveCms();
        alert(language === 'fa' ? 'داده‌ها وارد شدند' : 'Data imported successfully');
      } catch {
        alert(language === 'fa' ? 'خطا در خواندن فایل' : 'Error reading file');
      }
    };
    reader.readAsText(file);
  };
  
  // No access - show nothing (hidden admin)
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-[var(--text-muted)]">
          <Icon name="lock" size={64} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">404 - Page Not Found</p>
        </div>
      </div>
    );
  }
  
  // Login Screen
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8">
        <div className="w-full max-w-md px-4">
          <div className="glass-card-strong p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
                <Icon name="lock" size={32} className="text-white" />
              </div>
              <h1 className="text-2xl font-black">
                {language === 'fa' ? 'پنل مدیریت' : 'Admin Panel'}
              </h1>
              <p className="text-[var(--text-muted)] mt-2">
                {language === 'fa' ? 'رمز عبور را وارد کنید' : 'Enter your password'}
              </p>
            </div>
            
            {/* Diagnostics */}
            <div className="mb-6 p-4 rounded-xl bg-[var(--bg-tertiary)] text-sm space-y-2">
              <div className="flex items-center gap-2">
                <span className={connectionWarning ? 'text-[var(--accent-amber)]' : 'text-[var(--accent-emerald)]'}>✓</span>
                <span>{connectionWarning || (language === 'fa' ? 'API در دسترس' : 'API reachable')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--accent-amber)]">⚡</span>
                <span>{language === 'fa' ? 'رمز پیش‌فرض: admin' : 'Default password: admin'}</span>
              </div>
              {connectionWarning && (
                <div className="text-sm text-[var(--accent-amber)]">{connectionWarning}</div>
              )}
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder={language === 'fa' ? 'رمز عبور' : 'Password'}
                value={loginToken}
                onChange={e => setLoginToken(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--primary)] outline-none transition-colors"
                autoFocus
              />
              
              {loginError && (
                <p className="text-[var(--accent-rose)] text-sm">{loginError}</p>
              )}
              {connectionWarning && (
                <p className="text-[var(--accent-amber)] text-sm">{connectionWarning}</p>
              )}
              <p className="text-[var(--text-muted)] text-xs">
                {language === 'fa'
                  ? 'اگر اتصال به API برقرار نیست، با رمز admin وارد شوید تا حالت آفلاین فعال شود.'
                  : 'If the API is unavailable, use admin to enter offline mode.'}
              </p>
              <button
                type="submit"
                className="w-full py-3 rounded-xl gradient-bg text-white font-bold hover:brightness-110 transition-all"
              >
                {language === 'fa' ? 'ورود' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
  
  // Password Change Modal
  if (showPasswordChange) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8">
        <div className="w-full max-w-md px-4">
          <div className="glass-card-strong p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-[var(--accent-amber)]/20 flex items-center justify-center mx-auto mb-4">
                <Icon name="alert-circle" size={32} className="text-[var(--accent-amber)]" />
              </div>
              <h1 className="text-2xl font-black">
                {language === 'fa' ? 'تغییر رمز عبور' : 'Change Password'}
              </h1>
              <p className="text-[var(--text-muted)] mt-2">
                {language === 'fa' 
                  ? 'لطفاً رمز عبور پیش‌فرض را تغییر دهید'
                  : 'Please change the default password'}
              </p>
            </div>
            
            <div className="space-y-4">
              <input
                type="password"
                placeholder={language === 'fa' ? 'رمز عبور جدید' : 'New password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--primary)] outline-none transition-colors"
                autoFocus
              />
              
              <button
                onClick={handlePasswordChange}
                className="w-full py-3 rounded-xl gradient-bg text-white font-bold hover:brightness-110 transition-all"
              >
                {language === 'fa' ? 'ذخیره و ادامه' : 'Save & Continue'}
              </button>
              
              <button
                onClick={() => setShowPasswordChange(false)}
                className="w-full py-3 rounded-xl glass-card hover:border-[var(--border-active)] transition-colors"
              >
                {language === 'fa' ? 'بعداً' : 'Later'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Admin Dashboard
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="admin-sidebar w-64 flex-shrink-0 hidden lg:block">
        <div className="sticky top-16 h-[calc(100vh-64px)] overflow-y-auto p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg">
              {language === 'fa' ? 'پنل مدیریت' : 'Admin'}
            </h2>
            <div className={`sync-pill ${syncStatus}`}>
              {syncStatus === 'syncing' && (language === 'fa' ? 'ذخیره...' : 'Saving...')}
              {syncStatus === 'synced' && '✓'}
              {syncStatus === 'error' && '✕'}
              {syncStatus === 'idle' && ''}
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`admin-nav-item w-full flex items-center gap-3 text-start ${
                  activeSection === section.id ? 'active' : ''
                }`}
              >
                <Icon name={section.icon} size={18} />
                <span>{language === 'fa' ? section.labelFa : section.labelEn}</span>
              </button>
            ))}
          </nav>
          
          {/* Actions */}
          <div className="mt-8 pt-4 border-t border-[var(--border-color)] space-y-2">
            <button
              onClick={saveCms}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl gradient-bg text-white font-medium"
            >
              <Icon name="save" size={16} />
              {language === 'fa' ? 'ذخیره' : 'Save'}
            </button>
            
            <button
              onClick={exportData}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl glass-card hover:border-[var(--border-active)]"
            >
              <Icon name="download" size={16} />
              {language === 'fa' ? 'خروجی JSON' : 'Export JSON'}
            </button>
            
            <label className="w-full flex items-center justify-center gap-2 py-2 rounded-xl glass-card hover:border-[var(--border-active)] cursor-pointer">
              <Icon name="upload" size={16} />
              {language === 'fa' ? 'ورود JSON' : 'Import JSON'}
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[var(--accent-rose)] hover:bg-[var(--accent-rose)]/10"
            >
              <Icon name="x" size={16} />
              {language === 'fa' ? 'خروج' : 'Logout'}
            </button>
          </div>
        </div>
      </aside>
      
      {/* Mobile Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-secondary)] border-t border-[var(--border-color)] p-2">
        <div className="flex overflow-x-auto gap-1">
          {sections.slice(0, 6).map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-shrink-0 p-3 rounded-xl ${
                activeSection === section.id ? 'gradient-bg text-white' : ''
              }`}
            >
              <Icon name={section.icon} size={20} />
            </button>
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 p-6 pb-24 lg:pb-6">
        <AdminSection 
          section={activeSection} 
          cms={cms}
          updateCms={updateCms}
          language={language}
          t={t}
          saveCms={saveCms}
        />
      </main>
    </div>
  );
}

interface AdminSectionProps {
  section: Section;
  cms: CmsState;
  updateCms: (path: string, value: unknown) => void;
  language: 'fa' | 'en';
  t: (text: { fa: string; en: string } | string | undefined) => string;
  saveCms: () => Promise<void>;
}

function AdminSection({ section, cms, updateCms, language, t, saveCms }: AdminSectionProps) {
  
  switch (section) {
    case 'overview':
      return (
        <div>
          <h1 className="text-2xl font-black mb-6">
            {language === 'fa' ? 'نمای کلی' : 'Overview'}
          </h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass-card-strong p-6">
              <Icon name="eye" size={24} className="text-[var(--primary)] mb-2" />
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-[var(--text-muted)]">
                {language === 'fa' ? 'بازدید' : 'Views'}
              </p>
            </div>
            
            <div className="glass-card-strong p-6">
              <Icon name="message-square" size={24} className="text-[var(--accent-emerald)] mb-2" />
              <p className="text-2xl font-bold">{cms.comments.length}</p>
              <p className="text-sm text-[var(--text-muted)]">
                {language === 'fa' ? 'نظرات' : 'Comments'}
              </p>
            </div>
            
            <div className="glass-card-strong p-6">
              <Icon name="mail" size={24} className="text-[var(--accent-amber)] mb-2" />
              <p className="text-2xl font-bold">{cms.messages.length}</p>
              <p className="text-sm text-[var(--text-muted)]">
                {language === 'fa' ? 'پیام‌ها' : 'Messages'}
              </p>
            </div>
            
            <div className="glass-card-strong p-6">
              <Icon name="shopping-bag" size={24} className="text-[var(--accent-violet)] mb-2" />
              <p className="text-2xl font-bold">{cms.shop.products.length}</p>
              <p className="text-sm text-[var(--text-muted)]">
                {language === 'fa' ? 'محصولات' : 'Products'}
              </p>
            </div>
          </div>
          
          {/* Quick Info */}
          <div className="glass-card-strong p-6">
            <h2 className="font-bold mb-4">{language === 'fa' ? 'اطلاعات سریع' : 'Quick Info'}</h2>
            <div className="space-y-2 text-sm">
              <p><strong>{language === 'fa' ? 'نام:' : 'Name:'}</strong> {t(cms.identity.fullName)}</p>
              <p><strong>{language === 'fa' ? 'ایمیل:' : 'Email:'}</strong> {cms.identity.email}</p>
              <p><strong>{language === 'fa' ? 'گیت‌هاب:' : 'GitHub:'}</strong> {cms.settings.githubUsername}</p>
            </div>
          </div>
        </div>
      );

      case 'media':
        return (
          <div>
            <h1 className="text-2xl font-black mb-6">
              {language === 'fa' ? 'رسانه' : 'Media'}
            </h1>

            <div className="glass-card-strong p-6 space-y-4">
              <h2 className="font-bold">{language === 'fa' ? 'موسیقی' : 'Music'}</h2>

              <div className="space-y-2">
                <p className="text-sm text-[var(--text-muted)]">{language === 'fa' ? 'افزودن آهنگ از فایل یا URL' : 'Add track from file or URL'}</p>

                <div className="flex gap-2">
                  <label className="px-4 py-2 rounded-xl glass-card cursor-pointer">
                    {language === 'fa' ? 'آپلود فایل' : 'Upload file'}
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const src = ev.target?.result as string;
                          const id = Date.now().toString();
                          const track = { id, title: file.name, src, artist: '', enabled: true };
                          updateCms('music.tracks', [...(cms.music.tracks || []), track]);
                          alert(language === 'fa' ? 'آپلود انجام شد' : 'Uploaded');
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="hidden"
                    />
                  </label>

                  <div className="flex-1">
                    <input type="text" id="musicUrlInput" placeholder={language === 'fa' ? 'لینک مستقیم آهنگ' : 'Direct track URL'} className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]" />
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => {
                        const input = document.getElementById('musicUrlInput') as HTMLInputElement;
                        const url = input?.value?.trim();
                        if (!url) return alert(language === 'fa' ? 'لینک نامعتبر' : 'Invalid URL');
                        const id = Date.now().toString();
                        const track = { id, title: url.split('/').pop() || 'Track', src: url, artist: '', enabled: true };
                        updateCms('music.tracks', [...(cms.music.tracks || []), track]);
                        input.value = '';
                      }} className="px-4 py-2 rounded-xl gradient-bg text-white">{language === 'fa' ? 'اضافه' : 'Add'}</button>
                      <button onClick={() => { updateCms('music.tracks', []); }} className="px-4 py-2 rounded-xl glass-card">{language === 'fa' ? 'پاک کردن همه' : 'Clear All'}</button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">{language === 'fa' ? 'فهرست پخش' : 'Playlist'}</h3>
                <div className="space-y-2">
                  {(cms.music.tracks || []).map((t, i) => (
                    <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-tertiary)]">
                      <div>
                        <div className="font-medium">{typeof t.title === 'string' ? t.title : (t.title?.en || t.title?.fa)}</div>
                        <div className="text-xs text-[var(--text-muted)]">{t.artist}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { const arr = [...(cms.music.tracks || [])]; arr.splice(i,1); updateCms('music.tracks', arr); }} className="text-[var(--accent-rose)]">{language === 'fa' ? 'حذف' : 'Remove'}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border-color)]">
                <h3 className="font-medium mb-2">{language === 'fa' ? 'ویدیوی پس‌زمینه' : 'Background Video'}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[var(--text-muted)] mb-1">{language === 'fa' ? 'لینک ویدیو' : 'Video URL'}</label>
                    <input type="text" id="bgVideoInput" defaultValue={cms.settings?.backgroundVideo?.src || ''} className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]" />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--text-muted)] mb-1">{language === 'fa' ? 'پوستر (اختیاری)' : 'Poster (optional)'}</label>
                    <input type="text" id="bgPosterInput" defaultValue={cms.settings?.backgroundVideo?.poster || ''} className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]" />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" defaultChecked={!!cms.settings?.backgroundVideo?.enabled} id="bgEnabled" /> {language === 'fa' ? 'فعال' : 'Enabled'}
                  </label>
                  <button onClick={() => {
                    const src = (document.getElementById('bgVideoInput') as HTMLInputElement)?.value?.trim();
                    const poster = (document.getElementById('bgPosterInput') as HTMLInputElement)?.value?.trim();
                    const enabled = (document.getElementById('bgEnabled') as HTMLInputElement)?.checked;
                    updateCms('settings.backgroundVideo', { enabled, src: src || undefined, poster: poster || undefined, autoplay: true, loop: true, muted: true });
                    alert(language === 'fa' ? 'ذخیره شد' : 'Saved');
                  }} className="px-4 py-2 rounded-xl gradient-bg text-white">{language === 'fa' ? 'ذخیره' : 'Save'}</button>
                </div>
              </div>
            </div>
          </div>
        );
    
    case 'identity':
      return (
        <div>
          <h1 className="text-2xl font-black mb-6">
            {language === 'fa' ? 'هویت' : 'Identity'}
          </h1>
          
          <div className="glass-card-strong p-6 space-y-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                {language === 'fa' ? 'لوگو / آواتار' : 'Logo / Avatar'}
              </label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-2xl gradient-bg flex items-center justify-center overflow-hidden">
                  {cms.brand.logoImage ? (
                    <img src={cms.brand.logoImage} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-black text-white">{cms.brand.logoLetter}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block px-4 py-2 rounded-xl glass-card hover:border-[var(--border-active)] cursor-pointer text-center">
                    <Icon name="upload" size={16} className="inline me-2" />
                    {language === 'fa' ? 'آپلود لوگو' : 'Upload Logo'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            updateCms('brand.logoImage', event.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {cms.brand.logoImage && (
                    <button
                      onClick={() => updateCms('brand.logoImage', '')}
                      className="text-sm text-[var(--accent-rose)]"
                    >
                      {language === 'fa' ? 'حذف لوگو' : 'Remove'}
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Logo Letter */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                {language === 'fa' ? 'حرف لوگو (اگه عکس نباشه)' : 'Logo Letter (fallback)'}
              </label>
              <input
                type="text"
                maxLength={1}
                value={cms.brand.logoLetter}
                onChange={e => updateCms('brand.logoLetter', e.target.value)}
                className="w-20 px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--primary)] outline-none text-center text-xl font-bold"
              />
            </div>
            
            {/* Full Name */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                  {language === 'fa' ? 'نام کامل (فارسی)' : 'Full Name (Persian)'}
                </label>
                <input
                  type="text"
                  value={cms.identity.fullName.fa}
                  onChange={e => updateCms('identity.fullName.fa', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--primary)] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                  {language === 'fa' ? 'نام کامل (انگلیسی)' : 'Full Name (English)'}
                </label>
                <input
                  type="text"
                  value={cms.identity.fullName.en}
                  onChange={e => updateCms('identity.fullName.en', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--primary)] outline-none"
                />
              </div>
            </div>
            
            {/* Title */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                  {language === 'fa' ? 'عنوان شغلی (فارسی)' : 'Job Title (Persian)'}
                </label>
                <input
                  type="text"
                  value={cms.identity.title.fa}
                  onChange={e => updateCms('identity.title.fa', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--primary)] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                  {language === 'fa' ? 'عنوان شغلی (انگلیسی)' : 'Job Title (English)'}
                </label>
                <input
                  type="text"
                  value={cms.identity.title.en}
                  onChange={e => updateCms('identity.title.en', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--primary)] outline-none"
                />
              </div>
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                {language === 'fa' ? 'ایمیل' : 'Email'}
              </label>
              <input
                type="email"
                value={cms.identity.email}
                onChange={e => updateCms('identity.email', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--primary)] outline-none"
              />
            </div>
            
            {/* Brand Name */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                  {language === 'fa' ? 'نام برند (فارسی)' : 'Brand Name (Persian)'}
                </label>
                <input
                  type="text"
                  value={cms.brand.brandName.fa}
                  onChange={e => updateCms('brand.brandName.fa', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--primary)] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                  {language === 'fa' ? 'نام برند (انگلیسی)' : 'Brand Name (English)'}
                </label>
                <input
                  type="text"
                  value={cms.brand.brandName.en}
                  onChange={e => updateCms('brand.brandName.en', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--primary)] outline-none"
                />
              </div>
            </div>
            
            {/* Save Button */}
            <button
              onClick={saveCms}
              className="px-6 py-2 rounded-xl gradient-bg text-white font-medium"
            >
              {language === 'fa' ? 'ذخیره تغییرات' : 'Save Changes'}
            </button>
          </div>
        </div>
      );

    case 'socials':
      return (
        <div>
          <h1 className="text-2xl font-black mb-6">
            {language === 'fa' ? 'شبکه‌های اجتماعی' : 'Socials'}
          </h1>

          <div className="glass-card-strong p-6 space-y-6">
            {(cms.socials || []).map((social, index) => (
              <div key={social.id} className="space-y-3 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium">{language === 'fa' ? `ارتباط ${index + 1}` : `Social ${index + 1}`}</div>
                  <button
                    onClick={() => updateCms('socials', cms.socials.filter((_, i) => i !== index))}
                    className="text-[var(--accent-rose)] text-sm"
                  >
                    {language === 'fa' ? 'حذف' : 'Remove'}
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[var(--text-muted)] mb-1">{language === 'fa' ? 'پلتفرم' : 'Platform'}</label>
                    <input
                      type="text"
                      value={social.platform}
                      onChange={e => {
                        const updated = [...cms.socials];
                        updated[index] = { ...updated[index], platform: e.target.value as any };
                        updateCms('socials', updated);
                      }}
                      className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--text-muted)] mb-1">URL</label>
                    <input
                      type="text"
                      value={social.url}
                      onChange={e => {
                        const updated = [...cms.socials];
                        updated[index] = { ...updated[index], url: e.target.value };
                        updateCms('socials', updated);
                      }}
                      className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={social.label.fa}
                    onChange={e => {
                      const updated = [...cms.socials];
                      updated[index] = { ...updated[index], label: { ...updated[index].label, fa: e.target.value } };
                      updateCms('socials', updated);
                    }}
                    placeholder={language === 'fa' ? 'برچسب فارسی' : 'Label (Persian)'}
                    className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                  />
                  <input
                    type="text"
                    value={social.label.en}
                    onChange={e => {
                      const updated = [...cms.socials];
                      updated[index] = { ...updated[index], label: { ...updated[index].label, en: e.target.value } };
                      updateCms('socials', updated);
                    }}
                    placeholder={language === 'fa' ? 'برچسب انگلیسی' : 'Label (English)'}
                    className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                  />
                </div>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={social.enabled}
                    onChange={e => {
                      const updated = [...cms.socials];
                      updated[index] = { ...updated[index], enabled: e.target.checked };
                      updateCms('socials', updated);
                    }}
                  />
                  {language === 'fa' ? 'فعال' : 'Enabled'}
                </label>
              </div>
            ))}
            <button
              onClick={() => updateCms('socials', [...cms.socials, { id: Date.now().toString(), platform: '', url: '', label: { fa: '', en: '' }, enabled: true }])}
              className="px-6 py-3 rounded-xl gradient-bg text-white"
            >
              {language === 'fa' ? 'افزودن شبکه جدید' : 'Add Social'}
            </button>
          </div>
        </div>
      );

    case 'dashboard':
      return (
        <div>
          <h1 className="text-2xl font-black mb-6">
            {language === 'fa' ? 'صفحه اصلی' : 'Dashboard'}
          </h1>

          <div className="glass-card-strong p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">{language === 'fa' ? 'متن اول' : 'Hero Tag'}</label>
                <input
                  type="text"
                  value={cms.dashboard.heroTag[language]}
                  onChange={e => updateCms(`dashboard.heroTag.${language}`, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">{language === 'fa' ? 'عنوان A' : 'Title A'}</label>
                <input
                  type="text"
                  value={cms.dashboard.heroTitleA[language]}
                  onChange={e => updateCms(`dashboard.heroTitleA.${language}`, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">{language === 'fa' ? 'عنوان B' : 'Title B'}</label>
                <input
                  type="text"
                  value={cms.dashboard.heroTitleB[language]}
                  onChange={e => updateCms(`dashboard.heroTitleB.${language}`, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">{language === 'fa' ? 'توضیح' : 'Description'}</label>
                <input
                  type="text"
                  value={cms.dashboard.heroDescription[language]}
                  onChange={e => updateCms(`dashboard.heroDescription.${language}`, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">{language === 'fa' ? 'CTA اصلی' : 'Primary CTA'}</label>
                <input
                  type="text"
                  value={cms.dashboard.ctaPrimary[language]}
                  onChange={e => updateCms(`dashboard.ctaPrimary.${language}`, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">{language === 'fa' ? 'CTA ثانویه' : 'Secondary CTA'}</label>
                <input
                  type="text"
                  value={cms.dashboard.ctaSecondary[language]}
                  onChange={e => updateCms(`dashboard.ctaSecondary.${language}`, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                />
              </div>
            </div>

            <div>
              <h2 className="font-bold mb-3">{language === 'fa' ? 'پروژه‌های برجسته' : 'Featured Projects'}</h2>
              <div className="space-y-3">
                {cms.dashboard.projects.map((project, idx) => (
                  <div key={project.id} className="grid lg:grid-cols-3 gap-3 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    <input
                      type="text"
                      value={project.title[language]}
                      onChange={e => {
                        const updated = [...cms.dashboard.projects];
                        updated[idx].title = { ...updated[idx].title, [language]: e.target.value };
                        updateCms('dashboard.projects', updated);
                      }}
                      placeholder={language === 'fa' ? 'عنوان' : 'Title'}
                      className="col-span-3 md:col-span-1 px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <input
                      type="text"
                      value={project.description[language]}
                      onChange={e => {
                        const updated = [...cms.dashboard.projects];
                        updated[idx].description = { ...updated[idx].description, [language]: e.target.value };
                        updateCms('dashboard.projects', updated);
                      }}
                      placeholder={language === 'fa' ? 'توضیح' : 'Description'}
                      className="col-span-3 md:col-span-1 px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <div className="col-span-3 md:col-span-1 flex flex-col gap-2">
                      <input
                        type="text"
                        value={project.tags.join(', ')}
                        onChange={e => {
                          const updated = [...cms.dashboard.projects];
                          updated[idx].tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                          updateCms('dashboard.projects', updated);
                        }}
                        placeholder={language === 'fa' ? 'تگ‌ها، با ویرگول جدا شود' : 'Tags, comma separated'}
                        className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                      />
                      <label className="inline-flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={project.featured}
                          onChange={e => {
                            const updated = [...cms.dashboard.projects];
                            updated[idx].featured = e.target.checked;
                            updateCms('dashboard.projects', updated);
                          }}
                        />
                        {language === 'fa' ? 'برجسته' : 'Featured'}
                      </label>
                      <button
                        onClick={() => updateCms('dashboard.projects', cms.dashboard.projects.filter((_, i) => i !== idx))}
                        className="text-[var(--accent-rose)] text-sm"
                      >
                        {language === 'fa' ? 'حذف' : 'Remove'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => updateCms('dashboard.projects', [...cms.dashboard.projects, { id: Date.now().toString(), title: { fa: '', en: '' }, description: { fa: '', en: '' }, tags: [], featured: false }])}
                className="px-6 py-3 rounded-xl gradient-bg text-white mt-3"
              >
                {language === 'fa' ? 'افزودن پروژه' : 'Add Project'}
              </button>
            </div>

            <div>
              <h2 className="font-bold mb-3">{language === 'fa' ? 'آمار' : 'Stats'}</h2>
              <div className="space-y-3">
                {cms.dashboard.stats.map((stat, idx) => (
                  <div key={stat.id} className="grid lg:grid-cols-4 gap-3 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    <input
                      type="text"
                      value={stat.label[language]}
                      onChange={e => {
                        const updated = [...cms.dashboard.stats];
                        updated[idx].label = { ...updated[idx].label, [language]: e.target.value };
                        updateCms('dashboard.stats', updated);
                      }}
                      placeholder={language === 'fa' ? 'عنوان' : 'Label'}
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <input
                      type="text"
                      value={stat.value}
                      onChange={e => {
                        const updated = [...cms.dashboard.stats];
                        updated[idx].value = e.target.value;
                        updateCms('dashboard.stats', updated);
                      }}
                      placeholder={language === 'fa' ? 'مقدار' : 'Value'}
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <input
                      type="text"
                      value={stat.icon}
                      onChange={e => {
                        const updated = [...cms.dashboard.stats];
                        updated[idx].icon = e.target.value;
                        updateCms('dashboard.stats', updated);
                      }}
                      placeholder={language === 'fa' ? 'آیکون' : 'Icon'}
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <button
                      onClick={() => updateCms('dashboard.stats', cms.dashboard.stats.filter((_, i) => i !== idx))}
                      className="text-[var(--accent-rose)] text-sm"
                    >
                      {language === 'fa' ? 'حذف' : 'Remove'}
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => updateCms('dashboard.stats', [...cms.dashboard.stats, { id: Date.now().toString(), label: { fa: '', en: '' }, value: '', icon: '' }])}
                className="px-6 py-3 rounded-xl gradient-bg text-white mt-3"
              >
                {language === 'fa' ? 'افزودن آمار' : 'Add Stat'}
              </button>
            </div>
          </div>
        </div>
      );

    case 'about':
      return (
        <div>
          <h1 className="text-2xl font-black mb-6">
            {language === 'fa' ? 'درباره من' : 'About'}
          </h1>

          <div className="glass-card-strong p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">{language === 'fa' ? 'عنوان وضعیت' : 'Status Title'}</label>
                <input
                  type="text"
                  value={cms.about.statusTitle[language]}
                  onChange={e => updateCms(`about.statusTitle.${language}`, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">{language === 'fa' ? 'نقل‌قول' : 'Quote'}</label>
                <input
                  type="text"
                  value={cms.about.quote[language]}
                  onChange={e => updateCms(`about.quote.${language}`, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">{language === 'fa' ? 'عنوان خوش‌آمد' : 'Welcome Title'}</label>
                <input
                  type="text"
                  value={cms.about.welcomeTitle[language]}
                  onChange={e => updateCms(`about.welcomeTitle.${language}`, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">{language === 'fa' ? 'متن خوش‌آمد' : 'Welcome Body'}</label>
                <textarea
                  value={cms.about.welcomeBody[language]}
                  onChange={e => updateCms(`about.welcomeBody.${language}`, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                  rows={4}
                />
              </div>
            </div>

            <div>
              <h2 className="font-bold mb-3">{language === 'fa' ? 'معیارها' : 'Metrics'}</h2>
              <div className="space-y-3">
                {cms.about.metrics.map((metric, idx) => (
                  <div key={metric.id} className="grid lg:grid-cols-4 gap-3 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    <input
                      type="text"
                      value={metric.label[language]}
                      onChange={e => {
                        const updated = [...cms.about.metrics];
                        updated[idx].label = { ...updated[idx].label, [language]: e.target.value };
                        updateCms('about.metrics', updated);
                      }}
                      placeholder={language === 'fa' ? 'عنوان' : 'Label'}
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <input
                      type="number"
                      value={metric.percent}
                      onChange={e => {
                        const updated = [...cms.about.metrics];
                        updated[idx].percent = Number(e.target.value);
                        updateCms('about.metrics', updated);
                      }}
                      placeholder={language === 'fa' ? 'درصد' : 'Percent'}
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <input
                      type="text"
                      value={metric.color}
                      onChange={e => {
                        const updated = [...cms.about.metrics];
                        updated[idx].color = e.target.value;
                        updateCms('about.metrics', updated);
                      }}
                      placeholder={language === 'fa' ? 'رنگ' : 'Color'}
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <button
                      onClick={() => updateCms('about.metrics', cms.about.metrics.filter((_, i) => i !== idx))}
                      className="text-[var(--accent-rose)] text-sm"
                    >
                      {language === 'fa' ? 'حذف' : 'Remove'}
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => updateCms('about.metrics', [...cms.about.metrics, { id: Date.now().toString(), label: { fa: '', en: '' }, percent: 0, color: '#34d399' }])}
                className="px-6 py-3 rounded-xl gradient-bg text-white mt-3"
              >
                {language === 'fa' ? 'افزودن معیار' : 'Add Metric'}
              </button>
            </div>

            <div>
              <h2 className="font-bold mb-3">{language === 'fa' ? 'لینک‌های سریع' : 'Quick Links'}</h2>
              <div className="space-y-3">
                {cms.about.quickLinks.map((link, idx) => (
                  <div key={link.id} className="grid lg:grid-cols-4 gap-3 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    <input
                      type="text"
                      value={link.label[language]}
                      onChange={e => {
                        const updated = [...cms.about.quickLinks];
                        updated[idx].label = { ...updated[idx].label, [language]: e.target.value };
                        updateCms('about.quickLinks', updated);
                      }}
                      placeholder={language === 'fa' ? 'برچسب' : 'Label'}
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={e => {
                        const updated = [...cms.about.quickLinks];
                        updated[idx].url = e.target.value;
                        updateCms('about.quickLinks', updated);
                      }}
                      placeholder="URL"
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <input
                      type="text"
                      value={link.icon}
                      onChange={e => {
                        const updated = [...cms.about.quickLinks];
                        updated[idx].icon = e.target.value;
                        updateCms('about.quickLinks', updated);
                      }}
                      placeholder={language === 'fa' ? 'آیکون' : 'Icon'}
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <button
                      onClick={() => updateCms('about.quickLinks', cms.about.quickLinks.filter((_, i) => i !== idx))}
                      className="text-[var(--accent-rose)] text-sm"
                    >
                      {language === 'fa' ? 'حذف' : 'Remove'}
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => updateCms('about.quickLinks', [...cms.about.quickLinks, { id: Date.now().toString(), label: { fa: '', en: '' }, url: '', icon: '' }])}
                className="px-6 py-3 rounded-xl gradient-bg text-white mt-3"
              >
                {language === 'fa' ? 'افزودن لینک' : 'Add Link'}
              </button>
            </div>

            <div>
              <h2 className="font-bold mb-3">{language === 'fa' ? 'فعالیت اخیر' : 'Recent Activity'}</h2>
              <div className="space-y-3">
                {cms.about.recentActivity.map((item, idx) => (
                  <div key={item.id} className="grid lg:grid-cols-4 gap-3 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    <input
                      type="text"
                      value={item.text[language]}
                      onChange={e => {
                        const updated = [...cms.about.recentActivity];
                        updated[idx].text = { ...updated[idx].text, [language]: e.target.value };
                        updateCms('about.recentActivity', updated);
                      }}
                      placeholder={language === 'fa' ? 'متن' : 'Text'}
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <input
                      type="text"
                      value={item.date}
                      onChange={e => {
                        const updated = [...cms.about.recentActivity];
                        updated[idx].date = e.target.value;
                        updateCms('about.recentActivity', updated);
                      }}
                      placeholder={language === 'fa' ? 'تاریخ' : 'Date'}
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <input
                      type="text"
                      value={item.icon}
                      onChange={e => {
                        const updated = [...cms.about.recentActivity];
                        updated[idx].icon = e.target.value;
                        updateCms('about.recentActivity', updated);
                      }}
                      placeholder={language === 'fa' ? 'آیکون' : 'Icon'}
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <button
                      onClick={() => updateCms('about.recentActivity', cms.about.recentActivity.filter((_, i) => i !== idx))}
                      className="text-[var(--accent-rose)] text-sm"
                    >
                      {language === 'fa' ? 'حذف' : 'Remove'}
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => updateCms('about.recentActivity', [...cms.about.recentActivity, { id: Date.now().toString(), text: { fa: '', en: '' }, date: '', icon: '' }])}
                className="px-6 py-3 rounded-xl gradient-bg text-white mt-3"
              >
                {language === 'fa' ? 'افزودن فعالیت' : 'Add Activity'}
              </button>
            </div>
          </div>
        </div>
      );

    case 'projects':
      return (
        <div>
          <h1 className="text-2xl font-black mb-6">
            {language === 'fa' ? 'پروژه‌ها' : 'Projects'}
          </h1>

          <div className="glass-card-strong p-6 space-y-6">
            {(cms.projects.customProjects || []).map((project, idx) => (
              <div key={project.id} className="space-y-3 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{language === 'fa' ? `پروژه ${idx + 1}` : `Project ${idx + 1}`}</div>
                  <button
                    onClick={() => updateCms('projects.customProjects', cms.projects.customProjects.filter((_, i) => i !== idx))}
                    className="text-[var(--accent-rose)] text-sm"
                  >
                    {language === 'fa' ? 'حذف' : 'Remove'}
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={project.title[language]}
                    onChange={e => {
                      const updated = [...cms.projects.customProjects];
                      updated[idx].title = { ...updated[idx].title, [language]: e.target.value };
                      updateCms('projects.customProjects', updated);
                    }}
                    placeholder={language === 'fa' ? 'عنوان' : 'Title'}
                    className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                  />
                  <input
                    type="text"
                    value={project.description[language]}
                    onChange={e => {
                      const updated = [...cms.projects.customProjects];
                      updated[idx].description = { ...updated[idx].description, [language]: e.target.value };
                      updateCms('projects.customProjects', updated);
                    }}
                    placeholder={language === 'fa' ? 'توضیح' : 'Description'}
                    className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={project.github || ''}
                    onChange={e => {
                      const updated = [...cms.projects.customProjects];
                      updated[idx].github = e.target.value;
                      updateCms('projects.customProjects', updated);
                    }}
                    placeholder="GitHub"
                    className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                  />
                  <input
                    type="text"
                    value={project.demo || ''}
                    onChange={e => {
                      const updated = [...cms.projects.customProjects];
                      updated[idx].demo = e.target.value;
                      updateCms('projects.customProjects', updated);
                    }}
                    placeholder={language === 'fa' ? 'لینک دمو' : 'Demo URL'}
                    className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                  />
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={project.featured}
                      onChange={e => {
                        const updated = [...cms.projects.customProjects];
                        updated[idx].featured = e.target.checked;
                        updateCms('projects.customProjects', updated);
                      }}
                    />
                    {language === 'fa' ? 'برجسته' : 'Featured'}
                  </label>
                </div>
              </div>
            ))}
            <button
              onClick={() => updateCms('projects.customProjects', [...cms.projects.customProjects, { id: Date.now().toString(), title: { fa: '', en: '' }, description: { fa: '', en: '' }, tags: [], github: '', demo: '', featured: false }])}
              className="px-6 py-3 rounded-xl gradient-bg text-white"
            >
              {language === 'fa' ? 'افزودن پروژه' : 'Add Project'}
            </button>
          </div>
        </div>
      );

    case 'resume':
      return (
        <div>
          <h1 className="text-2xl font-black mb-6">
            {language === 'fa' ? 'رزومه' : 'Resume'}
          </h1>

          <div className="glass-card-strong p-6 space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">{language === 'fa' ? 'خلاصه' : 'Summary'}</label>
                <textarea
                  value={cms.resume.summary[language]}
                  onChange={e => updateCms(`resume.summary.${language}`, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">{language === 'fa' ? 'تلفن' : 'Phone'}</label>
                <input
                  type="text"
                  value={cms.resume.phone}
                  onChange={e => updateCms('resume.phone', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">Website</label>
                <input
                  type="text"
                  value={cms.resume.website}
                  onChange={e => updateCms('resume.website', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                />
              </div>
            </div>
            <div>
              <h2 className="font-bold mb-3">{language === 'fa' ? 'تجربیات' : 'Experience'}</h2>
              <div className="space-y-4">
                {cms.resume.experience.map((item, idx) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{language === 'fa' ? `تجربه ${idx + 1}` : `Item ${idx + 1}`}</div>
                      <button
                        onClick={() => updateCms('resume.experience', cms.resume.experience.filter((_, i) => i !== idx))}
                        className="text-[var(--accent-rose)] text-sm"
                      >
                        {language === 'fa' ? 'حذف' : 'Remove'}
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={item.company[language]}
                        onChange={e => {
                          const updated = [...cms.resume.experience];
                          updated[idx].company = { ...updated[idx].company, [language]: e.target.value };
                          updateCms('resume.experience', updated);
                        }}
                        placeholder={language === 'fa' ? 'شرکت' : 'Company'}
                        className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                      />
                      <input
                        type="text"
                        value={item.position[language]}
                        onChange={e => {
                          const updated = [...cms.resume.experience];
                          updated[idx].position = { ...updated[idx].position, [language]: e.target.value };
                          updateCms('resume.experience', updated);
                        }}
                        placeholder={language === 'fa' ? 'موقعیت' : 'Position'}
                        className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={item.startDate}
                        onChange={e => {
                          const updated = [...cms.resume.experience];
                          updated[idx].startDate = e.target.value;
                          updateCms('resume.experience', updated);
                        }}
                        placeholder={language === 'fa' ? 'شروع' : 'Start'}
                        className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                      />
                      <input
                        type="text"
                        value={item.endDate}
                        onChange={e => {
                          const updated = [...cms.resume.experience];
                          updated[idx].endDate = e.target.value;
                          updateCms('resume.experience', updated);
                        }}
                        placeholder={language === 'fa' ? 'پایان' : 'End'}
                        className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                      />
                      <textarea
                        value={item.bullets[0]?.[language] || ''}
                        onChange={e => {
                          const updated = [...cms.resume.experience];
                          const currentBullet = updated[idx].bullets[0] || { fa: '', en: '' };
                          updated[idx].bullets = [{ ...currentBullet, [language]: e.target.value }];
                          updateCms('resume.experience', updated);
                        }}
                        placeholder={language === 'fa' ? 'وظایف' : 'Responsibilities'}
                        className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => updateCms('resume.experience', [...cms.resume.experience, { id: Date.now().toString(), company: { fa: '', en: '' }, position: { fa: '', en: '' }, startDate: '', endDate: '', bullets: [{ fa: '', en: '' }] }])}
                className="px-6 py-3 rounded-xl gradient-bg text-white mt-3"
              >
                {language === 'fa' ? 'افزودن تجربه' : 'Add Experience'}
              </button>
            </div>

            <div>
              <h2 className="font-bold mb-3">{language === 'fa' ? 'مهارت‌ها' : 'Skills'}</h2>
              <div className="space-y-3">
                {cms.resume.skills.map((skill, idx) => (
                  <div key={skill.id} className="grid lg:grid-cols-4 gap-3 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={e => {
                        const updated = [...cms.resume.skills];
                        updated[idx].name = e.target.value;
                        updateCms('resume.skills', updated);
                      }}
                      placeholder={language === 'fa' ? 'نام مهارت' : 'Skill'}
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <input
                      type="number"
                      value={skill.percent}
                      onChange={e => {
                        const updated = [...cms.resume.skills];
                        updated[idx].percent = Number(e.target.value);
                        updateCms('resume.skills', updated);
                      }}
                      placeholder={language === 'fa' ? 'درصد' : 'Percent'}
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <input
                      type="text"
                      value={skill.category}
                      onChange={e => {
                        const updated = [...cms.resume.skills];
                        updated[idx].category = e.target.value;
                        updateCms('resume.skills', updated);
                      }}
                      placeholder={language === 'fa' ? 'دسته‌بندی' : 'Category'}
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <button
                      onClick={() => updateCms('resume.skills', cms.resume.skills.filter((_, i) => i !== idx))}
                      className="text-[var(--accent-rose)] text-sm"
                    >
                      {language === 'fa' ? 'حذف' : 'Remove'}
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => updateCms('resume.skills', [...cms.resume.skills, { id: Date.now().toString(), name: '', percent: 0, category: '' }])}
                className="px-6 py-3 rounded-xl gradient-bg text-white mt-3"
              >
                {language === 'fa' ? 'افزودن مهارت' : 'Add Skill'}
              </button>
            </div>

            <div>
              <h2 className="font-bold mb-3">{language === 'fa' ? 'تحصیلات' : 'Education'}</h2>
              <div className="space-y-3">
                {cms.resume.education.map((item, idx) => (
                  <div key={item.id} className="grid lg:grid-cols-4 gap-3 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    <input
                      type="text"
                      value={item.institution[language]}
                      onChange={e => {
                        const updated = [...cms.resume.education];
                        updated[idx].institution = { ...updated[idx].institution, [language]: e.target.value };
                        updateCms('resume.education', updated);
                      }}
                      placeholder={language === 'fa' ? 'موسسه' : 'Institution'}
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <input
                      type="text"
                      value={item.degree[language]}
                      onChange={e => {
                        const updated = [...cms.resume.education];
                        updated[idx].degree = { ...updated[idx].degree, [language]: e.target.value };
                        updateCms('resume.education', updated);
                      }}
                      placeholder={language === 'fa' ? 'مدرک' : 'Degree'}
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <input
                      type="text"
                      value={item.year}
                      onChange={e => {
                        const updated = [...cms.resume.education];
                        updated[idx].year = e.target.value;
                        updateCms('resume.education', updated);
                      }}
                      placeholder={language === 'fa' ? 'سال' : 'Year'}
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <button
                      onClick={() => updateCms('resume.education', cms.resume.education.filter((_, i) => i !== idx))}
                      className="text-[var(--accent-rose)] text-sm"
                    >
                      {language === 'fa' ? 'حذف' : 'Remove'}
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => updateCms('resume.education', [...cms.resume.education, { id: Date.now().toString(), institution: { fa: '', en: '' }, degree: { fa: '', en: '' }, year: '' }])}
                className="px-6 py-3 rounded-xl gradient-bg text-white mt-3"
              >
                {language === 'fa' ? 'افزودن تحصیل' : 'Add Education'}
              </button>
            </div>

            <div>
              <h2 className="font-bold mb-3">{language === 'fa' ? 'زبان‌ها' : 'Languages'}</h2>
              <div className="space-y-3">
                {cms.resume.languages.map((item, idx) => (
                  <div key={item.id} className="grid lg:grid-cols-4 gap-3 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    <input
                      type="text"
                      value={item.name[language]}
                      onChange={e => {
                        const updated = [...cms.resume.languages];
                        updated[idx].name = { ...updated[idx].name, [language]: e.target.value };
                        updateCms('resume.languages', updated);
                      }}
                      placeholder={language === 'fa' ? 'نام' : 'Name'}
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <input
                      type="text"
                      value={item.level[language]}
                      onChange={e => {
                        const updated = [...cms.resume.languages];
                        updated[idx].level = { ...updated[idx].level, [language]: e.target.value };
                        updateCms('resume.languages', updated);
                      }}
                      placeholder={language === 'fa' ? 'سطح' : 'Level'}
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <div />
                    <button
                      onClick={() => updateCms('resume.languages', cms.resume.languages.filter((_, i) => i !== idx))}
                      className="text-[var(--accent-rose)] text-sm"
                    >
                      {language === 'fa' ? 'حذف' : 'Remove'}
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => updateCms('resume.languages', [...cms.resume.languages, { id: Date.now().toString(), name: { fa: '', en: '' }, level: { fa: '', en: '' } }])}
                className="px-6 py-3 rounded-xl gradient-bg text-white mt-3"
              >
                {language === 'fa' ? 'افزودن زبان' : 'Add Language'}
              </button>
            </div>
          </div>
        </div>
      );

    case 'gifts':
      return (
        <div>
          <h1 className="text-2xl font-black mb-6">
            {language === 'fa' ? 'هدیه‌ها' : 'Gifts'}
          </h1>

          <div className="glass-card-strong p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">{language === 'fa' ? 'عنوان' : 'Title'}</label>
                <input
                  type="text"
                  value={cms.gifts.title[language]}
                  onChange={e => updateCms(`gifts.title.${language}`, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">{language === 'fa' ? 'زیرعنوان' : 'Subtitle'}</label>
                <input
                  type="text"
                  value={cms.gifts.subtitle[language]}
                  onChange={e => updateCms(`gifts.subtitle.${language}`, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                />
              </div>
            </div>

            <div>
              <h2 className="font-bold mb-3">{language === 'fa' ? 'لینک‌های دونیت' : 'Donation Links'}</h2>
              <div className="space-y-3">
                {cms.gifts.donationLinks.map((link, idx) => (
                  <div key={link.id} className="grid lg:grid-cols-4 gap-3 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    <input
                      type="text"
                      value={link.label[language]}
                      onChange={e => {
                        const updated = [...cms.gifts.donationLinks];
                        updated[idx].label = { ...updated[idx].label, [language]: e.target.value };
                        updateCms('gifts.donationLinks', updated);
                      }}
                      placeholder={language === 'fa' ? 'برچسب' : 'Label'}
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={e => {
                        const updated = [...cms.gifts.donationLinks];
                        updated[idx].url = e.target.value;
                        updateCms('gifts.donationLinks', updated);
                      }}
                      placeholder="URL"
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <input
                      type="text"
                      value={link.platform}
                      onChange={e => {
                        const updated = [...cms.gifts.donationLinks];
                        updated[idx].platform = e.target.value;
                        updateCms('gifts.donationLinks', updated);
                      }}
                      placeholder={language === 'fa' ? 'پلتفرم' : 'Platform'}
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <button
                      onClick={() => updateCms('gifts.donationLinks', cms.gifts.donationLinks.filter((_, i) => i !== idx))}
                      className="text-[var(--accent-rose)] text-sm"
                    >
                      {language === 'fa' ? 'حذف' : 'Remove'}
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => updateCms('gifts.donationLinks', [...cms.gifts.donationLinks, { id: Date.now().toString(), platform: '', url: '', label: { fa: '', en: '' }, icon: '', color: '#34d399' }])}
                className="px-6 py-3 rounded-xl gradient-bg text-white mt-3"
              >
                {language === 'fa' ? 'افزودن لینک' : 'Add Link'}
              </button>
            </div>

            <div>
              <h2 className="font-bold mb-3">{language === 'fa' ? 'دانلودها' : 'Downloads'}</h2>
              <div className="space-y-3">
                {cms.gifts.downloads.map((item, idx) => (
                  <div key={item.id} className="grid lg:grid-cols-4 gap-3 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    <input
                      type="text"
                      value={item.title[language]}
                      onChange={e => {
                        const updated = [...cms.gifts.downloads];
                        updated[idx].title = { ...updated[idx].title, [language]: e.target.value };
                        updateCms('gifts.downloads', updated);
                      }}
                      placeholder={language === 'fa' ? 'عنوان' : 'Title'}
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <input
                      type="text"
                      value={item.url}
                      onChange={e => {
                        const updated = [...cms.gifts.downloads];
                        updated[idx].url = e.target.value;
                        updateCms('gifts.downloads', updated);
                      }}
                      placeholder="URL"
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <input
                      type="text"
                      value={item.size || ''}
                      onChange={e => {
                        const updated = [...cms.gifts.downloads];
                        updated[idx].size = e.target.value;
                        updateCms('gifts.downloads', updated);
                      }}
                      placeholder={language === 'fa' ? 'حجم' : 'Size'}
                      className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                    />
                    <button
                      onClick={() => updateCms('gifts.downloads', cms.gifts.downloads.filter((_, i) => i !== idx))}
                      className="text-[var(--accent-rose)] text-sm"
                    >
                      {language === 'fa' ? 'حذف' : 'Remove'}
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => updateCms('gifts.downloads', [...cms.gifts.downloads, { id: Date.now().toString(), title: { fa: '', en: '' }, description: { fa: '', en: '' }, url: '', icon: '', size: '' }])}
                className="px-6 py-3 rounded-xl gradient-bg text-white mt-3"
              >
                {language === 'fa' ? 'افزودن دانلود' : 'Add Download'}
              </button>
            </div>
          </div>
        </div>
      );

    case 'announcements':
      return (
        <div>
          <h1 className="text-2xl font-black mb-6">
            {language === 'fa' ? 'اعلان‌ها' : 'Announcements'}
          </h1>

          <div className="glass-card-strong p-6 space-y-6">
            {cms.announcements.map((announcement, idx) => (
              <div key={announcement.id} className="space-y-3 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{language === 'fa' ? `اعلان ${idx + 1}` : `Announcement ${idx + 1}`}</div>
                  <button
                    onClick={() => updateCms('announcements', cms.announcements.filter((_, i) => i !== idx))}
                    className="text-[var(--accent-rose)] text-sm"
                  >
                    {language === 'fa' ? 'حذف' : 'Remove'}
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <select
                    value={announcement.type}
                    onChange={e => {
                      const updated = [...cms.announcements];
                      updated[idx].type = e.target.value as any;
                      updateCms('announcements', updated);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                  >
                    <option value="news">News</option>
                    <option value="poll">Poll</option>
                    <option value="map">Map</option>
                    <option value="image">Image</option>
                    <option value="text">Text</option>
                  </select>
                  <input
                    type="text"
                    value={announcement.title[language]}
                    onChange={e => {
                      const updated = [...cms.announcements];
                      updated[idx].title = { ...updated[idx].title, [language]: e.target.value };
                      updateCms('announcements', updated);
                    }}
                    placeholder={language === 'fa' ? 'عنوان' : 'Title'}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                  />
                </div>
                <textarea
                  value={announcement.content[language]}
                  onChange={e => {
                    const updated = [...cms.announcements];
                    updated[idx].content = { ...updated[idx].content, [language]: e.target.value };
                    updateCms('announcements', updated);
                  }}
                  placeholder={language === 'fa' ? 'متن' : 'Content'}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                  rows={3}
                />
                <div className="grid md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={announcement.image || ''}
                    onChange={e => {
                      const updated = [...cms.announcements];
                      updated[idx].image = e.target.value;
                      updateCms('announcements', updated);
                    }}
                    placeholder={language === 'fa' ? 'آدرس تصویر' : 'Image URL'}
                    className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                  />
                  <input
                    type="text"
                    value={announcement.mapLat ?? ''}
                    onChange={e => {
                      const updated = [...cms.announcements];
                      updated[idx].mapLat = Number(e.target.value) || undefined;
                      updateCms('announcements', updated);
                    }}
                    placeholder={language === 'fa' ? 'عرض جغرافیایی' : 'Map Lat'}
                    className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                  />
                  <input
                    type="text"
                    value={announcement.mapLng ?? ''}
                    onChange={e => {
                      const updated = [...cms.announcements];
                      updated[idx].mapLng = Number(e.target.value) || undefined;
                      updateCms('announcements', updated);
                    }}
                    placeholder={language === 'fa' ? 'طول جغرافیایی' : 'Map Lng'}
                    className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                  />
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={announcement.pinned}
                      onChange={e => {
                        const updated = [...cms.announcements];
                        updated[idx].pinned = e.target.checked;
                        updateCms('announcements', updated);
                      }}
                    />
                    {language === 'fa' ? 'پین شده' : 'Pinned'}
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={announcement.hidden}
                      onChange={e => {
                        const updated = [...cms.announcements];
                        updated[idx].hidden = e.target.checked;
                        updateCms('announcements', updated);
                      }}
                    />
                    {language === 'fa' ? 'پنهان' : 'Hidden'}
                  </label>
                </div>
              </div>
            ))}
            <button
              onClick={() => updateCms('announcements', [...cms.announcements, { id: Date.now().toString(), type: 'news', title: { fa: '', en: '' }, content: { fa: '', en: '' }, pinned: false, archived: false, hidden: false, createdAt: new Date().toISOString() }])}
              className="px-6 py-3 rounded-xl gradient-bg text-white"
            >
              {language === 'fa' ? 'افزودن اعلان' : 'Add Announcement'}
            </button>
          </div>
        </div>
      );

    case 'comments':
      return (
        <div>
          <h1 className="text-2xl font-black mb-6">
            {language === 'fa' ? 'نظرات' : 'Comments'}
          </h1>

          <div className="glass-card-strong p-6 space-y-4">
            {cms.comments.map((comment, idx) => (
              <div key={comment.id} className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div>
                    <div className="font-medium">{comment.name} — {comment.position}</div>
                    <div className="text-xs text-[var(--text-muted)]">{new Date(comment.createdAt).toLocaleDateString()}</div>
                  </div>
                  <button
                    onClick={() => updateCms('comments', cms.comments.filter((_, i) => i !== idx))}
                    className="text-[var(--accent-rose)] text-sm"
                  >
                    {language === 'fa' ? 'حذف' : 'Remove'}
                  </button>
                </div>
                <p className="mb-3">{comment.text}</p>
                <div className="flex items-center gap-4 flex-wrap text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={comment.approved}
                      onChange={e => {
                        const updated = [...cms.comments];
                        updated[idx].approved = e.target.checked;
                        updateCms('comments', updated);
                      }}
                    />
                    {language === 'fa' ? 'تایید شده' : 'Approved'}
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={comment.pinned}
                      onChange={e => {
                        const updated = [...cms.comments];
                        updated[idx].pinned = e.target.checked;
                        updateCms('comments', updated);
                      }}
                    />
                    {language === 'fa' ? 'پین شده' : 'Pinned'}
                  </label>
                </div>
              </div>
            ))}
            <button
              onClick={() => updateCms('comments', [...cms.comments, { id: Date.now().toString(), name: '', email: '', position: '', rating: 5, text: '', approved: false, pinned: false, createdAt: new Date().toISOString() }])}
              className="px-6 py-3 rounded-xl gradient-bg text-white"
            >
              {language === 'fa' ? 'افزودن نظر' : 'Add Comment'}
            </button>
          </div>
        </div>
      );

    case 'shop':
      return (
        <div>
          <h1 className="text-2xl font-black mb-6">
            {language === 'fa' ? 'فروشگاه' : 'Shop'}
          </h1>

          <div className="glass-card-strong p-6 space-y-6">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={cms.shop.enabled}
                onChange={e => updateCms('shop.enabled', e.target.checked)}
              />
              {language === 'fa' ? 'فروشگاه فعال' : 'Shop enabled'}
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">{language === 'fa' ? 'عنوان' : 'Title'}</label>
                <input
                  type="text"
                  value={cms.shop.title[language]}
                  onChange={e => updateCms(`shop.title.${language}`, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">{language === 'fa' ? 'دسته‌بندی‌ها' : 'Categories'}</label>
                <input
                  type="text"
                  value={cms.shop.categories.join(', ')}
                  onChange={e => updateCms('shop.categories', e.target.value.split(',').map(c => c.trim()).filter(Boolean))}
                  placeholder={language === 'fa' ? 'کامپیوتر, دوره' : 'Templates, Courses'}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                />
              </div>
            </div>
            <div className="space-y-4">
              {cms.shop.products.map((product, idx) => (
                <div key={product.id} className="grid lg:grid-cols-4 gap-3 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                  <input
                    type="text"
                    value={product.title[language]}
                    onChange={e => {
                      const updated = [...cms.shop.products];
                      updated[idx].title = { ...updated[idx].title, [language]: e.target.value };
                      updateCms('shop.products', updated);
                    }}
                    placeholder={language === 'fa' ? 'عنوان' : 'Title'}
                    className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                  />
                  <input
                    type="text"
                    value={product.description[language]}
                    onChange={e => {
                      const updated = [...cms.shop.products];
                      updated[idx].description = { ...updated[idx].description, [language]: e.target.value };
                      updateCms('shop.products', updated);
                    }}
                    placeholder={language === 'fa' ? 'توضیح' : 'Description'}
                    className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                  />
                  <input
                    type="text"
                    value={product.priceUSD?.toString() || ''}
                    onChange={e => {
                      const updated = [...cms.shop.products];
                      updated[idx].priceUSD = Number(e.target.value) || undefined;
                      updateCms('shop.products', updated);
                    }}
                    placeholder="USD"
                    className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
                  />
                  <button
                    onClick={() => updateCms('shop.products', cms.shop.products.filter((_, i) => i !== idx))}
                    className="text-[var(--accent-rose)] text-sm"
                  >
                    {language === 'fa' ? 'حذف' : 'Remove'}
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => updateCms('shop.products', [...cms.shop.products, { id: Date.now().toString(), title: { fa: '', en: '' }, description: { fa: '', en: '' }, image: '', priceUSD: 0, priceEUR: 0, priceIRR: 0, priceTMN: 0, priceUSDT: 0, discount: 0, category: '', tags: [], featured: false, soldOut: false }])}
              className="px-6 py-3 rounded-xl gradient-bg text-white"
            >
              {language === 'fa' ? 'افزودن محصول' : 'Add Product'}
            </button>
          </div>
        </div>
      );

    case 'messages':
      return (
        <div>
          <h1 className="text-2xl font-black mb-6">
            {language === 'fa' ? 'پیام‌ها' : 'Messages'}
          </h1>

          <div className="glass-card-strong p-6 space-y-4">
            {cms.messages.map((message, idx) => (
              <div key={message.id} className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div>
                    <div className="font-medium">{message.name} — {message.subject}</div>
                    <div className="text-xs text-[var(--text-muted)]">{message.email}</div>
                  </div>
                  <button
                    onClick={() => updateCms('messages', cms.messages.filter((_, i) => i !== idx))}
                    className="text-[var(--accent-rose)] text-sm"
                  >
                    {language === 'fa' ? 'حذف' : 'Remove'}
                  </button>
                </div>
                <p className="mb-3">{message.message}</p>
                <div className="flex items-center gap-4 flex-wrap text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={message.read}
                      onChange={e => {
                        const updated = [...cms.messages];
                        updated[idx].read = e.target.checked;
                        updateCms('messages', updated);
                      }}
                    />
                    {language === 'fa' ? 'خوانده شده' : 'Read'}
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={message.replied}
                      onChange={e => {
                        const updated = [...cms.messages];
                        updated[idx].replied = e.target.checked;
                        updateCms('messages', updated);
                      }}
                    />
                    {language === 'fa' ? 'پاسخ داده شده' : 'Replied'}
                  </label>
                </div>
              </div>
            ))}
            <button
              onClick={() => updateCms('messages', [...cms.messages, { id: Date.now().toString(), name: '', email: '', subject: '', message: '', read: false, replied: false, createdAt: new Date().toISOString() }])}
              className="px-6 py-3 rounded-xl gradient-bg text-white"
            >
              {language === 'fa' ? 'افزودن پیام' : 'Add Message'}
            </button>
          </div>
        </div>
      );

    case 'settings':
      return (
        <div>
          <h1 className="text-2xl font-black mb-6">
            {language === 'fa' ? 'تنظیمات' : 'Settings'}
          </h1>
          
          <div className="space-y-6">
            <div className="glass-card-strong p-6">
              <h2 className="font-bold mb-4">
                {language === 'fa' ? 'عمومی' : 'General'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-1">
                    {language === 'fa' ? 'نام کاربری گیت‌هاب' : 'GitHub Username'}
                  </label>
                  <input
                    type="text"
                    value={cms.settings.githubUsername}
                    onChange={e => updateCms('settings.githubUsername', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--primary)] outline-none"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[var(--text-muted)] mb-1">
                      {language === 'fa' ? 'زبان پیش‌فرض' : 'Default Language'}
                    </label>
                    <select
                      value={cms.settings.defaultLanguage}
                      onChange={e => updateCms('settings.defaultLanguage', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--primary)] outline-none"
                    >
                      <option value="fa">فارسی</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-[var(--text-muted)] mb-1">
                      {language === 'fa' ? 'تم پیش‌فرض' : 'Default Theme'}
                    </label>
                    <select
                      value={cms.settings.defaultTheme}
                      onChange={e => updateCms('settings.defaultTheme', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--primary)] outline-none"
                    >
                      <option value="dark">{language === 'fa' ? 'تاریک' : 'Dark'}</option>
                      <option value="light">{language === 'fa' ? 'روشن' : 'Light'}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Password Change */}
            <div className="glass-card-strong p-6">
              <h2 className="font-bold mb-4">
                {language === 'fa' ? 'تغییر رمز عبور' : 'Change Password'}
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                {language === 'fa' 
                  ? 'رمز جدید را وارد کنید و ذخیره کنید.'
                  : 'Enter a new password and save.'}
              </p>
              <div className="flex gap-4">
                <input
                  type="password"
                  placeholder={language === 'fa' ? 'رمز جدید' : 'New password'}
                  className="flex-1 px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--primary)] outline-none"
                  id="newPasswordInput"
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('newPasswordInput') as HTMLInputElement;
                    const newPw = input?.value;
                    if (newPw && newPw.length >= 4) {
                      localStorage.setItem('avidkiya-admin-token', newPw);
                      localStorage.setItem('avidkiya-password-changed', 'true');
                      alert(language === 'fa' ? 'رمز تغییر کرد!' : 'Password changed!');
                      input.value = '';
                    } else {
                      alert(language === 'fa' ? 'رمز باید حداقل ۴ کاراکتر باشد' : 'Password must be at least 4 characters');
                    }
                  }}
                  className="px-6 py-2 rounded-xl gradient-bg text-white font-medium"
                >
                  {language === 'fa' ? 'تغییر' : 'Change'}
                </button>
              </div>
            </div>
            
            {/* Save */}
            <button
              onClick={saveCms}
              className="px-6 py-2 rounded-xl gradient-bg text-white font-medium"
            >
              {language === 'fa' ? 'ذخیره تغییرات' : 'Save Changes'}
            </button>
          </div>
        </div>
      );
    
    default:
      return (
        <div className="text-center py-12 text-[var(--text-muted)]">
          <Icon name="settings" size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">
            {language === 'fa' ? sections.find(s => s.id === section)?.labelFa : sections.find(s => s.id === section)?.labelEn}
          </p>
          <p>{language === 'fa' ? 'در حال توسعه...' : 'Coming soon...'}</p>
        </div>
      );
  }
}
