import { Platform } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as WebBrowser from 'expo-web-browser';
import type { Habit } from '@/types';

export interface ShareableContent {
  title: string;
  message: string;
  url?: string;
  hashtags?: string[];
}

export interface ShareStats {
  completedToday: number;
  totalHabits: number;
  longestStreak: number;
  successRate: number;
}

const SHARE_URLS = {
  twitter: 'https://twitter.com/intent/tweet',
  facebook: 'https://www.facebook.com/sharer/sharer.php',
  linkedin: 'https://www.linkedin.com/sharing/share-offsite/',
  whatsapp: 'https://wa.me/',
  telegram: 'https://t.me/share/url',
  reddit: 'https://reddit.com/submit',
} as const;

const APP_URL = 'https://soluna.app';
const APP_NAME = 'Soluna: Habit Transformation';

// Generate shareable content for different scenarios
export const generateShareContent = {
  // Daily progress sharing
  dailyProgress: (stats: ShareStats, userName: string): ShareableContent => ({
    title: `${userName}'s Daily Progress`,
    message: `🎯 Crushed ${stats.completedToday}/${stats.totalHabits} habits today! ${stats.successRate}% success rate this month. Building better habits with ${APP_NAME}! 💪`,
    hashtags: ['HabitTracker', 'SelfImprovement', 'Productivity', 'Goals'],
    url: APP_URL,
  }),

  // Streak milestone sharing
  streakMilestone: (habit: Habit, userName: string): ShareableContent => ({
    title: `${userName} hit a ${habit.streak}-day streak!`,
    message: `🔥 Just hit a ${habit.streak}-day streak with "${habit.title}"! ${habit.emoji} Consistency is key to transformation. Join me on ${APP_NAME}!`,
    hashtags: ['StreakGoals', 'Consistency', 'HabitBuilding', 'Motivation'],
    url: APP_URL,
  }),

  // Weekly summary sharing
  weeklySummary: (completedHabits: number, totalHabits: number, userName: string): ShareableContent => ({
    title: `${userName}'s Weekly Habit Summary`,
    message: `📊 This week: ${completedHabits}/${totalHabits * 7} habit completions! Every small step counts toward transformation. Track your journey with ${APP_NAME}! 🌟`,
    hashtags: ['WeeklyGoals', 'Progress', 'HabitTracker', 'Transformation'],
    url: APP_URL,
  }),

  // Achievement sharing
  achievement: (achievementText: string, userName: string): ShareableContent => ({
    title: `${userName} unlocked an achievement!`,
    message: `🏆 Achievement unlocked: ${achievementText}! Celebrating every win on my habit transformation journey with ${APP_NAME}! 🎉`,
    hashtags: ['Achievement', 'Success', 'HabitGoals', 'Celebration'],
    url: APP_URL,
  }),

  // App recommendation
  appRecommendation: (userName: string): ShareableContent => ({
    title: `${userName} recommends ${APP_NAME}`,
    message: `🌟 Transforming my life one habit at a time with ${APP_NAME}! The most beautiful and effective habit tracker I've ever used. Join me on this journey! 💫`,
    hashtags: ['HabitTracker', 'SelfImprovement', 'AppRecommendation', 'Lifestyle'],
    url: APP_URL,
  }),

  // Custom sharing
  custom: (message: string, title?: string): ShareableContent => ({
    title: title || 'Shared from Soluna',
    message: `${message} \n\nShared via ${APP_NAME} ${APP_URL}`,
    hashtags: ['Soluna', 'HabitTracker'],
    url: APP_URL,
  }),
};

// Platform-specific sharing functions
const shareToTwitter = async (content: ShareableContent): Promise<void> => {
  const hashtags = content.hashtags?.map(tag => `#${tag}`).join(' ') || '';
  const text = encodeURIComponent(`${content.message} ${hashtags}`);
  const url = encodeURIComponent(content.url || APP_URL);
  const twitterUrl = `${SHARE_URLS.twitter}?text=${text}&url=${url}`;
  
  if (Platform.OS === 'web') {
    window.open(twitterUrl, '_blank');
  } else {
    await WebBrowser.openBrowserAsync(twitterUrl);
  }
};

const shareToFacebook = async (content: ShareableContent): Promise<void> => {
  const url = encodeURIComponent(content.url || APP_URL);
  const quote = encodeURIComponent(content.message);
  const facebookUrl = `${SHARE_URLS.facebook}?u=${url}&quote=${quote}`;
  
  if (Platform.OS === 'web') {
    window.open(facebookUrl, '_blank');
  } else {
    await WebBrowser.openBrowserAsync(facebookUrl);
  }
};

