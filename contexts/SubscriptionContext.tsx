import { useEffect, useState, useCallback, useMemo } from 'react';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

interface SubscriptionState {
  isPro: boolean;
  isTrialActive: boolean;
  trialDaysLeft: number;
  subscriptionType: 'free' | 'trial' | 'pro';
  trialStartDate: string | null;
}

interface UsageState {
  aiDailyCount: number;
  aiDailyLimit: number;
  aiLastDate: string | null;
}

interface SubscriptionActions {
  startTrial: () => Promise<void>;
  upgradeToPro: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  checkSubscriptionStatus: () => Promise<void>;
  canUseAI: (required?: number) => Promise<{ allowed: boolean; remaining: number; reason?: string }>;
  recordAIUse: (used?: number) => Promise<void>;
  getAIRemaining: () => number;
}

type SubscriptionContextType = SubscriptionState & UsageState & SubscriptionActions;

const TRIAL_DURATION_DAYS = 7;
const STORAGE_KEYS = {
  TRIAL_START_DATE: '@finsage_trial_start_date',
  IS_PRO: '@finsage_is_pro',
  SUBSCRIPTION_TYPE: '@finsage_subscription_type',
  AI_DAILY_COUNT: '@finsage_ai_daily_count',
  AI_LAST_DATE: '@finsage_ai_last_date',
} as const;

const FREE_AI_LIMIT = 3;
const TRIAL_AI_LIMIT = 10;

function todayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const [SubscriptionProvider, useSubscription] = createContextHook<SubscriptionContextType>(() => {
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>({
    isPro: false,
    isTrialActive: false,
    trialDaysLeft: 0,
    subscriptionType: 'free',
    trialStartDate: null,
  });

  const [usageState, setUsageState] = useState<UsageState>({
    aiDailyCount: 0,
    aiDailyLimit: FREE_AI_LIMIT,
    aiLastDate: null,
  });

  const calculateTrialStatus = (trialStartDate: string | null): { isTrialActive: boolean; trialDaysLeft: number } => {
    if (!trialStartDate) {
      return { isTrialActive: false, trialDaysLeft: 0 };
    }

    const startDate = new Date(trialStartDate);
    const currentDate = new Date();
    const daysDiff = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysLeft = Math.max(0, TRIAL_DURATION_DAYS - daysDiff);

    return {
      isTrialActive: daysLeft > 0,
      trialDaysLeft: daysLeft,
    };
  };

  const resolveAiLimit = (subType: 'free' | 'trial' | 'pro'): number => {
    if (subType === 'pro') return Number.MAX_SAFE_INTEGER;
    if (subType === 'trial') return TRIAL_AI_LIMIT;
    return FREE_AI_LIMIT;
  };

  const ensureDailyCounters = useCallback(async (subTypeOverride?: 'free' | 'trial' | 'pro'): Promise<void> => {
    const today = todayString();
    try {
      const [storedCount, storedDate] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.AI_DAILY_COUNT),
        AsyncStorage.getItem(STORAGE_KEYS.AI_LAST_DATE),
      ]);

      const subType = subTypeOverride ?? subscriptionState.subscriptionType;
      const limit = resolveAiLimit(subType);

      if (storedDate !== today) {
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.AI_DAILY_COUNT, '0'),
          AsyncStorage.setItem(STORAGE_KEYS.AI_LAST_DATE, today),
        ]);
        setUsageState({ aiDailyCount: 0, aiDailyLimit: limit, aiLastDate: today });
      } else {
        const count = Number(storedCount ?? '0');
        setUsageState({ aiDailyCount: Number.isFinite(count) ? count : 0, aiDailyLimit: limit, aiLastDate: today });
      }
    } catch (e) {
      console.warn('[FinSage] Failed to sync AI counters', e);
      setUsageState(prev => ({ ...prev, aiDailyLimit: resolveAiLimit(subscriptionState.subscriptionType) }));
    }
  }, [subscriptionState.subscriptionType]);

  const checkSubscriptionStatus = useCallback(async (): Promise<void> => {
    try {
      console.log('[FinSage] Checking subscription status...');

      const [trialStartDate, isProStored] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TRIAL_START_DATE),
        AsyncStorage.getItem(STORAGE_KEYS.IS_PRO),
      ]);

      const isPro = isProStored === 'true';
      const { isTrialActive, trialDaysLeft } = calculateTrialStatus(trialStartDate);

      let subscriptionType: 'free' | 'trial' | 'pro' = 'free';
      if (isPro) {
        subscriptionType = 'pro';
      } else if (isTrialActive) {
        subscriptionType = 'trial';
      }

      setSubscriptionState({
        isPro,
        isTrialActive,
        trialDaysLeft,
        subscriptionType,
        trialStartDate,
      });

      await ensureDailyCounters(subscriptionType);

      console.log('[FinSage] Status updated:', { isPro, isTrialActive, trialDaysLeft, subscriptionType });
    } catch (error) {
      console.error('[FinSage] Error checking status:', error);
    }
  }, [ensureDailyCounters]);

  const upgradeToPro = useCallback(async (): Promise<void> => {
    try {
      console.log('[FinSage] Upgrading to Pro...');

      if (Platform.OS === 'web') {
        Alert.alert(
          'Upgrade on Mobile',
          'To upgrade to FinSage Pro, please download the app from the App Store or Google Play Store.',
          [{ text: 'OK', style: 'default' }]
        );
        return;
      }

      Alert.alert(
        'Upgrade to FinSage Pro',
        'This will redirect you to the App Store to complete your purchase of FinSage Pro ($4.99/month or $29.99/year).',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Continue',
            style: 'default',
            onPress: async () => {
              await Promise.all([
                AsyncStorage.setItem(STORAGE_KEYS.IS_PRO, 'true'),
                AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_TYPE, 'pro'),
              ]);

              setSubscriptionState(prev => ({
                ...prev,
                isPro: true,
                subscriptionType: 'pro',
              }));

              await ensureDailyCounters('pro');

              Alert.alert(
                'Welcome to FinSage Pro!',
                'Thank you for upgrading! Unlimited AI access and premium features are now unlocked.',
                [{ text: 'Awesome!', style: 'default' }]
              );
            },
          },
        ]
      );
    } catch (error) {
      console.error('[FinSage] Error upgrading to Pro:', error);
      Alert.alert('Error', 'Failed to upgrade. Please try again.');
    }
  }, [ensureDailyCounters]);

  const startTrial = useCallback(async (): Promise<void> => {
    try {
      console.log('[FinSage] Starting trial...');

      const existingTrialDate = await AsyncStorage.getItem(STORAGE_KEYS.TRIAL_START_DATE);
      if (existingTrialDate) {
        Alert.alert(
          'Trial Already Used',
          'You have already used your free trial. Upgrade to FinSage Pro to continue enjoying premium features.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Upgrade Now', onPress: upgradeToPro },
          ]
        );
        return;
      }

      const trialStartDate = new Date().toISOString();

      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TRIAL_START_DATE, trialStartDate),
        AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_TYPE, 'trial'),
      ]);

      const { isTrialActive, trialDaysLeft } = calculateTrialStatus(trialStartDate);

      setSubscriptionState(prev => ({
        ...prev,
        isTrialActive,
        trialDaysLeft,
        subscriptionType: 'trial',
        trialStartDate,
      }));

      await ensureDailyCounters('trial');

      Alert.alert(
        'Welcome to FinSage Pro!',
        `Your 7-day free trial has started. Enjoy premium features and a higher AI limit (${TRIAL_AI_LIMIT}/day).`,
        [{ text: 'Get Started', style: 'default' }]
      );

      console.log('[FinSage] Trial started successfully');
    } catch (error) {
      console.error('[FinSage] Error starting trial:', error);
      Alert.alert('Error', 'Failed to start trial. Please try again.');
    }
  }, [upgradeToPro, ensureDailyCounters]);

  const restorePurchases = useCallback(async (): Promise<void> => {
    try {
      console.log('[FinSage] Restoring purchases...');

      if (Platform.OS === 'web') {
        Alert.alert(
          'Restore on Mobile',
          'Purchase restoration is only available on mobile devices.',
          [{ text: 'OK', style: 'default' }]
        );
        return;
      }

      const isProStored = await AsyncStorage.getItem(STORAGE_KEYS.IS_PRO);

      if (isProStored === 'true') {
        Alert.alert(
          'Purchases Restored',
          'Your FinSage Pro subscription has been restored successfully!',
          [{ text: 'Great!', style: 'default' }]
        );
        await checkSubscriptionStatus();
      } else {
        Alert.alert(
          'No Purchases Found',
          'No previous purchases were found for this account.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error) {
      console.error('[FinSage] Error restoring purchases:', error);
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    }
  }, [checkSubscriptionStatus]);

  const canUseAI = useCallback(async (required: number = 1): Promise<{ allowed: boolean; remaining: number; reason?: string }> => {
    await ensureDailyCounters();
    const limit = usageState.aiDailyLimit;
    if (!Number.isFinite(limit)) {
      return { allowed: true, remaining: Number.MAX_SAFE_INTEGER };
    }
    const remaining = Math.max(0, limit - usageState.aiDailyCount);
    if (remaining >= required) return { allowed: true, remaining };
    const reason = subscriptionState.subscriptionType === 'free'
      ? 'Daily free AI limit reached. Upgrade to Pro for unlimited access.'
      : 'Daily trial AI limit reached. Upgrade to Pro for unlimited access.';
    return { allowed: false, remaining, reason };
  }, [ensureDailyCounters, usageState.aiDailyLimit, usageState.aiDailyCount, subscriptionState.subscriptionType]);

  const recordAIUse = useCallback(async (used: number = 1): Promise<void> => {
    try {
      await ensureDailyCounters();
      const next = usageState.aiDailyCount + used;
      setUsageState(prev => ({ ...prev, aiDailyCount: next }));
      await AsyncStorage.setItem(STORAGE_KEYS.AI_DAILY_COUNT, String(next));
    } catch (e) {
      console.warn('[FinSage] Failed to record AI use', e);
    }
  }, [ensureDailyCounters, usageState.aiDailyCount]);

  const getAIRemaining = useCallback((): number => {
    const limit = usageState.aiDailyLimit;
    if (!Number.isFinite(limit)) return Number.MAX_SAFE_INTEGER;
    return Math.max(0, limit - usageState.aiDailyCount);
  }, [usageState.aiDailyLimit, usageState.aiDailyCount]);

  useEffect(() => {
    checkSubscriptionStatus();
  }, [checkSubscriptionStatus]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (subscriptionState.isTrialActive) {
        checkSubscriptionStatus();
      }
      ensureDailyCounters();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [subscriptionState.isTrialActive, checkSubscriptionStatus, ensureDailyCounters]);

  return useMemo(() => ({
    ...subscriptionState,
    ...usageState,
    startTrial,
    upgradeToPro,
    restorePurchases,
    checkSubscriptionStatus,
    canUseAI,
    recordAIUse,
    getAIRemaining,
  }), [subscriptionState, usageState, startTrial, upgradeToPro, restorePurchases, checkSubscriptionStatus, canUseAI, recordAIUse, getAIRemaining]);
});

export const useHasPremiumAccess = (): boolean => {
  const { isPro, isTrialActive } = useSubscription();
  return isPro || isTrialActive;
};

export const useSubscriptionStatusText = (): string => {
  const { subscriptionType, trialDaysLeft } = useSubscription();

  switch (subscriptionType) {
    case 'pro':
      return 'FinSage Pro Active';
    case 'trial':
      return `Trial: ${trialDaysLeft} days left`;
    case 'free':
    default:
      return 'Free Version';
  }
};