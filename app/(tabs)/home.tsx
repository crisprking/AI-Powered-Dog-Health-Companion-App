import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Sparkles, TrendingUp, Target, Crown, Zap, X, Share2 } from 'lucide-react-native';
import { useSoluna } from '@/hooks/useSolunaStore';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { getTimeOfDay, getGreeting, getWisdomQuote } from '@/utils/time';
import { QuickShare } from '@/components/ShareModal';
import type { ShareStats } from '@/utils/sharing';


const { width } = Dimensions.get('window');

interface ProgressRingProps {
  progress: number;
  size: number;
  strokeWidth: number;
  color: string;
  label: string;
  value: string;
}

const ProgressRing: React.FC<ProgressRingProps> = React.memo(({ progress, size, strokeWidth, color, label, value }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={[styles.progressRing, { width: size, height: size }]}>
      <View style={styles.progressRingInner}>
        <Text style={styles.progressValue}>{value}</Text>
        <Text style={styles.progressLabel}>{label}</Text>
      </View>
    </View>
  );
});

interface HabitCardProps {
  habit: any;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = React.memo(({ habit, onToggle, onDelete }) => {
  const { user } = useSoluna();
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleLongPress = useCallback(() => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(habit.id) },
      ]
    );
  }, [habit.id, habit.title, onDelete]);

  const handleToggle = useCallback(() => {
    onToggle(habit.id);
  }, [habit.id, onToggle]);

  const handleShareStreak = useCallback(() => {
    if (habit.streak >= 3) {
      setShowShareOptions(true);
    } else {
      Alert.alert(
        'Keep Going!',
        'Build a streak of 3+ days to share your progress and inspire others!',
        [{ text: 'Got it!', style: 'default' }]
      );
    }
  }, [habit.streak]);

  return (
    <TouchableOpacity
      style={[styles.habitCard, habit.isCompleted && styles.habitCardCompleted]}
      onPress={handleToggle}
      onLongPress={handleLongPress}
      activeOpacity={0.8}
    >
      <View style={styles.habitCardContent}>
        <View style={styles.habitInfo}>
          <Text style={styles.habitEmoji}>{habit.emoji}</Text>
          <View style={styles.habitDetails}>
            <Text style={[styles.habitTitle, habit.isCompleted && styles.habitTitleCompleted]}>
              {habit.title}
            </Text>
            <View style={styles.habitStreakContainer}>
              <Text style={styles.habitStreak}>
                {habit.streak > 0 ? `🔥 ${habit.streak} day streak` : 'Start your streak!'}
              </Text>
              {habit.streak >= 3 && (
                <TouchableOpacity
                  style={styles.shareStreakButton}
                  onPress={handleShareStreak}
                  activeOpacity={0.7}
                >
                  <Share2 size={14} color={colors.accent} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <View style={[styles.habitCheckbox, habit.isCompleted && styles.habitCheckboxCompleted]}>
          {habit.isCompleted && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </View>
      

    </TouchableOpacity>
  );
});

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (title: string, emoji: string, category: string) => Promise<boolean>;
}

