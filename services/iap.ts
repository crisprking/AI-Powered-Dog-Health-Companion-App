import * as InAppPurchases from 'expo-in-app-purchases';
import { Platform } from 'react-native';
import type { PaymentResult, SubscriptionPlan } from '@/types';

// Apple IAP Product IDs - These must match what you configure in App Store Connect
export const IAP_PRODUCT_IDS = {
  MONTHLY_PREMIUM: 'com.rork.soluna.monthly.premium',
  YEARLY_PREMIUM: 'com.rork.soluna.yearly.premium',
} as const;

// Subscription plans for Apple IAP
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly Premium',
    price: 2.99,
    interval: 'month',
    productId: IAP_PRODUCT_IDS.MONTHLY_PREMIUM,
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
    price: 19.99,
    interval: 'year',
    productId: IAP_PRODUCT_IDS.YEARLY_PREMIUM,
    popular: true,
    features: [
      'Everything in Monthly',
      '50% savings ($35.88 → $19.99)',
      'Exclusive yearly insights',
      'Early access to new features',
      'Personal habit coach',
      '1-on-1 success consultation'
    ]
  }
];

class AppleIAPService {
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      return false;
    }

    try {
      if (!this.isInitialized) {
        await InAppPurchases.connectAsync();
        this.isInitialized = true;
      }
      return true;
    } catch (error) {
      console.error('Failed to initialize IAP:', error);
      return false;
    }
  }

  async getProducts(): Promise<any[]> {
    try {
      await this.initialize();
      const products = await InAppPurchases.getProductsAsync([
        IAP_PRODUCT_IDS.MONTHLY_PREMIUM,
        IAP_PRODUCT_IDS.YEARLY_PREMIUM,
      ]);
      return products;
    } catch (error) {
      console.error('Failed to get products:', error);
      return [];
    }
  }

  async purchaseProduct(productId: string): Promise<PaymentResult> {
    try {
      await this.initialize();
      
      const result = await InAppPurchases.purchaseItemAsync(productId);
      
      if (result.responseCode === InAppPurchases.IAPResponseCode.OK) {
        return {
          success: true,
          subscriptionId: result.results?.[0]?.transactionId,
          customerId: result.results?.[0]?.originalTransactionIdentifierIOS,
        };
      } else {
        return {
          success: false,
          error: this.getErrorMessage(result.responseCode),
        };
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      return {
        success: false,
        error: 'Purchase failed. Please try again.',
      };
    }
  }

  async restorePurchases(): Promise<PaymentResult> {
    try {
      await this.initialize();
      
      const result = await InAppPurchases.getPurchaseHistoryAsync();
      
      if (result.responseCode === InAppPurchases.IAPResponseCode.OK) {
        const purchases = result.results || [];
        if (purchases.length > 0) {
          return {
            success: true,
            subscriptionId: purchases[0].transactionId,
            customerId: purchases[0].originalTransactionIdentifierIOS,
          };
        } else {
          return {
            success: false,
            error: 'No previous purchases found.',
          };
        }
      } else {
        return {
          success: false,
          error: this.getErrorMessage(result.responseCode),
        };
      }
    } catch (error) {
      console.error('Restore failed:', error);
      return {
        success: false,
        error: 'Failed to restore purchases. Please try again.',
      };
    }
  }

  async getSubscriptionStatus(): Promise<{ isActive: boolean; expiresAt?: Date; planId?: string; }> {
    try {
      await this.initialize();
      
      const result = await InAppPurchases.getPurchaseHistoryAsync();
      
      if (result.responseCode === InAppPurchases.IAPResponseCode.OK) {
        const purchases = result.results || [];
        const activePurchase = purchases.find(purchase => 
          purchase.productId === IAP_PRODUCT_IDS.MONTHLY_PREMIUM || 
          purchase.productId === IAP_PRODUCT_IDS.YEARLY_PREMIUM
        );
        
        if (activePurchase) {
          return {
            isActive: true,
            expiresAt: new Date(activePurchase.purchaseTime + (365 * 24 * 60 * 60 * 1000)), // 1 year from purchase
            planId: activePurchase.productId === IAP_PRODUCT_IDS.MONTHLY_PREMIUM ? 'monthly' : 'yearly',
          };
        }
      }
      
      return { isActive: false };
    } catch (error) {
      console.error('Failed to get subscription status:', error);
      return { isActive: false };
    }
  }

  private getErrorMessage(responseCode: InAppPurchases.IAPResponseCode): string {
    switch (responseCode) {
      case InAppPurchases.IAPResponseCode.USER_CANCELED:
        return 'Purchase was cancelled.';
      case InAppPurchases.IAPResponseCode.PAYMENT_INVALID:
        return 'Payment is invalid.';
      case InAppPurchases.IAPResponseCode.PAYMENT_NOT_ALLOWED:
        return 'Payment is not allowed.';
      case InAppPurchases.IAPResponseCode.PRODUCT_UNAVAILABLE:
        return 'Product is not available.';
      case InAppPurchases.IAPResponseCode.PURCHASE_PENDING:
        return 'Purchase is pending.';
      case InAppPurchases.IAPResponseCode.UNKNOWN:
      default:
        return 'An unknown error occurred.';
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.isInitialized) {
        await InAppPurchases.disconnectAsync();
        this.isInitialized = false;
      }
    } catch (error) {
      console.error('Failed to disconnect IAP:', error);
    }
  }
}

// Export singleton instance
export const iapService = new AppleIAPService();

// Legacy compatibility - keep the same interface as the old payment service
export class PaymentService {
  private static instance: PaymentService;
  private iapService: AppleIAPService;

  private constructor() {
    this.iapService = new AppleIAPService();
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
      if (!plan || !plan.productId) {
        return {
          success: false,
          error: 'Invalid subscription plan selected'
        };
      }

      return await this.iapService.purchaseProduct(plan.productId);
    } catch {
      return {
        success: false,
        error: 'Payment processing failed. Please try again.'
      };
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    // Note: Apple IAP doesn't allow programmatic cancellation
    // Users must cancel through their Apple ID settings
    return false;
  }

  async getSubscriptionStatus(customerId: string): Promise<{
    isActive: boolean;
    expiresAt?: Date;
    planId?: string;
  }> {
    return await this.iapService.getSubscriptionStatus();
  }

  async restorePurchases(userEmail: string): Promise<PaymentResult> {
    return await this.iapService.restorePurchases();
  }
}

// Export platform-aware service
export const paymentService = PaymentService.getInstance();
