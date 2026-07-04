'use client';

import { useState, useEffect } from 'react';
import { useApp, useCms } from '@/contexts/AppContext';
import { Icon } from '@/components/ui/Icon';
import type { Comment } from '@/lib/cms/schema';

export default function CommentsPage() {
  const { language } = useApp();
  const { cms } = useCms();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    rating: 5,
    text: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Fetch approved comments
  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch('/api/comments');
        if (res.ok) {
          const data = await res.json();
          setComments(data.data || []);
        }
      } catch (error) {
        // Use CMS comments as fallback
        setComments(cms.comments.filter(c => c.approved));
      } finally {
        setLoading(false);
      }
    }
    
    fetchComments();
  }, [cms.comments]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', position: '', rating: 5, text: '' });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const pinnedComments = comments.filter(c => c.pinned);
  const regularComments = comments.filter(c => !c.pinned);
  
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black gradient-text mb-4">
            {language === 'fa' ? 'نظرات' : 'Comments'}
          </h1>
          <p className="text-[var(--text-secondary)]">
            {language === 'fa' ? 'نظرات شما برای من ارزشمند است' : 'Your feedback is valuable to me'}
          </p>
        </div>
        
        {/* Comment Form */}
        <div className="glass-card-strong p-6 mb-12">
          <h2 className="text-xl font-bold mb-6">
            {language === 'fa' ? 'ثبت نظر' : 'Leave a Comment'}
          </h2>
          
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[var(--accent-emerald)]/20 flex items-center justify-center mx-auto mb-4">
                <Icon name="check" size={32} className="text-[var(--accent-emerald)]" />
              </div>
              <p className="font-medium">
                {language === 'fa' 
                  ? 'نظر شما ثبت شد و پس از تایید نمایش داده می‌شود'
                  : 'Your comment has been submitted and will be displayed after approval'}
              </p>
            </div>
          ) : (
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
                placeholder={language === 'fa' ? 'سمت (اختیاری)' : 'Position (optional)'}
                value={formData.position}
                onChange={e => setFormData(prev => ({ ...prev, position: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--primary)] outline-none transition-colors"
              />
              
              {/* Rating */}
              <div>
                <label className="block text-sm mb-2 text-[var(--text-secondary)]">
                  {language === 'fa' ? 'امتیاز' : 'Rating'}
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Icon
                        name="star"
                        size={28}
                        className={star <= formData.rating ? 'text-[var(--accent-amber)] fill-current' : 'text-[var(--text-muted)]'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <textarea
                placeholder={language === 'fa' ? 'نظر شما...' : 'Your comment...'}
                value={formData.text}
                onChange={e => setFormData(prev => ({ ...prev, text: e.target.value }))}
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--primary)] outline-none transition-colors resize-none"
              />
              
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl gradient-bg text-white font-bold hover:brightness-110 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <Icon name="refresh" size={18} className="animate-spin mx-auto" />
                ) : (
                  language === 'fa' ? 'ثبت نظر' : 'Submit Comment'
                )}
              </button>
            </form>
          )}
        </div>
        
        {/* Comments List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Icon name="refresh" size={32} className="animate-spin text-[var(--primary)]" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-muted)]">
            <Icon name="message-square" size={48} className="mx-auto mb-4 opacity-50" />
            <p>{language === 'fa' ? 'هنوز نظری ثبت نشده' : 'No comments yet'}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pinned Comments */}
            {pinnedComments.map(comment => (
              <CommentCard key={comment.id} comment={comment} pinned />
            ))}
            
            {/* Regular Comments */}
            {regularComments.map(comment => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
}

interface CommentCardProps {
  comment: Comment;
  pinned?: boolean;
}

function CommentCard({ comment, pinned }: CommentCardProps) {
  const { language } = useApp();
  
  // Generate avatar letter
  const avatarLetter = comment.name.charAt(0).toUpperCase();
  
  return (
    <div className={`glass-card-strong p-6 ${pinned ? 'ring-2 ring-[var(--accent-amber)]' : ''}`}>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold flex-shrink-0">
          {avatarLetter}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-bold">{comment.name}</span>
            {comment.position && (
              <span className="text-sm text-[var(--text-muted)]">— {comment.position}</span>
            )}
            {pinned && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--accent-amber)]/20 text-[var(--accent-amber)] text-xs font-medium">
                <Icon name="star" size={10} />
                {language === 'fa' ? 'پین شده' : 'Pinned'}
              </span>
            )}
          </div>
          
          {/* Rating */}
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map(star => (
              <Icon
                key={star}
                name="star"
                size={16}
                className={star <= comment.rating ? 'text-[var(--accent-amber)]' : 'text-[var(--text-muted)]'}
              />
            ))}
          </div>
          
          {/* Comment Text */}
          <p className="text-[var(--text-secondary)] leading-relaxed">
            {comment.text}
          </p>
          
          {/* Date */}
          <p className="text-xs text-[var(--text-muted)] mt-3">
            {new Date(comment.createdAt).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')}
          </p>
        </div>
      </div>
    </div>
  );
}
