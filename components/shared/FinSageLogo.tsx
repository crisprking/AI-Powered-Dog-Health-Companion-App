import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MASCOT_URL } from '@/constants/branding';

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
  

  
  const renderWordmark = () => {
    if (!showText) return null;
    
    return (
      <View style={styles.wordmarkContainer}>
        <LinearGradient
          colors={premium ? ['#1a1a2e', '#16213e', '#0f3460'] : ['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.modernContainer, { borderRadius: config.fontSize * 0.6 }]}
        >
          <View style={styles.brandContainer}>
            <Text style={[styles.brandText, { 
              fontSize: config.fontSize * 1.1,
              color: '#FFFFFF',
              textShadowColor: 'rgba(0,0,0,0.8)',
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 4
            }]}>
              FinSage
            </Text>
            <View style={styles.proContainer}>
              <LinearGradient
                colors={['#FFD700', '#FFA500', '#FF6B35']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.proGradient}
              >
                <Text style={[styles.proText, { fontSize: config.fontSize * 0.5 }]}>PRO</Text>
              </LinearGradient>
            </View>
          </View>
          <Text style={[styles.taglineText, { 
            fontSize: config.fontSize * 0.45,
            color: 'rgba(255, 255, 255, 0.9)'
          }]}>
            Your AI Financial Wizard
          </Text>
        </LinearGradient>
        {premium && (
          <View style={[styles.premiumBadge, { marginTop: config.spacing * 0.4 }]}>
            <LinearGradient
              colors={['#FFD700', '#FFA500', '#FF6B35']}
              style={styles.premiumGradient}
            >
              <Text style={[styles.premiumText, { fontSize: config.fontSize * 0.35 }]}>✨ PREMIUM UNLOCKED</Text>
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
  modernContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  brandText: {
    fontWeight: '900',
    letterSpacing: -1,
    textAlign: 'center',
  },
  proContainer: {
    marginLeft: 6,
    marginTop: -2,
  },
  proGradient: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  proText: {
    color: '#000',
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  taglineText: {
    fontWeight: '600',
    letterSpacing: 0.2,
    textAlign: 'center',
    opacity: 0.95,
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