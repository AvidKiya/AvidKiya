"use client";

import Link from "next/link";
import { useCms } from "@/contexts/CmsContext";
import Icon from "@/components/ui/Icon";

export default function EditModeBar() {
  const { isAdmin, editMode, setEditMode, logout, syncStatus, lastSyncAt, syncNow } = useCms();
  if (!isAdmin) return null;

  const statusMeta: Record<typeof syncStatus, { color: string; label: string; icon: string }> = {
    idle:    { color: "#84958a",  label: "Idle",     icon: "cloud" },
    syncing: { color: "#efc051",  label: "Syncing…", icon: "sync"  },
    synced:  { color: "#48ffb6",  label: "Synced",   icon: "cloud_done" },
    offline: { color: "#efc051",  label: "Offline",  icon: "cloud_off" },
    error:   { color: "#ffb4ab",  label: "Error",    icon: "cloud_alert" },
  };
  const m = statusMeta[syncStatus];

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9998] flex items-center gap-2 rounded-full px-2 py-2 shadow-2xl"
      style={{
        background: "var(--surface-container-solid)",
        border: `1px solid ${editMode ? "var(--primary)" : "var(--outline-variant)"}`,
        boxShadow: editMode
          ? "0 0 30px rgba(33,241,168,0.4)"
          : "0 10px 30px rgba(0,0,0,0.5)",
      }}
      dir="ltr"
    >
      <button
        onClick={() => setEditMode(!editMode)}
        className="text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1"
        style={{
          background: editMode ? "var(--primary)" : "transparent",
          color: editMode ? "var(--on-primary)" : "var(--on-surface)",
        }}
      >
        <Icon name={editMode ? "check_circle" : "edit"} size={14} />
        {editMode ? "Editing" : "Edit mode"}
      </button>

      <button
        onClick={syncNow}
        title={lastSyncAt ? `Last: ${new Date(lastSyncAt).toLocaleTimeString()}` : "Sync now"}
        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
        style={{ color: m.color, background: "rgba(255,255,255,0.03)" }}
      >
        <Icon name={m.icon} size={14} />
        <span className="hidden sm:inline">{m.label}</span>
      </button>

      <Link
        href="/admin"
        className="text-xs px-3 py-1 rounded-full border inline-flex items-center gap-1"
        style={{ borderColor: "var(--outline-variant)", color: "var(--on-surface)" }}
      >
        <Icon name="dashboard" size={14} />
        Admin
      </Link>

      <button
        onClick={logout}
        className="text-xs opacity-60 hover:opacity-100 px-2"
        style={{ color: "var(--on-surface)" }}
        title="Logout"
      >
        <Icon name="logout" size={14} className="align-middle" />
      </button>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
