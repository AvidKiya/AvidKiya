"use client";

import { useEffect, useState } from "react";
import { useCms } from "@/contexts/CmsContext";
import { Card, Section } from "../common";
import { deleteRemoteMessage, fetchRemoteMessages } from "@/lib/cms/api";
import Icon from "@/components/ui/Icon";

/**
 * Messages panel — reads from the Cloudflare Worker (KV) when available,
 * falls back to whatever the About page's contact form has queued in
 * localStorage.
 */
export default function MessagesEditor() {
  const { state, update, removeFromList } = useCms();
  const [remoteAvailable, setRemoteAvailable] = useState(false);

  // Sync any pending offline messages
  useEffect(() => {
    try {
      const raw = localStorage.getItem("avidkiya:messages");
      if (raw) {
        const pending = JSON.parse(raw) as any[];
        if (pending.length) {
          const existingIds = new Set(state.messages.map((m) => m.id));
          const merged = [
            ...pending.filter((m) => !existingIds.has(m.id)),
            ...state.messages,
          ];
          update("messages", merged);
          localStorage.removeItem("avidkiya:messages");
        }
      }
    } catch {}

    // Pull from remote KV if we have a token
    const token = localStorage.getItem("avidkiya:admin-token");
    if (token) {
      fetchRemoteMessages(token).then((list) => {
        if (list) {
          setRemoteAvailable(true);
          // Merge server-side messages
          const byId = new Map(state.messages.map((m) => [m.id, m]));
          for (const m of list) byId.set(m.id, m);
          update(
            "messages",
            Array.from(byId.values()).sort(
              (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
            )
          );
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id: string, i: number) {
    if (!confirm("Delete this message?")) return;
    if (remoteAvailable) {
      const token = localStorage.getItem("avidkiya:admin-token") ?? "";
      await deleteRemoteMessage(id, token);
    }
    removeFromList("messages", i);
  }

  return (
    <Section
      title="Messages"
      desc={
        remoteAvailable
          ? "Every contact-form submission lands here (server-side via Cloudflare KV)."
          : "Every contact-form submission lands here (local-only until Cloudflare KV is configured)."
      }
    >
      {state.messages.length === 0 ? (
        <Card>
          <div
            className="text-center py-10 opacity-60"
            style={{ color: "var(--on-surface-variant)" }}
          >
            <Icon name="inbox" size={48} />
            <p className="mt-3 text-sm">No messages yet.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {state.messages.map((m, i) => (
            <div
              key={m.id}
              className="glass-panel rounded-lg p-4"
              style={{
                background: "var(--surface-container-solid)",
                borderColor: m.read ? "var(--outline-variant)" : "var(--primary)",
              }}
            >
              <div className="flex justify-between items-start mb-2 gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold" style={{ color: "var(--on-surface)" }}>
                      {m.name}
                    </span>
                    <a
                      href={`mailto:${m.email}`}
                      className="text-xs opacity-70 hover:opacity-100"
                      style={{ color: "var(--primary)" }}
                    >
                      &lt;{m.email}&gt;
                    </a>
                    {!m.read && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                        style={{
                          background: "var(--primary)",
                          color: "var(--on-primary)",
                        }}
                      >
                        NEW
                      </span>
                    )}
                  </div>
                  <div
                    className="text-[11px] opacity-60 mt-0.5"
                    style={{ color: "var(--on-surface-variant)" }}
                  >
                    {new Date(m.at).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!m.read && (
                    <button
                      onClick={() => update(`messages.${i}.read`, true)}
                      className="text-xs px-3 py-1 rounded border"
                      style={{
                        borderColor: "var(--outline-variant)",
                        color: "var(--on-surface)",
                      }}
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(m.id, i)}
                    className="text-xs px-3 py-1 rounded"
                    style={{ background: "#93000a", color: "#fff" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {m.subject && (
                <div
                  className="text-sm font-bold mb-1"
                  style={{ color: "var(--primary)" }}
                >
                  {m.subject}
                </div>
              )}
              <p
                className="text-sm whitespace-pre-wrap"
                style={{ color: "var(--on-surface)" }}
              >
                {m.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
