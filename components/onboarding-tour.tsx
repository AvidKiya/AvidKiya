'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from './ui/glass';

interface TourStep {
  title: string;
  description: string;
  target: string;
}

const steps: TourStep[] = [
  {
    title: 'خوش آمدید! 👋',
    description: 'KIYA Planner مغز دوم شماست. بذارید راهنماییتون کنیم.',
    target: '',
  },
  {
    title: 'ثبت سریع ⚡',
    description: 'هر فکری داری بنویس. AI خودکار دسته‌بندی می‌کنه.',
    target: '.quick-capture',
  },
  {
    title: 'وظایف 📋',
    description: 'وظایفت رو اینجا مدیریت کن. کانبان ببین.',
    target: '',
  },
  {
    title: 'بینش AI 🧠',
    description: 'AI هر روز بهتون بینش می‌ده. الگوهای رفتاریتون رو کشف کن.',
    target: '',
  },
];

export function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('kiya_tour_done');
    if (!hasSeenTour) {
      setShow(true);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem('kiya_tour_done', '1');
    setShow(false);
  };

  if (!show) return null;

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <GlassCard className="max-w-md w-full text-center !p-8 relative">
        <button
          onClick={handleComplete}
          className="absolute top-4 left-4 text-text-3 hover:text-text-1 text-sm"
        >
          رد کردن
        </button>

        <div className="text-sm text-text-3 mb-4">
          {currentStep + 1} از {steps.length}
        </div>

        <h2 className="text-xl font-bold mb-3">{step.title}</h2>
        <p className="text-text-2 text-sm mb-6">{step.description}</p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentStep ? 'bg-primary' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="glass-btn flex-1 py-3"
            >
              قبلی
            </button>
          )}
          <button
            onClick={() => {
              if (isLast) {
                handleComplete();
              } else {
                setCurrentStep((prev) => prev + 1);
              }
            }}
            className="glass-btn-primary flex-1 py-3"
          >
            {isLast ? 'شروع کن! 🚀' : 'بعدی'}
          </button>
        </div>
      </GlassCard>
    </div>
  );
}