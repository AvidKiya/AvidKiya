// KIYA Planner Types

export interface User {
  id: string;
  licenseId: string;
  name: string;
  email?: string;
  createdAt: string;
}

export interface License {
  id: string;
  code: string;
  plan: 'free' | 'pro' | 'pro-ai' | 'team';
  status: 'active' | 'expired' | 'suspended';
  expiresAt?: string;
  isAdmin: boolean;
  device?: string;
  name?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  status: 'todo' | 'inprogress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  level: 'annual' | 'quarterly' | 'weekly';
  progress: number;
  createdAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  createdAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
}

export interface Event {
  id: string;
  userId: string;
  title: string;
  date: string;
  time?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content?: string;
  tags?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category?: string;
  date: string;
  createdAt: string;
}

export interface HealthLog {
  id: string;
  userId: string;
  type: 'sleep' | 'exercise' | 'energy' | 'mood';
  value: number;
  date: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface Capture {
  id: string;
  userId: string;
  text: string;
  category?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'expiry' | 'report' | 'streak' | 'comment' | 'product' | 'system';
  title: string;
  message?: string;
  read: boolean;
  createdAt: string;
}

export interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  highlighted: boolean;
}

export const PLAN_LIMITS = {
  free: {
    captures: 50,
    aiMessages: 10,
    tasks: 50,
    goals: 5,
    habits: 5,
    memoryDays: 30,
  },
  pro: {
    captures: 500,
    aiMessages: 50,
    tasks: Infinity,
    goals: Infinity,
    habits: Infinity,
    memoryDays: 90,
  },
  'pro-ai': {
    captures: Infinity,
    aiMessages: Infinity,
    tasks: Infinity,
    goals: Infinity,
    habits: Infinity,
    memoryDays: 365,
  },
  team: {
    captures: Infinity,
    aiMessages: Infinity,
    tasks: Infinity,
    goals: Infinity,
    habits: Infinity,
    memoryDays: Infinity,
  },
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;