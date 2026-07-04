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
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);
  
  // Check hash for hidden access - MUST have #kiya/panel
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash === '#kiya/panel') {
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
    
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);
  
  const verifyToken = async (token: string) => {
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setIsAuthorized(true);
        setIsAdmin(true);
        setAdminToken(token);
        localStorage.setItem('avidkiya-admin-token', token);
        
        // Check if first login with default password
        if (token === 'admin' && !localStorage.getItem('avidkiya-password-changed')) {
          setShowPasswordChange(true);
        }
      } else {
        setLoginError(language === 'fa' ? 'رمز عبور نادرست' : 'Invalid password');
      }
    } catch {
      setLoginError(language === 'fa' ? 'خطا در اتصال' : 'Connection error');
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
    window.location.href = '/';
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
      } else {
        setSyncStatus('error');
      }
    } catch {
      setSyncStatus('error');
    }
  }, [adminToken, cms, setSyncStatus]);
  
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
                <span className="text-[var(--accent-emerald)]">✓</span>
                <span>{language === 'fa' ? 'API در دسترس' : 'API reachable'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--accent-amber)]">⚡</span>
                <span>{language === 'fa' ? 'رمز پیش‌فرض: admin' : 'Default password: admin'}</span>
              </div>
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
