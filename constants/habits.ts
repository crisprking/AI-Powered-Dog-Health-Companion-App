import type { Habit } from '@/types';

// Generate realistic completion dates for demo
const generateCompletionDates = (streakDays: number, totalDays: number, consistency: number = 0.85): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  // Add current streak (consecutive days)
  for (let i = 0; i < streakDays; i++) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    dates.push(date.toDateString());
  }
  
  // Add historical completions with some gaps
  for (let i = streakDays; i < totalDays; i++) {
    if (Math.random() < consistency) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      dates.push(date.toDateString());
    }
  }
  
  return dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
};

export const DEFAULT_HABITS: Habit[] = [
  {
    id: 'habit_1',
    title: 'Morning Meditation',
    emoji: '🧘',
    category: 'Mindfulness',
    streak: 28,
    completedDates: generateCompletionDates(28, 90, 0.88),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    isCompleted: true,
    bestStreak: 45,
    totalCompletions: 78
  },
  {
    id: 'habit_2',
    title: 'Gym Workout',
    emoji: '💪',
    category: 'Fitness',
    streak: 12,
    completedDates: generateCompletionDates(12, 85, 0.75),
    createdAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000),
    isCompleted: false,
    bestStreak: 21,
    totalCompletions: 64
  },
  {
    id: 'habit_3',
    title: 'Read 30 Minutes',
    emoji: '📚',
    category: 'Learning',
    streak: 35,
    completedDates: generateCompletionDates(35, 100, 0.92),
    createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
    isCompleted: true,
    bestStreak: 42,
    totalCompletions: 92
  },
  {
    id: 'habit_4',
    title: 'Drink 8 Glasses Water',
    emoji: '💧',
    category: 'Health',
    streak: 19,
    completedDates: generateCompletionDates(19, 75, 0.82),
    createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000),
    isCompleted: true,
    bestStreak: 31,
    totalCompletions: 61
  },
  {
    id: 'habit_5',
    title: 'Journal Writing',
    emoji: '✍️',
    category: 'Productivity',
    streak: 22,
    completedDates: generateCompletionDates(22, 80, 0.85),
    createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000),
    isCompleted: true,
    bestStreak: 28,
    totalCompletions: 68
  },
  {
    id: 'habit_6',
    title: 'Learn Spanish',
    emoji: '🇪🇸',
    category: 'Learning',
    streak: 7,
    completedDates: generateCompletionDates(7, 60, 0.70),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    isCompleted: false,
    bestStreak: 15,
    totalCompletions: 42
  },
  {
    id: 'habit_7',
    title: 'Evening Walk',
    emoji: '🚶',
    category: 'Fitness',
    streak: 14,
    completedDates: generateCompletionDates(14, 70, 0.78),
    createdAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000),
    isCompleted: true,
    bestStreak: 25,
    totalCompletions: 55
  },
  {
    id: 'habit_8',
    title: 'Healthy Breakfast',
    emoji: '🥗',
    category: 'Health',
    streak: 31,
    completedDates: generateCompletionDates(31, 95, 0.89),
    createdAt: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
    isCompleted: true,
    bestStreak: 38,
    totalCompletions: 84
  }
];

export const HABIT_CATEGORIES = [
  { id: 'fitness', name: 'Fitness', emoji: '💪', color: '#10B981' },
  { id: 'mindfulness', name: 'Mindfulness', emoji: '🧘', color: '#8B5CF6' },
  { id: 'learning', name: 'Learning', emoji: '📚', color: '#3B82F6' },
  { id: 'health', name: 'Health', emoji: '🍎', color: '#EF4444' },
  { id: 'productivity', name: 'Productivity', emoji: '⚡', color: '#F59E0B' },
  { id: 'creativity', name: 'Creativity', emoji: '🎨', color: '#EC4899' },
  { id: 'social', name: 'Social', emoji: '👥', color: '#06B6D4' },
  { id: 'other', name: 'Other', emoji: '✨', color: '#6B7280' }
];