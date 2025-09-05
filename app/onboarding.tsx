import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import {
  ChevronRight,
  Target,
  Crown,
  Zap,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Baby,
  Home,
} from 'lucide-react-native';
import { useSoluna } from '@/hooks/useSolunaStore';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  component: React.ComponentType<any>;
}

const LIFESTYLE_OPTIONS = [
  { id: 'professional', label: 'Professional', icon: Briefcase, description: 'Corporate career focused' },
  { id: 'entrepreneur', label: 'Entrepreneur', icon: TrendingUp, description: 'Building my own business' },
  { id: 'student', label: 'Student', icon: GraduationCap, description: 'Learning and growing' },
  { id: 'parent', label: 'Parent', icon: Baby, description: 'Raising a family' },
  { id: 'retiree', label: 'Retiree', icon: Home, description: 'Enjoying life after work' },
];

const INCOME_OPTIONS = [
  { id: 'under50k', label: 'Under $50K', premium: false },
  { id: '50k-100k', label: '$50K - $100K', premium: true },
  { id: '100k-200k', label: '$100K - $200K', premium: true },
  { id: 'over200k', label: 'Over $200K', premium: true },
];

const GOAL_OPTIONS = [
  { id: 'health', label: 'Better Health', emoji: '💪', description: 'Fitness, nutrition, wellness' },
  { id: 'productivity', label: 'Peak Performance', emoji: '🚀', description: 'Work efficiency, focus' },
  { id: 'learning', label: 'Continuous Learning', emoji: '🧠', description: 'Skills, knowledge, growth' },
  { id: 'relationships', label: 'Stronger Relationships', emoji: '❤️', description: 'Family, friends, networking' },
  { id: 'wealth', label: 'Financial Freedom', emoji: '💰', description: 'Income, investments, savings' },
  { id: 'creativity', label: 'Creative Expression', emoji: '🎨', description: 'Art, music, writing' },
];

const MOTIVATION_OPTIONS = [
  { id: 'achievement', label: 'Achievement', emoji: '🏆' },
  { id: 'recognition', label: 'Recognition', emoji: '⭐' },
  { id: 'growth', label: 'Personal Growth', emoji: '🌱' },
  { id: 'freedom', label: 'Freedom', emoji: '🦅' },
  { id: 'impact', label: 'Making Impact', emoji: '🌍' },
  { id: 'security', label: 'Security', emoji: '🛡️' },
];

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <View style={styles.stepContainer}>
      <LinearGradient
        colors={[Colors.gold, '#B8860B']}
        style={styles.heroGradient}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>☀️🌙</Text>
          <Text style={styles.brandName}>SOLUNA</Text>
        </View>
        <Text style={styles.heroTitle}>Transform Your Life</Text>
        <Text style={styles.heroSubtitle}>
          Join 50,000+ high achievers who use SOLUNA to build elite habits
        </Text>
      </LinearGradient>
      
      <View style={styles.benefitsContainer}>
        <View style={styles.benefitItem}>
          <Target size={24} color={Colors.gold} />
          <Text style={styles.benefitText}>Science-backed habit formation</Text>
        </View>
        <View style={styles.benefitItem}>
          <Zap size={24} color={Colors.gold} />
          <Text style={styles.benefitText}>AI-powered personalized insights</Text>
        </View>
        <View style={styles.benefitItem}>
          <TrendingUp size={24} color={Colors.gold} />
          <Text style={styles.benefitText}>Track progress like a pro</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.primaryButton} onPress={onNext}>
        <LinearGradient
          colors={[Colors.gold, '#B8860B']}
          style={styles.buttonGradient}
        >
          <Text style={styles.primaryButtonText}>Start Your Transformation</Text>
          <ChevronRight size={20} color={Colors.background} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

function ProfileStep({ onNext, userData, setUserData }: any) {
  const [name, setName] = useState(userData.name || '');
  const [age, setAge] = useState(userData.age?.toString() || '');
  
  const handleNext = () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your name to continue.');
      return;
    }
    
    setUserData({
      ...userData,
      name: name.trim(),
      age: age ? parseInt(age) : undefined,
    });
    onNext();
  };
  
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Tell us about yourself</Text>
      <Text style={styles.stepSubtitle}>
        This helps us personalize your experience
      </Text>
      
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>What&apos;s your name? *</Text>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={Colors.textSecondary}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Age (optional)</Text>
          <TextInput
            style={styles.textInput}
            value={age}
            onChangeText={setAge}
            placeholder="25"
            placeholderTextColor={Colors.textSecondary}
            keyboardType="numeric"
            maxLength={2}
          />
        </View>
      </View>
      
      <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
        <LinearGradient
          colors={[Colors.gold, '#B8860B']}
          style={styles.buttonGradient}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
          <ChevronRight size={20} color={Colors.background} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

