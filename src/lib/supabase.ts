import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://hzwdzyecyukgsggoavlc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6d2R6eWVjeXVrZ3NnZ29hdmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyOTM5MTAsImV4cCI6MjA3Mjg2OTkxMH0.IZCwjD4UF4zYAwxh9OW8IcwkLoV1h9-jejCLOMTVKPs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'premium' | 'pro';
  subscription_status: 'active' | 'canceled' | 'expired' | 'past_due';
  subscription_expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  stripe_price_id_monthly: string;
  stripe_price_id_yearly: string;
  apple_product_id_monthly: string;
  apple_product_id_yearly: string;
  is_active: boolean;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'expired' | 'past_due';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  stripe_subscription_id?: string;
  apple_subscription_id?: string;
  created_at: string;
  updated_at: string;
}

