"use client";

import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Card, Input, Label, Section } from "../common";
import Icon from "@/components/ui/Icon";

interface TestResult {
  ok: boolean;
  account?: any;
  namespaces?: { id: string; title: string }[];
  projects?: { name: string }[];
  error?: string;
  detail?: any;
}

/**
 * Cloudflare setup wizard. Uses /api/setup which acts as a server-side
 * proxy — the Cloudflare API token never touches the browser's
 * localStorage.
 */
export default function CloudflareSetup() {
  const { language } = useApp();
  const [accountId, setAccountId] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [projectName, setProjectName] = useState("avidkiya-portfolio");
  const [kvTitle, setKvTitle] = useState("AVIDKIYA_KV");
  const [busy, setBusy] = useState(false);
  const [test, setTest] = useState<TestResult | null>(null);
  const [creation, setCreation] = useState<any>(null);
  const [bindResult, setBindResult] = useState<any>(null);

  async function call(action: string, body: any) {
    const res = await fetch(`/api/setup?action=${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("avidkiya:admin-token") ?? ""}`,
      },
      body: JSON.stringify(body),
    });
    return res.json();
  }

  async function runTest() {
    setBusy(true);
    setTest(null);
    const r = await call("test", { accountId, apiToken });
    setTest(r);
    setBusy(false);
  }

  async function createKv() {
    setBusy(true);
    const r = await call("create-kv", {
      accountId,
      apiToken,
      title: kvTitle,
      projectName,
    });
    setCreation(r);
    setBusy(false);
    if (r.ok) runTest();
  }

  async function bindKv(namespaceId: string) {
    setBusy(true);
    const r = await call("bind-kv", {
      accountId,
      apiToken,
      projectName,
      namespaceId,
      envVar: "AVIDKIYA_KV",
      environment: "production",
    });
    setBindResult(r);
    setBusy(false);
  }

  const l = (fa: string, en: string) => (language === "fa" ? fa : en);

  return (
    <Section
      title={l("راه‌اندازی کلادفلر", "Cloudflare setup wizard")}
      desc={l(
        "با وارد کردن API Token کلادفلر خودت می‌تونی KV بسازی و اتصالش رو اتوماتیک انجام بدی.",
        "Enter your Cloudflare API token and this wizard will create + bind a KV namespace for you."
      )}
    >
      <Card title={l("مرحله ۱: احراز هویت", "Step 1 — Authenticate")}>
        <div className="space-y-3">
          <div>
            <Label>{l("شناسه حساب کلادفلر (Account ID)", "Cloudflare Account ID")}</Label>
            <Input
              dir="ltr"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              placeholder="e.g. 1234567890abcdef"
            />
            <p className="text-[11px] opacity-70 mt-1" style={{ color: "var(--on-surface-variant)" }}>
              {l(
                "پیدا کن در: داشبورد کلادفلر → گوشه پایین راست پروفایل، یا آدرس داشبورد",
                "Find it: Cloudflare dashboard right sidebar, or the URL /dashboard/<accountId>"
              )}
            </p>
          </div>
          <div>
            <Label>API Token</Label>
            <Input
              dir="ltr"
              type="password"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              placeholder="paste API token"
            />
            <p className="text-[11px] opacity-70 mt-1" style={{ color: "var(--on-surface-variant)" }}>
              {l("ساخت توکن:", "Create a token:")}{" "}
              <a
                href="https://dash.cloudflare.com/profile/api-tokens"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--primary)", textDecoration: "underline" }}
              >
                dash.cloudflare.com/profile/api-tokens
              </a>{" "}
              →{" "}
              {l(
                "Create Token → Custom → مجوزها: Account.Cloudflare Pages:Edit, Account.Workers KV Storage:Edit, Account.Account Settings:Read",
                "Create Token → Custom → Permissions: Account.Cloudflare Pages:Edit, Account.Workers KV Storage:Edit, Account.Account Settings:Read"
              )}
            </p>
          </div>
          <div>
            <Label>{l("نام پروژه Pages", "Pages project name")}</Label>
            <Input dir="ltr" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
          </div>
          <button
            onClick={runTest}
            disabled={busy || !accountId || !apiToken}
            className="px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-60"
            style={{ background: "var(--primary)", color: "var(--on-primary)" }}
          >
            <Icon name={busy ? "sync" : "check_circle"} size={14} />
            {l("بررسی اتصال", "Test connection")}
          </button>

          {test && (
            <div
              className="mt-3 p-3 rounded text-xs"
              style={{
                background: test.ok ? "rgba(33,241,168,0.08)" : "rgba(255,180,171,0.08)",
                border: `1px solid ${test.ok ? "var(--primary)" : "#ffb4ab"}`,
                color: "var(--on-surface)",
              }}
            >
              {test.ok ? (
                <>
                  ✓ {l("متصل به حساب", "Connected to account")}:{" "}
                  <b>{test.account?.name}</b> · {test.namespaces?.length ?? 0}{" "}
                  {l("KV موجود", "existing KVs")} · {test.projects?.length ?? 0}{" "}
                  {l("پروژه Pages", "Pages projects")}
                </>
              ) : (
                <>❌ {test.error}</>
              )}
            </div>
          )}
        </div>
      </Card>

      {test?.ok && (
        <Card title={l("مرحله ۲: ساخت KV Namespace", "Step 2 — Create KV Namespace")}>
          <div className="space-y-3">
            <div>
              <Label>{l("نام KV", "KV namespace title")}</Label>
              <Input dir="ltr" value={kvTitle} onChange={(e) => setKvTitle(e.target.value)} />
            </div>

            {(test.namespaces?.length ?? 0) > 0 && (
              <div>
                <Label>{l("KV های موجود", "Existing namespaces")}</Label>
                <div className="space-y-1">
                  {test.namespaces!.map((n) => (
                    <div
                      key={n.id}
                      className="flex justify-between items-center p-2 rounded text-xs"
                      style={{
                        background: "var(--surface-container-low)",
                        border: "1px solid var(--outline-variant)",
                      }}
                    >
                      <span>
                        <b>{n.title}</b>{" "}
                        <span className="opacity-60 font-mono">({n.id.slice(0, 12)}...)</span>
                      </span>
                      <button
                        onClick={() => bindKv(n.id)}
                        disabled={busy}
                        className="px-3 py-1 rounded text-[11px] font-bold"
                        style={{ background: "var(--primary)", color: "var(--on-primary)" }}
                      >
                        {l("اتصال به Pages", "Bind to Pages")}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={createKv}
              disabled={busy || !kvTitle}
              className="px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-60"
              style={{ background: "var(--primary)", color: "var(--on-primary)" }}
            >
              <Icon name="add" size={14} />
              {l("ساخت KV جدید", "Create new KV")}
            </button>

            {creation?.ok && (
              <div className="text-xs p-3 rounded" style={{ background: "rgba(33,241,168,0.08)" }}>
                ✓ KV <b>{creation.namespace.title}</b> {l("ساخته شد", "created")} — ID:{" "}
                <code>{creation.namespace.id}</code>
                <div className="mt-2">
                  <button
                    onClick={() => bindKv(creation.namespace.id)}
                    disabled={busy}
                    className="px-3 py-1 rounded text-[11px] font-bold"
                    style={{ background: "var(--primary)", color: "var(--on-primary)" }}
                  >
                    {l("اتصال به Pages", "Bind to Pages")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {bindResult && (
        <Card title={l("مرحله ۳: نتیجه اتصال", "Step 3 — Bind result")}>
          <div
            className="p-3 rounded text-xs"
            style={{
              background: bindResult.ok ? "rgba(33,241,168,0.08)" : "rgba(239,192,81,0.08)",
              border: `1px solid ${bindResult.ok ? "var(--primary)" : "#efc051"}`,
            }}
          >
            {bindResult.ok ? (
              <>
                ✓ {bindResult.instruction ??
                  l("اتصال انجام شد. یک deployment جدید trigger کن.", "Binding added. Trigger a new deployment.")}
              </>
            ) : (
              <>
                ⚠️ {bindResult.error}
                {bindResult.dashboardUrl && (
                  <div className="mt-2">
                    <a
                      href={bindResult.dashboardUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded"
                      style={{ background: "var(--primary)", color: "var(--on-primary)" }}
                    >
                      {l("رفتن به داشبورد کلادفلر", "Open Cloudflare dashboard")}
                      <Icon name="arrow_outward" size={12} />
                    </a>
                    <p className="mt-2 opacity-70">
                      {l(
                        "در آنجا KV binding را دستی اضافه کن: Variable = AVIDKIYA_KV",
                        "Add the KV binding manually there: Variable = AVIDKIYA_KV"
                      )}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      )}
    </Section>
  );
}
