"use client";

/**
 * Central icon component. Uses lucide-react SVG icons instead of the
 * Material Symbols font — no external font download at runtime, no
 * text-fallback flash ("folder", "expand_more") in regions where Google
 * Fonts is blocked (e.g. Iran).
 *
 * Icon names use the Material Symbols vocabulary so we didn't have to
 * rewrite every call site.
 */

import React from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  AtSign,
  Bug,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Cloud,
  CloudOff,
  CloudUpload,
  Code,
  Download,
  Edit3,
  ExternalLink,
  FileText,
  Files,
  Folder,
  GitBranch,
  GitFork,
  Home,
  Inbox,
  Languages,
  Layers,
  Link as LinkIcon,
  LogIn,
  LogOut,
  Mail,
  MessageCircle,
  Moon,
  MoreHorizontal,
  Package,
  Plus,
  Power,
  Printer,
  Puzzle,
  RefreshCw,
  Rocket,
  RotateCcw,
  Search,
  Send,
  Settings,
  Share2,
  Shield,
  SplitSquareVertical,
  Star,
  Sun,
  Terminal,
  Trash2,
  Upload,
  Users,
  Waves,
  Workflow,
  X,
} from "lucide-react";

/* ─────────────── Brand-specific SVG icons ─────────────── */

function makeBrandIcon(path: React.ReactNode) {
  return function SvgIcon({
    size = 20,
    color = "currentColor",
    className,
    style,
  }: {
    size?: number;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
  }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={color}
        stroke="none"
        className={className}
        style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      >
        {path}
      </svg>
    );
  };
}

const GithubSvg = makeBrandIcon(
  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
);
const TelegramSvg = makeBrandIcon(
  <path d="M9.036 15.965l-.375 5.253c.539 0 .772-.232 1.052-.51l2.517-2.402 5.215 3.812c.955.527 1.63.25 1.888-.883l3.421-16.03c.302-1.408-.507-1.955-1.44-1.612L1.66 9.63c-1.36.527-1.343 1.286-.235 1.626l5.017 1.568L18.147 5.53c.55-.363 1.05-.163.639.201" />
);
const InstagramSvg = makeBrandIcon(
  <path d="M12 2.163c3.204 0 3.584.012 4.849.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.849.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
);
const XSvg = makeBrandIcon(
  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
);
const LinkedinSvg = makeBrandIcon(
  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
);

/* ─────────────── Name → component map ─────────────── */

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  // Navigation / structure
  home: Home,
  dashboard: Layers,
  folder: Folder,
  inbox: Inbox,
  settings: Settings,
  settings_input_component: Settings,
  account_circle: Users,
  person: Users,
  extension: Puzzle,
  admin_panel_settings: Shield,
  share: Share2,
  hub: GitBranch,
  language: Languages,
  translate: Languages,
  search: Search,
  close: X,
  more_horiz: MoreHorizontal,
  expand_more: ChevronDown,

  // Actions
  add: Plus,
  edit: Edit3,
  delete: Trash2,
  print: Printer,
  send: Send,
  mail: Mail,
  email: Mail,
  alternate_email: AtSign,
  forum: MessageCircle,
  download: Download,
  upload: Upload,
  file_download: Download,
  restart_alt: RotateCcw,
  sync: RefreshCw,
  rocket_launch: Rocket,
  power_settings_new: Power,
  logout: LogOut,
  lock: Shield,
  lock_open: LogIn,
  open_in_new: ExternalLink,
  arrow_outward: ArrowUpRight,
  arrow_back: ArrowLeft,
  arrow_forward: ArrowRight,
  arrow_upward: ArrowUp,
  arrow_downward: ArrowDown,
  fork_right: GitFork,
  star: Star,
  split_screen: SplitSquareVertical,

  // Terminal / IDE
  terminal: Terminal,
  code: Code,
  file_copy: Files,
  description: FileText,
  bug_report: Bug,
  account_tree: GitBranch,

  // Status / cloud
  check_circle: CheckCircle2,
  check: Check,
  warning: AlertTriangle,
  error: AlertTriangle,
  cloud: Cloud,
  cloud_done: CloudUpload,
  cloud_off: CloudOff,
  cloud_alert: AlertTriangle,
  waving_hand: Waves,
  work_history: Workflow,
  layers: Layers,
  photo_camera: Camera,
  camera_alt: Camera,
  link: LinkIcon,
  image: FileText,
  architecture: Package,
  dataset: Package,

  // Themes
  dark_mode: Moon,
  light_mode: Sun,

  // Social platforms
  github: GithubSvg,
  telegram: TelegramSvg,
  instagram: InstagramSvg,
  x: XSvg,
  linkedin: LinkedinSvg,
};

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  strokeWidth?: number;
}

export default function Icon({
  name,
  size = 20,
  color = "currentColor",
  className,
  style,
  strokeWidth = 1.75,
}: IconProps) {
  const Component = ICON_MAP[name];
  if (!Component) {
    return (
      <Circle
        size={size}
        color={color}
        className={className}
        style={style}
        strokeWidth={strokeWidth}
      />
    );
  }
  // Lucide icons take strokeWidth; brand SVGs ignore it — fine.
  return (
    <Component
      size={size}
      color={color}
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      strokeWidth={strokeWidth}
    />
  );
}
