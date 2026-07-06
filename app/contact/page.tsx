'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass';
import { validate, fieldRules, checkHoneypot } from '@/lib/validation';
import { useCms } from '@/lib/cms/cms-context';

export default function ContactPage() {
  const { cms, updateCms } = useCms();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '', // honeypot
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check honeypot
    const formDataObj = new FormData();
    formDataObj.set('website', formData.website);
    if (!checkHoneypot(formDataObj)) {
      setSubmitted(true);
      return;
    }

    // Validate
    const newErrors: Record<string, string> = {};
    
    const nameError = validate(formData.name, fieldRules.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validate(formData.email, fieldRules.email);
    if (emailError) newErrors.email = emailError;

    const subjectError = validate(formData.subject, fieldRules.title);
    if (subjectError) newErrors.subject = subjectError;

    const messageError = validate(formData.message, fieldRules.message);
    if (messageError) newErrors.message = messageError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Persist to CMS so the admin panel "پیام‌ها" section can see it
    const newMessage = {
      id: 'msg' + Date.now(),
      name: formData.name,
      email: formData.email,
      message: `[${formData.subject}] ${formData.message}`,
      date: new Date().toISOString().slice(0, 10),
      read: false,
    };
    updateCms({ messages: [newMessage, ...cms.messages] });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <GlassCard>
          <div className="text-4xl mb-4">✓</div>
          <h1 className="text-2xl font-bold mb-2">پیام شما ارسال شد</h1>
          <p className="text-text-2 mb-6">
            به زودی با شما تماس خواهیم گرفت.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: '', email: '', subject: '', message: '', website: '' });
            }}
            className="glass-btn px-6 py-2"
          >
            ارسال پیام جدید
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black mb-2">تماس با ما</h1>
        <p className="text-text-2">سوال یا پیشنهادی دارید؟ با ما در تماس باشید.</p>
      </div>

      <GlassCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot */}
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <div>
            <label className="block text-sm mb-2">نام *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
              placeholder="نام خود را وارد کنید"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-2">ایمیل *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
              placeholder="email@example.com"
              dir="ltr"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-2">موضوع *</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
              placeholder="موضوع پیام"
            />
            {errors.subject && (
              <p className="text-red-400 text-sm mt-1">{errors.subject}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-2">پیام *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none resize-none"
              placeholder="پیام خود را بنویسید..."
            />
            {errors.message && (
              <p className="text-red-400 text-sm mt-1">{errors.message}</p>
            )}
          </div>

          <button type="submit" className="glass-btn-primary w-full py-3">
            ارسال پیام
          </button>
        </form>
      </GlassCard>

      <div className="mt-8 text-center text-text-2 text-sm">
        <p>
          یا از طریق ایمیل{' '}
          <a href="mailto:contact@avidkiya.com" className="text-primary hover:underline">
            contact@avidkiya.com
          </a>{' '}
          با ما تماس بگیرید.
        </p>
      </div>
    </div>
  );
}