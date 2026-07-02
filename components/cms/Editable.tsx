"use client";

import React, { useState } from "react";
import { useCms } from "@/contexts/CmsContext";
import { EditableText, I18nText, StyleOverride } from "@/lib/cms/schema";
import { useApp } from "@/contexts/AppContext";

interface Props {
  path: string;                  // e.g. "about.welcomeTitle"
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
  raw?: I18nText;                // when we want to bind to a raw I18nText (not EditableText)
  editable?: EditableText;       // preferred
  children?: React.ReactNode;    // fallback: pure display
}

/**
 * Text element that shows a pencil icon in edit mode.
 * Click the pencil to open the inline editor overlay.
 */
export default function Editable({
  path,
  as = "span",
  className,
  style,
  multiline,
  raw,
  editable,
  children,
}: Props) {
  const { editMode, isAdmin, resolveEditable, resolve } = useCms();
  const [open, setOpen] = useState(false);

  const displayText = editable
    ? resolveEditable(editable)
    : raw
    ? resolve(raw)
    : "";

  const mergedStyle: React.CSSProperties = {
    ...style,
    ...(editable?.style
      ? {
          fontSize: editable.style.fontSize,
          color: editable.style.color,
          textAlign: editable.style.textAlign as any,
          fontWeight: editable.style.fontWeight as any,
          letterSpacing: editable.style.letterSpacing,
          marginTop: editable.style.marginTop,
          marginBottom: editable.style.marginBottom,
          paddingBlock: editable.style.paddingBlock,
          paddingInline: editable.style.paddingInline,
          display: editable.style.hidden ? "none" : undefined,
        }
      : {}),
  };

  const Tag: any = as;
  const showPencil = editMode && isAdmin;

  return (
    <>
      <Tag
        className={className}
        style={{
          ...mergedStyle,
          ...(showPencil
            ? {
                outline: "1px dashed rgba(33,241,168,0.5)",
                outlineOffset: 2,
                position: "relative",
                cursor: "text",
              }
            : null),
        }}
      >
        {children ?? displayText}
        {showPencil && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(true);
            }}
            aria-label="Edit"
            style={{
              position: "absolute",
              top: -10,
              insetInlineEnd: -10,
              zIndex: 60,
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "var(--primary)",
              color: "var(--on-primary)",
              border: "1px solid #fff",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              edit
            </span>
          </button>
        )}
      </Tag>

      {open && editable && (
        <EditorModal
          path={path}
          editable={editable}
          multiline={multiline}
          onClose={() => setOpen(false)}
        />
      )}
      {open && raw && !editable && (
        <RawTextModal
          path={path}
          value={raw}
          multiline={multiline}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

/* ─────────────────────────── Modals ─────────────────────────── */

function EditorModal({
  path,
  editable,
  multiline,
  onClose,
}: {
  path: string;
  editable: EditableText;
  multiline?: boolean;
  onClose: () => void;
}) {
  const { updateText, updateStyle } = useCms();
  const [fa, setFa] = useState(editable.value.fa);
  const [en, setEn] = useState(editable.value.en);
  const [style, setStyle] = useState<StyleOverride>(editable.style ?? {});

  function apply() {
    updateText(`${path}.value`, "fa", fa);
    updateText(`${path}.value`, "en", en);
    updateStyle(path, style);
    onClose();
  }

  return (
    <ModalShell title="Edit text & style" onClose={onClose}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="فارسی (RTL)">
          {multiline ? (
            <textarea
              value={fa}
              onChange={(e) => setFa(e.target.value)}
              rows={4}
              dir="rtl"
              className="cms-input"
            />
          ) : (
            <input
              value={fa}
              onChange={(e) => setFa(e.target.value)}
              dir="rtl"
              className="cms-input"
            />
          )}
        </Field>
        <Field label="English (LTR)">
          {multiline ? (
            <textarea
              value={en}
              onChange={(e) => setEn(e.target.value)}
              rows={4}
              dir="ltr"
              className="cms-input"
            />
          ) : (
            <input
              value={en}
              onChange={(e) => setEn(e.target.value)}
              dir="ltr"
              className="cms-input"
            />
          )}
        </Field>
      </div>

      <StyleFields style={style} onChange={setStyle} />

      <ModalActions onClose={onClose} onSave={apply} />
    </ModalShell>
  );
}

function RawTextModal({
  path,
  value,
  multiline,
  onClose,
}: {
  path: string;
  value: I18nText;
  multiline?: boolean;
  onClose: () => void;
}) {
  const { updateText } = useCms();
  const [fa, setFa] = useState(value.fa);
  const [en, setEn] = useState(value.en);

  function apply() {
    updateText(path, "fa", fa);
    updateText(path, "en", en);
    onClose();
  }

  return (
    <ModalShell title="Edit text" onClose={onClose}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="فارسی">
          {multiline ? (
            <textarea value={fa} onChange={(e) => setFa(e.target.value)} rows={4} dir="rtl" className="cms-input" />
          ) : (
            <input value={fa} onChange={(e) => setFa(e.target.value)} dir="rtl" className="cms-input" />
          )}
        </Field>
        <Field label="English">
          {multiline ? (
            <textarea value={en} onChange={(e) => setEn(e.target.value)} rows={4} dir="ltr" className="cms-input" />
          ) : (
            <input value={en} onChange={(e) => setEn(e.target.value)} dir="ltr" className="cms-input" />
          )}
        </Field>
      </div>
      <ModalActions onClose={onClose} onSave={apply} />
    </ModalShell>
  );
}

function StyleFields({
  style,
  onChange,
}: {
  style: StyleOverride;
  onChange: (s: StyleOverride) => void;
}) {
  function set<K extends keyof StyleOverride>(k: K, v: StyleOverride[K]) {
    onChange({ ...style, [k]: v });
  }
  return (
    <details className="mt-4">
      <summary
        className="cursor-pointer text-xs uppercase tracking-wider"
        style={{ color: "var(--primary)" }}
      >
        Style overrides
      </summary>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
        <Field label="Font size">
          <input
            className="cms-input"
            placeholder="e.g. 20px"
            value={style.fontSize ?? ""}
            onChange={(e) => set("fontSize", e.target.value || undefined)}
          />
        </Field>
        <Field label="Color">
          <input
            className="cms-input"
            placeholder="#fff or var(--primary)"
            value={style.color ?? ""}
            onChange={(e) => set("color", e.target.value || undefined)}
          />
        </Field>
        <Field label="Font weight">
          <select
            className="cms-input"
            value={style.fontWeight ?? ""}
            onChange={(e) => set("fontWeight", e.target.value || undefined)}
          >
            <option value="">—</option>
            <option value="300">300</option>
            <option value="400">400</option>
            <option value="500">500</option>
            <option value="600">600</option>
            <option value="700">700</option>
          </select>
        </Field>
        <Field label="Align">
          <select
            className="cms-input"
            value={style.textAlign ?? ""}
            onChange={(e) => set("textAlign", (e.target.value as any) || undefined)}
          >
            <option value="">—</option>
            <option value="start">start</option>
            <option value="center">center</option>
            <option value="end">end</option>
          </select>
        </Field>
        <Field label="Margin top">
          <input
            className="cms-input"
            placeholder="12px"
            value={style.marginTop ?? ""}
            onChange={(e) => set("marginTop", e.target.value || undefined)}
          />
        </Field>
        <Field label="Margin bottom">
          <input
            className="cms-input"
            placeholder="12px"
            value={style.marginBottom ?? ""}
            onChange={(e) => set("marginBottom", e.target.value || undefined)}
          />
        </Field>
        <Field label="Hidden">
          <select
            className="cms-input"
            value={style.hidden ? "1" : ""}
            onChange={(e) => set("hidden", e.target.value === "1" ? true : undefined)}
          >
            <option value="">No</option>
            <option value="1">Yes</option>
          </select>
        </Field>
      </div>
    </details>
  );
}

/* ─────────────────────────── shells ─────────────────────────── */

export function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { dir } = useApp();
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        dir={dir}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-xl overflow-hidden max-h-[90vh] flex flex-col"
        style={{
          background: "var(--surface-container-solid)",
          border: "1px solid var(--outline-variant)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
        }}
      >
        <div
          className="px-5 py-3 flex justify-between items-center border-b"
          style={{ borderColor: "var(--outline-variant)" }}
        >
          <h3 className="text-sm font-bold" style={{ color: "var(--primary)" }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="opacity-70 hover:opacity-100"
            style={{ color: "var(--on-surface)" }}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>

      <style jsx global>{`
        .cms-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--outline-variant);
          border-radius: 6px;
          padding: 8px 10px;
          font-size: 13px;
          color: var(--on-surface);
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s;
        }
        .cms-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(33, 241, 168, 0.15);
        }
      `}</style>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span
        className="block text-[10px] font-bold mb-1.5 uppercase tracking-widest opacity-80"
        style={{ color: "var(--on-surface-variant)" }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

export function ModalActions({
  onClose,
  onSave,
  saveLabel = "Save",
}: {
  onClose: () => void;
  onSave: () => void;
  saveLabel?: string;
}) {
  return (
    <div
      className="flex justify-end gap-2 pt-4 mt-4 border-t"
      style={{ borderColor: "var(--outline-variant)" }}
    >
      <button
        onClick={onClose}
        className="px-4 py-2 rounded border text-sm"
        style={{
          borderColor: "var(--outline-variant)",
          color: "var(--on-surface)",
        }}
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        className="px-4 py-2 rounded text-sm font-bold"
        style={{ background: "var(--primary)", color: "var(--on-primary)" }}
      >
        {saveLabel}
      </button>
    </div>
  );
}
