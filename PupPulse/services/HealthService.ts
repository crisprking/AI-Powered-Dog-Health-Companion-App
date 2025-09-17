import { Dog, HealthEvent, PulseScore, ScoreContributor } from '../types';
import { AIService } from './AIService';

export class HealthService {
  private static instance: HealthService;
  private aiService: AIService;

  private constructor() {
    this.aiService = AIService.getInstance();
  }

  public static getInstance(): HealthService {
    if (!HealthService.instance) {
      HealthService.instance = new HealthService();
    }
    return HealthService.instance;
  }

  async calculatePulseScore(dog: Dog, recentEvents: HealthEvent[]): Promise<PulseScore> {
    const contributors: ScoreContributor[] = [];
    let baseScore = 100;

    // Activity Analysis
    const activityScore = this.analyzeActivity(recentEvents);
    baseScore += activityScore.impact;
    contributors.push(activityScore);

    // Nutrition Analysis
    const nutritionScore = this.analyzeNutrition(recentEvents);
    baseScore += nutritionScore.impact;
    contributors.push(nutritionScore);

    // Symptom Analysis
    const symptomScore = this.analyzeSymptoms(recentEvents);
    baseScore += symptomScore.impact;
    contributors.push(symptomScore);

    // Sleep Analysis
    const sleepScore = this.analyzeSleep(recentEvents);
    baseScore += sleepScore.impact;
    contributors.push(sleepScore);

    // Age Factor
    const ageScore = this.analyzeAge(dog.age);
    baseScore += ageScore.impact;
    contributors.push(ageScore);

    // Weight Factor
    const weightScore = this.analyzeWeight(dog.weight, dog.breed);
    baseScore += weightScore.impact;
    contributors.push(weightScore);

    const finalScore = Math.max(0, Math.min(100, Math.round(baseScore)));
    const trend = this.calculateTrend(finalScore, dog.pulseScore);

    return {
      id: `pulse_${Date.now()}`,
      dogId: dog.id,
      score: finalScore,
      contributors,
      calculatedAt: new Date(),
      trend
    };
  }

  private analyzeActivity(events: HealthEvent[]): ScoreContributor {
    const recentWalks = events.filter(e => 
      e.type === 'walk' && this.isRecent(e.timestamp, 24)
    );

    const walkCount = recentWalks.length;
    let impact = 0;
    let description = '';

    if (walkCount >= 3) {
      impact = 10;
      description = 'Excellent activity level - 3+ walks today';
    } else if (walkCount === 2) {
      impact = 5;
      description = 'Good activity level - 2 walks today';
    } else if (walkCount === 1) {
      impact = -5;
      description = 'Low activity - only 1 walk today';
    } else {
      impact = -15;
      description = 'No walks today - needs more exercise';
    }

    return {
      factor: 'Activity',
      impact,
      description,
      positive: impact > 0
    };
  }

  private analyzeNutrition(events: HealthEvent[]): ScoreContributor {
    const recentMeals = events.filter(e => 
      e.type === 'meal' && this.isRecent(e.timestamp, 24)
    );

    const mealCount = recentMeals.length;
    let impact = 0;
    let description = '';

    if (mealCount >= 3) {
      impact = 8;
      description = 'Regular feeding schedule maintained';
    } else if (mealCount === 2) {
      impact = 2;
      description = 'Adequate nutrition - 2 meals today';
    } else if (mealCount === 1) {
      impact = -8;
      description = 'Insufficient meals - only 1 today';
    } else {
      impact = -15;
      description = 'No meals recorded today';
    }

    return {
      factor: 'Nutrition',
      impact,
      description,
      positive: impact > 0
    };
  }

