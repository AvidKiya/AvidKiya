"use client";

import Link from "next/link";
import { useApp } from "@/contexts/AppContext";
import { useCms } from "@/contexts/CmsContext";
import Icon from "@/components/ui/Icon";
import LangThemeSwitcher from "@/components/ui/LangThemeSwitcher";
import Logo from "@/components/ui/Logo";
import Editable from "@/components/cms/Editable";

/**
 * Print-ready resume page.
 * - Uses print-safe styles (white bg, black text) via @media print.
 * - Everything is editable inline (pencil ✎ in edit mode) — no separate
 *   admin section needed for the resume.
 */
export default function ResumePage() {
  const { t, language, dir } = useApp();
  const { state, resolve } = useCms();
  const r = state.resume;
  const id = state.identity;

  const socials = state.socials.filter((s) => s.enabled);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Toolbar (hidden on print) */}
      <header
        className={`no-print h-14 flex items-center justify-between px-4 md:px-6 border-b ${
          dir === "rtl" ? "flex-row-reverse" : ""
        }`}
        style={{
          borderColor: "var(--outline-variant)",
          background: "var(--surface-container-solid)",
        }}
      >
        <Link href="/" className="flex items-center gap-3">
          <Logo size={32} />
          <span className="font-bold text-sm" style={{ color: "var(--on-surface)" }}>
            {resolve(state.brand.brandName)}
          </span>
        </Link>
        <div className={`flex items-center gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
          <LangThemeSwitcher />
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
            style={{ background: "var(--primary)", color: "var(--on-primary)" }}
          >
            <Icon name="print" size={16} />
            {language === "fa" ? "چاپ رزومه" : "Print CV"}
          </button>
        </div>
      </header>

      {/* Printable A4 page */}
      <main className="py-8 print:py-0 px-4 flex justify-center">
        <article
          id="resume-sheet"
          dir={dir}
          className="w-full max-w-[820px] mx-auto shadow-2xl print:shadow-none"
          style={{
            background: "var(--resume-bg, #ffffff)",
            color: "var(--resume-fg, #111)",
            padding: "48px 56px",
            fontFamily: language === "fa" ? "Vazirmatn, sans-serif" : "'Hanken Grotesk', sans-serif",
            minHeight: "297mm",
          }}
        >
          {/* Header */}
          <header
            className="pb-4 mb-6"
            style={{ borderBottom: `3px solid ${state.brand.primaryColor}` }}
          >
            <div className={`flex ${dir === "rtl" ? "flex-row-reverse" : ""} justify-between items-start gap-4 flex-wrap`}>
              <div>
                <Editable
                  path="identity.fullName"
                  raw={id.fullName}
                  as="h1"
                  style={{
                    fontSize: 34,
                    fontWeight: 700,
                    color: "var(--resume-fg)",
                    margin: 0,
                    lineHeight: 1.1,
                  }}
                />
                <Editable
                  path="identity.title"
                  raw={id.title}
                  as="div"
                  style={{
                    fontSize: 16,
                    marginTop: 4,
                    color: state.brand.primaryColor,
                    fontWeight: 500,
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#333",
                  textAlign: dir === "rtl" ? "left" : "right",
                  lineHeight: 1.7,
                }}
              >
                {id.email && (
                  <div className="flex items-center gap-1.5 justify-end">
                    <Icon name="mail" size={12} />
                    <a href={`mailto:${id.email}`} style={{ color: "inherit" }}>
                      {id.email}
                    </a>
                  </div>
                )}
                {r.phone && (
                  <div className="flex items-center gap-1.5 justify-end" dir="ltr">
                    <Icon name="send" size={12} />
                    <span>{r.phone}</span>
                  </div>
                )}
                <Editable
                  path="identity.location"
                  raw={id.location}
                  as="div"
                  style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}
                />
                {r.website && (
                  <div className="flex items-center gap-1.5 justify-end" dir="ltr">
                    <Icon name="link" size={12} />
                    <a href={r.website} style={{ color: "inherit" }}>
                      {r.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Summary */}
          <Section title={language === "fa" ? "خلاصه" : "Summary"} primary={state.brand.primaryColor}>
            <Editable
              path="resume.summary"
              raw={r.summary}
              as="p"
              multiline
              style={{ fontSize: 13, lineHeight: 1.7, color: "#222", margin: 0 }}
            />
          </Section>

          {/* Experience */}
          <Section title={language === "fa" ? "تجربه کاری" : "Experience"} primary={state.brand.primaryColor}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {r.experience.map((e, i) => (
                <div key={e.id}>
                  <div
                    className={`flex ${dir === "rtl" ? "flex-row-reverse" : ""} justify-between items-baseline`}
                  >
                    <Editable
                      path={`resume.experience.${i}.role`}
                      raw={e.role}
                      as="div"
                      style={{ fontWeight: 700, fontSize: 14, color: "#111" }}
                    />
                    <Editable
                      path={`resume.experience.${i}.period`}
                      raw={e.period}
                      as="div"
                      style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}
                    />
                  </div>
                  <Editable
                    path={`resume.experience.${i}.org`}
                    raw={e.org}
                    as="div"
                    style={{ fontSize: 12, color: state.brand.primaryColor, marginBottom: 4 }}
                  />
                  {e.bullets?.length > 0 && (
                    <ul
                      style={{
                        margin: 0,
                        paddingInlineStart: 18,
                        fontSize: 12,
                        color: "#333",
                        lineHeight: 1.6,
                      }}
                    >
                      {e.bullets.map((b, bi) => (
                        <li key={bi}>
                          <Editable
                            path={`resume.experience.${i}.bullets.${bi}`}
                            raw={b}
                            as="span"
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* Skills */}
          <Section title={language === "fa" ? "مهارت‌ها" : "Skills"} primary={state.brand.primaryColor}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                columnGap: 24,
                rowGap: 8,
              }}
            >
              {r.skills.map((s) => (
                <div key={s.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 11,
                      marginBottom: 3,
                      color: "#333",
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{s.name}</span>
                    <span style={{ fontFamily: "monospace" }}>{s.level}%</span>
                  </div>
                  <div style={{ height: 4, background: "#e5e5e5", borderRadius: 2 }}>
                    <div
                      style={{
                        width: `${s.level}%`,
                        height: "100%",
                        background: state.brand.primaryColor,
                        borderRadius: 2,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Education */}
          <Section title={language === "fa" ? "تحصیلات" : "Education"} primary={state.brand.primaryColor}>
            {r.education.map((e, i) => (
              <div
                key={e.id}
                className={`flex ${dir === "rtl" ? "flex-row-reverse" : ""} justify-between`}
                style={{ marginBottom: 6 }}
              >
                <div>
                  <Editable
                    path={`resume.education.${i}.degree`}
                    raw={e.degree}
                    as="div"
                    style={{ fontWeight: 700, fontSize: 13 }}
                  />
                  <Editable
                    path={`resume.education.${i}.school`}
                    raw={e.school}
                    as="div"
                    style={{ fontSize: 12, color: "#555" }}
                  />
                </div>
                <Editable
                  path={`resume.education.${i}.period`}
                  raw={e.period}
                  as="div"
                  style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}
                />
              </div>
            ))}
          </Section>

          {/* Languages + Social */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <Section title={language === "fa" ? "زبان‌ها" : "Languages"} primary={state.brand.primaryColor} thin>
              {r.languages.map((l, i) => (
                <div
                  key={l.id}
                  className={`flex ${dir === "rtl" ? "flex-row-reverse" : ""} justify-between`}
                  style={{ fontSize: 12, marginBottom: 4 }}
                >
                  <Editable
                    path={`resume.languages.${i}.name`}
                    raw={l.name}
                    as="span"
                    style={{ fontWeight: 600 }}
                  />
                  <Editable
                    path={`resume.languages.${i}.level`}
                    raw={l.level}
                    as="span"
                    style={{ color: "#555" }}
                  />
                </div>
              ))}
            </Section>

            <Section title={language === "fa" ? "پروفایل‌ها" : "Profiles"} primary={state.brand.primaryColor} thin>
              {socials.map((s) => (
                <div
                  key={s.id}
                  style={{ fontSize: 12, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Icon name={s.icon} size={12} color={state.brand.primaryColor} />
                  <span style={{ fontWeight: 600 }}>{s.platform}:</span>
                  <span style={{ fontFamily: "monospace", color: "#333" }}>{s.handle}</span>
                </div>
              ))}
            </Section>
          </div>
        </article>
      </main>

      <style jsx global>{`
        :root {
          --resume-bg: #ffffff;
          --resume-fg: #111111;
        }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #resume-sheet { box-shadow: none !important; padding: 24mm 22mm !important; }
          @page { size: A4; margin: 0; }
        }
      `}</style>
    </div>
  );
}

function Section({
  title,
  children,
  primary,
  thin,
}: {
  title: string;
  children: React.ReactNode;
  primary: string;
  thin?: boolean;
}) {
  return (
    <section style={{ marginBottom: thin ? 12 : 18 }}>
      <h2
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: primary,
          borderBottom: `1px solid ${primary}`,
          paddingBottom: 4,
          marginBottom: 10,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
