import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import type { User, Habit } from '@/types';


const STORAGE_KEYS = {
  USER: 'soluna_user_v3',
  HABITS: 'soluna_habits_v3',
  AI_BOOSTS: 'soluna_ai_boosts_v3',
  LAST_RESET: 'soluna_last_reset_v3'
} as const;

const DEFAULT_USER: User = {
  id: '1',
  name: 'User',
  email: 'user@example.com',
  isPremium: false,
  avatar: undefined,
  createdAt: new Date(),
  subscriptionId: undefined,
  customerId: undefined,
  joinedAt: new Date().toDateString(),
  dailyAiBoosts: 3,
  lastAiBoostReset: new Date().toDateString(),
  hasCompletedOnboarding: false,
  totalSpent: 0,
  lifetimeValue: 0,
  churnRisk: 'low',
  lastActiveAt: new Date(),
  streakRecord: 0,
  achievementCount: 0,
};

const HABIT_LIMIT_FREE = 6;
const DAILY_AI_BOOSTS_FREE = 3;
const DAILY_AI_BOOSTS_PREMIUM = 50;

// Smart emoji detection for habits
const getHabitEmoji = (title: string): string => {
  const titleLower = title.toLowerCase();
  
  // Fitness & Health
  if (titleLower.includes('gym') || titleLower.includes('workout') || titleLower.includes('exercise')) return '💪';
  if (titleLower.includes('run') || titleLower.includes('jog')) return '🏃';
  if (titleLower.includes('walk') || titleLower.includes('dog')) return '🚶';
  if (titleLower.includes('yoga') || titleLower.includes('stretch')) return '🧘';
  if (titleLower.includes('water') || titleLower.includes('hydrat')) return '💧';
  if (titleLower.includes('sleep') || titleLower.includes('bed')) return '😴';
  if (titleLower.includes('eat') || titleLower.includes('meal') || titleLower.includes('nutrition')) return '🥗';
  
  // Learning & Productivity
  if (titleLower.includes('read') || titleLower.includes('book')) return '📚';
  if (titleLower.includes('write') || titleLower.includes('journal')) return '✍️';
  if (titleLower.includes('meditat')) return '🧘‍♀️';
  if (titleLower.includes('learn') || titleLower.includes('study')) return '🎓';
  if (titleLower.includes('code') || titleLower.includes('program')) return '💻';
  
  // Creative & Personal
  if (titleLower.includes('art') || titleLower.includes('draw') || titleLower.includes('paint')) return '🎨';
  if (titleLower.includes('music') || titleLower.includes('instrument')) return '🎵';
  if (titleLower.includes('clean') || titleLower.includes('organize')) return '🧹';
  if (titleLower.includes('call') || titleLower.includes('family') || titleLower.includes('friend')) return '📞';
  
  return '🎯'; // Default target emoji
};

