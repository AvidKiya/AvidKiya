"use client";

import { useEffect, useState } from "react";
import { useCms } from "@/contexts/CmsContext";
import { Card, Section } from "../common";
import Icon from "@/components/ui/Icon";
import {
  deleteComment,
  fetchComments,
  updateComment,
} from "@/lib/cms/api";

export default function CommentsEditor() {
  const { state, update, removeFromList } = useCms();
  const [remoteAvailable, setRemoteAvailable] = useState(false);
  const [busy, setBusy] = useState(false);
  const [replyingId, setReplyingId] = useState<string | null>(null);

  async function refresh() {
    setBusy(true);
    const token = localStorage.getItem("avidkiya:admin-token");
    if (token) {
      const list = await fetchComments(token);
      if (list) {
        setRemoteAvailable(true);
        // Merge server list with local state
        const byId = new Map(state.comments.map((c) => [c.id, c]));
        for (const c of list) byId.set(c.id, c as any);
        update(
          "comments",
          Array.from(byId.values()).sort(
            (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
          )
        );
      }
    }
    setBusy(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleApproved(id: string, i: number, approved: boolean) {
    update(`comments.${i}.approved`, approved);
    const token = localStorage.getItem("avidkiya:admin-token") ?? "";
    if (remoteAvailable) await updateComment(id, { approved }, token);
  }

  async function togglePinned(id: string, i: number, pinned: boolean) {
    update(`comments.${i}.pinned`, pinned);
    const token = localStorage.getItem("avidkiya:admin-token") ?? "";
    if (remoteAvailable) await updateComment(id, { pinned }, token);
  }

  async function submitReply(id: string, i: number, reply: string) {
    update(`comments.${i}.reply`, reply);
    update(`comments.${i}.replyAt`, new Date().toISOString());
    const token = localStorage.getItem("avidkiya:admin-token") ?? "";
    if (remoteAvailable) await updateComment(id, { reply }, token);
    setReplyingId(null);
  }

  async function handleDelete(id: string, i: number) {
    if (!confirm("Delete this review?")) return;
    const token = localStorage.getItem("avidkiya:admin-token") ?? "";
    if (remoteAvailable) await deleteComment(id, token);
    removeFromList("comments", i);
  }

  const pending = state.comments.filter((c) => !c.approved);

  return (
    <Section
      title="Reviews / Comments"
      desc="Moderate what visitors submit. Approve to make public. Reply publicly."
    >
      <div className="flex justify-between items-center mb-3">
        <div className="text-xs opacity-70" style={{ color: "var(--on-surface-variant)" }}>
          {state.comments.length} total · {pending.length} pending approval
        </div>
        <button
          onClick={refresh}
          disabled={busy}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border"
          style={{ borderColor: "var(--outline-variant)", color: "var(--on-surface)" }}
        >
          <Icon
            name="sync"
            size={14}
            style={{ animation: busy ? "spin 1s linear infinite" : undefined }}
          />
          Refresh
        </button>
      </div>

      {state.comments.length === 0 ? (
        <Card>
          <div className="text-center py-10 opacity-60" style={{ color: "var(--on-surface-variant)" }}>
            <Icon name="message" size={40} />
            <p className="mt-3 text-sm">No reviews yet.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {state.comments.map((c, i) => (
            <div
              key={c.id}
              className="glass-panel rounded-lg p-4"
              style={{
                background: "var(--surface-container-solid)",
                borderColor: c.approved ? "var(--outline-variant)" : "#efc051",
              }}
            >
              <div className="flex justify-between items-start mb-2 gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold" style={{ color: "var(--on-surface)" }}>
                      {c.name}
                    </span>
                    {c.email && (
                      <a href={`mailto:${c.email}`} className="text-xs opacity-70" style={{ color: "var(--primary)" }} dir="ltr">
                        {c.email}
                      </a>
                    )}
                    {!c.approved && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: "#efc051", color: "#000" }}>
                        PENDING
                      </span>
                    )}
                    {c.pinned && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: "var(--primary)", color: "var(--on-primary)" }}>
                        ★ PINNED
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] opacity-60 mt-0.5 flex gap-2" style={{ color: "var(--on-surface-variant)" }}>
                    <span>{new Date(c.at).toLocaleString()}</span>
                    {c.rating && <span>· {c.rating}★</span>}
                    {c.role && <span>· {c.role}</span>}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => toggleApproved(c.id, i, !c.approved)}
                    className="text-xs px-3 py-1 rounded"
                    style={{
                      background: c.approved ? "var(--surface-container-highest)" : "var(--primary)",
                      color: c.approved ? "var(--on-surface)" : "var(--on-primary)",
                    }}
                  >
                    {c.approved ? "Un-approve" : "Approve"}
                  </button>
                  <button
                    onClick={() => togglePinned(c.id, i, !c.pinned)}
                    className="text-xs px-3 py-1 rounded border"
                    style={{ borderColor: "var(--outline-variant)", color: "var(--on-surface)" }}
                  >
                    {c.pinned ? "Unpin" : "Pin"}
                  </button>
                  <button
                    onClick={() => setReplyingId(replyingId === c.id ? null : c.id)}
                    className="text-xs px-3 py-1 rounded"
                    style={{ background: "var(--primary)", color: "var(--on-primary)" }}
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, i)}
                    className="text-xs px-3 py-1 rounded"
                    style={{ background: "#93000a", color: "#fff" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--on-surface)" }}>
                {c.message}
              </p>
              {c.reply && !replyingId && (
                <div className="mt-3 ps-3 py-2 rounded" style={{ background: "rgba(33,241,168,0.05)", borderInlineStart: "3px solid var(--primary)" }}>
                  <div className="text-[10px] uppercase opacity-70 mb-1" style={{ color: "var(--primary)" }}>
                    Your reply
                  </div>
                  <p className="text-sm" style={{ color: "var(--on-surface)" }}>{c.reply}</p>
                </div>
              )}
              {replyingId === c.id && (
                <ReplyBox
                  initial={c.reply ?? ""}
                  onCancel={() => setReplyingId(null)}
                  onSave={(v) => submitReply(c.id, i, v)}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </Section>
  );
}

function ReplyBox({ initial, onCancel, onSave }: { initial: string; onCancel: () => void; onSave: (v: string) => void }) {
  const [v, setV] = useState(initial);
  return (
    <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--outline-variant)" }}>
      <textarea
        value={v}
        onChange={(e) => setV(e.target.value)}
        rows={3}
        placeholder="Reply publicly..."
        className="w-full rounded-md px-3 py-2 text-sm outline-none"
        style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--outline-variant)", color: "var(--on-surface)", fontFamily: "inherit" }}
      />
      <div className="flex justify-end gap-2 mt-2">
        <button onClick={onCancel} className="text-xs px-3 py-1.5 rounded border" style={{ borderColor: "var(--outline-variant)", color: "var(--on-surface)" }}>
          Cancel
        </button>
        <button
          onClick={() => v.trim() && onSave(v.trim())}
          className="text-xs px-4 py-1.5 rounded font-bold"
          style={{ background: "var(--primary)", color: "var(--on-primary)" }}
        >
          Save reply
        </button>
      </div>
    </div>
  );
}
