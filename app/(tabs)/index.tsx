import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Car, Crown, Shield, Star, ArrowRight, Calculator, DollarSign, Target, BarChart3, Settings } from 'lucide-react-native';
import SageMascot from '@/components/shared/SageMascot';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['top']}>
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
              color: hasPremiumAccess ? '#F59E0B' : '#00E67A'
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

        {/* Calculator Cards - Perfect Text Readability */}
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
    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeToggle: {
    // Additional styling if needed
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
    gap: 24,
  },
  
  // Hero Section
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 50,
    marginBottom: 24,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  brandContainer: {
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 32,
  },
  brandSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.2,
    lineHeight: 20,
    opacity: 0.9,
  },
  
  // Profit Banner
  profitBanner: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profitBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  profitBannerContent: {
    marginLeft: 12,
  },
  profitBannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    lineHeight: 22,
  },
  profitBannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
  },
  
  // Calculator Section
  calculatorSection: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 24,
  },
  calculatorCard: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  calculatorCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
  },
  calculatorIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  calculatorTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  calculatorTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  calculatorSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
    opacity: 0.8,
  },
  calculatorArrow: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Premium Section
  premiumSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  premiumCard: {
    borderRadius: 16,
    padding: 20,
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
    marginBottom: 16,
  },
  premiumIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  premiumDescription: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
    opacity: 0.8,
  },
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  premiumButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    lineHeight: 18,
  },
  
  // Features Section
  featuresSection: {
    paddingHorizontal: 20,
  },
  featuresTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -0.3,
    lineHeight: 26,
  },
  featuresList: {
    gap: 16,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  
  // Trust Badge
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.2)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  trustText: {
    fontSize: 14,
    color: '#00E67A',
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },
  
  // Premium Status
  premiumStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    padding: 16,
    borderRadius: 12,
  },
  premiumStatusText: {
    fontSize: 15,
    color: '#F59E0B',
    fontWeight: '600',
    flex: 1,
    lineHeight: 18,
  },
});