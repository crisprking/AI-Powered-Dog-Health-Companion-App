import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Car, Crown, Shield, Star, ArrowRight, Calculator, DollarSign, Target, BarChart3, Settings } from 'lucide-react-native';
import SageMascot from '@/components/shared/SageMascot';
import { StatusBar } from 'expo-status-bar';
import colors, { typography, spacing, borderRadius } from '@/constants/colors';
import { useSubscription, useSubscriptionStatusText, useHasPremiumAccess } from '@/contexts/SubscriptionContext';
import { useTheme } from '@/contexts/ThemeContext';
import { SimpleThemeToggle } from '@/components/shared/ThemeToggle';

export default function WelcomeScreen() {
  const { isPro, isTrialActive } = useSubscription();
  const statusText = useSubscriptionStatusText();
  const hasPremiumAccess = useHasPremiumAccess();
  const { colors: themeColors, isDark } = useTheme();

  const handleStartTrial = () => {
    router.push('/paywall');
  };

  const handleCalculatorPress = (type: 'mortgage' | 'car-loan') => {
    router.push(`/(tabs)/${type}` as const);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      
      {/* Header with Theme Toggle */}
      <View style={[styles.header, { 
        backgroundColor: themeColors.surface.primary,
        borderBottomColor: themeColors.border.light 
      }]}>
        <TouchableOpacity
          onPress={() => router.push('/settings')}
          style={[styles.settingsButton, { backgroundColor: themeColors.surface.secondary }]}
          activeOpacity={0.7}
          testID="settings-button"
        >
          <Settings size={20} color={themeColors.text.secondary} strokeWidth={2} />
        </TouchableOpacity>
        
        <SimpleThemeToggle style={styles.themeToggle} />
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        testID="home-scroll"
      >
        {/* Professional Header */}
        <View style={styles.heroSection}>
          <View style={[styles.statusBadge, {
            backgroundColor: hasPremiumAccess 
              ? 'rgba(245, 158, 11, 0.1)' 
              : isDark 
                ? 'rgba(0, 230, 122, 0.1)' 
                : 'rgba(0, 230, 122, 0.08)',
            borderColor: hasPremiumAccess 
              ? 'rgba(245, 158, 11, 0.3)' 
              : isDark 
                ? 'rgba(0, 230, 122, 0.3)' 
                : 'rgba(0, 230, 122, 0.2)'
          }]}>
            {hasPremiumAccess ? (
              <Crown size={16} color="#F59E0B" />
            ) : (
              <Calculator size={16} color="#00E67A" />
            )}
            <Text style={[styles.statusText, {
              color: hasPremiumAccess ? '#F59E0B' : themeColors.text.primary
            }]}>
              {statusText}
            </Text>
          </View>
          
          <View style={styles.brandContainer}>
            <SageMascot 
              size={96} 
              emotion={hasPremiumAccess ? 'celebrating' : 'confident'} 
              premium={hasPremiumAccess}
              animated={true}
              testID="sage-mascot"
            />
            <Text style={[styles.brandTitle, { color: themeColors.text.primary }]}>FinSage Pro</Text>
            <Text style={[styles.brandSubtitle, { color: themeColors.text.secondary }]}>Your AI Financial Advisor</Text>
          </View>
        </View>

        {/* Trust Banner */}
        <View style={styles.profitBanner}>
          <LinearGradient
            colors={hasPremiumAccess ? ['#F59E0B', '#D97706'] : ['#00E67A', '#00D166']}
            style={styles.profitBannerGradient}
          >
            <Shield size={24} color="#FFF" />
            <View style={styles.profitBannerContent}>
              <Text style={styles.profitBannerTitle}>Professional Grade</Text>
              <Text style={styles.profitBannerSubtitle}>Trusted by financial experts</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Calculator Cards - iOS Optimized */}
        <View style={styles.calculatorSection}>
          <TouchableOpacity
            style={[styles.calculatorCard, { backgroundColor: themeColors.surface.secondary }]}
            onPress={() => handleCalculatorPress('mortgage')}
            testID="open-mortgage"
            activeOpacity={0.8}
          >
            <View style={styles.calculatorCardContent}>
              <View style={[styles.calculatorIconContainer, { backgroundColor: 'rgba(0, 230, 122, 0.15)' }]}>
                <Home size={28} color="#00E67A" strokeWidth={2.5} />
              </View>
              <View style={styles.calculatorTextContainer}>
                <Text style={[styles.calculatorTitle, { color: themeColors.text.primary }]}>Mortgage Calculator</Text>
                <Text style={[styles.calculatorSubtitle, { color: themeColors.text.secondary }]}>Complete home loan analysis</Text>
              </View>
              <View style={styles.calculatorArrow}>
                <ArrowRight size={18} color={themeColors.text.tertiary} strokeWidth={2} />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.calculatorCard, { backgroundColor: themeColors.surface.secondary }]}
            onPress={() => handleCalculatorPress('car-loan')}
            testID="open-car-loan"
            activeOpacity={0.8}
          >
            <View style={styles.calculatorCardContent}>
              <View style={[styles.calculatorIconContainer, { backgroundColor: 'rgba(102, 126, 234, 0.15)' }]}>
                <Car size={28} color="#667EEA" strokeWidth={2.5} />
              </View>
              <View style={styles.calculatorTextContainer}>
                <Text style={[styles.calculatorTitle, { color: themeColors.text.primary }]}>Auto Loan Calculator</Text>
                <Text style={[styles.calculatorSubtitle, { color: themeColors.text.secondary }]}>Smart vehicle financing</Text>
              </View>
              <View style={styles.calculatorArrow}>
                <ArrowRight size={18} color={themeColors.text.tertiary} strokeWidth={2} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Premium Section - Clean Design */}
        {!isPro && (
          <View style={styles.premiumSection}>
            <View style={[styles.premiumCard, { backgroundColor: themeColors.surface.secondary }]}>
              <View style={styles.premiumHeader}>
                <View style={styles.premiumIconContainer}>
                  <Crown size={24} color="#F59E0B" />
                </View>
                <View style={styles.premiumTextContainer}>
                  <Text style={[styles.premiumTitle, { color: themeColors.text.primary }]}>
                    {isTrialActive ? 'FinSage Pro Active' : 'Unlock FinSage Pro'}
                  </Text>
                  <Text style={[styles.premiumDescription, { color: themeColors.text.secondary }]}>
                    {isTrialActive 
                      ? 'Advanced analytics and professional reports' 
                      : 'Professional-grade financial analysis tools'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.premiumButton}
                onPress={handleStartTrial}
                testID="open-paywall"
              >
                <Text style={styles.premiumButtonText}>
                  {isTrialActive ? 'Manage Subscription' : 'Start 7-Day Trial'}
                </Text>
                <ArrowRight size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={[styles.featuresTitle, { color: themeColors.text.primary }]}>Professional Features</Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: isDark ? 'rgba(0, 230, 122, 0.15)' : 'rgba(0, 230, 122, 0.1)' }]}>
                <BarChart3 size={16} color="#00E67A" />
              </View>
              <Text style={[styles.featureText, { color: themeColors.text.secondary }]}>Advanced financial analytics</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: isDark ? 'rgba(0, 230, 122, 0.15)' : 'rgba(0, 230, 122, 0.1)' }]}>
                <Target size={16} color="#00E67A" />
              </View>
              <Text style={[styles.featureText, { color: themeColors.text.secondary }]}>Professional insights and recommendations</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { 
                backgroundColor: hasPremiumAccess 
                  ? (isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)') 
                  : (isDark ? 'rgba(153, 153, 153, 0.15)' : 'rgba(153, 153, 153, 0.1)')
              }]}>
                <Star size={16} color={hasPremiumAccess ? "#F59E0B" : themeColors.text.quaternary} />
              </View>
              <Text style={[styles.featureText, { 
                color: hasPremiumAccess ? themeColors.text.secondary : themeColors.text.quaternary 
              }]}>
                {hasPremiumAccess ? 'Unlimited calculations' : 'Limited calculations'}
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { 
                backgroundColor: hasPremiumAccess 
                  ? (isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)') 
                  : (isDark ? 'rgba(153, 153, 153, 0.15)' : 'rgba(153, 153, 153, 0.1)')
              }]}>
                <DollarSign size={16} color={hasPremiumAccess ? "#F59E0B" : themeColors.text.quaternary} />
              </View>
              <Text style={[styles.featureText, { 
                color: hasPremiumAccess ? themeColors.text.secondary : themeColors.text.quaternary 
              }]}>
                {hasPremiumAccess ? 'Professional reports & exports' : 'Basic reports only'}
              </Text>
            </View>
          </View>

          {/* Trust Badge */}
          <View style={[styles.trustBadge, {
            backgroundColor: isDark ? 'rgba(0, 230, 122, 0.1)' : 'rgba(0, 230, 122, 0.08)',
            borderColor: isDark ? 'rgba(0, 230, 122, 0.3)' : 'rgba(0, 230, 122, 0.2)'
          }]}>
            <Shield size={18} color="#00E67A" />
            <Text style={[styles.trustText, { color: '#00E67A' }]}>
              Bank-grade security • Professional accuracy • Trusted by thousands
            </Text>
          </View>

          {/* Premium Status */}
          {hasPremiumAccess && (
            <View style={styles.premiumStatus}>
              <Crown size={24} color="#F59E0B" />
              <Text style={styles.premiumStatusText}>
                {isPro ? 'FinSage Pro Active - Full Access Unlocked' : 'Trial Active - Pro Features Enabled'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeToggle: {
    // Additional styling if needed
  },
  scrollContent: {
    paddingTop: spacing[8], // Reduced top padding
    paddingBottom: spacing[32], // More bottom breathing room
    gap: spacing[8], // More space between sections
  },
  
  // Hero Section - More relaxed
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: spacing[8], // More side padding
    marginBottom: spacing[16], // More space below
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3], // More icon spacing
    backgroundColor: 'rgba(245,245,245,0.08)', // Softer background
    paddingHorizontal: spacing[5], // More padding
    paddingVertical: spacing[4], // Taller badge
    borderRadius: borderRadius.full,
    marginBottom: spacing[10], // More space below
    borderWidth: 1,
    borderColor: 'rgba(0,230,122,0.2)', // Softer border
  },
  statusBadgePremium: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  statusText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: '#FFFFFF',
    letterSpacing: typography.letterSpacing.wide,
  },
  statusTextPremium: {
    color: '#F59E0B',
  },
  brandContainer: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  brandTitle: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    letterSpacing: -0.5,
    marginBottom: spacing[2],
    marginTop: spacing[4],
    textAlign: 'center',
  },
  brandSubtitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
    textAlign: 'center',
    letterSpacing: 0.2,
    lineHeight: 20,
    opacity: 0.9,
  },
  
  // Profit Banner
  profitBanner: {
    paddingHorizontal: spacing[6],
    marginBottom: spacing[6],
  },
  profitBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: borderRadius.xl,
  },
  profitBannerContent: {
    marginLeft: spacing[3],
  },
  profitBannerTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: '#FFF',
  },
  profitBannerSubtitle: {
    fontSize: typography.size.sm,
    color: 'rgba(255,255,255,0.9)',
  },
  
  // Calculator Section - Clean Design
  calculatorSection: {
    paddingHorizontal: spacing[6],
    gap: spacing[4],
    marginBottom: spacing[8],
  },
  calculatorCard: {
    borderRadius: borderRadius.xl,
    marginBottom: spacing[4],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  calculatorCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[6],
    borderRadius: borderRadius.xl,
  },
  calculatorIconContainer: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[4],
  },
  calculatorTextContainer: {
    flex: 1,
    paddingRight: spacing[2],
  },
  calculatorTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing[1],
    lineHeight: 22,
  },
  calculatorSubtitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.regular,
    lineHeight: 18,
    opacity: 0.8,
  },
  calculatorArrow: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Premium Section - Clean Design
  premiumSection: {
    paddingHorizontal: spacing[6],
    marginBottom: spacing[8],
  },
  premiumCard: {
    borderRadius: borderRadius.xl,
    padding: spacing[5],
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  premiumIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing[1],
    lineHeight: typography.lineHeight.snug,
  },
  premiumDescription: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.regular,
    lineHeight: typography.lineHeight.normal,
  },
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    backgroundColor: '#F59E0B',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius.lg,
  },
  premiumButtonText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: '#FFF',
  },
  
  // Features Section
  featuresSection: {
    paddingHorizontal: spacing[6],
  },
  featuresTitle: {
    fontSize: typography.size.xl, // Smaller, less overwhelming
    fontWeight: typography.weight.semibold, // Less aggressive
    color: '#F5F5F5', // Softer white
    textAlign: 'center',
    marginBottom: spacing[8], // More space
    letterSpacing: typography.letterSpacing.normal, // More readable
    lineHeight: typography.lineHeight.snug,
  },
  featuresList: {
    gap: spacing[4],
    marginBottom: spacing[8],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: typography.size.sm, // Smaller, easier to read
    color: 'rgba(192,192,192,0.9)', // Warmer, softer
    fontWeight: typography.weight.regular, // Lighter weight
    flex: 1,
    lineHeight: typography.lineHeight.relaxed, // Better spacing
  },
  featureTextDisabled: {
    color: '#999',
  },
  
  // Trust Badge
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.2)',
    padding: spacing[4],
    borderRadius: borderRadius.xl,
    marginBottom: spacing[4],
  },
  trustText: {
    fontSize: typography.size.xs, // Smaller, less prominent
    color: '#00E67A', // Softer green
    fontWeight: typography.weight.regular, // Lighter
    flex: 1,
    lineHeight: typography.lineHeight.relaxed, // Better readability
  },
  
  // Premium Status
  premiumStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    padding: spacing[4],
    borderRadius: borderRadius.xl,
  },
  premiumStatusText: {
    fontSize: typography.size.sm,
    color: '#F59E0B',
    fontWeight: typography.weight.semibold,
    flex: 1,
  },
});