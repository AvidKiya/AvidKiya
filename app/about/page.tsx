"use client";

import React, { useState, useEffect } from "react";
import RootPageLayout from "@/components/layout/RootPageLayout";
import { useCms } from "@/contexts/CmsContext";
import { Icon, BrandIcon } from "@/components/ui/Icons";

export default function AboutPage() {
  const { t, state, resolve, locale } = useCms();
  const [uptime, setUptime] = useState(0);
  const [metrics, setMetrics] = useState(state.about.metrics);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">("idle");

  // Uptime counter
  useEffect(() => {
    const timer = setInterval(() => setUptime((u) => u + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Live metrics simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics(state.about.metrics.map((m) => ({
        ...m,
        percent: Math.max(5, Math.min(95, m.percent + (Math.random() * 10 - 5))),
      })));
    }, 3000);
    return () => clearInterval(timer);
  }, [state.about.metrics]);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      setFormStatus("sent");
      setContactForm({ name: "", email: "", message: "" });
      setTimeout(() => setFormStatus("idle"), 3000);
    } catch {
      setFormStatus("idle");
    }
  };

  return (
    <RootPageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - System Status */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="glass p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-bold text-sm">{resolve(state.about.statusTitle)}</h3>
              </div>

              {/* Metrics */}
              {metrics.map((metric) => (
                <div key={metric.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--color-text-muted)]">{resolve(metric.label)}</span>
                    <span className="font-mono font-bold">{metric.value}</span>
                  </div>
                  <div className="progress-bar">
                    <div style={{ width: `${metric.percent}%`, background: metric.color || "var(--color-primary)" }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="glass p-6 space-y-3">
              <h3 className="font-bold text-sm text-[var(--color-text-subtle)] uppercase tracking-wider">
                {t("about", "quickLinks")}
              </h3>
              {state.about.quickLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--color-bg-alt)] hover:bg-[#1f1f22]/80 transition text-sm font-medium"
                >
                  <Icon name="ExternalLink" size={14} className="text-[var(--color-text-subtle)]" />
                  {resolve(link.label)}
                </a>
              ))}
            </div>

            {/* Quote */}
            <div className="glass p-6 text-center">
              <Icon name="Quote" size={24} className="mx-auto mb-3 text-[var(--color-primary)] opacity-30" />
              <p className="text-sm italic text-[var(--color-text-muted)] leading-relaxed">
                {resolve(state.about.quote)}
              </p>
            </div>
          </div>

          {/* Middle Column - Terminal */}
          <div className="space-y-6">
            {/* Terminal */}
            <div className="bg-[#0d1117] rounded-2xl border border-[#1c2330] overflow-hidden shadow-2xl">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1c2330]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-gray-500 mx-auto font-mono">
                  ~/{state.identity.handle} — zsh — {formatUptime(uptime)}
                </span>
              </div>

              {/* Terminal body */}
              <div className="p-5 font-mono text-sm space-y-1.5 text-gray-300">
                <div className="text-green-400"> <span className="text-white">initializing</span> <span className="text-gray-500">system...</span></div>
                <div className="text-gray-500">[OK] loading kernel modules</div>
                <div className="text-gray-500">[OK] mounting filesystems</div>
                <div className="text-gray-500">[OK] starting services</div>
                <div className="text-emerald-400 mt-3">
                  ✓ {resolve(state.about.welcomeTitle)}
                </div>
                <div className="text-gray-400 mt-2 leading-relaxed">
                  {resolve(state.about.welcomeBody)}
                </div>

                {/* Mini projects */}
                <div className="mt-4 pt-4 border-t border-[#1c2330]">
                  <div className="text-yellow-400 mb-2">📁 projects/</div>
                  {state.about.miniProjects.map((p) => (
                    <div key={p.id} className="pl-4 py-1 text-xs">
                      <span className="text-blue-400">├──</span>
                      <span className="text-gray-300">{p.title[locale] || p.title.en}</span>
                      <span className="text-gray-600 ms-2">[{p.tags?.join(", ")}]</span>
                    </div>
                  ))}
                </div>

                {/* Contact form inline */}
                <div className="mt-4 pt-4 border-t border-[#1c2330]">
                  <div className="text-cyan-400 mb-3">❯ {t("about", "contact")}</div>
                  <form onSubmit={handleSend} className="space-y-2">
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder={t("about", "name")}
                      className="w-full px-3 py-1.5 rounded bg-[#161b22] border border-[#30363d] text-xs text-gray-300 focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder={t("about", "email")}
                      className="w-full px-3 py-1.5 rounded bg-[#161b22] border border-[#30363d] text-xs text-gray-300 focus:outline-none focus:border-blue-500"
                    />
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder={t("about", "message")}
                      rows={3}
                      className="w-full px-3 py-1.5 rounded bg-[#161b22] border border-[#30363d] text-xs text-gray-300 focus:outline-none focus:border-blue-500 resize-none"
                    />
                    <button
                      type="submit"
                      disabled={formStatus !== "idle"}
                      className="px-4 py-1.5 rounded bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition disabled:opacity-50"
                    >
                      {formStatus === "sent" ? t("about", "sent") + " ✓" : t("about", "send")}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Activity */}
          <div className="space-y-6">
            {/* GitHub Heatmap (simplified) */}
            <div className="glass p-5">
              <h3 className="font-bold text-sm text-[var(--color-text-subtle)] uppercase tracking-wider mb-3">
                {t("about", "activity")}
              </h3>
              <div className="grid grid-cols-[repeat(20,1fr)] gap-[2px]">
                {Array.from({ length: 140 }, (_, i) => {
                  const intensity = Math.random();
                  const opacity = intensity > 0.7 ? 0.8 : intensity > 0.4 ? 0.4 : intensity > 0.2 ? 0.2 : 0.05;
                  return (
                    <div
                      key={i}
                      className="aspect-square rounded-[2px]"
                      style={{ backgroundColor: `rgba(93, 122, 230, ${opacity})` }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass p-5 space-y-3">
              {state.about.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 text-sm">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-[var(--color-bg-alt)]">
                    <Icon name={
                      activity.type === "commit" ? "GitCommit" :
                      activity.type === "pr" ? "GitPullRequest" :
                      activity.type === "issue" ? "CircleDot" :
                      activity.type === "release" ? "Tag" : "Circle"
                    } size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{resolve(activity.title)}</div>
                    <div className="text-xs text-[var(--color-text-subtle)]">{resolve(activity.description)}</div>
                    <div className="text-[10px] text-[var(--color-text-subtle)] mt-0.5">{activity.date}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="/about"
              className="block glass p-5 text-center hover:border-[#5d7ae6]/30 transition group"
            >
              <div className="text-2xl mb-2">🚀</div>
              <h4 className="font-bold group-hover:text-[var(--color-primary)] transition">
                {locale === "fa" ? "شروع پروژه جدید" : "Start a Project"}
              </h4>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                {locale === "fa" ? "بیایید با هم کار کنیم" : "Let's work together"}
              </p>
            </a>
          </div>
        </div>
      </div>
    </RootPageLayout>
  );
}
