export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

export interface WisdomQuote {
  text: string;
  author: string;
  category: 'success' | 'energy' | 'productivity' | 'leadership' | 'reflection' | 'growth';
}

export const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'evening';
};

export const getGreeting = (timeOfDay: TimeOfDay): string => {
  switch (timeOfDay) {
    case 'morning':
      return 'Sol Rising ☀️';
    case 'afternoon':
      return 'Sol Shining ✨';
    case 'evening':
      return 'Luna Rising 🌙';
    default:
      return 'Welcome Back';
  }
};

const WISDOM_QUOTES: Record<TimeOfDay, WisdomQuote[]> = {
  morning: [
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney",
      category: "success"
    },
    {
      text: "Your limitation—it's only your imagination.",
      author: "Unknown",
      category: "energy"
    },
    {
      text: "Great things never come from comfort zones.",
      author: "Unknown",
      category: "success"
    },
    {
      text: "Dream it. Wish it. Do it.",
      author: "Unknown",
      category: "energy"
    },
    {
      text: "Success doesn't just find you. You have to go out and get it.",
      author: "Unknown",
      category: "success"
    },
    {
      text: "The harder you work for something, the greater you'll feel when you achieve it.",
      author: "Unknown",
      category: "energy"
    },
    {
      text: "Dream bigger. Do bigger.",
      author: "Unknown",
      category: "success"
    },
    {
      text: "Don't stop when you're tired. Stop when you're done.",
      author: "Unknown",
      category: "energy"
    },
    {
      text: "Wake up with determination. Go to bed with satisfaction.",
      author: "Unknown",
      category: "success"
    },
    {
      text: "Do something today that your future self will thank you for.",
      author: "Sean Patrick Flanery",
      category: "energy"
    },
    {
      text: "Little things make big days.",
      author: "Unknown",
      category: "success"
    },
    {
      text: "It's going to be hard, but hard does not mean impossible.",
      author: "Unknown",
      category: "energy"
    }
  ],
  afternoon: [
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      category: "productivity"
    },
    {
      text: "Innovation distinguishes between a leader and a follower.",
      author: "Steve Jobs",
      category: "leadership"
    },
    {
      text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
      author: "Steve Jobs",
      category: "productivity"
    },
    {
      text: "The best time to plant a tree was 20 years ago. The second best time is now.",
      author: "Chinese Proverb",
      category: "productivity"
    },
    {
      text: "Don't be afraid to give up the good to go for the great.",
      author: "John D. Rockefeller",
      category: "leadership"
    },
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney",
      category: "productivity"
    },
    {
      text: "If you really look closely, most overnight successes took a long time.",
      author: "Steve Jobs",
      category: "leadership"
    },
    {
      text: "The only impossible journey is the one you never begin.",
      author: "Tony Robbins",
      category: "productivity"
    },
    {
      text: "In the middle of difficulty lies opportunity.",
      author: "Albert Einstein",
      category: "leadership"
    },
    {
      text: "It is during our darkest moments that we must focus to see the light.",
      author: "Aristotle",
      category: "productivity"
    },
    {
      text: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt",
      category: "leadership"
    },
    {
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
      category: "productivity"
    }
  ],
  evening: [
    {
      text: "The only person you are destined to become is the person you decide to be.",
      author: "Ralph Waldo Emerson",
      category: "reflection"
    },
    {
      text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
      author: "Ralph Waldo Emerson",
      category: "growth"
    },
    {
      text: "Be yourself; everyone else is already taken.",
      author: "Oscar Wilde",
      category: "reflection"
    },
    {
      text: "In the end, we will remember not the words of our enemies, but the silence of our friends.",
      author: "Martin Luther King Jr.",
      category: "growth"
    },
    {
      text: "The only way to make sense out of change is to plunge into it, move with it, and join the dance.",
      author: "Alan Watts",
      category: "reflection"
    },
    {
      text: "Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present.",
      author: "Bill Keane",
      category: "growth"
    },
    {
      text: "Life is what happens to you while you're busy making other plans.",
      author: "John Lennon",
      category: "reflection"
    },
    {
      text: "The purpose of our lives is to be happy.",
      author: "Dalai Lama",
      category: "growth"
    },
    {
      text: "Life is really simple, but we insist on making it complicated.",
      author: "Confucius",
      category: "reflection"
    },
    {
      text: "The only true wisdom is in knowing you know nothing.",
      author: "Socrates",
      category: "growth"
    },
    {
      text: "In the depth of winter, I finally learned that within me there lay an invincible summer.",
      author: "Albert Camus",
      category: "reflection"
    },
    {
      text: "The journey of a thousand miles begins with one step.",
      author: "Lao Tzu",
      category: "growth"
    }
  ]
};

export const getWisdomQuote = (timeOfDay: TimeOfDay): WisdomQuote => {
  const quotes = WISDOM_QUOTES[timeOfDay];
  const now = new Date();
  const hourIndex = Math.floor(now.getHours() / 2) % quotes.length;
  return quotes[hourIndex];
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export const getDaysAgo = (date: Date): number => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
};

export const getRelativeTimeString = (date: Date): string => {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  
  const daysAgo = getDaysAgo(date);
  if (daysAgo <= 7) return `${daysAgo} days ago`;
  if (daysAgo <= 30) return `${Math.floor(daysAgo / 7)} weeks ago`;
  if (daysAgo <= 365) return `${Math.floor(daysAgo / 30)} months ago`;
  return `${Math.floor(daysAgo / 365)} years ago`;
};