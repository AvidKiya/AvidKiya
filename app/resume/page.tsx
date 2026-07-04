"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCms } from "@/contexts/CmsContext";
import { Icon } from "@/components/ui/Icons";

function ResumeContent() {
  const { t, state, resolve, locale } = useCms();
  const searchParams = useSearchParams();
  const isPrint = searchParams.get("print") === "1";

  useEffect(() => {
    if (isPrint) {
      setTimeout(() => window.print(), 300);
    }
  }, [isPrint]);

  const handlePrint = () => window.print();

  const levelLabel = (level: string) => {
    switch (level) {
      case "native": return locale === "fa" ? "زبان مادری" : "Native";
      case "fluent": return locale === "fa" ? "روان" : "Fluent";
      case "intermediate": return locale === "fa" ? "متوسط" : "Intermediate";
      case "basic": return locale === "fa" ? "پایه" : "Basic";
      default: return level;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {!isPrint && (
        <div className="no-print flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black">{t("resume", "title")}</h1>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-[#5d7ae6] text-white font-bold text-sm flex items-center gap-2 hover:brightness-110 transition"
          >
            <Icon name="Printer" size={16} />
            {t("resume", "print")}
          </button>
        </div>
      )}

      <div className="bg-white text-black rounded-2xl shadow-2xl overflow-hidden" id="resume-content">
        <div className="bg-gradient-to-r from-[#2141a8] to-[#5d7ae6] text-white p-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-black">{resolve(state.identity.fullName)}</h1>
              <p className="text-blue-100 text-lg mt-1">{resolve(state.identity.title)}</p>
            </div>
            <div className="text-6xl font-black text-white/20">{state.brand.logoLetter}</div>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-blue-100">
            <span className="flex items-center gap-1.5">
              <Icon name="Mail" size={14} /> {state.identity.email}
            </span>
            {state.resume.phone && (
              <span className="flex items-center gap-1.5">
                <Icon name="Phone" size={14} /> {state.resume.phone}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Icon name="Globe" size={14} /> {state.resume.website}
            </span>
            <span className="flex items-center gap-1.5">
              <Icon name="MapPin" size={14} /> {resolve(state.identity.location)}
            </span>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <section>
            <h2 className="text-lg font-black text-[#2141a8] border-b-2 border-[#2141a8]/20 pb-2 mb-3">
              {t("resume", "summary")}
            </h2>
            <p className="text-gray-700 leading-relaxed">{resolve(state.resume.summary)}</p>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#2141a8] border-b-2 border-[#2141a8]/20 pb-2 mb-3">
              {t("resume", "experience")}
            </h2>
            <div className="space-y-5">
              {state.resume.experience.map((exp) => (
                <div key={exp.id} className="relative ps-5 border-s-2 border-[#2141a8]/20">
                  <div className="absolute -start-[5px] top-1.5 w-2 h-2 rounded-full bg-[#2141a8]" />
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-bold text-gray-900">{resolve(exp.role)}</h3>
                    <span className="text-sm text-gray-500 font-mono">{exp.period}</span>
                  </div>
                  <div className="text-sm text-[#2141a8] font-medium">
                    {resolve(exp.company)}
                    {exp.location && ` • ${resolve(exp.location)}`}
                  </div>
                  <ul className="mt-2 space-y-1">
                    {exp.bullets.map((bullet, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-[#2141a8] mt-1">▸</span>
                        <span>{resolve(bullet)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#2141a8] border-b-2 border-[#2141a8]/20 pb-2 mb-3">
              {t("resume", "skills")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {state.resume.skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 w-28 truncate">{skill.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#2141a8] to-[#5d7ae6]" style={{ width: `${skill.level}%` }} />
                  </div>
                  <span className="text-xs font-mono text-gray-500 w-8 text-end">{skill.level}%</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#2141a8] border-b-2 border-[#2141a8]/20 pb-2 mb-3">
              {t("resume", "education")}
            </h2>
            <div className="space-y-4">
              {state.resume.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-bold text-gray-900">{resolve(edu.degree)}</h3>
                    <span className="text-sm text-gray-500 font-mono">{edu.period}</span>
                  </div>
                  <div className="text-sm text-[#2141a8]">
                    {resolve(edu.school)}
                    {edu.field && ` — ${resolve(edu.field)}`}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#2141a8] border-b-2 border-[#2141a8]/20 pb-2 mb-3">
              {t("resume", "languages")}
            </h2>
            <div className="flex flex-wrap gap-3">
              {state.resume.languages.map((lang) => (
                <div key={lang.id} className="px-4 py-2 rounded-xl bg-gray-100 text-sm">
                  <span className="font-bold">{lang.name}</span>
                  <span className="text-gray-500 ms-2">— {levelLabel(lang.level)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function ResumePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ResumeContent />
    </Suspense>
  );
}
