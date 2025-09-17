import { supabase } from '../lib/supabase';
import { Profile, SubscriptionPlan, UserSubscription } from '../lib/supabase';

export class PaymentService {
  // Get user profile with subscription info
  static async getUserProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Get available subscription plans
  static async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price_monthly', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  // Update user subscription status
  static async updateSubscriptionStatus(
    userId: string,
    status: string,
    expiresAt?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: status,
        subscription_expires_at: expiresAt,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) throw error;
  }

  // Record payment
  static async recordPayment(
    userId: string,
    subscriptionId: string,
    amount: number,
    status: string,
    paymentMethod: string,
    externalPaymentId: string
  ): Promise<void> {
    const { error } = await supabase
      .from('payment_history')
      .insert({
        user_id: userId,
        subscription_id: subscriptionId,
        amount,
        status,
        payment_method: paymentMethod,
        external_payment_id: externalPaymentId
      });
    
    if (error) throw error;
  }

  // Check if user has active subscription
  static async hasActiveSubscription(userId: string): Promise<boolean> {
    const profile = await this.getUserProfile(userId);
    return profile?.subscription_status === 'active' && 
           (!profile.subscription_expires_at || 
            new Date(profile.subscription_expires_at) > new Date());
  }

  // Get user's current subscription
  static async getCurrentSubscription(userId: string): Promise<UserSubscription | null> {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        subscription_plans (*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();
    
    if (error) return null;
    return data;
  }

  // Create or update user profile
  static async createOrUpdateProfile(userId: string, email: string, fullName?: string): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email,
        full_name: fullName,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

