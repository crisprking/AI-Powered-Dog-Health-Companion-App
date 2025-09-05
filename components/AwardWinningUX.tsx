import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Crown, Sparkles, Star, Zap, TrendingUp } from 'lucide-react-native';
import { colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

interface CelebrationProps {
  visible: boolean;
  type: 'streak' | 'achievement' | 'milestone' | 'premium';
  title: string;
  subtitle?: string;
  onComplete?: () => void;
}

export const CelebrationAnimation: React.FC<CelebrationProps> = ({
  visible,
  type,
  title,
  subtitle,
  onComplete,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Haptic feedback
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Main animation sequence
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(1000),
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(1500),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        onComplete?.();
      });
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      sparkleAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  const getGradientColors = () => {
    switch (type) {
      case 'streak':
        return [colors.success, '#22C55E'];
      case 'achievement':
        return [colors.accent, colors.primary];
      case 'milestone':
        return [colors.warning, '#F59E0B'];
      case 'premium':
        return [colors.accent, colors.primary, '#FFD700'];
      default:
        return [colors.accent, colors.primary];
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'streak':
        return <Zap size={48} color={colors.background} />;
      case 'achievement':
        return <Star size={48} color={colors.background} />;
      case 'milestone':
        return <TrendingUp size={48} color={colors.background} />;
      case 'premium':
        return <Crown size={48} color={colors.background} />;
      default:
        return <Sparkles size={48} color={colors.background} />;
    }
  };

  return (
    <View style={styles.overlay}>
      <BlurView intensity={20} style={styles.blurContainer}>
        <Animated.View
          style={[
            styles.celebrationContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <LinearGradient
            colors={getGradientColors()}
            style={styles.celebrationCard}
          >
            <Animated.View
              style={[
                styles.sparkleContainer,
                {
                  opacity: sparkleAnim,
                },
              ]}
            >
              <Sparkles size={24} color={colors.background} style={styles.sparkle1} />
              <Sparkles size={20} color={colors.background} style={styles.sparkle2} />
              <Sparkles size={16} color={colors.background} style={styles.sparkle3} />
            </Animated.View>

            <View style={styles.iconContainer}>
              {getIcon()}
            </View>

            <Text style={styles.celebrationTitle}>{title}</Text>
            {subtitle && (
              <Text style={styles.celebrationSubtitle}>{subtitle}</Text>
            )}

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => {
                Animated.parallel([
                  Animated.timing(scaleAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                  }),
                  Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                  }),
                ]).start(() => onComplete?.());
              }}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </BlurView>
    </View>
  );
};

interface ProgressRingProps {
  progress: number;
  size: number;
  strokeWidth: number;
  color: string;
  label: string;
  value: string;
  animated?: boolean;
}

export const AnimatedProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size,
  strokeWidth,
  color,
  label,
  value,
  animated = true,
}) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedProgress, {
        toValue: progress,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    } else {
      animatedProgress.setValue(progress);
    }
  }, [progress, animated]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <View style={[styles.progressRing, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.progressRingInner,
          {
            transform: [
              {
                rotate: animatedProgress.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.progressRingContent}>
          <Text style={styles.progressValue}>{value}</Text>
          <Text style={styles.progressLabel}>{label}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

interface FloatingActionButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  label?: string;
  variant?: 'primary' | 'secondary' | 'success';
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon,
  label,
  variant = 'primary',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.fabPrimary;
      case 'secondary':
        return styles.fabSecondary;
      case 'success':
        return styles.fabSuccess;
      default:
        return styles.fabPrimary;
    }
  };

  return (
    <Animated.View
      style={[
        styles.fabContainer,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.fab, getButtonStyle()]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={
            variant === 'primary'
              ? [colors.accent, colors.primary]
              : variant === 'success'
              ? [colors.success, '#22C55E']
              : [colors.surface, colors.surface]
          }
          style={styles.fabGradient}
        >
          {icon}
          {label && <Text style={styles.fabLabel}>{label}</Text>}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationContainer: {
    alignItems: 'center',
  },
  celebrationCard: {
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    width: width - 64,
    position: 'relative',
    overflow: 'hidden',
  },
  sparkleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sparkle1: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  sparkle3: {
    position: 'absolute',
    top: '50%',
    left: 20,
  },
  iconContainer: {
    marginBottom: 16,
  },
  celebrationTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.background,
    textAlign: 'center',
    marginBottom: 8,
  },
  celebrationSubtitle: {
    fontSize: 16,
    color: colors.background,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 24,
  },
  continueButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  continueButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  progressRing: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRingInner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: colors.accent,
  },
  progressRingContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  progressValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  progressLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 4,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  fab: {
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  fabPrimary: {
    backgroundColor: colors.accent,
  },
  fabSecondary: {
    backgroundColor: colors.surface,
  },
  fabSuccess: {
    backgroundColor: colors.success,
  },
  fabLabel: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
});
