"use client";

import { useEffect, useState } from "react";
import { useCms } from "@/contexts/CmsContext";
import { Card, Section } from "../common";
import Icon from "@/components/ui/Icon";
import {
  deleteRemoteMessage,
  fetchRemoteMessages,
  updateRemoteMessage,
} from "@/lib/cms/api";

/**
 * Live inbox — fetches messages from Cloudflare KV on mount + refresh.
 * Merges local (offline) submissions with server-side ones.
 */
export default function MessagesEditor() {
  const { state, update, removeFromList } = useCms();
  const [remoteAvailable, setRemoteAvailable] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyingId, setReplyingId] = useState<string | null>(null);

  async function refresh() {
    setError(null);
    setBusy(true);
    try {
      // Absorb any offline messages first
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

      const token = localStorage.getItem("avidkiya:admin-token");
      if (!token) return;
      const list = await fetchRemoteMessages(token);
      if (list) {
        setRemoteAvailable(true);
        const byId = new Map(state.messages.map((m) => [m.id, m]));
        for (const m of list) byId.set(m.id, m);
        update(
          "messages",
          Array.from(byId.values()).sort(
            (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
          )
        );
      } else {
        setError("Could not reach /api/messages — is the API deployed?");
      }
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id: string, i: number) {
    if (!confirm("Delete this message?")) return;
    const token = localStorage.getItem("avidkiya:admin-token") ?? "";
    if (remoteAvailable) await deleteRemoteMessage(id, token);
    removeFromList("messages", i);
  }

  async function handleMarkRead(id: string, i: number) {
    update(`messages.${i}.read`, true);
    const token = localStorage.getItem("avidkiya:admin-token") ?? "";
    if (remoteAvailable) await updateRemoteMessage(id, { read: true }, token);
  }

  async function handleReply(id: string, i: number, body: string) {
    update(`messages.${i}.reply`, body);
    update(`messages.${i}.replyAt`, new Date().toISOString());
    update(`messages.${i}.read`, true);
    const token = localStorage.getItem("avidkiya:admin-token") ?? "";
    if (remoteAvailable) await updateRemoteMessage(id, { reply: body, read: true }, token);
    setReplyingId(null);
  }

  return (
    <Section
      title="Messages"
      desc={
        remoteAvailable
          ? "Every contact-form submission lands here (Cloudflare KV backend)."
          : "Server not reachable — showing local messages only."
      }
    >
      <div className="flex justify-between items-center mb-3">
        <div className="text-xs opacity-70" style={{ color: "var(--on-surface-variant)" }}>
          {state.messages.length} total · {state.messages.filter((m) => !m.read).length} unread
        </div>
        <button
          onClick={refresh}
          disabled={busy}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border"
          style={{
            borderColor: "var(--outline-variant)",
            color: "var(--on-surface)",
          }}
        >
          <Icon
            name="sync"
            size={14}
            style={{ animation: busy ? "spin 1s linear infinite" : undefined }}
          />
          Refresh
        </button>
      </div>

      {error && (
        <Card>
          <div className="text-xs" style={{ color: "#ffb4ab" }}>
            ⚠️ {error}
          </div>
        </Card>
      )}

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
            <MessageCard
              key={m.id}
              message={m}
              onDelete={() => handleDelete(m.id, i)}
              onMarkRead={() => handleMarkRead(m.id, i)}
              onReply={(body) => handleReply(m.id, i, body)}
              isReplying={replyingId === m.id}
              setReplying={(v) => setReplyingId(v ? m.id : null)}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Section>
  );
}

function MessageCard({
  message: m,
  onDelete,
  onMarkRead,
  onReply,
  isReplying,
  setReplying,
}: {
  message: any;
  onDelete: () => void;
  onMarkRead: () => void;
  onReply: (body: string) => void;
  isReplying: boolean;
  setReplying: (v: boolean) => void;
}) {
  const [body, setBody] = useState(m.reply ?? "");

  const mailtoBody = `\n\n---\nIn reply to:\n> ${(m.message || "").replace(/\n/g, "\n> ")}`;
  const mailtoLink = `mailto:${m.email}?subject=${encodeURIComponent(
    "Re: " + (m.subject || "Your message")
  )}&body=${encodeURIComponent((body || "") + mailtoBody)}`;

  return (
    <div
      className="glass-panel rounded-lg p-4"
      style={{
        background: "var(--surface-container-solid)",
        borderColor: m.read ? "var(--outline-variant)" : "var(--primary)",
      }}
    >
      <div className="flex justify-between items-start mb-3 gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold" style={{ color: "var(--on-surface)" }}>
              {m.name}
            </span>
            <a
              href={`mailto:${m.email}`}
              className="text-xs opacity-70 hover:opacity-100"
              style={{ color: "var(--primary)" }}
              dir="ltr"
            >
              &lt;{m.email}&gt;
            </a>
            {!m.read && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{ background: "var(--primary)", color: "var(--on-primary)" }}
              >
                NEW
              </span>
            )}
            {m.reply && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{ background: "rgba(33,241,168,0.15)", color: "var(--primary)" }}
              >
                REPLIED
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
              onClick={onMarkRead}
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
            onClick={() => setReplying(!isReplying)}
            className="text-xs px-3 py-1 rounded flex items-center gap-1"
            style={{ background: "var(--primary)", color: "var(--on-primary)" }}
          >
            <Icon name="reply" size={12} />
            Reply
          </button>
          <button
            onClick={onDelete}
            className="text-xs px-3 py-1 rounded"
            style={{ background: "#93000a", color: "#fff" }}
          >
            <Icon name="delete" size={12} />
          </button>
        </div>
      </div>

      {m.subject && (
        <div className="text-sm font-bold mb-1" style={{ color: "var(--primary)" }}>
          {m.subject}
        </div>
      )}
      <p
        className="text-sm whitespace-pre-wrap"
        style={{ color: "var(--on-surface)" }}
      >
        {m.message}
      </p>

      {m.reply && !isReplying && (
        <div
          className="mt-3 p-3 rounded ps-4"
          style={{
            background: "rgba(33,241,168,0.05)",
            borderInlineStart: "3px solid var(--primary)",
          }}
        >
          <div
            className="text-[10px] uppercase tracking-widest opacity-70 mb-1"
            style={{ color: "var(--primary)" }}
          >
            Your reply · {new Date(m.replyAt).toLocaleString()}
          </div>
          <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--on-surface)" }}>
            {m.reply}
          </p>
        </div>
      )}

      {isReplying && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--outline-variant)" }}>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder="Type your reply..."
            className="w-full rounded-md px-3 py-2 text-sm outline-none"
            style={{
              background: "rgba(0,0,0,0.3)",
              border: "1px solid var(--outline-variant)",
              color: "var(--on-surface)",
              fontFamily: "inherit",
            }}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setReplying(false)}
              className="text-xs px-3 py-1.5 rounded border"
              style={{
                borderColor: "var(--outline-variant)",
                color: "var(--on-surface)",
              }}
            >
              Cancel
            </button>
            <a
              href={mailtoLink}
              className="text-xs px-3 py-1.5 rounded flex items-center gap-1"
              style={{
                background: "var(--surface-container-highest)",
                color: "var(--on-surface)",
              }}
            >
              <Icon name="mail" size={12} />
              Open in email
            </a>
            <button
              onClick={() => body.trim() && onReply(body.trim())}
              className="text-xs px-4 py-1.5 rounded font-bold flex items-center gap-1"
              style={{ background: "var(--primary)", color: "var(--on-primary)" }}
            >
              <Icon name="send" size={12} />
              Save reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
