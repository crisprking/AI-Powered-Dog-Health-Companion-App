import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Target, 
  Lightbulb, 
  Crown,
  Lock,
  Sparkles
} from 'lucide-react-native';
import { useSoluna } from '@/hooks/useSolunaStore';
// import { generateAIInsight } from '@/utils/ai'; // Commented out for demo
import Colors from '@/constants/colors';

export default function InsightsScreen() {
  const { habits, user, useAIBoost, dailyAIBoosts } = useSoluna();
  const [isGenerating, setIsGenerating] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);

  const handleGenerateInsight = useCallback(async () => {
    if (isGenerating) return;

    const canUseBoost = await useAIBoost();
    if (!canUseBoost) return;

    setIsGenerating(true);
    try {
      // Mock AI insight generation for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockInsight = `Based on your ${habits.length} habits, you're showing strong consistency patterns. Your best performing habit has a ${Math.max(...habits.map(h => h.streak), 0)}-day streak!`;
      setInsights(prev => [mockInsight, ...prev.slice(0, 4)]);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate insight. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [habits, user, useAIBoost, isGenerating]);

  const handleUpgradePress = () => {
    router.push('/premium');
  };

  // Mock insights for demo
  const mockInsights = [
    {
      type: 'forecast',
      title: 'Weekly Forecast',
      content: 'Based on your current patterns, you have an 85% chance of completing all habits this week. Your morning routine shows the strongest consistency.',
      confidence: 85,
      icon: TrendingUp,
      color: Colors.success,
    },
    {
      type: 'optimization',
      title: 'Success Factor Analysis',
      content: 'Your habit completion rate is 23% higher on days when you complete your morning meditation first. Consider prioritizing this habit.',
      confidence: 92,
      icon: Target,
      color: Colors.gold,
    },
    {
      type: 'recommendation',
      title: 'Personalized Recommendation',
      content: 'Users with similar patterns find success by adding a 5-minute evening reflection habit. This could boost your overall consistency by 15%.',
      confidence: 78,
      icon: Lightbulb,
      color: '#4ECDC4',
    },
    {
      type: 'prediction',
      title: 'Achievement Prediction',
      content: 'You\'re on track to unlock the \"Consistency King\" achievement in 12 days if you maintain your current 7-day streak momentum.',
      confidence: 89,
      icon: Crown,
      color: '#FF6B6B',
    },
  ];

  const availableBoosts = user.isPremium ? 50 : dailyAIBoosts;
  const maxBoosts = user.isPremium ? 50 : 3;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>AI Insights</Text>
          <Text style={styles.subtitle}>Personalized coaching powered by AI</Text>
        </View>

        {/* AI Boost Counter */}
        <View style={styles.boostContainer}>
          <LinearGradient
            colors={[Colors.gold + '20', Colors.gold + '10']}
            style={styles.boostCard}
          >
            <View style={styles.boostHeader}>
              <Zap size={24} color={Colors.gold} />
              <Text style={styles.boostTitle}>AI Boosts Available</Text>
            </View>
            <Text style={styles.boostCount}>
              {availableBoosts} / {maxBoosts}
            </Text>
            <Text style={styles.boostSubtitle}>
              {user.isPremium ? 'Unlimited daily insights' : 'Resets daily at midnight'}
            </Text>
          </LinearGradient>
        </View>

        {/* Generate Insight Button */}
        <TouchableOpacity
          style={[styles.generateButton, (!availableBoosts || isGenerating) && styles.disabledButton]}
          onPress={handleGenerateInsight}
          disabled={!availableBoosts || isGenerating}
        >
          <LinearGradient
            colors={availableBoosts && !isGenerating ? [Colors.gold, '#B8860B'] : [Colors.textSecondary, Colors.textSecondary]}
            style={styles.generateGradient}
          >
            {isGenerating ? (
              <ActivityIndicator color={Colors.background} size="small" />
            ) : (
              <>
                <Brain size={20} color={Colors.background} />
                <Text style={styles.generateButtonText}>
                  Generate AI Insight
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Mock Insights Preview */}
        <View style={styles.insightsContainer}>
          <Text style={styles.sectionTitle}>Your Insights</Text>
          
          {mockInsights.map((insight, index) => {
            const IconComponent = insight.icon;
            const isLocked = !user.isPremium && index > 0;
            
            return (
              <View key={index} style={[styles.insightCard, isLocked && styles.lockedCard]}>
                <LinearGradient
                  colors={isLocked ? ['#333', '#222'] : [insight.color + '20', insight.color + '10']}
                  style={styles.insightGradient}
                >
                  <View style={styles.insightHeader}>
                    <View style={styles.insightIconContainer}>
                      {isLocked ? (
                        <Lock size={20} color={Colors.textSecondary} />
                      ) : (
                        <IconComponent size={20} color={insight.color} />
                      )}
                    </View>
                    <View style={styles.insightTitleContainer}>
                      <Text style={[styles.insightTitle, isLocked && styles.lockedText]}>
                        {isLocked ? 'Premium Insight' : insight.title}
                      </Text>
                      {!isLocked && (
                        <View style={styles.confidenceContainer}>
                          <Sparkles size={12} color={insight.color} />
                          <Text style={[styles.confidenceText, { color: insight.color }]}>
                            {insight.confidence}% confidence
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  <Text style={[styles.insightContent, isLocked && styles.lockedText]}>
                    {isLocked 
                      ? 'Unlock advanced AI insights with Premium. Get personalized recommendations, success predictions, and optimization tips.'
                      : insight.content
                    }
                  </Text>
                  
                  {isLocked && (
                    <TouchableOpacity
                      style={styles.unlockButton}
                      onPress={handleUpgradePress}
                    >
                      <Crown size={16} color={Colors.gold} />
                      <Text style={styles.unlockButtonText}>Upgrade to Premium</Text>
                    </TouchableOpacity>
                  )}
                </LinearGradient>
              </View>
            );
          })}
        </View>

        {/* Premium Upgrade CTA */}
        {!user.isPremium && (
          <View style={styles.upgradeContainer}>
            <LinearGradient
              colors={[Colors.gold + '30', Colors.gold + '20']}
              style={styles.upgradeCard}
            >
              <Crown size={40} color={Colors.gold} />
              <Text style={styles.upgradeTitle}>Unlock Unlimited AI Insights</Text>
              <Text style={styles.upgradeSubtitle}>
                Get 50 daily AI boosts, advanced analytics, and personalized coaching recommendations
              </Text>
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={handleUpgradePress}
              >
                <LinearGradient
                  colors={[Colors.gold, '#B8860B']}
                  style={styles.upgradeButtonGradient}
                >
                  <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  boostContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  boostCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  boostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  boostTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  boostCount: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.gold,
    marginBottom: 4,
  },
  boostSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  generateButton: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
  },
  generateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  generateButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  insightsContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 20,
  },
  insightCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  lockedCard: {
    opacity: 0.8,
  },
  insightGradient: {
    padding: 20,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insightIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightTitleContainer: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  insightContent: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  lockedText: {
    color: Colors.textSecondary,
  },
  unlockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  unlockButtonText: {
    color: Colors.gold,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  upgradeContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  upgradeCard: {
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gold + '40',
  },
  upgradeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 16,
    textAlign: 'center',
  },
  upgradeSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  upgradeButton: {
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  upgradeButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  upgradeButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
});