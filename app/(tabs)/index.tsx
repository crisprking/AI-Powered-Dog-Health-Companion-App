import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Car, Crown, Shield, Star, ArrowRight, Calculator, DollarSign, Target, BarChart3, Settings } from 'lucide-react-native';
import SageMascot from '@/components/shared/SageMascot';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors, { typography, spacing, borderRadius } from '@/constants/colors';
import { APP_NAME, TAGLINE, MASCOT_URL, BRAND_COLORS } from '@/constants/branding';
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
            <View style={[styles.logoBackdrop, {
              backgroundColor: isDark ? 'rgba(0, 230, 122, 0.05)' : 'rgba(0, 230, 122, 0.03)',
              borderRadius: 100,
              padding: 20,
              shadowColor: isDark ? '#00E67A' : '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDark ? 0.15 : 0.08,
              shadowRadius: 12,
              elevation: 6,
            }]}>
              <SageMascot 
                size={140} 
                emotion={hasPremiumAccess ? 'celebrating' : 'confident'} 
                premium={hasPremiumAccess}
                animated={true}
                testID="sage-mascot"
                imageUrl={MASCOT_URL}
              />
            </View>
            <View style={styles.appNameContainer}>
              <Text style={[styles.appName, { 
                color: isDark ? '#FFFFFF' : '#000000',
                textShadowColor: isDark ? 'rgba(0, 230, 122, 0.3)' : 'rgba(0, 0, 0, 0.1)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }]}>
                {APP_NAME}
              </Text>
              <Text style={[styles.appTagline, { color: themeColors.text.secondary }]}>
                {TAGLINE}
              </Text>
            </View>
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

        {/* Calculator Cards - Enhanced UX */}
        <View style={styles.calculatorSection}>
          <Text style={[styles.calculatorSectionTitle, { 
            color: themeColors.text.primary,
            fontSize: typography.size['2xl'],
            fontWeight: typography.weight.bold,
            lineHeight: typography.size['2xl'] * typography.lineHeight.tight,
            letterSpacing: typography.letterSpacing.tight,
          }]}>
            Financial Calculators
          </Text>
          <Text style={[styles.calculatorSectionSubtitle, { 
            color: themeColors.text.secondary,
            fontSize: typography.size.base,
            fontWeight: typography.weight.medium,
            lineHeight: typography.size.base * typography.lineHeight.normal,
          }]}>
            Swipe to explore • Tap for instant calculations
          </Text>
          <HorizontalCalculators onOpen={handleCalculatorPress} />
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

const CARD_SPACING = 16 as const;
const CARD_WIDTH = 320 as const;

function HorizontalCalculators({ onOpen }: { onOpen: (type: 'mortgage' | 'car-loan') => void }) {
  const { colors: themeColors } = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState<number>(0);
  const data = useMemo(() => ([
    {
      key: 'mortgage' as const,
      title: 'Mortgage Calculator',
      subtitle: 'Complete home loan analysis',
      bg: 'rgba(0, 230, 122, 0.15)',
      icon: <Home size={28} color="#00E67A" strokeWidth={2.5} />,
      testID: 'open-mortgage'
    },
    {
      key: 'car-loan' as const,
      title: 'Auto Loan Calculator',
      subtitle: 'Smart vehicle financing',
      bg: 'rgba(102, 126, 234, 0.15)',
      icon: <Car size={28} color="#667EEA" strokeWidth={2.5} />,
      testID: 'open-car-loan'
    }
  ]), []);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / (CARD_WIDTH + CARD_SPACING));
    if (i !== index) setIndex(i);
  };

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 20 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        testID="calculator-carousel"
      >
        {data.map((item) => (
          <TouchableOpacity
            key={item.key}
            onPress={() => onOpen(item.key)}
            activeOpacity={0.92}
            testID={item.testID}
            style={{
              width: CARD_WIDTH,
              marginRight: CARD_SPACING,
            }}
          >
            <View style={[styles.calculatorCard, { backgroundColor: themeColors.surface.secondary }]}> 
              <View style={styles.calculatorCardContent}>
                <View style={[styles.calculatorIconContainer, { backgroundColor: item.bg }]}> 
                  {item.icon}
                </View>
                <View style={styles.calculatorTextContainer}>
                  <Text style={[styles.calculatorTitle, { color: themeColors.text.primary }]}>{item.title}</Text>
                  <Text style={[styles.calculatorSubtitle, { color: themeColors.text.secondary }]}>{item.subtitle}</Text>
                </View>
                <View style={styles.calculatorArrow}>
                  <ArrowRight size={18} color={themeColors.text.tertiary} strokeWidth={2} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {data.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
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
  logoBackdrop: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  appNameContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  appName: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.black,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.size['3xl'] * typography.lineHeight.tight,
    marginBottom: 4,
  },
  appTagline: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
    letterSpacing: typography.letterSpacing.wide,
    lineHeight: typography.size.base * typography.lineHeight.normal,
    opacity: 0.8,
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
    marginBottom: 24,
  },
  calculatorSectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 20,
    letterSpacing: -0.3,
    lineHeight: 26,
  },
  calculatorSectionSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    opacity: 0.7,
    lineHeight: 18,
  },
  calculatorCard: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
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
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  dotActive: {
    backgroundColor: '#00E67A',
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