'use client';
import {
  Brain, ShoppingBag, Briefcase, Wrench, FileCode2, MessageSquare,
  Calendar, Clock, Gift, Megaphone, User, FileText, Mail, Home,
  Github, Star, GitFork, Eye, ExternalLink, Download, Search,
  Sun, Moon, Globe, Menu, X, ChevronRight, ChevronLeft,
  Code2, Layers, Zap, Target, TrendingUp, Users, CheckCircle2,
  Sparkles, Cpu, Database, Cloud, Terminal, BookOpen,
  Settings, BarChart3, Heart, Share2, ArrowUpRight
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const Icons = {
  brain: Brain,
  shop: ShoppingBag,
  services: Briefcase,
  tools: Wrench,
  projects: FileCode2,
  comments: MessageSquare,
  calendar: Calendar,
  clock: Clock,
  gift: Gift,
  announce: Megaphone,
  about: User,
  resume: FileText,
  contact: Mail,
  home: Home,
  github: Github,
  star: Star,
  fork: GitFork,
  eye: Eye,
  external: ExternalLink,
  download: Download,
  search: Search,
  code: Code2,
  layers: Layers,
  zap: Zap,
  target: Target,
  trending: TrendingUp,
  users: Users,
  check: CheckCircle2,
  sparkles: Sparkles,
  cpu: Cpu,
  database: Database,
  cloud: Cloud,
  terminal: Terminal,
  book: BookOpen,
  settings: Settings,
  chart: BarChart3,
  heart: Heart,
  share: Share2,
  arrow: ArrowUpRight,
};

export type IconName = keyof typeof Icons;

export function AppIcon({ name, size = 24, className, strokeWidth = 1.8 }: { 
  name: IconName; 
  size?: number; 
  className?: string;
  strokeWidth?: number;
}) {
  const IconComp = Icons[name] as LucideIcon;
  return <IconComp size={size} className={className} strokeWidth={strokeWidth} />;
}
