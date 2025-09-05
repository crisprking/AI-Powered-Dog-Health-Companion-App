import React, { useState } from 'react';
import { router, Stack } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, Check, Star, Shield, Zap, TrendingUp } from 'lucide-react-native';
import { useSoluna } from '@/hooks/useSolunaStore';
import { colors } from '@/constants/colors';
import { paymentService } from '@/services/iap';

// Premium subscription plans
const SUBSCRIPTION_PLANS = [
  {
    id: 'monthly',
    name: 'Monthly Premium',
    price: 9.99,
    interval: 'month',
    productId: 'com.rork.soluna.monthly.premium',
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
    productId: 'com.rork.soluna.yearly.premium',
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

export default function PremiumScreen() {
  const { user, upgradeToPremium, isLoading, error, clearError } = useSoluna();
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    clearError();

    try {
      const result = await paymentService.createSubscription(selectedPlan, user.email || 'user@example.com', user.id);
      
      if (result.success && result.subscriptionId && result.customerId) {
        await upgradeToPremium(result.subscriptionId, result.customerId);
        
        Alert.alert(
          '🎉 Welcome to Premium!',
          'Your subscription is now active. Enjoy unlimited habits and AI insights!',
          [
            {
              text: 'Start Transforming',
              onPress: () => router.back()
            }
          ]
        );
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (error) {
      Alert.alert(
        'Payment Failed',
        error?.message || 'Unable to process payment. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestorePurchases = async () => {
    setIsProcessing(true);
    clearError();

    try {
      const result = await paymentService.restorePurchases(user.email || 'user@example.com');
      
      if (result.success && result.subscriptionId && result.customerId) {
        await upgradeToPremium(result.subscriptionId, result.customerId);
        
        Alert.alert(
          '✅ Purchases Restored',
          'Your premium subscription has been restored!',
          [
            {
              text: 'Continue',
              onPress: () => router.back()
            }
          ]
        );
      } else {
        throw new Error(result.error || 'No purchases found');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error?.message || 'Unable to restore purchases. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (user.isPremium) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ 
          title: 'Premium Status',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.accent
        }} />
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <LinearGradient
            colors={[colors.accent, colors.primary]}
            style={styles.premiumBadge}
          >
            <Crown size={32} color={colors.background} />
            <Text style={styles.premiumTitle}>Premium Active</Text>
            <Text style={styles.premiumSubtitle}>
              You&apos;re part of the elite 1% of habit transformers
            </Text>
          </LinearGradient>

          <View style={styles.benefitsContainer}>
            <Text style={styles.sectionTitle}>Your Premium Benefits</Text>
            
            {SUBSCRIPTION_PLANS.find(p => p.id === 'yearly')?.features.map((feature, index) => (
              <View key={index} style={styles.benefitItem}>
                <Check size={20} color={colors.success} />
                <Text style={styles.benefitText}>{feature}</Text>
              </View>
            ))}
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Premium Stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Zap size={24} color={colors.accent} />
                <Text style={styles.statValue}>Unlimited</Text>
                <Text style={styles.statLabel}>AI Insights</Text>
              </View>
              <View style={styles.statItem}>
                <TrendingUp size={24} color={colors.accent} />
                <Text style={styles.statValue}>∞</Text>
                <Text style={styles.statLabel}>Habits</Text>
              </View>
              <View style={styles.statItem}>
                <Star size={24} color={colors.accent} />
                <Text style={styles.statValue}>Elite</Text>
                <Text style={styles.statLabel}>Status</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.manageButton}
            onPress={() => {
              Alert.alert(
                'Manage Subscription',
                'To manage your subscription, please visit your account settings in the App Store or Google Play Store.',
                [{ text: 'OK' }]
              );
            }}
          >
            <Text style={styles.manageButtonText}>Manage Subscription</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Upgrade to Premium',
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.accent
      }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={[colors.accent, colors.primary]}
          style={styles.heroSection}
        >
          <Crown size={48} color={colors.background} />
          <Text style={styles.heroTitle}>Join the Elite 1%</Text>
          <Text style={styles.heroSubtitle}>
            Transform your life with unlimited habits and AI-powered insights
          </Text>
          <View style={styles.socialProof}>
            <Shield size={16} color={colors.background} />
            <Text style={styles.socialProofText}>50,000+ high achievers trust SOLUNA</Text>
          </View>
        </LinearGradient>

        <View style={styles.plansContainer}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          
          {SUBSCRIPTION_PLANS.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.selectedPlan,
                plan.popular && styles.popularPlan
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>MOST POPULAR</Text>
                </View>
              )}
              
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.planPrice}>${plan.price}</Text>
                  <Text style={styles.planInterval}>/{plan.interval}</Text>
                </View>
                {plan.id === 'yearly' && (
                  <Text style={styles.savings}>Save 50% vs Monthly</Text>
                )}
              </View>

              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Check size={16} color={colors.success} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.guaranteeContainer}>
          <Shield size={24} color={colors.accent} />
          <Text style={styles.guaranteeText}>
            7-day money-back guarantee • Cancel anytime
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.upgradeButton, isProcessing && styles.disabledButton]}
          onPress={handleUpgrade}
          disabled={isProcessing || isLoading}
        >
          <LinearGradient
            colors={[colors.accent, colors.primary]}
            style={styles.upgradeGradient}
          >
            {isProcessing ? (
              <ActivityIndicator color={colors.background} size="small" />
            ) : (
              <>
                <Crown size={20} color={colors.background} />
                <Text style={styles.upgradeButtonText}>
                  Start Premium Journey
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {Platform.OS !== 'web' && (
          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestorePurchases}
            disabled={isProcessing}
          >
            <Text style={styles.restoreButtonText}>Restore Purchases</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.disclaimer}>
          Subscription automatically renews unless cancelled at least 24 hours before the end of the current period.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    padding: 32,
    alignItems: 'center',
    margin: 20,
    borderRadius: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.background,
    marginTop: 16,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.background,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
  },
  socialProof: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
  },
  socialProofText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  premiumBadge: {
    padding: 32,
    alignItems: 'center',
    margin: 20,
    borderRadius: 24,
  },
  premiumTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.background,
    marginTop: 16,
  },
  premiumSubtitle: {
    fontSize: 16,
    color: colors.background,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
  },
  plansContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedPlan: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '10',
  },
  popularPlan: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '05',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 20,
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: colors.background,
    fontSize: 10,
    fontWeight: '800',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.accent,
  },
  planInterval: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  savings: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '600',
    marginTop: 4,
  },
  featuresContainer: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  benefitsContainer: {
    padding: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  statsContainer: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.accent,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  guaranteeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  guaranteeText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    textAlign: 'center',
  },
  upgradeButton: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  upgradeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  upgradeButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 20,
  },
  restoreButtonText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  manageButton: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  manageButtonText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    lineHeight: 16,
  },
});