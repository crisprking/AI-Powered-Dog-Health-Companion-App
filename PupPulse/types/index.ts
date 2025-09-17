export interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  pulseScore: number;
  lastCheck: Date;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  medicalHistory: MedicalRecord[];
  allergies: string[];
  medications: Medication[];
  vaccinations: Vaccination[];
}

export interface HealthEvent {
  id: string;
  dogId: string;
  type: 'walk' | 'meal' | 'medication' | 'symptom' | 'vet_visit' | 'vaccination' | 'grooming' | 'training';
  title: string;
  description: string;
  timestamp: Date;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  photos?: string[];
  aiAnalysis?: AIAnalysis;
}

export interface MedicalRecord {
  id: string;
  date: Date;
  vetName: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  attachments: string[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

export interface Vaccination {
  id: string;
  name: string;
  date: Date;
  nextDue: Date;
  vetName: string;
  lotNumber?: string;
}

export interface AIAnalysis {
  triageLevel: 'monitor' | 'see_vet' | 'emergency';
  confidence: number;
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  followUpHours: number;
}

export interface PulseScore {
  id: string;
  dogId: string;
  score: number;
  contributors: ScoreContributor[];
  calculatedAt: Date;
  trend: 'improving' | 'stable' | 'declining';
}

export interface ScoreContributor {
  factor: string;
  impact: number;
  description: string;
  positive: boolean;
}

export interface SymptomCheck {
  id: string;
  dogId: string;
  symptoms: string[];
  severity: number;
  duration: string;
  behaviorChanges: string[];
  aiResponse: AIAnalysis;
  createdAt: Date;
}

export interface VetConsultation {
  id: string;
  dogId: string;
  vetId: string;
  type: 'chat' | 'video' | 'phone';
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  scheduledAt: Date;
  duration?: number;
  notes?: string;
  cost: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  type: 'primary_vet' | 'emergency_clinic' | 'specialist';
  address: string;
  distance: number;
  isAvailable: boolean;
}

