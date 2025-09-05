import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import {
  User,
  Crown,
  Camera,
  Settings,
  Bell,
  Shield,
  LogOut,
  Trophy,
  Target,
  Flame,
  TrendingUp,
  Edit3,
} from 'lucide-react-native';
import { useSoluna } from '@/hooks/useSolunaStore';
import { router } from 'expo-router';
import Colors from '@/constants/colors';

export default function ProfileScreen() {
  const { user, habits, signOut, updateUserAvatar } = useSoluna();
  const [isUploading, setIsUploading] = useState(false);

  const stats = {
    totalHabits: habits.length,
    completedToday: habits.filter(h => {
      const today = new Date().toDateString();
      return h.completedDates?.includes(today);
    }).length,
    longestStreak: Math.max(...habits.map(h => h.streak), 0),
    totalCompletions: habits.reduce((sum, h) => sum + (h.completedDates?.length || 0), 0),
    successRate: habits.length > 0 
      ? Math.round((habits.reduce((sum, h) => sum + (h.completedDates?.length || 0), 0) / (habits.length * 30)) * 100)
      : 0,
  };

  const achievements = [
    {
      id: 'first_habit',
      title: 'First Steps',
      description: 'Created your first habit',
      icon: Target,
      unlocked: habits.length >= 1,
      color: Colors.success,
    },
    {
      id: 'habit_master',
      title: 'Habit Master',
      description: 'Created 6+ habits',
      icon: Crown,
      unlocked: habits.length >= 6,
      color: Colors.gold,
    },
    {
      id: 'streak_warrior',
      title: 'Streak Warrior',
      description: '7-day streak achieved',
      icon: Flame,
      unlocked: stats.longestStreak >= 7,
      color: '#FF6B6B',
    },
    {
      id: 'consistency_king',
      title: 'Consistency King',
      description: '30-day streak achieved',
      icon: Trophy,
      unlocked: stats.longestStreak >= 30,
      color: '#4ECDC4',
    },
  ];

  const handleImagePicker = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to upload a profile photo.');
        return;
      }

      Alert.alert(
        'Select Photo',
        'Choose how you\'d like to select your profile photo',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Camera', onPress: () => openCamera() },
          { text: 'Photo Library', onPress: () => openLibrary() },
        ]
      );
    } catch {
      Alert.alert('Error', 'Failed to request permissions');
    }
  }, []);

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera permissions to take a photo.');
        return;
      }

      setIsUploading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await updateUserAvatar(result.assets[0].uri);
        Alert.alert('Success', 'Profile photo updated successfully!');
      }
    } catch {
      Alert.alert('Error', 'Failed to take photo');
    } finally {
      setIsUploading(false);
    }
  };

  const openLibrary = async () => {
    try {
      setIsUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await updateUserAvatar(result.assets[0].uri);
        Alert.alert('Success', 'Profile photo updated successfully!');
      }
    } catch {
      Alert.alert('Error', 'Failed to select photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSignOut = useCallback(() => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out? Your data will be saved locally.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              Alert.alert('Success', 'You have been signed out successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  }, [signOut]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          {user.isPremium && (
            <View style={styles.premiumBadge}>
              <Crown size={16} color={Colors.gold} />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity
            style={[styles.avatarContainer, user.isPremium && styles.avatarContainerPremium]}
            onPress={handleImagePicker}
            disabled={isUploading}
          >
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={40} color={Colors.textSecondary} />
              </View>
            )}
            <View style={styles.editBadge}>
              {isUploading ? (
                <Text style={styles.editBadgeText}>...</Text>
              ) : (
                <Edit3 size={12} color={Colors.background} />
              )}
            </View>
          </TouchableOpacity>
          
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          {!user.isPremium && (
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => router.push('/premium')}
            >
              <LinearGradient
                colors={[Colors.gold, '#B8860B']}
                style={styles.upgradeGradient}
              >
                <Crown size={20} color={Colors.background} />
                <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Target size={24} color={Colors.gold} />
              <Text style={styles.statValue}>{stats.totalHabits}</Text>
              <Text style={styles.statLabel}>Active Habits</Text>
            </View>
            <View style={styles.statCard}>
              <TrendingUp size={24} color={Colors.success} />
              <Text style={styles.statValue}>{stats.completedToday}</Text>
              <Text style={styles.statLabel}>Completed Today</Text>
            </View>
            <View style={styles.statCard}>
              <Flame size={24} color='#FF6B6B' />
              <Text style={styles.statValue}>{stats.longestStreak}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Trophy size={24} color='#4ECDC4' />
              <Text style={styles.statValue}>{stats.successRate}%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsList}>
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon;
              return (
                <View
                  key={achievement.id}
                  style={[
                    styles.achievementCard,
                    achievement.unlocked && styles.achievementCardUnlocked,
                  ]}
                >
                  <View
                    style={[
                      styles.achievementIcon,
                      achievement.unlocked && { backgroundColor: achievement.color + '20' },
                    ]}
                  >
                    <IconComponent
                      size={24}
                      color={achievement.unlocked ? achievement.color : Colors.textSecondary}
                    />
                  </View>
                  <View style={styles.achievementContent}>
                    <Text
                      style={[
                        styles.achievementTitle,
                        achievement.unlocked && styles.achievementTitleUnlocked,
                      ]}
                    >
                      {achievement.title}
                    </Text>
                    <Text style={styles.achievementDescription}>
                      {achievement.description}
                    </Text>
                  </View>
                  {achievement.unlocked && (
                    <View style={styles.achievementBadge}>
                      <Text style={styles.achievementBadgeText}>✓</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsList}>
            <TouchableOpacity style={styles.settingItem}>
              <Bell size={20} color={Colors.textSecondary} />
              <Text style={styles.settingText}>Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Shield size={20} color={Colors.textSecondary} />
              <Text style={styles.settingText}>Privacy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={handleSignOut}>
              <LogOut size={20} color={Colors.error} />
              <Text style={[styles.settingText, { color: Colors.error }]}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.text,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gold + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gold,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarContainerPremium: {
    borderWidth: 3,
    borderColor: Colors.gold,
    borderRadius: 60,
    padding: 3,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.background,
  },
  editBadgeText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  upgradeButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  upgradeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  upgradeButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.cardBackground,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  achievementsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  achievementsList: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: 16,
    borderRadius: 16,
    opacity: 0.5,
  },
  achievementCardUnlocked: {
    opacity: 1,
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.textSecondary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  achievementTitleUnlocked: {
    color: Colors.text,
  },
  achievementDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  achievementBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementBadgeText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: '700',
  },
  settingsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  settingsList: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  settingText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 16,
    fontWeight: '500',
  },
});