import { supabase } from '../lib/supabase';
import { Profile, SubscriptionPlan, UserSubscription } from '../lib/supabase';

export class PaymentService {
  static async getUserProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  }

  static async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price', { ascending: true });
      
      if (error) {
        console.error('Error fetching subscription plans:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getSubscriptionPlans:', error);
      return [];
    }
  }

  static async updateSubscriptionStatus(
    userId: string, 
    planId: string, 
    status: 'active' | 'inactive' | 'cancelled'
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          plan_id: planId,
          status,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error updating subscription status:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateSubscriptionStatus:', error);
      return false;
    }
  }

  static async recordPayment(
    userId: string,
    planId: string,
    amount: number,
    paymentMethod: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('payments')
        .insert({
          user_id: userId,
          plan_id: planId,
          amount,
          payment_method: paymentMethod,
          status: 'completed',
          created_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error recording payment:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in recordPayment:', error);
      return false;
    }
  }

  static async hasActiveSubscription(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('status')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();
      
      if (error) {
        console.error('Error checking active subscription:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error in hasActiveSubscription:', error);
      return false;
    }
  }

  static async getCurrentSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (
            name,
            price,
            features
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();
      
      if (error) {
        console.error('Error fetching current subscription:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getCurrentSubscription:', error);
      return null;
    }
  }

  static async createOrUpdateProfile(profile: Partial<Profile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(profile);
      
      if (error) {
        console.error('Error creating/updating profile:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in createOrUpdateProfile:', error);
      return false;
    }
  }
}