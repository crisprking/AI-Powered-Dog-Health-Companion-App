import { AIAnalysis, SymptomCheck, HealthEvent } from '../types';

export class AIService {
  private static instance: AIService;
  private apiKey: string;

  private constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async analyzeSymptoms(symptomCheck: Omit<SymptomCheck, 'id' | 'aiResponse' | 'createdAt'>): Promise<AIAnalysis> {
    try {
      const prompt = this.buildSymptomPrompt(symptomCheck);
      const response = await this.callOpenAI(prompt);
      return this.parseAIResponse(response);
    } catch (error) {
      console.error('AI analysis failed:', error);
      return this.getFallbackAnalysis(symptomCheck);
    }
  }

  async generateHealthInsights(dogId: string, recentEvents: HealthEvent[]): Promise<string[]> {
    try {
      const prompt = this.buildInsightsPrompt(dogId, recentEvents);
      const response = await this.callOpenAI(prompt);
      return this.parseInsightsResponse(response);
    } catch (error) {
      console.error('Insights generation failed:', error);
      return ['Keep monitoring your dog\'s health and consult a vet if you notice any changes.'];
    }
  }

  async calculatePulseScore(healthEvents: HealthEvent[], dogProfile: any): Promise<number> {
    // Advanced pulse score calculation based on multiple factors
    let baseScore = 100;
    
    // Activity analysis
    const recentWalks = healthEvents.filter(e => e.type === 'walk' && this.isRecent(e.timestamp, 24));
    const walkFrequency = recentWalks.length;
    if (walkFrequency < 2) baseScore -= 15;
    else if (walkFrequency > 4) baseScore += 5;

    // Meal consistency
    const recentMeals = healthEvents.filter(e => e.type === 'meal' && this.isRecent(e.timestamp, 24));
    const expectedMeals = 3; // Assuming 3 meals per day
    const mealScore = Math.min(recentMeals.length / expectedMeals, 1) * 20;
    baseScore = baseScore - 20 + mealScore;

    // Symptom severity
    const recentSymptoms = healthEvents.filter(e => e.type === 'symptom' && this.isRecent(e.timestamp, 48));
    recentSymptoms.forEach(symptom => {
      if (symptom.severity === 'critical') baseScore -= 25;
      else if (symptom.severity === 'high') baseScore -= 15;
      else if (symptom.severity === 'medium') baseScore -= 8;
      else if (symptom.severity === 'low') baseScore -= 3;
    });

    // Age factor
    if (dogProfile.age > 8) baseScore += 5; // Senior dogs get buffer
    else if (dogProfile.age < 2) baseScore -= 5; // Puppies are more vulnerable

    // Weight factor
    const idealWeight = this.getIdealWeight(dogProfile.breed, dogProfile.age);
    const weightRatio = dogProfile.weight / idealWeight;
    if (weightRatio > 1.2 || weightRatio < 0.8) baseScore -= 10;

    return Math.max(0, Math.min(100, Math.round(baseScore)));
  }

  private buildSymptomPrompt(symptomCheck: Omit<SymptomCheck, 'id' | 'aiResponse' | 'createdAt'>): string {
    return `
You are a veterinary AI assistant. Analyze these dog symptoms and provide triage guidance.

DOG SYMPTOMS:
- Symptoms: ${symptomCheck.symptoms.join(', ')}
- Severity (1-10): ${symptomCheck.severity}
- Duration: ${symptomCheck.duration}
- Behavior Changes: ${symptomCheck.behaviorChanges.join(', ')}

SAFETY RULES:
- If symptoms include: blood, seizure, breathing difficulty, unconsciousness → EMERGENCY
- If confidence < 0.6 → recommend vet consultation
- Always include disclaimer: "This is not medical advice. Consult a veterinarian."

Respond with JSON:
{
  "triageLevel": "monitor" | "see_vet" | "emergency",
  "confidence": 0.0-1.0,
  "recommendations": ["string"],
  "urgency": "low" | "medium" | "high" | "critical",
  "followUpHours": number
}`;
  }

  private buildInsightsPrompt(dogId: string, recentEvents: HealthEvent[]): string {
    return `
Analyze this dog's recent health data and provide 2-3 actionable insights.

RECENT EVENTS:
${recentEvents.map(e => `- ${e.type}: ${e.title} (${e.timestamp.toISOString()})`).join('\n')}

Provide insights that are:
- Specific and actionable
- Encouraging but honest
- Focused on prevention
- Easy to understand

Return as JSON array of strings.`;
  }

  private async callOpenAI(prompt: string): Promise<string> {
    // Mock implementation - replace with actual OpenAI API call
    return JSON.stringify({
      triageLevel: 'monitor',
      confidence: 0.8,
      recommendations: ['Monitor symptoms closely', 'Ensure adequate rest'],
      urgency: 'low',
      followUpHours: 24
    });
  }

  private parseAIResponse(response: string): AIAnalysis {
    try {
      const parsed = JSON.parse(response);
      return {
        triageLevel: parsed.triageLevel || 'monitor',
        confidence: parsed.confidence || 0.5,
        recommendations: parsed.recommendations || [],
        urgency: parsed.urgency || 'low',
        followUpHours: parsed.followUpHours || 24
      };
    } catch (error) {
      return this.getFallbackAnalysis();
    }
  }

  private parseInsightsResponse(response: string): string[] {
    try {
      return JSON.parse(response);
    } catch (error) {
      return ['Keep monitoring your dog\'s health and consult a vet if you notice any changes.'];
    }
  }

  private getFallbackAnalysis(symptomCheck?: any): AIAnalysis {
    return {
      triageLevel: 'monitor',
      confidence: 0.5,
      recommendations: ['Monitor symptoms closely', 'Consult a veterinarian if symptoms persist'],
      urgency: 'low',
      followUpHours: 24
    };
  }

  private isRecent(timestamp: Date, hours: number): boolean {
    const now = new Date();
    const diffHours = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
    return diffHours <= hours;
  }

  private getIdealWeight(breed: string, age: number): number {
    // Simplified breed weight mapping
    const breedWeights: { [key: string]: number } = {
      'Golden Retriever': 30,
      'Labrador': 30,
      'German Shepherd': 35,
      'Beagle': 15,
      'Poodle': 20,
      'Bulldog': 25,
      'Chihuahua': 3,
      'Great Dane': 60
    };
    
    const baseWeight = breedWeights[breed] || 25;
    return age < 1 ? baseWeight * 0.5 : baseWeight;
  }
}

