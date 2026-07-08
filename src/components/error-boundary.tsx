'use client';

import React from 'react';
import { GlassCard } from './ui/glass';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    try {
      fetch('/api/monitoring/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: error.message, stack: error.stack, componentStack: errorInfo.componentStack, path: typeof location !== 'undefined' ? location.pathname : '' }),
        keepalive: true,
      }).catch(() => {});
    } catch {}
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[40vh] flex items-center justify-center p-4">
          <GlassCard className="max-w-md text-center">
            <div className="flex justify-center mb-4"><AlertTriangle size={38} className="text-amber" /></div>
            <h2 className="font-bold text-lg mb-2">خطایی رخ داد</h2>
            <p className="text-text-2 text-sm mb-4">
              متأسفانه مشکلی پیش اومد. لطفاً صفحه رو رفرش کن.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="glass-btn-primary px-6 py-2"
            >
              تلاش مجدد
            </button>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}