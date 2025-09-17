import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';

interface PremiumCardProps {
  onUpgrade: () => void;
  isPremium?: boolean;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({ onUpgrade, isPremium = false }) => {
  if (isPremium) {
    return (
      <View style={styles.premiumActiveCard}>
        <MaterialIcons name="star" size={24} color={Colors.light.secondary} />
        <View style={styles.premiumContent}>
          <Text style={styles.premiumTitle}>Premium Active</Text>
          <Text style={styles.premiumDescription}>Enjoying all premium features</Text>
        </View>
        <MaterialIcons name="check-circle" size={24} color={Colors.light.success} />
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.premiumCard} onPress={onUpgrade}>
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.primaryDark]}
        style={styles.gradient}
      >
        <View style={styles.premiumHeader}>
          <MaterialIcons name="star" size={24} color={Colors.light.secondary} />
          <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
        </View>
        
        <View style={styles.featuresList}>
          <View style={styles.feature}>
            <MaterialIcons name="check" size={16} color="#FFFFFF" />
            <Text style={styles.featureText}>Unlimited AI Health Insights</Text>
          </View>
          <View style={styles.feature}>
            <MaterialIcons name="check" size={16} color="#FFFFFF" />
            <Text style={styles.featureText}>Vet Consultations</Text>
          </View>
          <View style={styles.feature}>
            <MaterialIcons name="check" size={16} color="#FFFFFF" />
            <Text style={styles.featureText}>Multi-Dog Support</Text>
          </View>
          <View style={styles.feature}>
            <MaterialIcons name="check" size={16} color="#FFFFFF" />
            <Text style={styles.featureText}>Advanced Analytics</Text>
          </View>
        </View>
        
        <View style={styles.pricing}>
          <Text style={styles.price}>$9.99/month</Text>
          <Text style={styles.priceSubtext}>or $99.99/year (17% off)</Text>
        </View>
        
        <View style={styles.upgradeButton}>
          <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  premiumCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    padding: 20,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  featuresList: {
    marginBottom: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  pricing: {
    alignItems: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  priceSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  premiumActiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: 16,
    margin: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.secondary,
  },
  premiumContent: {
    flex: 1,
    marginLeft: 12,
  },
  premiumDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
});

