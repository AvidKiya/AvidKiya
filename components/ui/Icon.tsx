"use client";
import * as L from "lucide-react";
import React from "react";

const map: Record<string, any> = {
  folder: L.Folder,
  expand_more: L.ChevronDown,
  chevron_right: L.ChevronRight,
  chevron_left: L.ChevronLeft,
  menu: L.Menu,
  x: L.X,
  home: L.Home,
  code: L.Code,
  user: L.User,
  file_text: L.FileText,
  gift: L.Gift,
  bell: L.Bell,
  message_square: L.MessageSquare,
  shopping_bag: L.ShoppingBag,
  settings: L.Settings,
  search: L.Search,
  git_branch: L.GitBranch,
  bug: L.Bug,
  puzzle: L.Puzzle,
  terminal: L.Terminal,
  star: L.Star,
  heart: L.Heart,
  download: L.Download,
  external_link: L.ExternalLink,
  mail: L.Mail,
  phone: L.Phone,
  map_pin: L.MapPin,
  edit: L.Pencil,
  trash: L.Trash2,
  plus: L.Plus,
  arrow_up: L.ArrowUp,
  arrow_down: L.ArrowDown,
  check: L.Check,
  sun: L.Sun,
  moon: L.Moon,
  globe: L.Globe,
  eye: L.Eye,
  eye_off: L.EyeOff,
  copy: L.Copy,
  log_out: L.LogOut,
  save: L.Save,
  book: L.BookOpen,
};

export function Icon({ name, size=18, className="", ...rest }:{ name: string; size?: number; className?: string; [k:string]:any }){
  const Comp = map[name] || L.Circle;
  return <Comp size={size} className={className} {...rest} />;
}

// Brand SVGs inline
export function BrandIcon({ platform, size=18 }: { platform: string, size?: number }){
  const common = { width: size, height: size, fill: "currentColor" };
  switch(platform){
    case "github":
      return <svg {...common} viewBox="0 0 24 24"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.39 7.86 10.91.57.1.78-.25.78-.56v-2.01c-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.67 1.24 3.32.95.1-.74.4-1.24.73-1.52-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.41.35.77 1.04.77 2.1v3.11c0 .31.2.67.79.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>;
    case "telegram":
      return <svg {...common} viewBox="0 0 24 24"><path d="M22.67 3.3 2.95 10.9c-1.35.52-1.34 1.25-.25 1.57l5.06 1.58 1.17 3.78c.14.45.07.63.48.63.33 0 .47-.15.65-.33l1.57-1.52 3.27 2.41c.6.33 1.03.16 1.18-.56l2.14-10.07c.19-.86-.31-1.19-.86-.98Z"/></svg>;
    case "instagram":
      return <svg {...common} viewBox="0 0 24 24"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm4.5-2a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>;
    case "x":
      return <svg {...common} viewBox="0 0 24 24"><path d="M18.9 2H21.7L14.5 10.2 23 22h-6.3l-4.9-6.4L5.9 22H3.1l7.7-8.8L1 2h6.5l4.4 5.8L18.9 2Zm-2.2 18h1.7L7.0 4H5.2l11.5 16Z"/></svg>;
    case "linkedin":
      return <svg {...common} viewBox="0 0 24 24"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07c.67-1.27 2.3-2.6 4.73-2.6 5.06 0 6 3.33 6 7.66V24h-5v-7.1c0-1.69-.03-3.87-2.36-3.87-2.36 0-2.72 1.84-2.72 3.75V24h-5V8z"/></svg>;
    default:
      return <L.Link size={size} />;
  }
}
