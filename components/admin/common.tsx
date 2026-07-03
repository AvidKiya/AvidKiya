"use client";

import React from "react";
import { useCms } from "@/contexts/CmsContext";
import { useApp } from "@/contexts/AppContext";
import { I18nText } from "@/lib/cms/schema";
import Icon from "@/components/ui/Icon";

export function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--on-surface)" }}>
        {title}
      </h1>
      {desc && (
        <p className="text-sm opacity-70 mb-5" style={{ color: "var(--on-surface-variant)" }}>
          {desc}
        </p>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function Card({
  title,
  right,
  children,
}: {
  title?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="glass-panel rounded-lg p-5"
      style={{ background: "var(--surface-container-solid)" }}
    >
      {(title || right) && (
        <div className="flex justify-between items-center mb-4">
          {title && (
            <h3 className="font-bold text-sm" style={{ color: "var(--primary)" }}>
              {title}
            </h3>
          )}
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="block text-[10px] font-bold mb-1.5 uppercase tracking-widest"
      style={{ color: "var(--on-surface-variant)" }}
    >
      {children}
    </span>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={"w-full rounded-md px-3 py-2 text-sm outline-none transition-all " + (props.className ?? "")}
      style={{
        background: "rgba(0,0,0,0.3)",
        border: "1px solid var(--outline-variant)",
        color: "var(--on-surface)",
        ...(props.style ?? {}),
      }}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={"w-full rounded-md px-3 py-2 text-sm outline-none transition-all font-inherit " + (props.className ?? "")}
      style={{
        background: "rgba(0,0,0,0.3)",
        border: "1px solid var(--outline-variant)",
        color: "var(--on-surface)",
        ...(props.style ?? {}),
      }}
    />
  );
}

/** Bilingual text row: side-by-side fa + en. */
export function I18nRow({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: I18nText;
  onChange: (next: I18nText) => void;
  multiline?: boolean;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {multiline ? (
          <Textarea
            rows={3}
            dir="rtl"
            value={value.fa}
            onChange={(e) => onChange({ ...value, fa: e.target.value })}
            placeholder="فارسی"
          />
        ) : (
          <Input
            dir="rtl"
            value={value.fa}
            onChange={(e) => onChange({ ...value, fa: e.target.value })}
            placeholder="فارسی"
          />
        )}
        {multiline ? (
          <Textarea
            rows={3}
            dir="ltr"
            value={value.en}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
            placeholder="English"
          />
        ) : (
          <Input
            dir="ltr"
            value={value.en}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
            placeholder="English"
          />
        )}
      </div>
    </div>
  );
}

/** Reusable "list editor" — renders items with up/down/remove + add button. */
export function ListShell<T>({
  items,
  path,
  render,
  addLabel,
  onAdd,
  gridCols = 1,
}: {
  items: T[];
  path: string;
  render: (item: T, index: number) => React.ReactNode;
  addLabel: string;
  onAdd: () => void;
  gridCols?: 1 | 2 | 3;
}) {
  const { removeFromList, moveInList } = useCms();
  const { language } = useApp();
  const gridClass =
    gridCols === 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-3"
      : gridCols === 3
      ? "grid grid-cols-1 md:grid-cols-3 gap-3"
      : "space-y-3";

  return (
    <>
      <div className={gridClass}>
        {items.map((item, i) => (
          <div
            key={(item as any).id ?? i}
            className="rounded-lg p-3 relative"
            style={{
              background: "rgba(0,0,0,0.2)",
              border: "1px solid var(--outline-variant)",
            }}
          >
            <div className="absolute -top-3 end-2 flex gap-1 z-10">
              <MiniBtn icon="arrow_upward" onClick={() => moveInList(path, i, -1)} />
              <MiniBtn icon="arrow_downward" onClick={() => moveInList(path, i, 1)} />
              <MiniBtn
                icon="delete"
                danger
                onClick={() => {
                  if (confirm(language === "fa" ? "این آیتم حذف شود؟" : "Delete this item?"))
                    removeFromList(path, i);
                }}
              />
            </div>
            {render(item, i)}
          </div>
        ))}
      </div>
      <button
        onClick={onAdd}
        className="mt-3 w-full py-2 rounded border-2 border-dashed text-xs font-bold flex items-center justify-center gap-2 transition-all"
        style={{
          borderColor: "rgba(33,241,168,0.4)",
          color: "var(--primary)",
          background: "rgba(33,241,168,0.05)",
        }}
      >
        <Icon name="add" size={16} />
        {addLabel}
      </button>
    </>
  );
}

function MiniBtn({ icon, onClick, danger }: { icon: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="w-6 h-6 rounded grid place-items-center"
      style={{
        background: "var(--surface-container-highest)",
        color: danger ? "#ffb4ab" : "var(--on-surface)",
        border: "1px solid var(--outline-variant)",
      }}
    >
      <Icon name={icon} size={12} />
    </button>
  );
}
