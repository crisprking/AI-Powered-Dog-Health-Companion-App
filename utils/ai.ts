import type { Habit, User } from '@/types';

export interface AIInsightResponse {
  type: 'forecast' | 'recommendation' | 'analysis' | 'prediction';
  title: string;
  content: string;
  confidence?: number;
  impact?: number;
}

// Mock AI insights for demo purposes
const MOCK_INSIGHTS: AIInsightResponse[] = [
  {
    type: 'forecast',
    title: 'Weekly Success Prediction',
    content: 'Based on your current streak patterns, you have an 87% chance of completing all habits this week. Your morning habits show the strongest consistency.',
    confidence: 87,
    impact: 9
  },
  {
    type: 'recommendation',
    title: 'Optimize Your Routine',
    content: 'Consider moving your reading habit to the morning. Users with similar patterns show 34% better completion rates when reading is done before 10 AM.',
    confidence: 78,
    impact: 7
  },
  {
    type: 'analysis',
    title: 'Streak Analysis',
    content: 'Your longest streak is 12 days for meditation. This habit has the highest consistency score and could be a keystone habit for building others.',
    confidence: 95,
    impact: 8
  },
  {
    type: 'prediction',
    title: 'Goal Achievement Forecast',
    content: 'At your current pace, you\'ll reach your 30-day streak goal in 18 days. Maintaining weekend consistency will be crucial for success.',
    confidence: 82,
    impact: 9
  },
  {
    type: 'recommendation',
    title: 'Habit Stacking Opportunity',
    content: 'Try linking your water intake habit with your existing workout routine. This combination shows 45% higher success rates in similar user profiles.',
    confidence: 73,
    impact: 6
  },
  {
    type: 'analysis',
    title: 'Performance Insights',
    content: 'Your completion rate drops by 23% on Fridays. Consider setting reminders or reducing habit complexity for end-of-week maintenance.',
    confidence: 89,
    impact: 7
  },
  {
    type: 'forecast',
    title: 'Monthly Outlook',
    content: 'Based on your progress trajectory, you\'re on track to achieve 91% of your monthly habit goals. Focus on consistency over perfection.',
    confidence: 84,
    impact: 8
  },
  {
    type: 'recommendation',
    title: 'Recovery Strategy',
    content: 'After missing a habit, users who restart within 24 hours maintain 67% of their original streak momentum. Don\'t let perfect be the enemy of good.',
    confidence: 92,
    impact: 8
  }
];

export const generateAIInsight = async (habits: Habit[], user: User): Promise<AIInsightResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real app, this would call an AI service
  // For demo, we'll return contextual insights based on user data
  
  const totalHabits = habits.length;
  const completedToday = habits.filter(h => {
    const today = new Date().toDateString();
    return h.completedDates?.includes(today);
  }).length;
  
  const totalCompletions = habits.reduce((sum, h) => sum + (h.completedDates?.length || 0), 0);
  const avgStreak = habits.length > 0 ? habits.reduce((sum, h) => sum + (h.streak || 0), 0) / habits.length : 0;
  
  // Select insight based on user's current state
  let selectedInsight: AIInsightResponse;
  
  if (totalHabits === 0) {
    selectedInsight = {
      type: 'recommendation',
      title: 'Start Your Journey',
      content: 'Begin with 2-3 simple habits that take less than 5 minutes each. Research shows that starting small leads to 73% higher long-term success rates.',
      confidence: 95,
      impact: 9
    };
  } else if (completedToday === totalHabits) {
    selectedInsight = {
      type: 'forecast',
      title: 'Perfect Day Achievement',
      content: `Excellent work! You've completed all ${totalHabits} habits today. Users who achieve perfect days have 89% higher monthly success rates. Keep this momentum going!`,
      confidence: 89,
      impact: 9
    };
  } else if (avgStreak >= 7) {
    selectedInsight = {
      type: 'analysis',
      title: 'Streak Master Status',
      content: `Your average streak of ${Math.round(avgStreak)} days puts you in the top 15% of users. This consistency is building powerful neural pathways for lasting change.`,
      confidence: 92,
      impact: 8
    };
  } else if (completedToday === 0 && totalHabits > 0) {
    selectedInsight = {
      type: 'recommendation',
      title: 'Recovery Mode',
      content: 'Today is a fresh start! Choose just one habit to complete right now. Small wins create momentum, and 78% of users who restart immediately maintain their progress.',
      confidence: 78,
      impact: 7
    };
  } else {
    // Return a random insight from the pool
    const randomIndex = Math.floor(Math.random() * MOCK_INSIGHTS.length);
    selectedInsight = MOCK_INSIGHTS[randomIndex];
  }
  
  // Personalize the insight with user data
  if (selectedInsight.content.includes('your')) {
    // Already personalized
    return selectedInsight;
  }
  
  return selectedInsight;
};

