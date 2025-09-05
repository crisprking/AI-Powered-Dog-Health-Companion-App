export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isPremium: boolean;
  premiumExpiresAt?: Date;
  subscriptionId?: string;
  customerId?: string;
  createdAt: Date;
  joinedAt: string;
  dailyAiBoosts: number;
  lastAiBoostReset: string;
  // Enhanced user profiling for better conversion
  age?: number;
  goals?: string[];
  motivations?: string[];
  lifestyle?: 'student' | 'professional' | 'entrepreneur' | 'parent' | 'retiree';
  income?: 'under50k' | '50k-100k' | '100k-200k' | 'over200k';
  hasCompletedOnboarding: boolean;
  referralCode?: string;
  referredBy?: string;
  totalSpent: number;
  lifetimeValue: number;
  churnRisk: 'low' | 'medium' | 'high';
  lastActiveAt: Date;
  streakRecord: number;
  achievementCount: number;
}

export interface Habit {
  id: string;
  title: string;
  emoji: string;
  category: string;
  streak: number;
  completedDates: string[];
  createdAt: Date;
  lastCompletedAt?: Date;
  isCompleted: boolean;
  bestStreak: number;
  totalCompletions: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface AIInsight {
  id: string;
  type: 'forecast' | 'recommendation' | 'analysis';
  title: string;
  content: string;
  confidence?: number;
  impact?: number;
  createdAt: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  productId?: string; // Apple IAP Product ID
  stripePriceId?: string; // Legacy Stripe ID for web
  popular?: boolean;
}

export interface PaymentResult {
  success: boolean;
  subscriptionId?: string;
  customerId?: string;
  error?: string;
  receipt?: string;
}

export interface AppState {
  user: User;
  habits: Habit[];
  achievements: Achievement[];
  aiInsights: AIInsight[];
  dailyAIBoosts: number;
  lastAIBoostReset: string;
  isLoading: boolean;
  error: string | null;
}