  private analyzeSymptoms(events: HealthEvent[]): ScoreContributor {
    const recentSymptoms = events.filter(e => 
      e.type === 'symptom' && this.isRecent(e.timestamp, 48)
    );

    if (recentSymptoms.length === 0) {
      return {
        factor: 'Symptoms',
        impact: 5,
        description: 'No concerning symptoms reported',
        positive: true
      };
    }

    const criticalSymptoms = recentSymptoms.filter(s => s.severity === 'critical');
    const highSymptoms = recentSymptoms.filter(s => s.severity === 'high');
    const mediumSymptoms = recentSymptoms.filter(s => s.severity === 'medium');
    const lowSymptoms = recentSymptoms.filter(s => s.severity === 'low');

    let impact = 0;
    let description = '';

    if (criticalSymptoms.length > 0) {
      impact = -25;
      description = `${criticalSymptoms.length} critical symptoms - immediate attention needed`;
    } else if (highSymptoms.length > 0) {
      impact = -15;
      description = `${highSymptoms.length} high-severity symptoms - vet consultation recommended`;
    } else if (mediumSymptoms.length > 0) {
      impact = -8;
      description = `${mediumSymptoms.length} moderate symptoms - monitor closely`;
    } else {
      impact = -3;
      description = `${lowSymptoms.length} minor symptoms - keep an eye on`;
    }

    return {
      factor: 'Symptoms',
      impact,
      description,
      positive: impact > 0
    };
  }

  private analyzeSleep(events: HealthEvent[]): ScoreContributor {
    // Simplified sleep analysis - in real app, would use smart collar data
    const recentEvents = events.filter(e => this.isRecent(e.timestamp, 24));
    
    // Assume good sleep if no concerning events
    const hasDisturbances = recentEvents.some(e => 
      e.type === 'symptom' && e.severity === 'high'
    );

    if (hasDisturbances) {
      return {
        factor: 'Sleep',
        impact: -10,
        description: 'Sleep may be disrupted by health issues',
        positive: false
      };
    }

    return {
      factor: 'Sleep',
      impact: 5,
      description: 'Good sleep quality maintained',
      positive: true
    };
  }

  private analyzeAge(age: number): ScoreContributor {
    if (age >= 8) {
      return {
        factor: 'Age',
        impact: 5,
        description: 'Senior dog - extra care points applied',
        positive: true
      };
    } else if (age < 2) {
      return {
        factor: 'Age',
        impact: -5,
        description: 'Young dog - more vulnerable to health issues',
        positive: false
      };
    }

    return {
      factor: 'Age',
      impact: 0,
      description: 'Adult dog - optimal age range',
      positive: true
    };
  }

  private analyzeWeight(weight: number, breed: string): ScoreContributor {
    const idealWeight = this.getIdealWeight(breed);
    const weightRatio = weight / idealWeight;

    if (weightRatio >= 0.9 && weightRatio <= 1.1) {
      return {
        factor: 'Weight',
        impact: 5,
        description: 'Ideal weight maintained',
        positive: true
      };
    } else if (weightRatio > 1.2) {
      return {
        factor: 'Weight',
        impact: -10,
        description: 'Overweight - consider diet adjustment',
        positive: false
      };
    } else if (weightRatio < 0.8) {
      return {
        factor: 'Weight',
        impact: -8,
        description: 'Underweight - consult vet about nutrition',
        positive: false
      };
    }

    return {
      factor: 'Weight',
      impact: 0,
      description: 'Weight within acceptable range',
      positive: true
    };
  }

  private calculateTrend(currentScore: number, previousScore: number): 'improving' | 'stable' | 'declining' {
    const difference = currentScore - previousScore;
    
    if (difference > 5) return 'improving';
    if (difference < -5) return 'declining';
    return 'stable';
  }

  private isRecent(timestamp: Date, hours: number): boolean {
    const now = new Date();
    const diffHours = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
    return diffHours <= hours;
  }

  private getIdealWeight(breed: string): number {
    const breedWeights: { [key: string]: number } = {
      'Golden Retriever': 30,
      'Labrador': 30,
      'German Shepherd': 35,
      'Beagle': 15,
      'Poodle': 20,
      'Bulldog': 25,
      'Chihuahua': 3,
      'Great Dane': 60,
      'Border Collie': 25,
      'Australian Shepherd': 25,
      'Siberian Husky': 30,
      'Rottweiler': 45,
      'Doberman': 35,
      'Boxer': 30,
      'Dalmatian': 25
    };
    
    return breedWeights[breed] || 25;
  }

  getHealthStatus(score: number): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'fair';
    if (score >= 40) return 'poor';
    return 'critical';
  }
}

