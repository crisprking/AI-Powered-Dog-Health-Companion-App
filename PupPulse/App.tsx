import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Dimensions, Animated, Vibration } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  pulseScore: number;
  lastCheck: Date;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
}

interface HealthEvent {
  id: string;
  type: 'walk' | 'meal' | 'medication' | 'symptom' | 'vet_visit' | 'vaccination' | 'grooming' | 'play';
  title: string;
  description: string;
  timestamp: Date;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export default function App() {
  const [currentDog, setCurrentDog] = useState<Dog | null>(null);
  const [healthEvents, setHealthEvents] = useState<HealthEvent[]>([]);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [showSymptomChecker, setShowSymptomChecker] = useState(false);
  const [pulseScore, setPulseScore] = useState(87);
  const [healthStreak, setHealthStreak] = useState(5);
  const [level, setLevel] = useState(3);
  const [xp, setXp] = useState(1250);
  const [achievements, setAchievements] = useState<string[]>(['week_warrior', 'walking_champion']);
  const [insights, setInsights] = useState<string[]>([
    '🌟 Buddy is doing great! Keep up the excellent care!',
    '🚶 Try adding a 15-minute play session today',
    '💡 Consider a vet checkup next month for routine care'
  ]);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
  const [pulseAnimation] = useState(new Animated.Value(1));
  const [streakAnimation] = useState(new Animated.Value(1));

  useEffect(() => {
    loadAppData();
  }, []);

  const loadAppData = () => {
    // Create sample dog
    const sampleDog: Dog = {
      id: '1',
      name: 'Buddy',
      breed: 'Golden Retriever',
      age: 3,
      weight: 28.5,
      pulseScore: 87,
      lastCheck: new Date(),
      healthStatus: 'excellent'
    };

    // Create sample events
    const sampleEvents: HealthEvent[] = [
      {
        id: '1',
        type: 'walk',
        title: 'Morning Walk',
        description: '30 minutes, good energy',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        severity: 'low'
      },
      {
        id: '2',
        type: 'meal',
        title: 'Breakfast',
        description: '1 cup premium kibble + supplements',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        severity: 'low'
      },
      {
        id: '3',
        type: 'symptom',
        title: 'Slight Limping',
        description: 'Noticed during evening walk',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        severity: 'medium'
      },
      {
        id: '4',
        type: 'play',
        title: 'Fetch Session',
        description: '15 minutes of active play',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        severity: 'low'
      },
      {
        id: '5',
        type: 'grooming',
        title: 'Weekly Grooming',
        description: 'Brushing and nail trimming',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        severity: 'low'
      }
    ];

    setCurrentDog(sampleDog);
    setHealthEvents(sampleEvents);
  };

  // 🎮 Gamification Functions
  const addXP = useCallback((amount: number) => {
    setXp(prev => {
      const newXP = prev + amount;
      const newLevel = Math.floor(newXP / 1000) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
        setShowAchievement(`Level Up! Level ${newLevel}`);
        Vibration.vibrate([0, 200, 100, 200]);
        setTimeout(() => setShowAchievement(null), 3000);
      }
      return newXP;
    });
  }, [level]);

  const addHealthStreak = useCallback(() => {
    setHealthStreak(prev => {
      const newStreak = prev + 1;
      if (newStreak % 7 === 0) {
        setShowAchievement('Week Warrior! 7-day streak!');
        Vibration.vibrate([0, 200, 100, 200]);
        setTimeout(() => setShowAchievement(null), 3000);
      }
      return newStreak;
    });
  }, []);