const shareToLinkedIn = async (content: ShareableContent): Promise<void> => {
  const url = encodeURIComponent(content.url || APP_URL);
  const title = encodeURIComponent(content.title);
  const summary = encodeURIComponent(content.message);
  const linkedinUrl = `${SHARE_URLS.linkedin}?url=${url}&title=${title}&summary=${summary}`;
  
  if (Platform.OS === 'web') {
    window.open(linkedinUrl, '_blank');
  } else {
    await WebBrowser.openBrowserAsync(linkedinUrl);
  }
};

const shareToWhatsApp = async (content: ShareableContent): Promise<void> => {
  const text = encodeURIComponent(`${content.message} ${content.url || APP_URL}`);
  const whatsappUrl = `${SHARE_URLS.whatsapp}?text=${text}`;
  
  if (Platform.OS === 'web') {
    window.open(whatsappUrl, '_blank');
  } else {
    await WebBrowser.openBrowserAsync(whatsappUrl);
  }
};

const shareToTelegram = async (content: ShareableContent): Promise<void> => {
  const text = encodeURIComponent(content.message);
  const url = encodeURIComponent(content.url || APP_URL);
  const telegramUrl = `${SHARE_URLS.telegram}?url=${url}&text=${text}`;
  
  if (Platform.OS === 'web') {
    window.open(telegramUrl, '_blank');
  } else {
    await WebBrowser.openBrowserAsync(telegramUrl);
  }
};

const shareToReddit = async (content: ShareableContent): Promise<void> => {
  const title = encodeURIComponent(content.title);
  const url = encodeURIComponent(content.url || APP_URL);
  const text = encodeURIComponent(content.message);
  const redditUrl = `${SHARE_URLS.reddit}?title=${title}&url=${url}&text=${text}`;
  
  if (Platform.OS === 'web') {
    window.open(redditUrl, '_blank');
  } else {
    await WebBrowser.openBrowserAsync(redditUrl);
  }
};

// Native sharing (iOS/Android)
const shareNative = async (content: ShareableContent): Promise<void> => {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Sharing is not available on this device');
    }

    const shareMessage = `${content.message}\n\n${content.url || APP_URL}`;
    await Sharing.shareAsync(shareMessage);
  } catch (error) {
    console.error('Native sharing failed:', error);
    throw error;
  }
};

// Main sharing functions
export const shareContent = {
  twitter: shareToTwitter,
  facebook: shareToFacebook,
  linkedin: shareToLinkedIn,
  whatsapp: shareToWhatsApp,
  telegram: shareToTelegram,
  reddit: shareToReddit,
  native: shareNative,
};

// Quick share functions for common scenarios
export const quickShare = {
  dailyProgress: async (stats: ShareStats, userName: string, platform: keyof typeof shareContent) => {
    const content = generateShareContent.dailyProgress(stats, userName);
    await shareContent[platform](content);
  },

  streakMilestone: async (habit: Habit, userName: string, platform: keyof typeof shareContent) => {
    const content = generateShareContent.streakMilestone(habit, userName);
    await shareContent[platform](content);
  },

  weeklySummary: async (completedHabits: number, totalHabits: number, userName: string, platform: keyof typeof shareContent) => {
    const content = generateShareContent.weeklySummary(completedHabits, totalHabits, userName);
    await shareContent[platform](content);
  },

  achievement: async (achievementText: string, userName: string, platform: keyof typeof shareContent) => {
    const content = generateShareContent.achievement(achievementText, userName);
    await shareContent[platform](content);
  },

  appRecommendation: async (userName: string, platform: keyof typeof shareContent) => {
    const content = generateShareContent.appRecommendation(userName);
    await shareContent[platform](content);
  },
};

// Share with platform selection
export const shareWithOptions = async (content: ShareableContent): Promise<void> => {
  if (Platform.OS === 'web') {
    // For web, we'll use Twitter as default
    // In a real app, you'd show a modal with platform options
    await shareContent.twitter(content);
  } else {
    // On mobile, use native sharing first, fallback to Twitter
    try {
      await shareContent.native(content);
    } catch {
      console.log('Native sharing failed, falling back to Twitter');
      await shareContent.twitter(content);
    }
  }
};

// Utility to check if sharing is available
export const isSharingAvailable = async (): Promise<boolean> => {
  if (Platform.OS === 'web') {
    return true; // Web always supports sharing via URLs
  }
  
  try {
    return await Sharing.isAvailableAsync();
  } catch {
    return false;
  }
};

// Generate share URL for deep linking
export const generateShareUrl = (content: ShareableContent): string => {
  const params = new URLSearchParams({
    title: content.title,
    message: content.message,
    ...(content.hashtags && { hashtags: content.hashtags.join(',') }),
  });
  
  return `${APP_URL}/share?${params.toString()}`;
};

// Premium feature: Advanced sharing analytics
export const trackShareEvent = (platform: string, contentType: string, userId: string): void => {
  // In a real app, you'd send this to your analytics service
  console.log('Share event:', { platform, contentType, userId, timestamp: new Date().toISOString() });
};