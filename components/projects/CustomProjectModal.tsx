"use client";

import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import type { CustomRepoProject } from "@/lib/cms/schema";
import Icon from "@/components/ui/Icon";

interface Props {
  onClose: () => void;
  onSave: (p: CustomRepoProject) => void;
}

export default function CustomProjectModal({ onClose, onSave }: Props) {
  const { t, dir } = useApp();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionFa, setDescriptionFa] = useState("");
  const [url, setUrl] = useState("");
  const [language, setLanguage] = useState("");
  const [topics, setTopics] = useState("");
  const [status, setStatus] = useState<CustomRepoProject["status"]>("STABLE");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    onSave({
      id: `custom-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      descriptionFa: descriptionFa.trim() || undefined,
      url: url.trim(),
      language: language.trim() || undefined,
      topics: topics
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      status,
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <form
        dir={dir}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="glass-panel rounded-xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto"
        style={{ background: "var(--surface-container-solid)" }}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold" style={{ color: "var(--on-surface)" }}>
            {t("addCustomProject")}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="opacity-60 hover:opacity-100"
            style={{ color: "var(--on-surface)" }}
          >
            <Icon name="close" />
          </button>
        </div>

        <Field label={t("projectName")} required>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input"
            placeholder="my-awesome-project"
          />
        </Field>

        <Field label={t("projectUrl")} required>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            type="url"
            className="input"
            placeholder="https://github.com/avidkiya/..."
          />
        </Field>

        <Field label={t("projectDesc")}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input min-h-[70px] resize-y"
            placeholder="Short description in English"
          />
        </Field>

        <Field label={t("projectDescFa")}>
          <textarea
            value={descriptionFa}
            onChange={(e) => setDescriptionFa(e.target.value)}
            className="input min-h-[70px] resize-y"
            placeholder="توضیح کوتاه به فارسی"
            dir="rtl"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label={t("projectLang")}>
            <input
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="input"
              placeholder="TypeScript"
            />
          </Field>
          <Field label="Status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CustomRepoProject["status"])}
              className="input"
            >
              <option value="STABLE">STABLE</option>
              <option value="BETA">BETA</option>
              <option value="ALPHA">ALPHA</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </Field>
        </div>

        <Field label={t("projectTopics")}>
          <input
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            className="input"
            placeholder="react, ai, cloud"
          />
        </Field>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border text-sm"
            style={{
              borderColor: "var(--outline-variant)",
              color: "var(--on-surface)",
            }}
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded text-sm font-bold"
            style={{ background: "var(--primary)", color: "var(--on-primary)" }}
          >
            {t("save")}
          </button>
        </div>
      </form>

      <style jsx>{`
        .input {
          width: 100%;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid var(--outline-variant);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 13px;
          color: var(--on-surface);
          outline: none;
          transition: border-color 0.2s;
        }
        .input:focus {
          border-color: var(--primary);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span
        className="block text-xs font-bold mb-1 uppercase tracking-wide opacity-70"
        style={{ color: "var(--on-surface-variant)" }}
      >
        {label} {required && <span style={{ color: "var(--primary)" }}>*</span>}
      </span>
      {children}
    </label>
  );
}
