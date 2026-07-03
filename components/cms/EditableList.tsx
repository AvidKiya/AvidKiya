"use client";

import React from "react";
import { useCms } from "@/contexts/CmsContext";
import Icon from "@/components/ui/Icon";

interface Props {
  path: string;            // path to list, e.g. "about.metrics"
  index: number;
  onEdit?: () => void;
  className?: string;
  children: React.ReactNode;
}

/**
 * Wraps a single list-item in edit-mode with a floating toolbar
 * (move-up / move-down / edit / delete).
 */
export function ListItem({ path, index, onEdit, className, children }: Props) {
  const { editMode, isAdmin, removeFromList, moveInList } = useCms();
  if (!editMode || !isAdmin) return <div className={className}>{children}</div>;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        outline: "1px dashed rgba(33,241,168,0.35)",
        outlineOffset: 4,
        borderRadius: 6,
      }}
    >
      {children}
      <div
        style={{
          position: "absolute",
          top: -14,
          insetInlineEnd: 4,
          display: "flex",
          gap: 4,
          zIndex: 60,
          background: "var(--surface-container-solid)",
          padding: "2px 4px",
          borderRadius: 6,
          border: "1px solid var(--outline-variant)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        }}
      >
        <ToolbarBtn icon="arrow_upward" title="Move up" onClick={() => moveInList(path, index, -1)} />
        <ToolbarBtn icon="arrow_downward" title="Move down" onClick={() => moveInList(path, index, 1)} />
        {onEdit && <ToolbarBtn icon="edit" title="Edit" onClick={onEdit} highlight />}
        <ToolbarBtn
          icon="delete"
          title="Delete"
          danger
          onClick={() => {
            if (confirm("Delete this item?")) removeFromList(path, index);
          }}
        />
      </div>
    </div>
  );
}

interface AddProps {
  onClick: () => void;
  label?: string;
  compact?: boolean;
}

/** "+ Add" pill shown only in edit mode. */
export function AddButton({ onClick, label = "Add", compact }: AddProps) {
  const { editMode, isAdmin } = useCms();
  if (!editMode || !isAdmin) return null;
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded font-bold border transition-all ${
        compact ? "text-[10px] px-2 py-1" : "text-xs px-3 py-1.5"
      }`}
      style={{
        background: "rgba(33,241,168,0.1)",
        color: "var(--primary)",
        borderColor: "rgba(33,241,168,0.4)",
        borderStyle: "dashed",
      }}
    >
      <Icon name="add" />
      {label}
    </button>
  );
}

function ToolbarBtn({
  icon,
  title,
  onClick,
  danger,
  highlight,
}: {
  icon: string;
  title: string;
  onClick: () => void;
  danger?: boolean;
  highlight?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      style={{
        width: 22,
        height: 22,
        borderRadius: 4,
        border: "none",
        background: highlight ? "var(--primary)" : "transparent",
        color: highlight
          ? "var(--on-primary)"
          : danger
          ? "#ffb4ab"
          : "var(--on-surface)",
        cursor: "pointer",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Icon name={icon} size={14} />
    </button>
  );
}