function LifestyleStep({ onNext, userData, setUserData }: any) {
  const [selectedLifestyle, setSelectedLifestyle] = useState(userData.lifestyle || '');
  const [selectedIncome, setSelectedIncome] = useState(userData.income || '');
  
  const handleNext = () => {
    if (!selectedLifestyle) {
      Alert.alert('Selection Required', 'Please select your lifestyle to continue.');
      return;
    }
    
    setUserData({
      ...userData,
      lifestyle: selectedLifestyle,
      income: selectedIncome,
    });
    onNext();
  };
  
  return (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What describes you best?</Text>
      <Text style={styles.stepSubtitle}>
        This helps us tailor your habit recommendations
      </Text>
      
      <View style={styles.optionsContainer}>
        <Text style={styles.sectionLabel}>Lifestyle *</Text>
        {LIFESTYLE_OPTIONS.map((option) => {
          const IconComponent = option.icon;
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                selectedLifestyle === option.id && styles.selectedOption,
              ]}
              onPress={() => setSelectedLifestyle(option.id)}
            >
              <IconComponent
                size={24}
                color={selectedLifestyle === option.id ? Colors.gold : Colors.textSecondary}
              />
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionTitle,
                  selectedLifestyle === option.id && styles.selectedOptionText,
                ]}>
                  {option.label}
                </Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
        
        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Income Range (optional)</Text>
        <Text style={styles.sectionNote}>Helps us show relevant premium features</Text>
        {INCOME_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionCard,
              selectedIncome === option.id && styles.selectedOption,
            ]}
            onPress={() => setSelectedIncome(option.id)}
          >
            <View style={styles.optionContent}>
              <Text style={[
                styles.optionTitle,
                selectedIncome === option.id && styles.selectedOptionText,
              ]}>
                {option.label}
              </Text>
              {option.premium && (
                <View style={styles.premiumBadge}>
                  <Crown size={12} color={Colors.gold} />
                  <Text style={styles.premiumText}>Premium Recommended</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
        <LinearGradient
          colors={[Colors.gold, '#B8860B']}
          style={styles.buttonGradient}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
          <ChevronRight size={20} color={Colors.background} />
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

function GoalsStep({ onNext, userData, setUserData }: any) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(userData.goals || []);
  const [selectedMotivations, setSelectedMotivations] = useState<string[]>(userData.motivations || []);
  
  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };
  
  const toggleMotivation = (motivationId: string) => {
    setSelectedMotivations(prev => 
      prev.includes(motivationId) 
        ? prev.filter(id => id !== motivationId)
        : [...prev, motivationId]
    );
  };
  
  const handleNext = () => {
    if (selectedGoals.length === 0) {
      Alert.alert('Goals Required', 'Please select at least one goal to continue.');
      return;
    }
    
    setUserData({
      ...userData,
      goals: selectedGoals,
      motivations: selectedMotivations,
    });
    onNext();
  };
  
  return (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What are your goals?</Text>
      <Text style={styles.stepSubtitle}>
        Select what matters most to you (choose multiple)
      </Text>
      
      <View style={styles.optionsContainer}>
        <Text style={styles.sectionLabel}>Primary Goals *</Text>
        <View style={styles.gridContainer}>
          {GOAL_OPTIONS.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.goalCard,
                selectedGoals.includes(goal.id) && styles.selectedGoalCard,
              ]}
              onPress={() => toggleGoal(goal.id)}
            >
              <Text style={styles.goalEmoji}>{goal.emoji}</Text>
              <Text style={[
                styles.goalTitle,
                selectedGoals.includes(goal.id) && styles.selectedGoalText,
              ]}>
                {goal.label}
              </Text>
              <Text style={styles.goalDescription}>{goal.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>What motivates you? (optional)</Text>
        <View style={styles.motivationContainer}>
          {MOTIVATION_OPTIONS.map((motivation) => (
            <TouchableOpacity
              key={motivation.id}
              style={[
                styles.motivationChip,
                selectedMotivations.includes(motivation.id) && styles.selectedMotivationChip,
              ]}
              onPress={() => toggleMotivation(motivation.id)}
            >
              <Text style={styles.motivationEmoji}>{motivation.emoji}</Text>
              <Text style={[
                styles.motivationText,
                selectedMotivations.includes(motivation.id) && styles.selectedMotivationText,
              ]}>
                {motivation.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
        <LinearGradient
          colors={[Colors.gold, '#B8860B']}
          style={styles.buttonGradient}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
          <ChevronRight size={20} color={Colors.background} />
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

function PremiumStep({ onNext, userData }: any) {
  const handleStartFree = () => {
    onNext();
  };
  
  const handleUpgradePremium = () => {
    router.push('/premium');
  };
  
  // Show premium offer based on user profile
  const showPremiumOffer = userData.income && userData.income !== 'under50k';
  const discount = showPremiumOffer ? '50%' : '30%';
  
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Ready to transform?</Text>
      <Text style={styles.stepSubtitle}>
        Choose how you want to start your journey
      </Text>
      
      {showPremiumOffer && (
        <View style={styles.premiumOfferCard}>
          <LinearGradient
            colors={[Colors.gold, '#B8860B']}
            style={styles.premiumOfferGradient}
          >
            <Crown size={32} color={Colors.background} />
            <Text style={styles.premiumOfferTitle}>Special Launch Offer</Text>
            <Text style={styles.premiumOfferDiscount}>{discount} OFF Premium</Text>
            <Text style={styles.premiumOfferSubtitle}>
              Perfect for {userData.lifestyle}s like you
            </Text>
          </LinearGradient>
          
          <TouchableOpacity style={styles.premiumButton} onPress={handleUpgradePremium}>
            <LinearGradient
              colors={[Colors.gold, '#B8860B']}
              style={styles.buttonGradient}
            >
              <Crown size={20} color={Colors.background} />
              <Text style={styles.primaryButtonText}>Start Premium Journey</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.freeOptionCard}>
        <Text style={styles.freeOptionTitle}>Start Free</Text>
        <Text style={styles.freeOptionSubtitle}>
          • 6 habits to get you started{"\n"}
          • 3 daily AI insights{"\n"}
          • Basic progress tracking{"\n"}
          • Upgrade anytime
        </Text>
        
        <TouchableOpacity style={styles.freeButton} onPress={handleStartFree}>
          <Text style={styles.freeButtonText}>Continue with Free</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.disclaimer}>
        You can always upgrade later. No commitment required.
      </Text>
    </View>
  );
}

export default function OnboardingScreen() {
  const { user, saveUser } = useSoluna();
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    name: user.name,
    age: user.age,
    lifestyle: user.lifestyle,
    income: user.income,
    goals: user.goals || [],
    motivations: user.motivations || [],
  });
  
  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome',
      subtitle: 'Transform your life with SOLUNA',
      component: WelcomeStep,
    },
    {
      id: 'profile',
      title: 'Profile',
      subtitle: 'Tell us about yourself',
      component: ProfileStep,
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle',
      subtitle: 'What describes you best?',
      component: LifestyleStep,
    },
    {
      id: 'goals',
      title: 'Goals',
      subtitle: 'What are your aspirations?',
      component: GoalsStep,
    },
    {
      id: 'premium',
      title: 'Get Started',
      subtitle: 'Choose your plan',
      component: PremiumStep,
    },
  ];
  
  const completeOnboarding = useCallback(async () => {
    try {
      const updatedUser = {
        ...user,
        ...userData,
        hasCompletedOnboarding: true,
        lastActiveAt: new Date(),
      };
      
      await saveUser(updatedUser);
      router.replace('/home');
    } catch {
      Alert.alert('Error', 'Failed to complete onboarding. Please try again.');
    }
  }, [user, userData, saveUser]);
  
  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  }, [currentStep, steps.length, completeOnboarding]);
  
  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={[Colors.gold, '#B8860B']}
            style={[styles.progressFill, { width: `${progress}%` }]}
          />
        </View>
        <Text style={styles.progressText}>
          {currentStep + 1} of {steps.length}
        </Text>
      </View>
      
      <CurrentStepComponent
        onNext={handleNext}
        userData={userData}
        setUserData={setUserData}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.cardBackground,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroGradient: {
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 48,
    marginBottom: 8,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.background,
    letterSpacing: -1,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.background,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: Colors.background,
    textAlign: 'center',
    opacity: 0.9,
  },
  benefitsContainer: {
    marginBottom: 32,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
    fontWeight: '500',
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  formContainer: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionsContainer: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  sectionNote: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: Colors.gold,
    backgroundColor: Colors.gold + '10',
  },
  optionContent: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  selectedOptionText: {
    color: Colors.gold,
  },
  optionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  premiumText: {
    fontSize: 12,
    color: Colors.gold,
    marginLeft: 4,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  goalCard: {
    width: (width - 52) / 2,
    backgroundColor: Colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedGoalCard: {
    borderColor: Colors.gold,
    backgroundColor: Colors.gold + '10',
  },
  goalEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  selectedGoalText: {
    color: Colors.gold,
  },
  goalDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  motivationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  motivationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedMotivationChip: {
    borderColor: Colors.gold,
    backgroundColor: Colors.gold + '10',
  },
  motivationEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  motivationText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  selectedMotivationText: {
    color: Colors.gold,
  },
  premiumOfferCard: {
    marginBottom: 24,
  },
  premiumOfferGradient: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  premiumOfferTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.background,
    marginTop: 8,
  },
  premiumOfferDiscount: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.background,
    marginTop: 4,
  },
  premiumOfferSubtitle: {
    fontSize: 14,
    color: Colors.background,
    opacity: 0.9,
    marginTop: 4,
  },
  premiumButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  freeOptionCard: {
    backgroundColor: Colors.cardBackground,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  freeOptionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  freeOptionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  freeButton: {
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.gold,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  freeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gold,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.background,
    marginRight: 8,
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
});