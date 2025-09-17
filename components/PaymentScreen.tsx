import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PaymentService } from '../services/PaymentService';
import { SubscriptionPlan } from '../lib/supabase';

interface PaymentScreenProps {
  visible: boolean;
  onClose: () => void;
  onSubscriptionChange: (isPremium: boolean) => void;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  visible,
  onClose,
  onSubscriptionChange,
}) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (visible) {
      loadPlans();
    }
  }, [visible]);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const subscriptionPlans = await PaymentService.getSubscriptionPlans();
      if (subscriptionPlans.length === 0) {
        // Mock plans if no data from Supabase
        setPlans([
          {
            id: '1',
            name: 'Free',
            description: 'Basic health tracking',
            price: 0,
            currency: 'USD',
            interval: 'monthly',
            features: ['Basic health tracking', 'Limited AI insights', 'Basic support'],
            is_popular: false,
          },
          {
            id: '2',
            name: 'Premium',
            description: 'Advanced AI features',
            price: 9.99,
            currency: 'USD',
            interval: 'monthly',
            features: ['Unlimited AI insights', 'Vet chat', 'Health reports', 'Priority support'],
            is_popular: true,
          },
          {
            id: '3',
            name: 'Pro',
            description: 'Everything + Advanced analytics',
            price: 19.99,
            currency: 'USD',
            interval: 'monthly',
            features: ['Everything in Premium', 'Advanced analytics', 'Custom reports', '24/7 support'],
            is_popular: false,
          },
        ]);
      } else {
        setPlans(subscriptionPlans);
      }
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    setProcessing(true);
    try {
      // Mock payment processing
      const result = await PaymentService.processPayment(selectedPlan.id, 'apple');
      
      if (result.success) {
        // Update subscription status
        await PaymentService.updateSubscriptionStatus('user123', 'premium');
        
        Alert.alert(
          'Success!',
          `Welcome to ${selectedPlan.name}! Your subscription is now active.`,
          [
            {
              text: 'Great!',
              onPress: () => {
                onSubscriptionChange(true);
                onClose();
              },
            },
          ]
        );
      } else {
        Alert.alert('Payment Failed', result.error || 'Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const renderPlan = (plan: SubscriptionPlan) => (
    <TouchableOpacity
      key={plan.id}
      style={[
        styles.planCard,
        selectedPlan?.id === plan.id && styles.selectedPlan,
        plan.is_popular && styles.popularPlan,
      ]}
      onPress={() => setSelectedPlan(plan)}
    >
      {plan.is_popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>MOST POPULAR</Text>
        </View>
      )}
      
      <View style={styles.planHeader}>
        <Text style={styles.planName}>{plan.name}</Text>
        <Text style={styles.planDescription}>{plan.description}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${plan.price}</Text>
          <Text style={styles.interval}>/{plan.interval}</Text>
        </View>
      </View>

      <View style={styles.featuresContainer}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <MaterialIcons name="check" size={16} color="#4CAF50" />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {selectedPlan?.id === plan.id && (
        <View style={styles.selectedIndicator}>
          <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <LinearGradient colors={['#4CAF50', '#2E7D32']} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Choose Your Plan</Text>
            <View style={styles.placeholder} />
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Loading plans...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.subtitle}>
                Unlock advanced features for your dog's health
              </Text>
              
              {plans.map(renderPlan)}
              
              <TouchableOpacity
                style={[
                  styles.subscribeButton,
                  !selectedPlan && styles.disabledButton,
                ]}
                onPress={handleSubscribe}
                disabled={!selectedPlan || processing}
              >
                {processing ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <MaterialIcons name="star" size={20} color="#FFFFFF" />
                    <Text style={styles.subscribeText}>
                      {selectedPlan ? `Subscribe to ${selectedPlan.name}` : 'Select a Plan'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedPlan: {
    borderColor: '#4CAF50',
  },
  popularPlan: {
    borderColor: '#FFD700',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  planHeader: {
    marginBottom: 20,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  interval: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  subscribeButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  subscribeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

