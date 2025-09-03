import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SageMascotProps {
  size?: number;
  emotion?: 'confident' | 'analytical' | 'celebrating' | 'encouraging' | 'focused' | 'trustworthy';
  animated?: boolean;
  testID?: string;
  premium?: boolean;
}

const SageMascot: React.FC<SageMascotProps> = ({
  size = 80,
  emotion = 'confident',
  animated = true,
  testID,
  premium = false
}) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animated || Platform.OS === 'web') return;

    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -2,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );

    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.01,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    );

    bounceAnimation.start();
    scaleAnimation.start();

    return () => {
      bounceAnimation.stop();
      scaleAnimation.stop();
    };
  }, [animated, bounceAnim, scaleAnim]);

  const getEmotionColor = () => {
    switch (emotion) {
      case 'celebrating':
        return '#F59E0B';
      case 'analytical':
        return '#0EA5E9';
      case 'encouraging':
        return '#10B981';
      case 'focused':
        return '#8B5CF6';
      case 'trustworthy':
        return '#059669';
      default:
        return '#00E67A';
    }
  };

  const eyeColor = getEmotionColor();
  const gradientColors: [string, string] = premium 
    ? ['#F59E0B', '#D97706'] 
    : ['#00E67A', '#00D166'];

  const Container = animated && Platform.OS !== 'web' ? Animated.View : View;
  const containerStyle = [
    styles.container,
    animated && Platform.OS !== 'web' && {
      transform: [
        { translateY: bounceAnim },
        { scale: scaleAnim }
      ]
    }
  ].filter(Boolean);

  return (
    <Container style={containerStyle} testID={testID}>
      <View style={[
        styles.glow, 
        { 
          width: size + 16, 
          height: size + 16,
          opacity: premium ? 0.4 : 0.2,
          backgroundColor: premium ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0, 230, 122, 0.15)'
        }
      ]} />
      <LinearGradient
        colors={gradientColors}
        style={[styles.gradient, { width: size, height: size, borderRadius: size * 0.3 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.face, { width: size * 0.6, height: size * 0.6 }]}>
          <View style={[styles.eye, { backgroundColor: eyeColor }]} />
          <View style={[styles.eye, { backgroundColor: eyeColor }]} />
          <View style={[styles.mouth, { 
            backgroundColor: eyeColor,
            borderRadius: emotion === 'confident' ? 10 : 2
          }]} />
        </View>
      </LinearGradient>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  face: {
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  eye: {
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 2,
  },
  mouth: {
    width: 12,
    height: 3,
    marginTop: 4,
  },
  glow: {
    position: 'absolute',
    borderRadius: 50,
    top: -8,
    left: -8,
  },
});

export default SageMascot;