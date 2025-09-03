export const APP_NAME = 'FinSage Pro';
export const TAGLINE = 'Your AI Financial Advisor';
export const MASCOT_URL = 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/t2vyqi799p9auoc72kb7v';

// Brand Story & Narrative
export const BRAND_STORY = {
  mission: 'Democratizing financial wisdom through AI',
  vision: 'Every person deserves intelligent financial guidance',
  personality: 'Wise, approachable, empowering, trustworthy',
  tone: 'Professional yet friendly, like a knowledgeable mentor',
  values: ['Transparency', 'Empowerment', 'Intelligence', 'Accessibility']
} as const;

// Viral Elements (inspired by Duolingo's engagement tactics)
export const ENGAGEMENT_ELEMENTS = {
  streaks: 'Financial wisdom streaks',
  achievements: 'Smart money milestones',
  challenges: 'Weekly financial challenges',
  social: 'Share your financial wins',
  gamification: 'Level up your financial IQ'
} as const;

// Brand colors for consistent theming
export const BRAND_COLORS = {
  primary: '#00E67A',
  primaryDark: '#00D166',
  premium: '#F59E0B',
  premiumDark: '#D97706',
  textBlack: '#000000',
  textWhite: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceDark: '#1A1A1A',
  sage: '#059669', // Sage green for wisdom
  trust: '#0EA5E9', // Trust blue
  success: '#10B981', // Success green
  warning: '#F59E0B', // Premium gold
} as const;

// Logo variants for different contexts
export const LOGO_VARIANTS = {
  primary: MASCOT_URL, // Main FinSage mascot
  icon: MASCOT_URL, // Icon version
  wordmark: 'FinSage Pro', // Text-only version
  premium: MASCOT_URL, // Premium version with golden accent
} as const;
