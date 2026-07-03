"use client";

import { useApp } from "@/contexts/AppContext";
import { languageColor } from "@/lib/github";
import Icon from "@/components/ui/Icon";

interface Props {
  title: string;
  description: string;
  url: string;
  homepage?: string | null;
  language: string | null;
  topics: string[];
  status: "STABLE" | "BETA" | "ALPHA" | "ARCHIVED";
  stars?: number;
  forks?: number;
  size?: string;
  updatedAt?: string;
  isCustom?: boolean;
  onRemove?: () => void;
  /** Optional cover image (data-URL or https). */
  image?: string;
}

export default function ProjectCard({
  title,
  description,
  url,
  homepage,
  language,
  topics,
  status,
  stars,
  forks,
  size,
  updatedAt,
  isCustom,
  onRemove,
  image,
}: Props) {
  const { t, language: lang } = useApp();

  const statusColor = {
    STABLE: "var(--primary-fixed)",
    BETA: "#efc051",
    ALPHA: "#ffb4ab",
    ARCHIVED: "var(--on-surface-variant)",
  }[status];

  return (
    <article className="glass-panel rounded-lg overflow-hidden transition-all group hover:-translate-y-0.5 flex flex-col">
      {image && (
        <div
          className="w-full overflow-hidden"
          style={{ aspectRatio: "16/9", background: "var(--surface-container-highest)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-5 flex-1 flex flex-col">
      <div className="flex justify-between items-start mb-4 gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3
              className="text-lg font-bold truncate"
              style={{ color: "var(--on-surface)" }}
            >
              {title}
            </h3>
            {isCustom && (
              <span
                className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                style={{ background: "rgba(239,192,81,0.15)", color: "#efc051" }}
              >
                CUSTOM
              </span>
            )}
          </div>
          <p
            className="text-xs leading-relaxed opacity-80 line-clamp-2"
            style={{ color: "var(--on-surface-variant)" }}
          >
            {description || (lang === "fa" ? "بدون توضیحات" : "No description")}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: statusColor, boxShadow: `0 0 6px ${statusColor}` }}
            />
            <span className="text-[10px] font-bold" style={{ color: statusColor }}>
              {status}
            </span>
          </div>
          {isCustom && onRemove && (
            <button
              onClick={onRemove}
              className="text-[10px] opacity-40 hover:opacity-100 transition-opacity"
              style={{ color: "#ffb4ab" }}
              title={t("remove")}
            >
              <Icon name="delete" size={14} />
            </button>
          )}
        </div>
      </div>

      {topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {topics.slice(0, 5).map((topic) => (
            <span
              key={topic}
              className="text-[10px] px-2 py-0.5 rounded border font-mono"
              style={{
                background: "var(--surface-container-highest)",
                borderColor: "var(--outline-variant)",
                color: "var(--primary)",
              }}
            >
              {topic}
            </span>
          ))}
          {language && (
            <span
              className="text-[10px] px-2 py-0.5 rounded font-mono flex items-center gap-1"
              style={{
                background: "var(--surface-container-highest)",
                color: "var(--on-surface)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ background: languageColor(language) }}
              />
              {language}
            </span>
          )}
        </div>
      )}

      <div
        className="flex items-center justify-between text-[11px] font-mono border-t pt-3"
        style={{
          borderColor: "var(--outline-variant)",
          color: "var(--on-surface-variant)",
        }}
      >
        <div className="flex gap-3 flex-wrap opacity-80">
          {typeof stars === "number" && (
            <span className="flex items-center gap-1">
              <Icon name="star" size={12} />
              {stars}
            </span>
          )}
          {typeof forks === "number" && (
            <span className="flex items-center gap-1">
              <Icon name="fork_right" size={12} />
              {forks}
            </span>
          )}
          {size && <span>{size}</span>}
          {updatedAt && (
            <span title={new Date(updatedAt).toLocaleString()}>
              {timeAgo(updatedAt, lang)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {homepage && (
            <a
              href={homepage}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 font-bold hover:underline"
              style={{ color: "var(--primary)" }}
            >
              {t("liveDemo")}
              <Icon name="open_in_new" size={12} />
            </a>
          )}
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 font-bold hover:underline"
            style={{ color: "var(--primary)" }}
          >
            {t("sourceCode")}
            <Icon name="arrow_outward" size={14} />
          </a>
        </div>
      </div>
      </div>
    </article>
  );
}

function timeAgo(iso: string, lang: "fa" | "en"): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.round(diff / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);
  const mon = Math.round(day / 30);
  const yr = Math.round(day / 365);
  if (lang === "fa") {
    if (sec < 60) return "چند لحظه پیش";
    if (min < 60) return `${min} دقیقه پیش`;
    if (hr < 24) return `${hr} ساعت پیش`;
    if (day < 30) return `${day} روز پیش`;
    if (mon < 12) return `${mon} ماه پیش`;
    return `${yr} سال پیش`;
  }
  if (sec < 60) return "just now";
  if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`;
  if (day < 30) return `${day}d ago`;
  if (mon < 12) return `${mon}mo ago`;
  return `${yr}y ago`;
}
