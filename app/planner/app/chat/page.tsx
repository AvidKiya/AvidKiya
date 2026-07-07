'use client';

import { useState, useRef, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass';
import { MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

const commands = [
  { cmd: '/ثبت', desc: 'ثبت سریع' },
  { cmd: '/وضعیت', desc: 'وضعیت امروز' },
  { cmd: '/روز', desc: 'برنامه روز' },
  { cmd: '/هفته', desc: 'خلاصه هفته' },
  { cmd: '/هدف‌ها', desc: 'اهداف فعال' },
  { cmd: '/تصمیم', desc: 'کمک تصمیم‌گیری' },
  { cmd: '/ایده', desc: 'ذخیره ایده' },
  { cmd: '/انرژی', desc: 'ثبت انرژی' },
];

const authHeader = () => ({ Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('kiya_jwt') || '' : ''}` });

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [limitError, setLimitError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;
    setLimitError(null);

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const sentText = input.trim();
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/planner/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ message: sentText }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessages((prev) => [...prev, data.data.assistantMessage]);
      } else if (res.status === 429) {
        setLimitError(data.error || 'به حد مجاز پیام رسیدی.');
      } else {
        // fallback to local simulated response if API unavailable
        setMessages((prev) => [...prev, {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: generateResponse(sentText),
          createdAt: new Date().toISOString(),
        }]);
      }
    } catch {
      setMessages((prev) => [...prev, {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: generateResponse(sentText),
        createdAt: new Date().toISOString(),
      }]);
    }
    setIsTyping(false);
  };

  const generateResponse = (text: string): string => {
    const lowerText = text.toLowerCase();

    if (text.startsWith('/ثبت')) {
      const content = text.replace('/ثبت', '').trim();
      return content ? `✅ ثبت شد: "${content}"` : 'لطفاً متن را وارد کنید.';
    }

    if (text.startsWith('/وضعیت')) {
      return '📊 وضعیت امروز:\n\n✅ ۲ وظیفه تکمیل شده\n⏱ ۳ ساعت کار مفید\n🔥 ۵ روز streak\n⚡ انرژی: ۷/۱۰';
    }

    if (text.startsWith('/روز')) {
      return '📅 برنامه امروز:\n\n۱. جلسه تیم - ساعت ۱۰:۰۰\n۲. کدنویسی پروژه - ساعت ۱۴:۰۰\n۳. ورزش - ساعت ۱۸:۰۰';
    }

    if (text.startsWith('/هفته')) {
      return '📋 خلاصه هفته:\n\n• ۱۲ وظیفه تکمیل شده\n• ۵ عادت ثبت شده\n• میانگین انرژی: ۷.۵\n• ۳ پروژه پیشرفت داشته';
    }

    if (text.startsWith('/هدف‌ها')) {
      return '🎯 اهداف فعال:\n\n۱. یادگیری React (پیشرفت: ۶۰٪)\n۲. ورزش روزانه (پیشرفت: ۸۰٪)\n۳. تکمیل پروژه X (پیشرفت: ۴۵٪)';
    }

    if (text.startsWith('/تصمیم')) {
      return '🤔 برای تصمیم‌گیری:\n\n۱. معیارهای مهم را لیست کنید\n۲. مزایا و معایب هر گزینه را بنویسید\n۳. تأثیر بلندمدت را در نظر بگیرید\n۴. به حس خود اعتماد کنید';
    }

    if (text.startsWith('/ایده')) {
      const idea = text.replace('/ایده', '').trim();
      return idea ? `💡 ایده ذخیره شد: "${idea}"` : 'لطفاً ایده خود را بنویسید.';
    }

    if (text.startsWith('/انرژی')) {
      const value = text.replace('/انرژی', '').trim();
      return value ? `⚡ انرژی شما ثبت شد: ${value}/10` : 'لطفاً مقدار انرژی را وارد کنید (1-10).';
    }

    if (lowerText.includes('سلام') || lowerText.includes('hello')) {
      return 'سلام! چطور می‌تونم کمکتون کنم؟ 😊';
    }

    if (lowerText.includes('کمک') || lowerText.includes('help')) {
      return 'من می‌تونم در برنامه‌ریزی، ثبت عادت‌ها، و مدیریت وظایف کمکتون کنم.\n\nاز دستورات /ثبت، /وضعیت، /روز استفاده کنید.';
    }

    return 'متوجه شدم. چطور می‌تونم کمکتون کنم؟';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">چت AI</h1>
        <div className="text-sm text-text-3">
          ۱۰ پیام رایگان باقیمانده
        </div>
      </div>

      {/* Commands Help */}
      <GlassCard className="mb-4">
        <div className="text-sm text-text-2 mb-2">دستورات:</div>
        <div className="flex flex-wrap gap-2">
          {commands.map(({ cmd, desc }) => (
            <button
              key={cmd}
              onClick={() => setInput(cmd + ' ')}
              className="text-xs bg-white/5 px-2 py-1 rounded hover:bg-white/10"
            >
              <span className="text-primary">{cmd}</span>
              <span className="text-text-3 mr-1">{desc}</span>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="text-center text-text-3 py-12">
            <div className="flex justify-center mb-4"><MessageCircle size={38} className="opacity-50" /></div>
            <p>پیام خود را بنویسید یا از دستورات استفاده کنید.</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-br-sm'
                  : 'bg-white/10 text-text-1 rounded-bl-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-text-3 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-text-3 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-text-3 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {limitError && (
        <div className="mb-2 text-xs text-amber-400 bg-amber-400/10 rounded-lg px-3 py-2">{limitError}</div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="پیام خود را بنویسید..."
          className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
          disabled={isTyping}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isTyping}
          className="glass-btn-primary px-6 py-3"
        >
          ارسال
        </button>
      </div>
    </div>
  );
}