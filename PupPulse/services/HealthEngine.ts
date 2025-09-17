// 🐕 PupPulse Health Engine - The Brain of Dog Health
export interface DogProfile {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  sex: 'male' | 'female';
  neutered: boolean;
  medicalHistory: string[];
  allergies: string[];
  medications: string[];
  lastVetVisit: Date;
  pulseScore: number;
  healthStreak: number; // Days of good health
  level: number; // Gamification level
  xp: number; // Experience points
  achievements: string[];
}

export interface HealthEvent {
  id: string;
  type: 'walk' | 'meal' | 'medication' | 'symptom' | 'vet_visit' | 'vaccination' | 'grooming' | 'play';
  title: string;
  description: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  points: number; // XP earned
  impact: number; // Impact on pulse score
}

export interface PulseScore {
  overall: number;
  activity: number;
  nutrition: number;
  medical: number;
  behavior: number;
  lastUpdated: Date;
  trend: 'improving' | 'stable' | 'declining';
}

export class HealthEngine {
  private static instance: HealthEngine;
  
  static getInstance(): HealthEngine {
    if (!HealthEngine.instance) {
      HealthEngine.instance = new HealthEngine();
    }
    return HealthEngine.instance;
  }

  // 🎯 Calculate Pulse Score - The Core Algorithm
  calculatePulseScore(dog: DogProfile, events: HealthEvent[]): PulseScore {
    const now = new Date();
    const last24h = events.filter(e => 
      now.getTime() - e.timestamp.getTime() <= 24 * 60 * 60 * 1000
    );
    
    // Activity Score (0-100)
    const walks = last24h.filter(e => e.type === 'walk').length;
    const playSessions = last24h.filter(e => e.type === 'play').length;
    const activityScore = Math.min(100, (walks * 20) + (playSessions * 15));
    
    // Nutrition Score (0-100)
    const meals = last24h.filter(e => e.type === 'meal').length;
    const nutritionScore = Math.min(100, meals * 25);
    
    // Medical Score (0-100)
    const symptoms = last24h.filter(e => e.type === 'symptom');
    const criticalSymptoms = symptoms.filter(e => e.severity === 'critical').length;
    const highSymptoms = symptoms.filter(e => e.severity === 'high').length;
    const medicalScore = Math.max(0, 100 - (criticalSymptoms * 50) - (highSymptoms * 25));
    
    // Behavior Score (0-100) - Based on positive events
    const positiveEvents = last24h.filter(e => 
      ['walk', 'play', 'grooming'].includes(e.type)
    ).length;
    const behaviorScore = Math.min(100, positiveEvents * 20);
    
    // Overall Pulse Score
    const overall = Math.round(
      (activityScore * 0.3) + 
      (nutritionScore * 0.25) + 
      (medicalScore * 0.3) + 
      (behaviorScore * 0.15)
    );
    
    return {
      overall: Math.max(0, Math.min(100, overall)),
      activity: activityScore,
      nutrition: nutritionScore,
      medical: medicalScore,
      behavior: behaviorScore,
      lastUpdated: now,
      trend: this.calculateTrend(events)
    };
  }

  // 📈 Calculate Health Trend
  private calculateTrend(events: HealthEvent[]): 'improving' | 'stable' | 'declining' {
    const now = new Date();
    const last7Days = events.filter(e => 
      now.getTime() - e.timestamp.getTime() <= 7 * 24 * 60 * 60 * 1000
    );
    
    const symptoms = last7Days.filter(e => e.type === 'symptom');
    const positiveEvents = last7Days.filter(e => 
      ['walk', 'play', 'grooming'].includes(e.type)
    );
    
    if (symptoms.length > positiveEvents.length) return 'declining';
    if (positiveEvents.length > symptoms.length * 2) return 'improving';
    return 'stable';
  }

  // 🎮 Gamification System
  calculateXP(event: HealthEvent, dog: DogProfile): number {
    let baseXP = 0;
    
    switch (event.type) {
      case 'walk': baseXP = 10; break;
      case 'meal': baseXP = 5; break;
      case 'play': baseXP = 15; break;
      case 'grooming': baseXP = 8; break;
      case 'medication': baseXP = 3; break;
      case 'vet_visit': baseXP = 25; break;
      case 'vaccination': baseXP = 20; break;
      case 'symptom': baseXP = -5; break;
    }
    
    // Streak bonus
    const streakBonus = Math.floor(dog.healthStreak / 7) * 2;
    
    return Math.max(0, baseXP + streakBonus);
  }

  // 🏆 Achievement System
  checkAchievements(dog: DogProfile, events: HealthEvent[]): string[] {
    const newAchievements: string[] = [];
    
    // Health Streak Achievements
    if (dog.healthStreak >= 7 && !dog.achievements.includes('week_warrior')) {
      newAchievements.push('week_warrior');
    }
    if (dog.healthStreak >= 30 && !dog.achievements.includes('month_master')) {
      newAchievements.push('month_master');
    }
    
    // Activity Achievements
    const walksThisWeek = events.filter(e => 
      e.type === 'walk' && 
      Date.now() - e.timestamp.getTime() <= 7 * 24 * 60 * 60 * 1000
    ).length;
    
    if (walksThisWeek >= 14 && !dog.achievements.includes('walking_champion')) {
      newAchievements.push('walking_champion');
    }
    
    // Pulse Score Achievements
    if (dog.pulseScore >= 95 && !dog.achievements.includes('health_god')) {
      newAchievements.push('health_god');
    }
    
    return newAchievements;
  }

  // 🚨 Emergency Detection
  detectEmergency(events: HealthEvent[]): boolean {
    const last24h = events.filter(e => 
      Date.now() - e.timestamp.getTime() <= 24 * 60 * 60 * 1000
    );
    
    const criticalSymptoms = last24h.filter(e => 
      e.type === 'symptom' && e.severity === 'critical'
    );
    
    const emergencyKeywords = [
      'bleeding', 'seizure', 'unconscious', 'breathing', 'choking',
      'vomiting blood', 'can\'t stand', 'extreme pain'
    ];
    
    return criticalSymptoms.some(event => 
      emergencyKeywords.some(keyword => 
        event.description.toLowerCase().includes(keyword)
      )
    );
  }

  // 💡 AI Health Insights
  generateInsights(dog: DogProfile, events: HealthEvent[]): string[] {
    const insights: string[] = [];
    const pulseScore = this.calculatePulseScore(dog, events);
    
    // Activity insights
    if (pulseScore.activity < 50) {
      insights.push(`🚶 ${dog.name} needs more exercise! Try adding a 15-minute walk to boost their activity score.`);
    }
    
    // Nutrition insights
    if (pulseScore.nutrition < 60) {
      insights.push(`🍽️ Consider adding a healthy snack or adjusting ${dog.name}'s meal schedule.`);
    }
    
    // Medical insights
    if (pulseScore.medical < 80) {
      insights.push(`⚠️ Keep monitoring ${dog.name}'s health closely. Consider a vet checkup if symptoms persist.`);
    }
    
    // Positive reinforcement
    if (pulseScore.overall >= 90) {
      insights.push(`🌟 Amazing! ${dog.name} is in excellent health. Keep up the great care!`);
    }
    
    return insights;
  }
}

