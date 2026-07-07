'use client';
import {
  Brain, ShoppingBag, Briefcase, Wrench, FileCode2, MessageSquare,
  Calendar, Clock, Gift, Megaphone, User, FileText, Mail, Home,
  Github, Star, GitFork, Eye, ExternalLink, Download, Search,
  Sun, Moon, Globe, Menu, X, ChevronRight, ChevronLeft,
  Code2, Layers, Zap, Target, TrendingUp, Users, CheckCircle2,
  Sparkles, Cpu, Database, Cloud, Terminal, BookOpen,
  Settings, BarChart3, Heart, Share2, ArrowUpRight, Inbox,
  CreditCard, Coffee, Bitcoin, Bell, Flame, MessageCircle,
  Package, ShoppingCart, Gamepad2, Utensils, Car, DollarSign,
  Laptop, Moon as MoonSleep, Activity, Droplet, Lightbulb, Trophy,
  StickyNote, Folder, HandHeart, PartyPopper, Wand2, Rocket,
  AlertTriangle, Inbox as EmptyInbox, XCircle, HelpCircle, Check,
  Smile, Meh, Frown, ThumbsUp, ClipboardList, Send, Circle,
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
  inbox: Inbox,
  // پرداخت / حمایت مالی
  creditCard: CreditCard,
  coffee: Coffee,
  bitcoin: Bitcoin,
  // اعلان‌ها
  bell: Bell,
  flame: Flame,
  message: MessageCircle,
  // دسته‌بندی مالی
  package: Package,
  cart: ShoppingCart,
  game: Gamepad2,
  food: Utensils,
  car: Car,
  dollar: DollarSign,
  laptop: Laptop,
  // سلامت
  sleep: MoonSleep,
  activity: Activity,
  droplet: Droplet,
  // بینش‌ها
  idea: Lightbulb,
  trophy: Trophy,
  // یادداشت / پروژه
  note: StickyNote,
  folder: Folder,
  // متفرقه
  supportHeart: HandHeart,
  party: PartyPopper,
  wand: Wand2,
  rocket: Rocket,
  warning: AlertTriangle,
  emptyInbox: EmptyInbox,
  xCircle: XCircle,
  help: HelpCircle,
  checkSimple: Check,
  smile: Smile,
  meh: Meh,
  frown: Frown,
  thumbsUp: ThumbsUp,
  clipboard: ClipboardList,
  send: Send,
  dot: Circle,
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

