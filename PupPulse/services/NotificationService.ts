// 🔔 PupPulse Notification Service - Never Miss a Beat
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Reminder {
  id: string;
  type: 'walk' | 'meal' | 'medication' | 'vet_visit' | 'grooming' | 'play';
  title: string;
  message: string;
  scheduledTime: Date;
  isActive: boolean;
  repeatDays: number[]; // 0=Sunday, 1=Monday, etc.
  dogId: string;
}

export class NotificationService {
  private static instance: NotificationService;
  
  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<void> {
    // Request permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Notification permission not granted');
    }

    // Configure notification behavior
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }

  // 📅 Schedule Smart Reminders
  async scheduleReminder(reminder: Reminder): Promise<string> {
    const trigger: Notifications.NotificationTriggerInput = {
      date: reminder.scheduledTime,
      repeats: reminder.repeatDays.length > 0,
    };

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `🐕 ${reminder.title}`,
        body: reminder.message,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        categoryIdentifier: 'dog_health',
      },
      trigger,
    });

    // Save to storage
    await this.saveReminder({ ...reminder, id: notificationId });
    return notificationId;
  }

  // 🎯 Smart Reminder Suggestions
  generateSmartReminders(dogProfile: any): Reminder[] {
    const reminders: Reminder[] = [];
    const now = new Date();
    
    // Morning walk reminder
    const morningWalk = new Date(now);
    morningWalk.setHours(7, 0, 0, 0);
    if (morningWalk <= now) morningWalk.setDate(morningWalk.getDate() + 1);
    
    reminders.push({
      id: `walk_morning_${dogProfile.id}`,
      type: 'walk',
      title: 'Morning Walk Time!',
      message: `Time for ${dogProfile.name}'s morning exercise! 🚶‍♂️`,
      scheduledTime: morningWalk,
      isActive: true,
      repeatDays: [1, 2, 3, 4, 5, 6, 0], // Every day
      dogId: dogProfile.id,
    });

    // Evening walk reminder
    const eveningWalk = new Date(now);
    eveningWalk.setHours(18, 0, 0, 0);
    if (eveningWalk <= now) eveningWalk.setDate(eveningWalk.getDate() + 1);
    
    reminders.push({
      id: `walk_evening_${dogProfile.id}`,
      type: 'walk',
      title: 'Evening Walk Time!',
      message: `Let's take ${dogProfile.name} for their evening stroll! 🌅`,
      scheduledTime: eveningWalk,
      isActive: true,
      repeatDays: [1, 2, 3, 4, 5, 6, 0], // Every day
      dogId: dogProfile.id,
    });

    // Meal reminders (based on age)
    const mealTimes = dogProfile.age < 1 ? 
      [7, 12, 17, 21] : // Puppy: 4 meals
      [8, 18]; // Adult: 2 meals

    mealTimes.forEach((hour, index) => {
      const mealTime = new Date(now);
      mealTime.setHours(hour, 0, 0, 0);
      if (mealTime <= now) mealTime.setDate(mealTime.getDate() + 1);
      
      reminders.push({
        id: `meal_${index}_${dogProfile.id}`,
        type: 'meal',
        title: 'Meal Time!',
        message: `🍽️ ${dogProfile.name} is ready for their ${index === 0 ? 'breakfast' : index === 1 ? 'lunch' : index === 2 ? 'dinner' : 'snack'}!`,
        scheduledTime: mealTime,
        isActive: true,
        repeatDays: [1, 2, 3, 4, 5, 6, 0], // Every day
        dogId: dogProfile.id,
      });
    });

    // Play time reminder
    const playTime = new Date(now);
    playTime.setHours(15, 0, 0, 0);
    if (playTime <= now) playTime.setDate(playTime.getDate() + 1);
    
    reminders.push({
      id: `play_${dogProfile.id}`,
      type: 'play',
      title: 'Play Time!',
      message: `🎾 Time for some fun with ${dogProfile.name}!`,
      scheduledTime: playTime,
      isActive: true,
      repeatDays: [1, 2, 3, 4, 5, 6, 0], // Every day
      dogId: dogProfile.id,
    });

    return reminders;
  }

  // 💊 Medication Reminders
  async scheduleMedicationReminder(
    dogId: string,
    medication: string,
    times: string[],
    duration: number // days
  ): Promise<string[]> {
    const notificationIds: string[] = [];
    
    for (const time of times) {
      const [hours, minutes] = time.split(':').map(Number);
      const startDate = new Date();
      startDate.setHours(hours, minutes, 0, 0);
      
      for (let day = 0; day < duration; day++) {
        const scheduledTime = new Date(startDate);
        scheduledTime.setDate(scheduledTime.getDate() + day);
        
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: '💊 Medication Time!',
            body: `Time to give ${medication} to your dog`,
            sound: 'default',
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: { date: scheduledTime },
        });
        
        notificationIds.push(notificationId);
      }
    }
    
    return notificationIds;
  }

  // 🚨 Emergency Alerts
  async sendEmergencyAlert(dogName: string, symptoms: string[]): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🚨 URGENT: Dog Health Alert',
        body: `${dogName} needs immediate attention! Symptoms: ${symptoms.join(', ')}`,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.MAX,
        categoryIdentifier: 'emergency',
      },
      trigger: null, // Immediate
    });
  }

  // 📊 Health Check Reminders
  async scheduleHealthCheck(dogId: string, frequency: 'daily' | 'weekly' | 'monthly'): Promise<string> {
    const now = new Date();
    let scheduledTime: Date;
    
    switch (frequency) {
      case 'daily':
        scheduledTime = new Date(now);
        scheduledTime.setHours(20, 0, 0, 0);
        break;
      case 'weekly':
        scheduledTime = new Date(now);
        scheduledTime.setDate(scheduledTime.getDate() + (7 - scheduledTime.getDay()));
        scheduledTime.setHours(19, 0, 0, 0);
        break;
      case 'monthly':
        scheduledTime = new Date(now);
        scheduledTime.setMonth(scheduledTime.getMonth() + 1, 1);
        scheduledTime.setHours(19, 0, 0, 0);
        break;
    }
    
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔍 Health Check Time!',
        body: 'How is your dog feeling today? Log their health status.',
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: { 
        date: scheduledTime,
        repeats: frequency === 'daily'
      },
    });
  }

  // 💾 Storage Methods
  private async saveReminder(reminder: Reminder): Promise<void> {
    const reminders = await this.getReminders();
    reminders.push(reminder);
    await AsyncStorage.setItem('puppulse_reminders', JSON.stringify(reminders));
  }

  async getReminders(): Promise<Reminder[]> {
    const stored = await AsyncStorage.getItem('puppulse_reminders');
    return stored ? JSON.parse(stored) : [];
  }

  async cancelReminder(reminderId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(reminderId);
    const reminders = await this.getReminders();
    const filtered = reminders.filter(r => r.id !== reminderId);
    await AsyncStorage.setItem('puppulse_reminders', JSON.stringify(filtered));
  }

  // 🧹 Cleanup
  async cancelAllReminders(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.removeItem('puppulse_reminders');
  }
}

