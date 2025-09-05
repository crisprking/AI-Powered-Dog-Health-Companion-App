import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, Zap, TrendingUp, Star } from 'lucide-react-native';
import { router } from 'expo-router';
import Colors from '@/constants/colors';

interface PremiumCardProps {
  variant?: 'compact' | 'full';
}

export default function PremiumCard({ variant = 'compact' }: PremiumCardProps) {
  const handleUpgrade = () => {
    router.push('/premium');
  };

  if (variant === 'compact') {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={handleUpgrade}>
        <LinearGradient
          colors={Colors.goldGradient}
          style={styles.compactGradient}
        >
          <View style={styles.compactContent}>
            <Crown size={20} color={Colors.background} />
            <View style={styles.compactText}>
              <Text style={styles.compactTitle}>Upgrade to Premium</Text>
              <Text style={styles.compactSubtitle}>Unlimited habits & AI insights</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.fullCard} onPress={handleUpgrade}>
      <LinearGradient
        colors={Colors.goldGradient}
        style={styles.fullGradient}
      >
        <View style={styles.header}>
          <Crown size={32} color={Colors.background} />
          <Text style={styles.title}>Unlock Premium</Text>
          <Text style={styles.subtitle}>Join the elite 1% of habit transformers</Text>
        </View>

        <View style={styles.features}>
          <View style={styles.featureRow}>
            <View style={styles.feature}>
              <TrendingUp size={20} color={Colors.background} />
              <Text style={styles.featureText}>Unlimited habits</Text>
            </View>
            <View style={styles.feature}>
              <Zap size={20} color={Colors.background} />
              <Text style={styles.featureText}>50 AI insights daily</Text>
            </View>
          </View>
          <View style={styles.featureRow}>
            <View style={styles.feature}>
              <Star size={20} color={Colors.background} />
              <Text style={styles.featureText}>Advanced analytics</Text>
            </View>
            <View style={styles.feature}>
              <Crown size={20} color={Colors.background} />
              <Text style={styles.featureText}>Priority support</Text>
            </View>
          </View>
        </View>

        <View style={styles.pricing}>
          <Text style={styles.price}>$9.99/month</Text>
          <Text style={styles.priceNote}>or $59.99/year (save 50%)</Text>
        </View>

        <View style={styles.cta}>
          <Text style={styles.ctaText}>Start Premium Journey →</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  compactCard: {
    marginHorizontal: 20,
    marginVertical: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  compactGradient: {
    padding: 16,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactText: {
    marginLeft: 12,
    flex: 1,
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
  },
  compactSubtitle: {
    fontSize: 14,
    color: Colors.background,
    opacity: 0.9,
    marginTop: 2,
  },
  fullCard: {
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 24,
    overflow: 'hidden',
  },
  fullGradient: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.background,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.background,
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 4,
  },
  features: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background,
    marginLeft: 8,
  },
  pricing: {
    alignItems: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.background,
  },
  priceNote: {
    fontSize: 12,
    color: Colors.background,
    opacity: 0.8,
    marginTop: 4,
  },
  cta: {
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
  },
});