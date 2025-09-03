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

    interface SubscriptionActions {
      startTrial: () => Promise<void>;
      upgradeToPro: () => Promise<void>;
      restorePurchases: () => Promise<void>;
      checkSubscriptionStatus: () => Promise<void>;
    }

    type SubscriptionContextType = SubscriptionState & SubscriptionActions;

    const TRIAL_DURATION_DAYS = 7;
    const STORAGE_KEYS = {
      TRIAL_START_DATE: '@financewise_trial_start_date',
      IS_PRO: '@financewise_is_pro',
      SUBSCRIPTION_TYPE: '@financewise_subscription_type',
    } as const;

    export const [SubscriptionProvider, useSubscription] = createContextHook<SubscriptionContextType>(() => {
      const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>({
        isPro: false,
        isTrialActive: false,
        trialDaysLeft: 0,
        subscriptionType: 'free',
        trialStartDate: null,
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

      const checkSubscriptionStatus = useCallback(async (): Promise<void> => {
        try {
          console.log('[FinanceWise] Checking subscription status...');
          
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

          console.log('[FinanceWise] Status updated:', { isPro, isTrialActive, trialDaysLeft, subscriptionType });
        } catch (error) {
          console.error('[FinanceWise] Error checking status:', error);
        }
      }, []);

      const upgradeToPro = useCallback(async (): Promise<void> => {
        try {
          console.log('[FinanceWise] Upgrading to Pro...');
          
          if (Platform.OS === 'web') {
            Alert.alert(
              'Upgrade on Mobile',
              'To upgrade to FinSage Pro, please download the app from the App Store or Google Play Store.',
              [{ text: 'OK', style: 'default' }]
            );
            return;
          }

          // In a real app, this would integrate with App Store/Google Play
          // For demo purposes, we'll simulate the upgrade
          Alert.alert(
            'Upgrade to FinSage Pro',
            'This will redirect you to the App Store to complete your purchase of FinSage Pro ($4.99/month or $29.99/year).',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Continue',
                style: 'default',
                onPress: async () => {
                  // Simulate successful purchase for demo
                  await Promise.all([
                    AsyncStorage.setItem(STORAGE_KEYS.IS_PRO, 'true'),
                    AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_TYPE, 'pro'),
                  ]);
                  
                  setSubscriptionState(prev => ({
                    ...prev,
                    isPro: true,
                    subscriptionType: 'pro',
                  }));
                  
                  Alert.alert(
                    'Welcome to FinSage Pro!',
                    'Thank you for upgrading! You now have unlimited access to all premium financial analysis features.',
                    [{ text: 'Awesome!', style: 'default' }]
                  );
                },
              },
            ]
          );
        } catch (error) {
          console.error('[FinanceWise] Error upgrading to Pro:', error);
          Alert.alert('Error', 'Failed to upgrade. Please try again.');
        }
      }, []);

      const startTrial = useCallback(async (): Promise<void> => {
        try {
          console.log('[FinanceWise] Starting trial...');
          
          // Check if trial was already used
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

          Alert.alert(
            'Welcome to FinSage Pro!',
            `Your 7-day free trial has started. Enjoy unlimited access to all premium financial analysis features!`,
            [{ text: 'Get Started', style: 'default' }]
          );

          console.log('[FinanceWise] Trial started successfully');
        } catch (error) {
          console.error('[FinanceWise] Error starting trial:', error);
          Alert.alert('Error', 'Failed to start trial. Please try again.');
        }
      }, [upgradeToPro]);

      const restorePurchases = useCallback(async (): Promise<void> => {
        try {
          console.log('[FinanceWise] Restoring purchases...');
          
          if (Platform.OS === 'web') {
            Alert.alert(
              'Restore on Mobile',
              'Purchase restoration is only available on mobile devices.',
              [{ text: 'OK', style: 'default' }]
            );
            return;
          }

          // In a real app, this would check with App Store/Google Play
          // For demo purposes, we'll check local storage
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
          console.error('[FinanceWise] Error restoring purchases:', error);
          Alert.alert('Error', 'Failed to restore purchases. Please try again.');
        }
      }, [checkSubscriptionStatus]);

      // Check subscription status on mount
      useEffect(() => {
        checkSubscriptionStatus();
      }, [checkSubscriptionStatus]);

      // Check trial expiration daily
      useEffect(() => {
        const interval = setInterval(() => {
          if (subscriptionState.isTrialActive) {
            checkSubscriptionStatus();
          }
        }, 24 * 60 * 60 * 1000); // Check every 24 hours

        return () => clearInterval(interval);
      }, [subscriptionState.isTrialActive, checkSubscriptionStatus]);

      return useMemo(() => ({
        ...subscriptionState,
        startTrial,
        upgradeToPro,
        restorePurchases,
        checkSubscriptionStatus,
      }), [subscriptionState, startTrial, upgradeToPro, restorePurchases, checkSubscriptionStatus]);
    });

    // Helper hook for checking if user has access to premium features
    export const useHasPremiumAccess = (): boolean => {
      const { isPro, isTrialActive } = useSubscription();
      return isPro || isTrialActive;
    };

    // Helper hook for getting subscription status text
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