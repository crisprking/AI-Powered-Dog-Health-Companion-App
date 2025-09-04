import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Sparkles, Check, Star, Shield, Zap } from 'lucide-react-native';
import SageMascot from '@/components/shared/SageMascot';
import FinSageLogo from '@/components/shared/FinSageLogo';
import colors, { typography, spacing, borderRadius } from '@/constants/colors';
import { MASCOT_URL, BRAND_STORY, VIRAL_COPY, BRAND_COLORS } from '@/constants/branding';
import { useSubscription, useSubscriptionStatusText } from '@/contexts/SubscriptionContext';
import { useTheme } from '@/contexts/ThemeContext';

function PaywallScreen() {
  const { colors: themeColors } = useTheme();
  const { upgradeToPro, restorePurchases, isPro, isTrialActive, trialDaysLeft } = useSubscription();
  const statusText = useSubscriptionStatusText();

  const handleStartTrial = async () => {
    router.back();
  };

  const handleUpgrade = async () => {
    await upgradeToPro();
    if (isPro) {
      router.back();
    }
  };

  const handleRestore = async () => {
    await restorePurchases();
  };

  return (
    <View style={styles.root} testID="paywall-screen">
      <Stack.Screen
        options={{
          title: 'FinSage Pro',
          headerTransparent: true,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              accessibilityLabel="Close"
              testID="close-paywall"
            >
              <X color="#fff" size={22} />
            </TouchableOpacity>
          ),
        }}
      />

      <LinearGradient
        colors={['#0F172A', '#1E293B']}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <View style={styles.mascotContainer}>
            <SageMascot 
              size={96} 
              emotion="celebrating" 
              premium={isPro}
              animated={true}
              testID="paywall-mascot"
              imageUrl={MASCOT_URL}
            />
          </View>
          
          <Text style={styles.title}>
            {isPro ? 'FinSage Pro Active' : isTrialActive ? `Trial: ${trialDaysLeft} days left` : 'Unlock FinSage Pro'}
          </Text>
          
          <Text style={styles.subtitle}>
            {isPro 
              ? BRAND_STORY.mission 
              : VIRAL_COPY.onboarding.promise}
          </Text>
          
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={[styles.content, { backgroundColor: themeColors.background }]} showsVerticalScrollIndicator={false}>
        {/* Viral Value Proposition */}
        <View style={styles.valueSection}>
          <Text style={[styles.valueTitle, { color: themeColors.text.primary }]}>{BRAND_STORY.viralHook}</Text>
          <Text style={[styles.valueSubtitle, { color: themeColors.text.secondary }]}>
            {BRAND_STORY.socialProof} • {VIRAL_COPY.appStore.description}
          </Text>
        </View>

        {/* Premium Features with Emotional Appeal */}
        <View style={styles.featuresSection}>
          <View style={[styles.featureCard, { backgroundColor: themeColors.surface.elevated }]}>
            <LinearGradient colors={['#00E67A', '#00D166']} style={styles.featureIcon}>
              <Sparkles size={20} color={themeColors.text.inverse} />
            </LinearGradient>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: themeColors.text.primary }]}>Advanced Analytics Engine</Text>
              <Text style={[styles.featureDescription, { color: themeColors.text.secondary }]}>Professional-grade calculations with precision insights</Text>
            </View>
          </View>
          
          <View style={[styles.featureCard, { backgroundColor: themeColors.surface.elevated }]}>
            <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.featureIcon}>
              <Star size={20} color={themeColors.text.inverse} />
            </LinearGradient>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: themeColors.text.primary }]}>Profit Optimization</Text>
              <Text style={[styles.featureDescription, { color: themeColors.text.secondary }]}>Maximize returns with intelligent scenario analysis</Text>
            </View>
          </View>
          
          <View style={[styles.featureCard, { backgroundColor: themeColors.surface.elevated }]}>
            <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.featureIcon}>
              <Shield size={20} color={themeColors.text.inverse} />
            </LinearGradient>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: themeColors.text.primary }]}>Unlimited Calculations</Text>
              <Text style={[styles.featureDescription, { color: themeColors.text.secondary }]}>Save and compare unlimited scenarios with detailed analysis</Text>
            </View>
          </View>
          
          <View style={[styles.featureCard, { backgroundColor: themeColors.surface.elevated }]}>
            <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.featureIcon}>
              <Zap size={20} color={themeColors.text.inverse} />
            </LinearGradient>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: themeColors.text.primary }]}>Professional Reports</Text>
              <Text style={[styles.featureDescription, { color: themeColors.text.secondary }]}>Export detailed PDF and CSV reports for professional use</Text>
            </View>
          </View>
        </View>

        {/* Viral Social Proof */}
        <View style={[styles.socialProof, { backgroundColor: themeColors.surface.elevated }]}>
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} color="#F59E0B" fill="#F59E0B" />
              ))}
            </View>
            <Text style={[styles.ratingText, { color: themeColors.text.secondary }]}>4.9 • 50,000+ users</Text>
          </View>
          <Text style={[styles.testimonial, { color: themeColors.text.primary }]}>
            &ldquo;FinSage Pro is like having a financial genius in your pocket. Saved me $47K on my mortgage and helped me build a 6-figure investment portfolio. This app literally changed my life! 🚀&rdquo;
          </Text>
          <Text style={[styles.testimonialAuthor, { color: themeColors.text.tertiary }]}>— Sarah M., went from $0 to $100K in 2 years</Text>
          
          <View style={styles.viralStats}>
            <View style={styles.viralStat}>
              <Text style={[styles.viralStatNumber, { color: BRAND_COLORS.success }]}>$2.3M+</Text>
              <Text style={[styles.viralStatLabel, { color: themeColors.text.secondary }]}>Total Saved</Text>
            </View>
            <View style={styles.viralStat}>
              <Text style={[styles.viralStatNumber, { color: BRAND_COLORS.premium }]}>50K+</Text>
              <Text style={[styles.viralStatLabel, { color: themeColors.text.secondary }]}>Success Stories</Text>
            </View>
            <View style={styles.viralStat}>
              <Text style={[styles.viralStatNumber, { color: BRAND_COLORS.trust }]}>4.9★</Text>
              <Text style={[styles.viralStatLabel, { color: themeColors.text.secondary }]}>App Store</Text>
            </View>
          </View>
        </View>

        {/* Pricing with Emotional Appeal */}
        {!isPro && (
          <View style={styles.pricingSection}>
            <View style={styles.pricingCard}>
              <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.pricingGradient}>
                <View style={styles.pricingHeader}>
                  <FinSageLogo 
                    variant="premium" 
                    size="medium" 
                    premium={true} 
                    animated={true}
                    testID="paywall-logo"
                  />
                </View>
                
                <View style={styles.pricingPrice}>
                  <Text style={[styles.priceAmount, { color: themeColors.text.inverse }]}>$4.99</Text>
                  <Text style={[styles.pricePeriod, { color: 'rgba(255,255,255,0.8)' }]}>/month</Text>
                </View>
                
                <Text style={[styles.pricingDescription, { color: 'rgba(255, 255, 255, 0.9)' }]}>
                  {isTrialActive ? 'Continue building wealth with Pro' : 'Start FREE • Then just $4.99/month'}
                </Text>
                
                <View style={styles.valueHighlight}>
                  <Text style={[styles.valueHighlightText, { color: 'rgba(255, 255, 255, 0.95)' }]}>
                    💰 Average user saves $12,000+ in first year
                  </Text>
                </View>
                
                <TouchableOpacity
                  onPress={isTrialActive ? handleUpgrade : handleStartTrial}
                  style={styles.ctaButton}
                  testID={isTrialActive ? "upgrade-to-pro" : "start-trial"}
                >
                  <Text style={[styles.ctaButtonText, { color: themeColors.text.inverse }]}>
                    {isTrialActive ? '🚀 Unlock Full Potential' : '🎯 Start Building Wealth FREE'}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
            
            <TouchableOpacity onPress={handleRestore} style={styles.restoreButton} testID="restore-purchases">
              <Text style={[styles.restoreText, { color: themeColors.text.secondary }]}>Restore Purchases</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Trust Indicators with Emotional Language */}
        <View style={[styles.trustSection, { backgroundColor: themeColors.surface.elevated }]}>
          <View style={styles.trustItem}>
            <Shield size={16} color="#10B981" />
            <Text style={[styles.trustText, { color: themeColors.text.secondary }]}>Bank-grade security</Text>
          </View>
          <View style={styles.trustItem}>
            <Check size={16} color="#10B981" />
            <Text style={[styles.trustText, { color: themeColors.text.secondary }]}>Cancel anytime</Text>
          </View>
          <View style={styles.trustItem}>
            <Star size={16} color="#10B981" />
            <Text style={[styles.trustText, { color: themeColors.text.secondary }]}>30-day money back guarantee</Text>
          </View>
        </View>

        {Platform.OS === 'web' && (
          <View style={[styles.webNote, { 
            backgroundColor: '#34D39920',
            borderColor: '#34D39940'
          }]}>
            <Text style={[styles.webNoteText, { color: themeColors.text.secondary }]}>💡 Free trials available on iOS and Android</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
      root: {
        flex: 1,
        backgroundColor: '#171717',
      },
      hero: {
        paddingTop: 96,
        paddingBottom: spacing[8],
        paddingHorizontal: spacing[6],
      },
      heroContent: {
        alignItems: 'center',
      },
      mascotContainer: {
        marginBottom: spacing[6],
        alignItems: 'center',
      },
      title: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.text.inverse,
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -0.3,
        lineHeight: 32,
      },
      subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 16,
        fontWeight: '500',
      },
      statusBadge: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[2],
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
      },
      statusText: {
        color: colors.text.inverse,
        fontSize: typography.size.sm,
        fontWeight: typography.weight.semibold,
      },
      content: {
        flex: 1,
        borderTopLeftRadius: borderRadius['3xl'],
        borderTopRightRadius: borderRadius['3xl'],
        paddingTop: spacing[8],
        paddingHorizontal: spacing[6],
        paddingBottom: spacing[6],
      },
      valueSection: {
        alignItems: 'center',
        marginBottom: spacing[8],
      },
      valueTitle: {
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: -0.3,
        lineHeight: 26,
      },
      valueSubtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 20,
        fontWeight: '500',
      },
      featuresSection: {
        gap: spacing[4],
        marginBottom: spacing[8],
      },
      featureCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface.elevated,
        padding: spacing[5],
        borderRadius: borderRadius['2xl'],
        shadowColor: colors.shadow.sm.shadowColor,
        shadowOffset: colors.shadow.sm.shadowOffset,
        shadowOpacity: colors.shadow.sm.shadowOpacity,
        shadowRadius: colors.shadow.sm.shadowRadius,
        elevation: colors.shadow.sm.elevation,
      },
      featureIcon: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing[4],
      },
      featureContent: {
        flex: 1,
      },
      featureTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: 4,
        letterSpacing: -0.2,
        lineHeight: 20,
      },
      featureDescription: {
        fontSize: 14,
        color: colors.text.secondary,
        lineHeight: 18,
        fontWeight: '500',
      },
      socialProof: {
        padding: spacing[6],
        borderRadius: borderRadius['2xl'],
        alignItems: 'center',
        marginBottom: spacing[8],
        shadowColor: colors.shadow.sm.shadowColor,
        shadowOffset: colors.shadow.sm.shadowOffset,
        shadowOpacity: colors.shadow.sm.shadowOpacity,
        shadowRadius: colors.shadow.sm.shadowRadius,
        elevation: colors.shadow.sm.elevation,
      },
      ratingContainer: {
        alignItems: 'center',
        marginBottom: spacing[4],
      },
      stars: {
        flexDirection: 'row',
        gap: spacing[1],
        marginBottom: spacing[2],
      },
      ratingText: {
        fontSize: typography.size.sm,
        fontWeight: typography.weight.semibold,
      },
      testimonial: {
        fontSize: 15,
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 20,
        marginBottom: 8,
        fontWeight: '500',
      },
      testimonialAuthor: {
        fontSize: typography.size.sm,
        fontWeight: typography.weight.semibold,
      },
      progressContainer: {
        marginTop: spacing[4],
        alignItems: 'center',
      },
      progressLabel: {
        fontSize: typography.size.sm,
        color: colors.text.secondary,
        marginBottom: spacing[2],
      },
      pricingSection: {
        marginBottom: spacing[8],
      },
      pricingCard: {
        borderRadius: borderRadius['3xl'],
        overflow: 'hidden',
        marginBottom: spacing[4],
        shadowColor: colors.shadow.lg.shadowColor,
        shadowOffset: colors.shadow.lg.shadowOffset,
        shadowOpacity: colors.shadow.lg.shadowOpacity,
        shadowRadius: colors.shadow.lg.shadowRadius,
        elevation: colors.shadow.lg.elevation,
      },
      pricingGradient: {
        padding: spacing[8],
        alignItems: 'center',
      },
      pricingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
        marginBottom: spacing[4],
      },
      pricingIconContainer: {
        width: 60,
        height: 60,
        borderRadius: borderRadius.xl,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
      },
      pricingTitle: {
        fontSize: 24,
        fontWeight: '700',
        letterSpacing: -0.3,
        lineHeight: 28,
      },
      pricingPrice: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: spacing[3],
      },
      priceAmount: {
        fontSize: 36,
        fontWeight: '800',
        letterSpacing: -0.5,
      },
      pricePeriod: {
        fontSize: 18,
        fontWeight: '500',
        marginLeft: 4,
      },
      pricingDescription: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '500',
        lineHeight: 20,
      },
      ctaButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: spacing[4],
        paddingHorizontal: spacing[8],
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        shadowColor: colors.shadow.sm.shadowColor,
        shadowOffset: colors.shadow.sm.shadowOffset,
        shadowOpacity: colors.shadow.sm.shadowOpacity,
        shadowRadius: colors.shadow.sm.shadowRadius,
        elevation: colors.shadow.sm.elevation,
      },
      ctaButtonText: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        letterSpacing: 0.3,
        lineHeight: 20,
      },
      restoreButton: {
        alignItems: 'center',
        paddingVertical: spacing[3],
      },
      restoreText: {
        fontSize: typography.size.base,
        fontWeight: typography.weight.semibold,
      },
      trustSection: {
        padding: spacing[4],
        borderRadius: borderRadius.xl,
        marginBottom: spacing[6],
        gap: spacing[3],
      },
      trustItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
        justifyContent: 'center',
      },
      trustText: {
        fontSize: typography.size.sm,
        fontWeight: typography.weight.medium,
      },
      webNote: {
        padding: spacing[4],
        borderRadius: borderRadius.xl,
        borderWidth: 1,
      },
      webNoteText: {
        fontSize: typography.size.sm,
        textAlign: 'center',
        fontWeight: typography.weight.medium,
      },
      viralStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: spacing[6],
        paddingTop: spacing[4],
        borderTopWidth: 1,
        borderTopColor: 'rgba(156, 163, 175, 0.2)',
      },
      viralStat: {
        alignItems: 'center',
        flex: 1,
      },
      viralStatNumber: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 4,
      },
      viralStatLabel: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
      },
      valueHighlight: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[2],
        borderRadius: borderRadius.lg,
        marginBottom: spacing[4],
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
      },
      valueHighlightText: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
      },
    });

export default PaywallScreen;