import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, X, Sparkles, Check, Star, Shield, Zap } from 'lucide-react-native';
import colors, { typography, spacing, borderRadius } from '@/constants/colors';
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
            <View style={styles.logoIcon}>
              <Crown size={48} color="#FFF" />
            </View>
          </View>
          
          <Text style={styles.title}>
            {isPro ? 'FinSage Pro Active' : isTrialActive ? `Trial: ${trialDaysLeft} days left` : 'Unlock Professional Analytics'}
          </Text>
          
          <Text style={styles.subtitle}>
            {isPro 
              ? 'Full access to professional financial tools!' 
              : 'Join thousands who trust FinSage for precision financial analysis.'}
          </Text>
          
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={[styles.content, { backgroundColor: themeColors.background }]} showsVerticalScrollIndicator={false}>
        {/* Professional Value Proposition */}
        <View style={styles.valueSection}>
          <Text style={[styles.valueTitle, { color: themeColors.text.primary }]}>Professional Financial Analysis</Text>
          <Text style={[styles.valueSubtitle, { color: themeColors.text.secondary }]}>
            Bank-grade calculations with advanced analytics for maximum profitability
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

        {/* Social Proof with Emotional Testimonials */}
        <View style={[styles.socialProof, { backgroundColor: themeColors.surface.elevated }]}>
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} color="#F59E0B" fill="#F59E0B" />
              ))}
            </View>
            <Text style={[styles.ratingText, { color: themeColors.text.secondary }]}>4.9 • 2,847 reviews</Text>
          </View>
          <Text style={[styles.testimonial, { color: themeColors.text.primary }]}>
            &ldquo;FinSage Pro&apos;s precision calculations helped me save $47,000 on my mortgage. The professional reports are invaluable for my financial planning.&rdquo;
          </Text>
          <Text style={[styles.testimonialAuthor, { color: themeColors.text.tertiary }]}>— Sarah M., Real Estate Investor</Text>
        </View>

        {/* Pricing with Emotional Appeal */}
        {!isPro && (
          <View style={styles.pricingSection}>
            <View style={styles.pricingCard}>
              <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.pricingGradient}>
                <View style={styles.pricingHeader}>
                  <View style={styles.pricingIconContainer}>
                    <Crown size={32} color="#FFF" />
                  </View>
                  <Text style={[styles.pricingTitle, { color: themeColors.text.inverse }]}>FinSage Pro</Text>
                </View>
                
                <View style={styles.pricingPrice}>
                  <Text style={[styles.priceAmount, { color: themeColors.text.inverse }]}>$4.99</Text>
                  <Text style={[styles.pricePeriod, { color: 'rgba(255,255,255,0.8)' }]}>/month</Text>
                </View>
                
                <Text style={[styles.pricingDescription, { color: 'rgba(255, 255, 255, 0.9)' }]}>
                  {isTrialActive ? 'Continue professional access' : '7-day free trial, then $4.99/month'}
                </Text>
                
                <TouchableOpacity
                  onPress={isTrialActive ? handleUpgrade : handleStartTrial}
                  style={styles.ctaButton}
                  testID={isTrialActive ? "upgrade-to-pro" : "start-trial"}
                >
                  <Text style={[styles.ctaButtonText, { color: themeColors.text.inverse }]}>
                    {isTrialActive ? 'Upgrade to Pro' : 'Start Free Trial'}
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
        marginBottom: spacing[4],
      },
      logoIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(0, 230, 122, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(0, 230, 122, 0.3)',
      },
      title: {
        fontSize: typography.size['4xl'],
        fontWeight: typography.weight.extrabold,
        color: colors.text.inverse,
        textAlign: 'center',
        marginBottom: spacing[3],
        letterSpacing: typography.letterSpacing.tight,
      },
      subtitle: {
        fontSize: typography.size.lg,
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
        lineHeight: typography.lineHeight.relaxed,
        marginBottom: spacing[4],
        fontWeight: typography.weight.medium,
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
        fontSize: typography.size['3xl'],
        fontWeight: typography.weight.bold,
        textAlign: 'center',
        marginBottom: spacing[2],
        letterSpacing: typography.letterSpacing.tight,
      },
      valueSubtitle: {
        fontSize: typography.size.base,
        textAlign: 'center',
        lineHeight: typography.lineHeight.relaxed,
        fontWeight: typography.weight.medium,
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
        ...colors.shadow.sm,
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
        fontSize: typography.size.lg,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
        marginBottom: spacing[1],
        letterSpacing: typography.letterSpacing.tight,
      },
      featureDescription: {
        fontSize: typography.size.sm,
        color: colors.text.secondary,
        lineHeight: typography.lineHeight.snug,
        fontWeight: typography.weight.medium,
      },
      socialProof: {
        padding: spacing[6],
        borderRadius: borderRadius['2xl'],
        alignItems: 'center',
        marginBottom: spacing[8],
        ...colors.shadow.sm,
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
        fontSize: typography.size.base,
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: typography.lineHeight.relaxed,
        marginBottom: spacing[2],
        fontWeight: typography.weight.medium,
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
        ...colors.shadow.lg,
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
        fontSize: typography.size['2xl'],
        fontWeight: typography.weight.bold,
        letterSpacing: typography.letterSpacing.tight,
      },
      pricingPrice: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: spacing[3],
      },
      priceAmount: {
        fontSize: typography.size['5xl'],
        fontWeight: typography.weight.extrabold,
        letterSpacing: typography.letterSpacing.tighter,
      },
      pricePeriod: {
        fontSize: typography.size.xl,
        fontWeight: typography.weight.medium,
        marginLeft: spacing[1],
      },
      pricingDescription: {
        fontSize: typography.size.base,
        textAlign: 'center',
        marginBottom: spacing[6],
        fontWeight: typography.weight.medium,
      },
      ctaButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: spacing[4],
        paddingHorizontal: spacing[8],
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        ...colors.shadow.sm,
      },
      ctaButtonText: {
        fontSize: typography.size.lg,
        fontWeight: typography.weight.bold,
        textAlign: 'center',
        letterSpacing: typography.letterSpacing.wide,
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
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: spacing[4],
        borderRadius: borderRadius.xl,
        marginBottom: spacing[6],
      },
      trustItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
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
    });

export default PaywallScreen;