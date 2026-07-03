'use client';
import { Activity, ArrowUp, BarChart3, BookOpen, Box, Briefcase, Check, ChevronDown, Code2, Cpu, Download, Edit3, ExternalLink, Eye, FileText, Folder, Gift, Github, Globe2, Heart, Home, Image as ImageIcon, Languages, LayoutDashboard, Link as LinkIcon, List, Lock, Mail, MapPin, Megaphone, Menu, MessageCircle, Moon, Music, Package, Printer, Radio, RefreshCw, Save, Search, Send, Settings, Share2, Shield, ShoppingBag, Star, Sun, Terminal, Trash2, Upload, User, X, Zap } from 'lucide-react';
import type { SVGProps } from 'react';
const map: Record<string, any> = { activity:Activity, arrowUp:ArrowUp, barChart:BarChart3, book:BookOpen, box:Box, briefcase:Briefcase, check:Check, chevronDown:ChevronDown, code:Code2, cpu:Cpu, download:Download, edit:Edit3, external:ExternalLink, eye:Eye, fileText:FileText, folder:Folder, gift:Gift, github:Github, globe:Globe2, heart:Heart, home:Home, image:ImageIcon, languages:Languages, dashboard:LayoutDashboard, link:LinkIcon, list:List, lock:Lock, mail:Mail, mapPin:MapPin, megaphone:Megaphone, menu:Menu, moon:Moon, music:Music, package:Package, printer:Printer, radio:Radio, refresh:RefreshCw, save:Save, search:Search, send:Send, settings:Settings, share:Share2, shield:Shield, shop:ShoppingBag, shoppingBag:ShoppingBag, star:Star, sun:Sun, terminal:Terminal, trash:Trash2, upload:Upload, user:User, x:X, zap:Zap };
function Brand({ name, size=18, ...props }: { name:string; size?:number } & SVGProps<SVGSVGElement>) {
  const common = { width:size, height:size, viewBox:'0 0 24 24', fill:'currentColor', 'aria-hidden':true, ...props } as SVGProps<SVGSVGElement>;
  if (name === 'telegram') return <svg {...common}><path d="M9.9 15.6 9.5 20c.6 0 .9-.3 1.2-.6l2.9-2.8 6 4.4c1.1.6 1.9.3 2.2-1l4-18.7c.4-1.5-.5-2.1-1.6-1.7L1 8.6c-1.5.6-1.5 1.5-.3 1.8l5.9 1.8L20.4 3.6c.6-.4 1.2-.2.7.2L9.9 15.6Z" transform="scale(.92) translate(-.5 1)"/></svg>;
  if (name === 'instagram') return <svg {...common}><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 12 16.5 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 12 14.5 2.5 2.5 0 0 0 12 9.5ZM17.7 6.3a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z"/></svg>;
  if (name === 'linkedin') return <svg {...common}><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.4 8h4.2v14H.4V8Zm7.4 0h4v1.9h.1c.6-1.1 2-2.3 4.1-2.3 4.4 0 5.2 2.9 5.2 6.7V22H17v-6.8c0-1.6 0-3.7-2.3-3.7s-2.6 1.8-2.6 3.6V22H7.8V8Z" transform="translate(1 0) scale(.95)"/></svg>;
  if (name === 'x') return <svg {...common}><path d="M18.9 2H22l-6.8 7.8 8 12.2h-6.3l-5-7.2L6 22H2.9l7.3-8.4L2.5 2h6.5l4.5 6.5L18.9 2Zm-1.1 17.9h1.7L8 4H6.2l11.6 15.9Z"/></svg>;
  return <Github size={size} {...props}/>;
}
export function Icon({ name, size=18, className='' }: { name:string; size?:number; className?:string }) {
  if (['github','telegram','instagram','linkedin','x'].includes(name)) return <Brand name={name} size={size} className={className}/>;
  const Cmp = map[name] || Box;
  return <Cmp size={size} className={className} aria-hidden="true" />;
}