export const getAIRecommendations = async (habits: Habit[]): Promise<string[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const recommendations = [
    'Try habit stacking: link new habits to existing ones',
    'Set implementation intentions: "When X happens, I will do Y"',
    'Use the 2-minute rule: make habits so easy they take less than 2 minutes',
    'Focus on identity: "I am the type of person who..."',
    'Design your environment to make good habits obvious',
    'Track your habits to maintain awareness and motivation',
    'Celebrate small wins to reinforce positive behavior',
    'Plan for obstacles and create if-then scenarios'
  ];
  
  // Return 3 random recommendations
  const shuffled = recommendations.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

export const analyzeHabitPatterns = (habits: Habit[]): {
  strongestHabit: string;
  weakestHabit: string;
  bestDay: string;
  worstDay: string;
  overallTrend: 'improving' | 'stable' | 'declining';
} => {
  if (habits.length === 0) {
    return {
      strongestHabit: 'No habits yet',
      weakestHabit: 'No habits yet',
      bestDay: 'No data',
      worstDay: 'No data',
      overallTrend: 'stable'
    };
  }
  
  // Find strongest habit (highest streak)
  const strongestHabit = habits.reduce((prev, current) => 
    (current.streak || 0) > (prev.streak || 0) ? current : prev
  );
  
  // Find weakest habit (lowest streak)
  const weakestHabit = habits.reduce((prev, current) => 
    (current.streak || 0) < (prev.streak || 0) ? current : prev
  );
  
  // Analyze day patterns (mock data for demo)
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const bestDay = days[Math.floor(Math.random() * days.length)];
  const worstDay = days[Math.floor(Math.random() * days.length)];
  
  // Determine overall trend
  const avgStreak = habits.reduce((sum, h) => sum + (h.streak || 0), 0) / habits.length;
  const overallTrend: 'improving' | 'stable' | 'declining' = 
    avgStreak >= 5 ? 'improving' : avgStreak >= 2 ? 'stable' : 'declining';
  
  return {
    strongestHabit: strongestHabit.title,
    weakestHabit: weakestHabit.title,
    bestDay,
    worstDay,
    overallTrend
  };
};

export const generateMotivationalMessage = (completionRate: number): string => {
  if (completionRate >= 90) {
    return "🔥 You're absolutely crushing it! This level of consistency is building unstoppable momentum.";
  } else if (completionRate >= 70) {
    return "💪 Great progress! You're building strong habits that will transform your life.";
  } else if (completionRate >= 50) {
    return "🌱 You're on the right track! Every small step is moving you closer to your goals.";
  } else if (completionRate >= 30) {
    return "🎯 Keep going! Remember, progress isn't about perfection—it's about consistency.";
  } else {
    return "🌟 Every journey begins with a single step. Today is a perfect day to start fresh!";
  }
};

export const calculateHabitScore = (habit: Habit): number => {
  const streak = habit.streak || 0;
  const totalCompletions = habit.completedDates?.length || 0;
  const daysActive = Math.max(1, Math.floor((Date.now() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)));
  const completionRate = totalCompletions / daysActive;
  
  // Score based on streak (40%), completion rate (40%), and longevity (20%)
  const streakScore = Math.min(streak * 2, 40);
  const rateScore = completionRate * 40;
  const longevityScore = Math.min(daysActive, 20);
  
  return Math.round(streakScore + rateScore + longevityScore);
};