export const [SolunaProvider, useSoluna] = createContextHook(() => {
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [dailyAIBoosts, setDailyAIBoosts] = useState<number>(DAILY_AI_BOOSTS_FREE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);





  // Optimized data initialization with batch loading
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        
        // Batch load all storage keys for better performance
        const [storedUser, storedHabits, storedBoosts, lastResetDate] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.USER),
          AsyncStorage.getItem(STORAGE_KEYS.HABITS),
          AsyncStorage.getItem(STORAGE_KEYS.AI_BOOSTS),
          AsyncStorage.getItem(STORAGE_KEYS.LAST_RESET)
        ]);
        
        // Process user data
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser({ 
            ...parsedUser, 
            createdAt: new Date(parsedUser.createdAt),
            joinedAt: parsedUser.joinedAt || new Date(parsedUser.createdAt).toDateString()
          });
        }

        // Process habits data with optimized parsing
        if (storedHabits) {
          const parsedHabits = JSON.parse(storedHabits).map((habit: any) => ({
            ...habit,
            createdAt: new Date(habit.createdAt),
          }));
          setHabits(parsedHabits);
        } else {
          // Start with empty habits for new users
          setHabits([]);
        }

        // Handle daily AI boosts reset
        const today = new Date().toDateString();
        const currentUser = storedUser ? JSON.parse(storedUser) : DEFAULT_USER;
        
        if (lastResetDate !== today) {
          const newBoosts = currentUser.isPremium ? DAILY_AI_BOOSTS_PREMIUM : DAILY_AI_BOOSTS_FREE;
          setDailyAIBoosts(newBoosts);
          // Batch write operations
          await Promise.all([
            AsyncStorage.setItem(STORAGE_KEYS.AI_BOOSTS, newBoosts.toString()),
            AsyncStorage.setItem(STORAGE_KEYS.LAST_RESET, today)
          ]);
        } else if (storedBoosts) {
          setDailyAIBoosts(parseInt(storedBoosts, 10));
        } else {
          // Set initial AI boosts for new user
          const initialBoosts = currentUser.isPremium ? DAILY_AI_BOOSTS_PREMIUM : DAILY_AI_BOOSTS_FREE;
          setDailyAIBoosts(initialBoosts);
        }
      } catch (err) {
        console.error('Failed to initialize data:', err);
        setError('Failed to load your data. Please restart the app.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);



  // Save user data
  const saveUser = useCallback(async (userData: User) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      console.error('Failed to save user:', err);
      setError('Failed to save user data.');
    }
  }, []);

  // Save habits data
  const saveHabits = useCallback(async (habitsData: Habit[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habitsData));
      setHabits(habitsData);
    } catch (err) {
      console.error('Failed to save habits:', err);
      setError('Failed to save habits.');
    }
  }, []);

  // Add new habit with smart emoji detection
  const addHabit = useCallback(async (title: string, emoji?: string, category?: string): Promise<boolean> => {
    try {
      if (!user.isPremium && habits.length >= HABIT_LIMIT_FREE) {
        return false;
      }

      const smartEmoji = emoji || getHabitEmoji(title);
      const habitCategory = category || 'Personal';

      const newHabit: Habit = {
        id: Date.now().toString(),
        title: title.trim(),
        emoji: smartEmoji,
        category: habitCategory,
        streak: 0,
        isCompleted: false,
        completedDates: [],
        createdAt: new Date(),
        bestStreak: 0,
        totalCompletions: 0,
      };

      const updatedHabits = [...habits, newHabit];
      await saveHabits(updatedHabits);
      return true;
    } catch (err) {
      console.error('Failed to add habit:', err);
      setError('Failed to add habit.');
      return false;
    }
  }, [habits, user.isPremium, saveHabits]);

  // Toggle habit completion with streak calculation
  const toggleHabit = useCallback(async (habitId: string) => {
    try {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      
      const updatedHabits = habits.map(habit => {
        if (habit.id === habitId) {
          const isCurrentlyCompleted = habit.completedDates?.includes(today) || false;
          let newCompletedDates: string[];
          let newStreak = habit.streak;
          let newTotalCompletions = habit.totalCompletions || 0;

          if (isCurrentlyCompleted) {
            // Uncomplete the habit
            newCompletedDates = habit.completedDates?.filter(date => date !== today) || [];
            // Recalculate streak
            const wasCompletedYesterday = habit.completedDates?.includes(yesterday) || false;
            newStreak = wasCompletedYesterday ? habit.streak - 1 : 0;
            newTotalCompletions = Math.max(0, newTotalCompletions - 1);
          } else {
            // Complete the habit
            newCompletedDates = [...(habit.completedDates || []), today];
            // Calculate new streak
            const wasCompletedYesterday = habit.completedDates?.includes(yesterday) || false;
            newStreak = wasCompletedYesterday ? habit.streak + 1 : 1;
            newTotalCompletions = newTotalCompletions + 1;
          }

          const newBestStreak = Math.max(habit.bestStreak || 0, newStreak);

          return {
            ...habit,
            isCompleted: !isCurrentlyCompleted,
            completedDates: newCompletedDates,
            streak: Math.max(0, newStreak),
            bestStreak: newBestStreak,
            totalCompletions: newTotalCompletions,
          };
        }
        return habit;
      });

      await saveHabits(updatedHabits);
    } catch (err) {
      console.error('Failed to toggle habit:', err);
      setError('Failed to update habit.');
    }
  }, [habits, saveHabits]);

  // Delete habit
  const deleteHabit = useCallback(async (habitId: string) => {
    try {
      const updatedHabits = habits.filter(habit => habit.id !== habitId);
      await saveHabits(updatedHabits);
    } catch (err) {
      console.error('Failed to delete habit:', err);
      setError('Failed to delete habit.');
    }
  }, [habits, saveHabits]);

  // Check if user can add more habits
  const canAddHabit = useCallback((): boolean => {
    return user.isPremium || habits.length < HABIT_LIMIT_FREE;
  }, [user.isPremium, habits.length]);

  // Get habit limit for current user
  const getHabitLimit = useCallback((): number => {
    return user.isPremium ? Infinity : HABIT_LIMIT_FREE;
  }, [user.isPremium]);

  // Use AI boost
  const useAIBoost = useCallback(async (): Promise<boolean> => {
    try {
      if (dailyAIBoosts <= 0) {
        return false;
      }

      const newBoosts = dailyAIBoosts - 1;
      setDailyAIBoosts(newBoosts);
      await AsyncStorage.setItem(STORAGE_KEYS.AI_BOOSTS, newBoosts.toString());
      return true;
    } catch (err) {
      console.error('Failed to use AI boost:', err);
      setError('Failed to use AI boost.');
      return false;
    }
  }, [dailyAIBoosts]);

  // Update user avatar
  const updateUserAvatar = useCallback(async (avatarUri: string) => {
    try {
      const updatedUser = { ...user, avatar: avatarUri };
      await saveUser(updatedUser);
    } catch (err) {
      console.error('Failed to update avatar:', err);
      setError('Failed to update profile picture.');
    }
  }, [user, saveUser]);

  // Update user name
  const updateUserName = useCallback(async (name: string) => {
    try {
      const updatedUser = { ...user, name: name.trim() };
      await saveUser(updatedUser);
    } catch (err) {
      console.error('Failed to update name:', err);
      setError('Failed to update name.');
    }
  }, [user, saveUser]);

  // Sign out user
  const signOut = useCallback(async (): Promise<boolean> => {
    try {
      // Clear all stored data
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.HABITS,
        STORAGE_KEYS.AI_BOOSTS,
        STORAGE_KEYS.LAST_RESET,
      ]);
      
      // Reset state to defaults
      setUser(DEFAULT_USER);
      setHabits([]);
      setDailyAIBoosts(DAILY_AI_BOOSTS_FREE);
      setError(null);
      
      return true;
    } catch (err) {
      console.error('Failed to sign out:', err);
      setError('Failed to sign out. Please try again.');
      return false;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Upgrade to premium
  const upgradeToPremium = useCallback(async (subscriptionId: string, customerId: string) => {
    try {
      const updatedUser = {
        ...user,
        isPremium: true,
        subscriptionId,
        customerId,
      };
      await saveUser(updatedUser);
      
      // Reset AI boosts to premium amount
      const newBoosts = DAILY_AI_BOOSTS_PREMIUM;
      setDailyAIBoosts(newBoosts);
      await AsyncStorage.setItem(STORAGE_KEYS.AI_BOOSTS, newBoosts.toString());
    } catch (err) {
      console.error('Failed to upgrade to premium:', err);
      setError('Failed to upgrade account.');
    }
  }, [user, saveUser]);

  // Reset user data
  const resetUserData = useCallback(async () => {
    try {
      // Clear all stored data
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.HABITS,
        STORAGE_KEYS.AI_BOOSTS,
        STORAGE_KEYS.LAST_RESET,
      ]);
      
      // Reset to default state
      setUser(DEFAULT_USER);
      setHabits([]);
      setDailyAIBoosts(DAILY_AI_BOOSTS_FREE);
      setError(null);
      
      return true;
    } catch (err) {
      console.error('Failed to reset user data:', err);
      setError('Failed to reset user data.');
      return false;
    }
  }, []);

  // Get analytics data
  const getAnalytics = useCallback(() => {
    const today = new Date().toDateString();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      return date.toDateString();
    }).reverse();

    const completedToday = habits.filter(h => h.completedDates?.includes(today)).length;
    const totalHabits = habits.length;
    const activeHabits = habits.filter(h => h.streak > 0).length;
    const totalCompletions = habits.reduce((sum, h) => sum + (h.totalCompletions || 0), 0);
    const averageStreak = habits.length > 0 ? habits.reduce((sum, h) => sum + h.streak, 0) / habits.length : 0;
    const successRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

    const weeklyData = last7Days.map(date => {
      const completed = habits.filter(h => h.completedDates?.includes(date)).length;
      return { date, completed, total: totalHabits };
    });

    const categoryData = habits.reduce((acc, habit) => {
      acc[habit.category] = (acc[habit.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topStreaks = [...habits]
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 5)
      .map(h => ({ name: h.title, streak: h.streak, emoji: h.emoji }));

    return {
      completedToday,
      totalHabits,
      activeHabits,
      totalCompletions,
      averageStreak: Math.round(averageStreak * 10) / 10,
      successRate,
      weeklyData,
      categoryData,
      topStreaks,
    };
  }, [habits]);

  return useMemo(() => ({
    // State
    user,
    habits,
    dailyAIBoosts,
    isLoading,
    error,
    
    // Actions
    addHabit,
    toggleHabit,
    deleteHabit,
    canAddHabit,
    getHabitLimit,
    useAIBoost,
    updateUserAvatar,
    updateUserName,
    signOut,
    clearError,
    upgradeToPremium,
    getAnalytics,
    saveUser,
    resetUserData,
  }), [
    user,
    habits,
    dailyAIBoosts,
    isLoading,
    error,
    addHabit,
    toggleHabit,
    deleteHabit,
    canAddHabit,
    getHabitLimit,
    useAIBoost,
    updateUserAvatar,
    updateUserName,
    signOut,
    clearError,
    upgradeToPremium,
    getAnalytics,
    saveUser,
    resetUserData,
  ]);
});