'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass';
import { validate, fieldRules } from '@/lib/validation';
import { useCms } from '@/lib/cms/cms-context';
import { Star, Check } from 'lucide-react';

export default function CommentsPage() {
  const { cms, updateCms } = useCms();
  const [remoteComments, setRemoteComments] = useState(cms.comments);
  const comments = remoteComments.length ? remoteComments : cms.comments;

  useEffect(() => {
    fetch('/api/comments')
      .then(r => r.json())
      .then(d => { if (d.success && Array.isArray(d.data)) setRemoteComments(d.data); })
      .catch(() => {});
  }, []);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    text: '',
    rating: 5,
    website: '', // honeypot
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [justSubmitted, setJustSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check honeypot
    if (formData.website) {
      setShowForm(false);
      return;
    }

    // Rate limit سمت کلاینت — حداکثر ۳ نظر در ساعت (طبق 24-FINAL-REQUIREMENTS.md بخش A3)
    try {
      const key = 'ak_comment_times';
      const now = Date.now();
      const hour = 60 * 60 * 1000;
      const times: number[] = JSON.parse(localStorage.getItem(key) || '[]').filter((t: number) => now - t < hour);
      if (times.length >= 3) {
        setErrors({ text: 'تعداد نظرات مجاز در این ساعت تمام شده. کمی بعد دوباره امتحان کن.' });
        return;
      }
      times.push(now);
      localStorage.setItem(key, JSON.stringify(times));
    } catch {}

    // Validate
    const newErrors: Record<string, string> = {};

    const nameError = validate(formData.name, fieldRules.name);
    if (nameError) newErrors.name = nameError;

    const textError = validate(formData.text, fieldRules.message);
    if (textError) newErrors.text = textError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Add comment (pending approval) — persisted to CMS so the admin panel can moderate it
    const newComment = {
      id: `comment-${Date.now()}`,
      author: formData.name,
      email: formData.email || undefined,
      role: formData.role || undefined,
      text: formData.text,
      rating: formData.rating,
      approved: false,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    updateCms({ comments: [newComment, ...cms.comments] });
    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          text: formData.text,
          rating: formData.rating,
          website: formData.website,
        }),
      });
    } catch {}
    setFormData({ name: '', email: '', role: '', text: '', rating: 5, website: '' });
    setShowForm(false);
    setJustSubmitted(true);
    setTimeout(() => setJustSubmitted(false), 4000);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={14} className={i < rating ? 'text-yellow-400' : 'text-text-3'} fill={i < rating ? 'currentColor' : 'none'} />
    ));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black mb-2">نظرات</h1>
        <p className="text-text-2">نظرات کاربران ما</p>
      </div>

      {justSubmitted && (
        <GlassCard className="mb-8 text-center border-emerald/20">
          <p className="text-emerald text-sm flex items-center justify-center gap-1.5"><Check size={14} /> نظر شما ثبت شد — بعد از تایید ادمین نمایش داده می‌شود.</p>
        </GlassCard>
      )}

      {/* Add Comment Button */}
      <div className="text-center mb-8">
        <button
          onClick={() => setShowForm(true)}
          className="glass-btn-primary px-6 py-3"
        >
          ثبت نظر
        </button>
      </div>

      {/* Add Comment Form */}
      {showForm && (
        <GlassCard className="mb-8">
          <h2 className="font-bold mb-4">نظر شما</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot */}
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">نام *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm mb-2">نقش</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="مثال: توسعه‌دهنده"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">امتیاز</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className={star <= formData.rating ? 'text-yellow-400' : 'text-text-3'}
                  >
                    <Star size={22} fill={star <= formData.rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">نظر *</label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none resize-none"
              />
              {errors.text && (
                <p className="text-red-400 text-sm mt-1">{errors.text}</p>
              )}
            </div>

            <div className="flex gap-2">
              <button type="submit" className="glass-btn-primary px-6 py-2">
                ارسال نظر
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="glass-btn px-6 py-2"
              >
                انصراف
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.filter((c) => c.approved).length === 0 && (
          <GlassCard className="text-center text-text-3 py-10 text-sm">
            هنوز نظری ثبت نشده. اولین نفری باش که نظر می‌دهد!
          </GlassCard>
        )}
        {comments
          .filter((c) => c.approved)
          .map((comment) => (
            <GlassCard key={comment.id}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-bold">{comment.author}</div>
                  {comment.role && (
                    <div className="text-xs text-text-3">{comment.role}</div>
                  )}
                </div>
                <div className="flex gap-1">{renderStars(comment.rating || 0)}</div>
              </div>
              <p className="text-text-2">{comment.text}</p>
              <div className="text-xs text-text-3 mt-2">{comment.createdAt}</div>
            </GlassCard>
          ))}
      </div>
    </div>
  );
}