const AddHabitModal: React.FC<AddHabitModalProps> = React.memo(({ visible, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🎯');
  const [selectedCategory, setSelectedCategory] = useState('Health');
  const [isLoading, setIsLoading] = useState(false);

  const emojiOptions = ['🎯', '💪', '📚', '🧘', '🏃', '💧', '🥗', '😴', '✍️', '🎨'];
  const categoryOptions = ['Health', 'Fitness', 'Learning', 'Productivity', 'Mindfulness', 'Creativity'];

  const handleAdd = async () => {
    if (!title.trim()) return;
    
    setIsLoading(true);
    const success = await onAdd(title.trim(), selectedEmoji, selectedCategory);
    setIsLoading(false);
    
    if (success) {
      setTitle('');
      setSelectedEmoji('🎯');
      setSelectedCategory('Health');
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Create New Habit</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Habit Name</Text>
          <TextInput
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter habit name..."
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Choose Emoji</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiScroll}>
            {emojiOptions.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={[styles.emojiOption, selectedEmoji === emoji && styles.emojiOptionSelected]}
                onPress={() => setSelectedEmoji(emoji)}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categoryOptions.map((category) => (
              <TouchableOpacity
                key={category}
                style={[styles.categoryOption, selectedCategory === category && styles.categoryOptionSelected]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextSelected]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.modalButtonSecondary} onPress={onClose}>
            <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modalButtonPrimary, (!title.trim() || isLoading) && styles.modalButtonDisabled]} 
            onPress={handleAdd}
            disabled={!title.trim() || isLoading}
          >
            <Text style={styles.modalButtonPrimaryText}>
              {isLoading ? 'Creating...' : 'Create Habit'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

export default function HomeScreen() {
  const {
    user,
    habits,
    dailyAIBoosts,
    isLoading,
    error,
    addHabit,
    toggleHabit,
    deleteHabit,
    canAddHabit,
    useAIBoost,
    clearError,
  } = useSoluna();

  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const timeOfDay = getTimeOfDay();
  const greeting = getGreeting(timeOfDay);
  const wisdomQuote = getWisdomQuote(timeOfDay);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const completedToday = habits.filter(h => h.completedDates?.includes(today)).length;
    const totalHabits = habits.length;
    const weeklyProgress = Math.round((completedToday / Math.max(totalHabits, 1)) * 100);
    const monthlyProgress = Math.round((habits.reduce((sum, h) => sum + (h.completedDates?.length || 0), 0) / Math.max(totalHabits * 30, 1)) * 100);
    
    return {
      today: { value: `${completedToday}/${totalHabits}`, progress: weeklyProgress },
      weekly: { value: `${weeklyProgress}%`, progress: weeklyProgress },
      monthly: { value: `${monthlyProgress}%`, progress: monthlyProgress },
    };
  }, [habits]);

  const handleAIBoost = useCallback(async () => {
    const success = await useAIBoost();
    if (success) {
      router.push('/(tabs)/insights');
    }
  }, [useAIBoost]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const handleAddHabit = useCallback(async (title: string, emoji: string, category: string) => {
    const success = await addHabit(title, emoji, category);
    if (!success) {
      Alert.alert(
        'Upgrade Required',
        'Free users can only have 6 habits. Upgrade to Premium for unlimited habits!',
        [
          { text: 'Maybe Later', style: 'cancel' },
          { text: 'Upgrade Now', onPress: () => router.push('/premium') },
        ]
      );
    }
    return success;
  }, [addHabit]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your habits...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.userName}>{user.name}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/(tabs)/profile')}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Progress Overview */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.sectionTitle}>Today's Progress</Text>
            <QuickShare
              type="progress"
              data={{
                completedToday: stats.today.progress === 100 ? habits.length : Math.floor((stats.today.progress / 100) * habits.length),
                totalHabits: habits.length,
                longestStreak: Math.max(...habits.map(h => h.streak), 0),
                successRate: stats.today.progress,
              } as ShareStats}
              userName={user.name}
              isPremium={user.isPremium}
            />
          </View>
          <View style={styles.progressContainer}>
            <ProgressRing
              progress={stats.today.progress}
              size={80}
              strokeWidth={6}
              color={colors.primary}
              label="Today"
              value={stats.today.value}
            />
            <ProgressRing
              progress={stats.weekly.progress}
              size={80}
              strokeWidth={6}
              color={colors.accent}
              label="Weekly"
              value={stats.weekly.value}
            />
            <ProgressRing
              progress={stats.monthly.progress}
              size={80}
              strokeWidth={6}
              color={colors.success}
              label="Monthly"
              value={stats.monthly.value}
            />
          </View>
        </View>

        {/* Wisdom Quote */}
        <LinearGradient
          colors={[colors.accent + '20', colors.primary + '20']}
          style={styles.wisdomCard}
        >
          <Text style={styles.wisdomText}>"{wisdomQuote.text}"</Text>
          <Text style={styles.wisdomAuthor}>— {wisdomQuote.author}</Text>
        </LinearGradient>

        {/* Habits Section */}
        <View style={styles.habitsSection}>
          <View style={styles.habitsSectionHeader}>
            <Text style={styles.sectionTitle}>Today's Habits</Text>
            {canAddHabit() && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddModal(true)}
              >
                <Plus size={20} color={colors.background} />
              </TouchableOpacity>
            )}
          </View>

          {habits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>🌱</Text>
              <Text style={styles.emptyStateTitle}>Start Your Journey</Text>
              <Text style={styles.emptyStateText}>
                Create your first habit and begin transforming your life, one day at a time.
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => setShowAddModal(true)}
              >
                <Text style={styles.emptyStateButtonText}>Create First Habit</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.habitsList}>
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={toggleHabit}
                  onDelete={deleteHabit}
                />
              ))}
              
              {!canAddHabit() && (
                <TouchableOpacity
                  style={styles.upgradePrompt}
                  onPress={() => router.push('/premium')}
                >
                  <Text style={styles.upgradePromptText}>
                    Want more habits? Upgrade to Premium for unlimited habits!
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* AI Boost Section */}
        <View style={styles.aiSection}>
          <TouchableOpacity
            style={[styles.aiBoostButton, dailyAIBoosts === 0 && styles.aiBoostButtonDisabled]}
            onPress={handleAIBoost}
            disabled={dailyAIBoosts === 0}
          >
            <LinearGradient
              colors={dailyAIBoosts > 0 ? [colors.accent, colors.primary] : [colors.textSecondary, colors.textSecondary]}
              style={styles.aiBoostGradient}
            >
              <Sparkles size={24} color={colors.background} />
              <Text style={styles.aiBoostText}>
                AI Boost ({dailyAIBoosts} left)
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push('/(tabs)/analytics')}
          >
            <TrendingUp size={20} color={colors.accent} />
            <Text style={styles.quickActionText}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push('/(tabs)/insights')}
          >
            <Target size={20} color={colors.accent} />
            <Text style={styles.quickActionText}>Insights</Text>
          </TouchableOpacity>
          <View style={styles.quickActionButton}>
            <QuickShare
              type="recommendation"
              userName={user.name}
              isPremium={user.isPremium}
              style={styles.recommendShareButton}
            />
          </View>
        </View>

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={clearError}>
              <Text style={styles.errorDismiss}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <AddHabitModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddHabit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    color: colors.text,
    fontWeight: '900',
    letterSpacing: -1,
  },
  profileButton: {
    padding: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    color: colors.background,
    fontWeight: '700',
  },
  progressSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    color: colors.text,
    fontWeight: '700',
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  progressRing: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRingInner: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '700',
  },
  progressLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  wisdomCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
  },
  wisdomText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 8,
  },
  wisdomAuthor: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  habitsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  habitsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitsList: {
    gap: 12,
  },
  habitCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  habitCardCompleted: {
    borderColor: colors.success,
    backgroundColor: colors.success + '10',
  },
  habitCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  habitDetails: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  habitTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  habitStreakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habitStreak: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  shareStreakButton: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: colors.accent + '20',
  },
  habitCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitCheckboxCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkmark: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    color: colors.text,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  upgradePrompt: {
    backgroundColor: colors.accent + '20',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  upgradePromptText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  aiSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  aiBoostButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  aiBoostButtonDisabled: {
    opacity: 0.5,
  },
  aiBoostGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  aiBoostText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  quickActionText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  recommendShareButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorContainer: {
    backgroundColor: colors.error + '20',
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  errorDismiss: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    width: width - 48,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    color: colors.text,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.textSecondary + '30',
  },
  emojiScroll: {
    flexDirection: 'row',
  },
  emojiOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: colors.background,
  },
  emojiOptionSelected: {
    backgroundColor: colors.accent,
  },
  emojiText: {
    fontSize: 24,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.textSecondary + '30',
  },
  categoryOptionSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: colors.background,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButtonSecondary: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonSecondaryText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonPrimary: {
    flex: 1,
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonPrimaryText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonDisabled: {
    opacity: 0.5,
  },
});