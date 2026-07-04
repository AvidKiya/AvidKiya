'use client';

import {
  Folder,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Search,
  GitBranch,
  Bug,
  Puzzle,
  File,
  FileText,
  FileCode,
  Terminal,
  Settings,
  Mail,
  MapPin,
  Calendar,
  Users,
  Star,
  Clock,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  Printer,
  ExternalLink,
  Download,
  Upload,
  Coffee,
  CreditCard,
  Heart,
  MessageSquare,
  ShoppingBag,
  Bell,
  Home,
  User,
  Briefcase,
  Gift,
  Image,
  Music,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Info,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Save,
  Copy,
  Link,
  Tag,
  GitCommit,
  Zap,
  Award,
  Target,
  Activity,
  BarChart3,
  PieChart,
  Cpu,
  HardDrive,
  Wifi,
  Database,
  Server,
  Code,
  Code2,
  Layers,
  Package,
  Send,
  Lock,
  LayoutDashboard,
  Phone,
  type LucideIcon
} from 'lucide-react';

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  folder: Folder,
  'chevron-down': ChevronDown,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  'expand_more': ChevronDown,
  'expand_less': ChevronUp,
  search: Search,
  git: GitBranch,
  'git-branch': GitBranch,
  'git-commit': GitCommit,
  debug: Bug,
  bug: Bug,
  extension: Puzzle,
  puzzle: Puzzle,
  file: File,
  'file-text': FileText,
  'file-code': FileCode,
  terminal: Terminal,
  settings: Settings,
  mail: Mail,
  email: Mail,
  'map-pin': MapPin,
  location: MapPin,
  calendar: Calendar,
  users: Users,
  star: Star,
  clock: Clock,
  menu: Menu,
  hamburger: Menu,
  close: X,
  x: X,
  sun: Sun,
  moon: Moon,
  globe: Globe,
  language: Globe,
  printer: Printer,
  print: Printer,
  'external-link': ExternalLink,
  download: Download,
  upload: Upload,
  coffee: Coffee,
  'credit-card': CreditCard,
  heart: Heart,
  'message-square': MessageSquare,
  comments: MessageSquare,
  'shopping-bag': ShoppingBag,
  shop: ShoppingBag,
  bell: Bell,
  announcements: Bell,
  home: Home,
  user: User,
  about: User,
  briefcase: Briefcase,
  work: Briefcase,
  projects: Briefcase,
  gift: Gift,
  gifts: Gift,
  image: Image,
  music: Music,
  'volume-2': Volume2,
  'volume-x': VolumeX,
  play: Play,
  pause: Pause,
  eye: Eye,
  'eye-off': EyeOff,
  edit: Edit,
  pencil: Edit,
  trash: Trash2,
  delete: Trash2,
  plus: Plus,
  add: Plus,
  minus: Minus,
  check: Check,
  'alert-circle': AlertCircle,
  alert: AlertCircle,
  info: Info,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  refresh: RefreshCw,
  save: Save,
  copy: Copy,
  link: Link,
  tag: Tag,
  zap: Zap,
  award: Award,
  target: Target,
  activity: Activity,
  'bar-chart': BarChart3,
  'pie-chart': PieChart,
  cpu: Cpu,
  'hard-drive': HardDrive,
  wifi: Wifi,
  bandwidth: Wifi,
  database: Database,
  server: Server,
  code: Code,
  code2: Code2,
  layers: Layers,
  package: Package,
  send: Send,
  lock: Lock,
  'layout-dashboard': LayoutDashboard,
  phone: Phone
};

// Import ChevronUp for expand_less
import { ChevronUp } from 'lucide-react';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  onClick?: () => void;
}

export function Icon({ name, size = 20, className = '', onClick }: IconProps) {
  const IconComponent = iconMap[name.toLowerCase()];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return <span className={className} style={{ width: size, height: size }} />;
  }
  
  return (
    <IconComponent 
      size={size} 
      className={className}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : undefined }}
    />
  );
}

// Brand SVG Icons
export function GitHubIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

export function TelegramIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

export function InstagramIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

export function XIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

export function LinkedInIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

export function getPlatformIcon(platform: string, size = 20, className = '') {
  switch (platform) {
    case 'github':
      return <GitHubIcon size={size} className={className} />;
    case 'telegram':
      return <TelegramIcon size={size} className={className} />;
    case 'instagram':
      return <InstagramIcon size={size} className={className} />;
    case 'twitter':
    case 'x':
      return <XIcon size={size} className={className} />;
    case 'linkedin':
      return <LinkedInIcon size={size} className={className} />;
    default:
      return <Icon name={platform} size={size} className={className} />;
  }
}

export default Icon;
