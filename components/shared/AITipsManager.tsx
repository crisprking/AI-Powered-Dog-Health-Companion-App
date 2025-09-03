import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Share, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Heart, Share2, Bookmark, MessageCircle, TrendingUp, DollarSign, Crown, X, Copy, Check } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useHasPremiumAccess } from '@/contexts/SubscriptionContext';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { typography, spacing, borderRadius } from '@/constants/colors';

type ContentPart = { type: 'text'; text: string } | { type: 'image'; image: string };
type CoreMessage = { role: 'system' | 'user' | 'assistant'; content: string | ContentPart[] };

interface AITipsManagerProps {
  visible: boolean;
  onClose: () => void;
  initialAdvice: string;
  calculatorType: 'mortgage' | 'car-loan';
  calculationData: any;
  testID?: string;
}

interface SavedTip {
  id: string;
  advice: string;
  timestamp: number;
  calculatorType: string;
  liked: boolean;
}

export default function AITipsManager({
  visible,
  onClose,
  initialAdvice,
  calculatorType,
  calculationData,
  testID
}: AITipsManagerProps) {
  const { colors: themeColors } = useTheme();
  const hasPremiumAccess = useHasPremiumAccess();
  const [currentAdvice, setCurrentAdvice] = useState<string>(initialAdvice);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [conversationHistory, setConversationHistory] = useState<CoreMessage[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [tipUsageCount, setTipUsageCount] = useState<number>(0);

  const handleLike = useCallback(() => {
    setIsLiked(!isLiked);
    // Track engagement for monetization
    console.log('AI tip liked - engagement metric');
  }, [isLiked]);

  const handleSave = useCallback(async () => {
    if (!hasPremiumAccess && tipUsageCount >= 2) {
      Alert.alert(
        'FinSage Pro Required',
        'Save unlimited AI tips with FinSage Pro. Upgrade now to unlock advanced financial insights and build your personal finance knowledge base.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade Now', onPress: () => router.push('/paywall') },
        ]
      );
      return;
    }

    setIsSaved(!isSaved);
    setTipUsageCount(prev => prev + 1);
    
    // Here you would save to AsyncStorage or backend
    const savedTip: SavedTip = {
      id: Date.now().toString(),
      advice: currentAdvice,
      timestamp: Date.now(),
      calculatorType,
      liked: isLiked
    };
    
    console.log('Saving tip:', savedTip);
    Alert.alert('Success', 'AI tip saved to your personal finance library!');
  }, [currentAdvice, calculatorType, isLiked, hasPremiumAccess, tipUsageCount, isSaved]);

  const handleShare = useCallback(async () => {
    try {
      const shareContent = `💡 FinSage Pro AI Insight:\n\n${currentAdvice}\n\n📊 Get personalized financial advice with FinSage Pro!\n\n#FinSagePro #FinancialPlanning #SmartMoney`;
      
      await Share.share({
        message: shareContent,
        title: 'FinSage Pro AI Financial Tip'
      });
      
      // Track sharing for viral growth
      console.log('AI tip shared - viral metric');
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, [currentAdvice]);

  const handleCopy = useCallback(async () => {
    await Clipboard.setStringAsync(currentAdvice);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [currentAdvice]);

  const askFollowUp = useCallback(async (question: string) => {
    if (!hasPremiumAccess && tipUsageCount >= 1) {
      Alert.alert(
        'FinSage Pro Required',
        'Ask unlimited follow-up questions with FinSage Pro. Get deeper insights and personalized financial strategies.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade Now', onPress: () => router.push('/paywall') },
        ]
      );
      return;
    }

    try {
      setIsLoading(true);
      setTipUsageCount(prev => prev + 1);
      
      const messages: CoreMessage[] = [
        { role: 'system', content: 'You are a helpful, concise financial assistant. Provide practical, risk-aware advice.' },
        { role: 'user', content: `Previous advice: ${currentAdvice}\n\nFollow-up question: ${question}\n\nCalculator data: ${JSON.stringify(calculationData)}` }
      ];
      
      const res = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
      
      if (!res.ok) throw new Error(`AI request failed: ${res.status}`);
      const json = await res.json();
      const text = (json?.completion as string) ?? '';
      
      setCurrentAdvice(text);
      setConversationHistory(prev => [...prev, ...messages, { role: 'assistant', content: text }]);
    } catch (error: any) {
      Alert.alert('Error', 'Unable to get follow-up advice. Please try again.');
      console.error('Follow-up AI error:', error?.message ?? error);
    } finally {
      setIsLoading(false);
    }
  }, [currentAdvice, calculationData, hasPremiumAccess, tipUsageCount]);

  const quickQuestions = [
    'How can I save more money?',
    'What are the risks?',
    'Any tax implications?',
    'Better alternatives?'
  ];

  if (!visible) return null;

  return (
    <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.8)' }]}>
      <View style={[styles.container, { backgroundColor: themeColors.surface.primary }]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.aiIcon, { backgroundColor: 'rgba(0, 230, 122, 0.1)' }]}>
                <Sparkles size={20} color="#00E67A" />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: themeColors.text.primary }]}>AI Financial Advisor</Text>
                <Text style={[styles.headerSubtitle, { color: themeColors.text.secondary }]}>Personalized insights</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={themeColors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* AI Advice Card */}
          <View style={[styles.adviceCard, { backgroundColor: themeColors.surface.secondary }]}>
            <LinearGradient
              colors={['rgba(0, 230, 122, 0.05)', 'rgba(0, 230, 122, 0.02)']}
              style={styles.adviceGradient}
            >
              <Text style={[styles.adviceText, { color: themeColors.text.primary }]}>
                {currentAdvice}
              </Text>
            </LinearGradient>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity 
              onPress={handleLike} 
              style={[styles.actionButton, isLiked && styles.actionButtonActive]}
            >
              <Heart size={18} color={isLiked ? '#FF6B6B' : themeColors.text.tertiary} fill={isLiked ? '#FF6B6B' : 'none'} />
              <Text style={[styles.actionText, { color: isLiked ? '#FF6B6B' : themeColors.text.tertiary }]}>Like</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleSave} style={[styles.actionButton, isSaved && styles.actionButtonActive]}>
              <Bookmark size={18} color={isSaved ? '#F59E0B' : themeColors.text.tertiary} fill={isSaved ? '#F59E0B' : 'none'} />
              <Text style={[styles.actionText, { color: isSaved ? '#F59E0B' : themeColors.text.tertiary }]}>Save</Text>
              {!hasPremiumAccess && tipUsageCount >= 2 && (
                <Crown size={12} color="#F59E0B" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <Share2 size={18} color={themeColors.text.tertiary} />
              <Text style={[styles.actionText, { color: themeColors.text.tertiary }]}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleCopy} style={styles.actionButton}>
              {copied ? (
                <Check size={18} color="#10B981" />
              ) : (
                <Copy size={18} color={themeColors.text.tertiary} />
              )}
              <Text style={[styles.actionText, { color: copied ? '#10B981' : themeColors.text.tertiary }]}>
                {copied ? 'Copied' : 'Copy'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Follow-up Questions */}
          <View style={styles.quickQuestionsSection}>
            <Text style={[styles.sectionTitle, { color: themeColors.text.primary }]}>Ask Follow-up Questions</Text>
            <View style={styles.quickQuestions}>
              {quickQuestions.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => askFollowUp(question)}
                  style={[styles.quickQuestionButton, { backgroundColor: themeColors.surface.tertiary }]}
                  disabled={isLoading}
                >
                  <MessageCircle size={14} color="#00E67A" />
                  <Text style={[styles.quickQuestionText, { color: themeColors.text.secondary }]}>{question}</Text>
                  {!hasPremiumAccess && tipUsageCount >= 1 && (
                    <Crown size={10} color="#F59E0B" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Premium Upsell */}
          {!hasPremiumAccess && (
            <View style={styles.premiumUpsell}>
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                style={styles.premiumGradient}
              >
                <Crown size={24} color="#FFFFFF" />
                <View style={styles.premiumContent}>
                  <Text style={styles.premiumTitle}>Unlock Unlimited AI Insights</Text>
                  <Text style={styles.premiumSubtitle}>
                    • Unlimited follow-up questions{'\n'}• Save all AI tips{'\n'}• Advanced financial strategies{'\n'}• Priority AI responses
                  </Text>
                  <TouchableOpacity
                    style={styles.premiumButton}
                    onPress={() => {
                      onClose();
                      router.push('/paywall');
                    }}
                  >
                    <Text style={styles.premiumButtonText}>Upgrade to Pro</Text>
                    <TrendingUp size={16} color="#000" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          )}

          {/* Usage Counter for Free Users */}
          {!hasPremiumAccess && (
            <View style={[styles.usageCounter, { backgroundColor: themeColors.surface.tertiary }]}>
              <DollarSign size={16} color={themeColors.text.tertiary} />
              <Text style={[styles.usageText, { color: themeColors.text.tertiary }]}>
                {tipUsageCount}/3 free AI interactions used
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Loading Overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#00E67A" />
            <Text style={[styles.loadingText, { color: themeColors.text.primary }]}>Getting AI insights...</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: borderRadius['2xl'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 230, 122, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    lineHeight: typography.size.lg * typography.lineHeight.tight,
  },
  headerSubtitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    opacity: 0.7,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adviceCard: {
    margin: spacing[5],
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  adviceGradient: {
    padding: spacing[5],
  },
  adviceText: {
    fontSize: typography.size.base,
    lineHeight: typography.size.base * typography.lineHeight.relaxed,
    fontWeight: typography.weight.medium,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing[5],
    marginBottom: spacing[5],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  actionButtonActive: {
    backgroundColor: 'rgba(0, 230, 122, 0.1)',
  },
  actionText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  quickQuestionsSection: {
    paddingHorizontal: spacing[5],
    marginBottom: spacing[5],
  },
  sectionTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing[3],
  },
  quickQuestions: {
    gap: spacing[2],
  },
  quickQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    padding: spacing[3],
    borderRadius: borderRadius.lg,
  },
  quickQuestionText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    flex: 1,
  },
  premiumUpsell: {
    margin: spacing[5],
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  premiumGradient: {
    padding: spacing[5],
    alignItems: 'center',
  },
  premiumContent: {
    alignItems: 'center',
    marginTop: spacing[3],
  },
  premiumTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: '#FFFFFF',
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  premiumSubtitle: {
    fontSize: typography.size.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: spacing[4],
    lineHeight: typography.size.sm * typography.lineHeight.relaxed,
  },
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: '#FFFFFF',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    borderRadius: borderRadius.lg,
  },
  premiumButtonText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: '#000000',
  },
  usageCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    margin: spacing[5],
    padding: spacing[3],
    borderRadius: borderRadius.lg,
  },
  usageText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    borderRadius: borderRadius['2xl'],
  },
  loadingText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
  },
});