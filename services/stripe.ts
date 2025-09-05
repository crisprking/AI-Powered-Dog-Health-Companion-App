import { Platform } from 'react-native';
import type { PaymentResult, SubscriptionPlan } from '@/types';

// Simple payment service for demo purposes
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly Premium',
    price: 9.99,
    interval: 'month',
    stripePriceId: 'price_monthly_premium',
    features: [
      'Unlimited habits',
      'Unlimited AI insights',
      'Advanced analytics',
      'Custom categories',
      'Cloud sync',
      'Priority support'
    ]
  },
  {
    id: 'yearly',
    name: 'Yearly Premium',
    price: 59.99,
    interval: 'year',
    stripePriceId: 'price_yearly_premium',
    popular: true,
    features: [
      'Everything in Monthly',
      '50% savings ($119.88 → $59.99)',
      'Exclusive yearly insights',
      'Early access to new features',
      'Personal habit coach',
      '1-on-1 success consultation'
    ]
  }
];

// Web-compatible payment interface
interface PaymentInterface {
  createSubscription(planId: string, userEmail: string, userId: string): Promise<PaymentResult>;
  cancelSubscription(subscriptionId: string): Promise<boolean>;
  getSubscriptionStatus(customerId: string): Promise<{ isActive: boolean; expiresAt?: Date; planId?: string; }>;
  restorePurchases(userEmail: string): Promise<PaymentResult>;
}

// Web payment implementation
class WebPaymentService implements PaymentInterface {
  async createSubscription(planId: string, userEmail: string, userId: string): Promise<PaymentResult> {
    try {
      // Simulate web payment flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        success: true,
        subscriptionId: `web_sub_${Date.now()}_${planId}`,
        customerId: `web_cus_${Date.now()}`
      };
    } catch {
      return {
        success: false,
        error: 'Web payment processing failed. Please try again.'
      };
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch {
      return false;
    }
  }

  async getSubscriptionStatus(customerId: string): Promise<{ isActive: boolean; expiresAt?: Date; planId?: string; }> {
    try {
      const isRecentCustomer = Boolean(customerId && customerId.includes('cus_'));
      return {
        isActive: isRecentCustomer,
        expiresAt: isRecentCustomer ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined,
        planId: isRecentCustomer ? 'yearly' : undefined
      };
    } catch {
      return { isActive: false };
    }
  }

  async restorePurchases(userEmail: string): Promise<PaymentResult> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const hasPreviousPurchase = Math.random() > 0.5;
      
      if (hasPreviousPurchase) {
        return {
          success: true,
          subscriptionId: `web_sub_restored_${Date.now()}`,
          customerId: `web_cus_restored_${Date.now()}`
        };
      } else {
        return {
          success: false,
          error: 'No active subscriptions found for this account'
        };
      }
    } catch {
      return {
        success: false,
        error: 'Failed to restore purchases. Please try again.'
      };
    }
  }
}

// Native payment implementation (placeholder)
class NativePaymentService implements PaymentInterface {
  async createSubscription(planId: string, userEmail: string, userId: string): Promise<PaymentResult> {
    try {
      // For native, we'd use actual Stripe SDK here
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        success: true,
        subscriptionId: `native_sub_${Date.now()}_${planId}`,
        customerId: `native_cus_${Date.now()}`
      };
    } catch {
      return {
        success: false,
        error: 'Native payment processing failed. Please try again.'
      };
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch {
      return false;
    }
  }

  async getSubscriptionStatus(customerId: string): Promise<{ isActive: boolean; expiresAt?: Date; planId?: string; }> {
    try {
      const isRecentCustomer = Boolean(customerId && customerId.includes('cus_'));
      return {
        isActive: isRecentCustomer,
        expiresAt: isRecentCustomer ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined,
        planId: isRecentCustomer ? 'yearly' : undefined
      };
    } catch {
      return { isActive: false };
    }
  }

  async restorePurchases(userEmail: string): Promise<PaymentResult> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const hasPreviousPurchase = Math.random() > 0.5;
      
      if (hasPreviousPurchase) {
        return {
          success: true,
          subscriptionId: `native_sub_restored_${Date.now()}`,
          customerId: `native_cus_restored_${Date.now()}`
        };
      } else {
        return {
          success: false,
          error: 'No active subscriptions found for this account'
        };
      }
    } catch {
      return {
        success: false,
        error: 'Failed to restore purchases. Please try again.'
      };
    }
  }
}

// Platform-aware payment service
export class PaymentService {
  private static instance: PaymentService;
  private paymentProvider: PaymentInterface;

  private constructor() {
    // Use platform-specific payment implementation
    this.paymentProvider = Platform.OS === 'web' 
      ? new WebPaymentService() 
      : new NativePaymentService();
  }

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async createSubscription(
    planId: string,
    userEmail: string,
    userId: string
  ): Promise<PaymentResult> {
    try {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
      if (!plan) {
        return {
          success: false,
          error: 'Invalid subscription plan selected'
        };
      }

      return await this.paymentProvider.createSubscription(planId, userEmail, userId);
    } catch {
      return {
        success: false,
        error: 'Payment processing failed. Please try again.'
      };
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    return await this.paymentProvider.cancelSubscription(subscriptionId);
  }

  async getSubscriptionStatus(customerId: string): Promise<{
    isActive: boolean;
    expiresAt?: Date;
    planId?: string;
  }> {
    return await this.paymentProvider.getSubscriptionStatus(customerId);
  }

  async restorePurchases(userEmail: string): Promise<PaymentResult> {
    return await this.paymentProvider.restorePurchases(userEmail);
  }
}

// Export platform-aware service
export const paymentService = PaymentService.getInstance();