  const pulseAnimationEffect = useCallback(() => {
    Animated.sequence([
      Animated.timing(pulseAnimation, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [pulseAnimation]);

  const streakAnimationEffect = useCallback(() => {
    Animated.sequence([
      Animated.timing(streakAnimation, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(streakAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [streakAnimation]);

  const getPulseScoreColor = (score: number) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 75) return '#8BC34A';
    if (score >= 60) return '#FFC107';
    if (score >= 40) return '#FF9800';
    return '#F44336';
  };

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return 'sentiment-very-satisfied';
      case 'good': return 'sentiment-satisfied';
      case 'fair': return 'sentiment-neutral';
      case 'poor': return 'sentiment-dissatisfied';
      case 'critical': return 'warning';
      default: return 'pets';
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#4CAF50';
      case 'good': return '#8BC34A';
      case 'fair': return '#FFC107';
      case 'poor': return '#FF9800';
      case 'critical': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const handleEmergencyMode = () => {
    setIsEmergencyMode(true);
    Vibration.vibrate([0, 500, 200, 500]);
    Alert.alert(
      '🚨 Emergency Mode Activated',
      'Your dog needs immediate veterinary attention. We\'re here to help you through this.',
      [
        { text: 'Call Nearest Vet', onPress: () => console.log('Calling vet...') },
        { text: 'Export Health Report', onPress: () => console.log('Exporting...') },
        { text: 'Find Emergency Clinic', onPress: () => console.log('Finding clinic...') }
      ]
    );
  };

  const handleSymptomChecker = () => {
    setShowSymptomChecker(true);
    Alert.alert(
      '🔍 AI Symptom Checker',
      'Describe your dog\'s symptoms and we\'ll provide immediate triage guidance.',
      [
        { text: 'Start Symptom Check', onPress: () => console.log('Starting check...') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleLogEvent = () => {
    Alert.alert(
      '📝 Log Health Event',
      'What would you like to log?',
      [
        { text: 'Walk', onPress: () => { addXP(10); addHealthStreak(); pulseAnimationEffect(); } },
        { text: 'Meal', onPress: () => { addXP(5); pulseAnimationEffect(); } },
        { text: 'Play', onPress: () => { addXP(15); pulseAnimationEffect(); } },
        { text: 'Grooming', onPress: () => { addXP(8); pulseAnimationEffect(); } },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleSchedule = () => {
    Alert.alert(
      '📅 Schedule Management',
      'Manage your dog\'s health schedule',
      [
        { text: 'Set Reminders', onPress: () => { addXP(8); pulseAnimationEffect(); } },
        { text: 'View Calendar', onPress: () => { addXP(5); pulseAnimationEffect(); } },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleVetChat = () => {
    Alert.alert(
      '📹 Vet Consultation',
      'Connect with veterinary professionals',
      [
        { text: 'Start Video Call', onPress: () => { addXP(15); pulseAnimationEffect(); } },
        { text: 'Send Message', onPress: () => { addXP(10); pulseAnimationEffect(); } },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  if (!currentDog) {
    return (
      <LinearGradient colors={['#4CAF50', '#2E7D32']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <MaterialIcons name="pets" size={80} color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading PupPulse...</Text>
        </View>
        <StatusBar style="light" />
      </LinearGradient>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#4CAF50', '#2E7D32']} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.dogInfo}>
            <MaterialIcons name="pets" size={32} color="#FFFFFF" />
            <View style={styles.dogDetails}>
              <Text style={styles.dogName}>{currentDog.name}</Text>
              <Text style={styles.dogBreed}>{currentDog.breed} • {currentDog.age} years</Text>
            </View>
          </View>
          
          <View style={styles.pulseScoreContainer}>
            <Text style={styles.pulseScoreLabel}>Pulse Score</Text>
            <Animated.Text 
              style={[
                styles.pulseScore, 
                { 
                  color: getPulseScoreColor(pulseScore),
                  transform: [{ scale: pulseAnimation }]
                }
              ]}
            >
              {pulseScore}
            </Animated.Text>
            <View style={styles.healthStatus}>
              <MaterialIcons 
                name={getHealthStatusIcon(currentDog.healthStatus)} 
                size={20} 
                color={getHealthStatusColor(currentDog.healthStatus)} 
              />
              <Text style={[styles.healthStatusText, { color: getHealthStatusColor(currentDog.healthStatus) }]}>
                {currentDog.healthStatus.toUpperCase()}
              </Text>
            </View>
            
            {/* Gamification Elements */}
            <View style={styles.gamificationRow}>
              <View style={styles.levelContainer}>
                <MaterialIcons name="star" size={16} color="#FFD700" />
                <Text style={styles.levelText}>Level {level}</Text>
              </View>
              <View style={styles.streakContainer}>
                <Animated.View style={{ transform: [{ scale: streakAnimation }] }}>
                  <MaterialIcons name="local-fire-department" size={16} color="#FF6B35" />
                </Animated.View>
                <Text style={styles.streakText}>{healthStreak} days</Text>
              </View>
            </View>
            
            <View style={styles.xpContainer}>
              <Text style={styles.xpText}>XP: {xp}</Text>
              <View style={styles.xpBar}>
                <View style={[styles.xpProgress, { width: `${(xp % 1000) / 10}%` }]} />
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Achievement Notification */}
        {showAchievement && (
          <View style={styles.achievementNotification}>
            <MaterialIcons name="emoji-events" size={24} color="#FFD700" />
            <Text style={styles.achievementText}>{showAchievement}</Text>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => {
              handleSymptomChecker();
              addXP(10);
              pulseAnimationEffect();
            }}
          >
            <MaterialIcons name="medical-services" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Symptom Check</Text>
            <Text style={styles.actionXP}>+10 XP</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleLogEvent}
          >
            <MaterialIcons name="add" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Log Event</Text>
            <Text style={styles.actionXP}>+5 XP</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleSchedule}
          >
            <MaterialIcons name="schedule" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Schedule</Text>
            <Text style={styles.actionXP}>+8 XP</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleVetChat}
          >
            <MaterialIcons name="videocam" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Vet Chat</Text>
            <Text style={styles.actionXP}>+15 XP</Text>
          </TouchableOpacity>
        </View>

        {/* Health Overview */}
        <View style={styles.healthOverview}>
          <Text style={styles.sectionTitle}>Health Overview</Text>
          <View style={styles.healthMetrics}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{currentDog.weight} kg</Text>
              <Text style={styles.metricLabel}>Weight</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>3.2 km</Text>
              <Text style={styles.metricLabel}>Today's Walk</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>2/3</Text>
              <Text style={styles.metricLabel}>Meals</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>14h</Text>
              <Text style={styles.metricLabel}>Sleep</Text>
            </View>
          </View>
        </View>

        {/* Recent Health Events */}
        <View style={styles.recentEvents}>
          <Text style={styles.sectionTitle}>Recent Health Events</Text>
          {healthEvents.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventIcon}>
                <MaterialIcons 
                  name={
                    event.type === 'walk' ? 'directions-walk' :
                    event.type === 'meal' ? 'restaurant' :
                    event.type === 'medication' ? 'medication' :
                    event.type === 'symptom' ? 'warning' :
                    event.type === 'vet_visit' ? 'local-hospital' :
                    event.type === 'vaccination' ? 'vaccines' :
                    event.type === 'grooming' ? 'content-cut' :
                    'sports'
                  } 
                  size={24} 
                  color="#4CAF50" 
                />
              </View>
              <View style={styles.eventDetails}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDescription}>{event.description}</Text>
                <Text style={styles.eventTime}>
                  {event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              {event.severity && (
                <View style={[styles.severityBadge, { 
                  backgroundColor: event.severity === 'critical' ? '#F44336' :
                                 event.severity === 'high' ? '#FF9800' :
                                 event.severity === 'medium' ? '#FFC107' : '#4CAF50'
                }]}>
                  <Text style={styles.severityText}>{event.severity.toUpperCase()}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* AI Insights */}
        <View style={styles.aiInsights}>
          <Text style={styles.sectionTitle}>🤖 AI Health Insights</Text>
          {insights.map((insight, index) => (
            <View key={index} style={styles.insightCard}>
              <MaterialIcons name="lightbulb" size={24} color="#FFD700" />
              <View style={styles.insightContent}>
                <Text style={styles.insightDescription}>{insight}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Emergency Button */}
        <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyMode}>
          <MaterialIcons name="emergency" size={24} color="#FFFFFF" />
          <Text style={styles.emergencyText}>Emergency Mode</Text>
        </TouchableOpacity>
      </ScrollView>

      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dogInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dogDetails: {
    marginLeft: 12,
  },
  dogName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dogBreed: {
    fontSize: 16,
    color: '#E8F5E8',
    marginTop: 2,
  },
  pulseScoreContainer: {
    alignItems: 'center',
  },
  pulseScoreLabel: {
    fontSize: 14,
    color: '#E8F5E8',
    marginBottom: 4,
  },
  pulseScore: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  healthStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  healthStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  healthOverview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  healthMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  recentEvents: {
    marginBottom: 20,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  eventTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  aiInsights: {
    marginBottom: 20,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 8,
  },
  insightContent: {
    flex: 1,
    marginLeft: 12,
  },
  insightDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emergencyButton: {
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  emergencyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 16,
  },
  // Gamification Styles
  gamificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    width: '100%',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  xpContainer: {
    marginTop: 8,
    width: '100%',
  },
  xpText: {
    color: '#E8F5E8',
    fontSize: 12,
    marginBottom: 4,
  },
  xpBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  xpProgress: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  achievementNotification: {
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  achievementText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  actionXP: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 2,
  },
});