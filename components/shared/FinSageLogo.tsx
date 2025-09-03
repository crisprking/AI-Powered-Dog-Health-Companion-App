import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MASCOT_URL, BRAND_COLORS } from '@/constants/branding';
import { useTheme } from '@/contexts/ThemeContext';

interface FinSageLogoProps {
  variant?: 'full' | 'icon' | 'wordmark' | 'premium';
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  premium?: boolean;
  animated?: boolean;
  testID?: string;
}

const FinSageLogo: React.FC<FinSageLogoProps> = ({
  variant = 'full',
  size = 'medium',
  showText = true,
  premium = false,
  animated = false,
  testID
}) => {
  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return { mascotSize: 32, fontSize: 16, spacing: 8 };
      case 'large':
        return { mascotSize: 64, fontSize: 24, spacing: 16 };
      default:
        return { mascotSize: 48, fontSize: 20, spacing: 12 };
    }
  };
  
  const config = getSizeConfig();
  
  const renderMascot = () => (
    <Image
      source={{ uri: MASCOT_URL }}
      style={{
        width: config.mascotSize,
        height: config.mascotSize,
        borderRadius: config.mascotSize * 0.1,
      }}
      resizeMode="contain"
      testID={`${testID}-mascot`}
    />
  );
  
  const { isDark } = useTheme();
  
  const renderWordmark = () => {
    if (!showText) return null;
    
    return (
      <View style={styles.wordmarkContainer}>
        <View style={[
          styles.textContainer,
          {
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            borderRadius: config.fontSize * 0.4,
          }
        ]}>
          <LinearGradient
            colors={premium ? [BRAND_COLORS.premium, BRAND_COLORS.premiumDark] : [BRAND_COLORS.primary, BRAND_COLORS.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.textGradient, { borderRadius: config.fontSize * 0.3 }]}
          >
            <Text style={[styles.brandText, { 
              fontSize: config.fontSize,
              color: BRAND_COLORS.textWhite,
              textShadowColor: 'rgba(0,0,0,0.5)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 3
            }]}>
              FinSage Pro
            </Text>
          </LinearGradient>
        </View>
        {premium && (
          <View style={[styles.premiumBadge, { marginTop: config.spacing * 0.3 }]}>
            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              style={styles.premiumGradient}
            >
              <Text style={[styles.premiumText, { fontSize: config.fontSize * 0.4 }]}>PREMIUM</Text>
            </LinearGradient>
          </View>
        )}
      </View>
    );
  };
  
  switch (variant) {
    case 'icon':
      return (
        <View style={styles.container} testID={testID}>
          {renderMascot()}
        </View>
      );
      
    case 'wordmark':
      return (
        <View style={styles.container} testID={testID}>
          {renderWordmark()}
        </View>
      );
      
    case 'premium':
      return (
        <View style={[styles.container, styles.premiumContainer]} testID={testID}>
          <View style={styles.premiumLayout}>
            {renderMascot()}
            <View style={{ marginLeft: config.spacing }}>
              {renderWordmark()}
            </View>
          </View>
        </View>
      );
      
    default: // 'full'
      return (
        <View style={styles.container} testID={testID}>
          <View style={[styles.fullLayout, { gap: config.spacing }]}>
            {renderMascot()}
            {renderWordmark()}
          </View>
        </View>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullLayout: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumContainer: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  premiumLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmarkContainer: {
    alignItems: 'center',
  },
  textContainer: {
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  textGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  brandText: {
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  premiumBadge: {
    alignItems: 'center',
  },
  premiumGradient: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  premiumText: {
    color: '#000',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default FinSageLogo;