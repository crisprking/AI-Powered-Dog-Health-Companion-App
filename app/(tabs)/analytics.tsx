import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Trophy, TrendingUp, Target, Calendar, Award, Flame, Share2 } from 'lucide-react-native';
import { useSoluna } from '@/hooks/useSolunaStore';
import Colors from '@/constants/colors';
import { QuickShare } from '@/components/ShareModal';
import type { ShareStats } from '@/utils/sharing';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 40;

export default function AnalyticsScreen() {
  const { habits, user } = useSoluna();

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return date.toDateString();
    });

    // Daily completion data for line chart
    const dailyCompletions = last7Days.map(date => {
      return habits.reduce((count, habit) => {
        return count + (habit.completedDates.includes(date) ? 1 : 0);
      }, 0);
    });

    // Habit streaks for bar chart
    const habitStreaks = habits
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 5)
      .map(habit => ({
        name: habit.title.length > 8 ? habit.title.substring(0, 8) + '...' : habit.title,
        streak: habit.streak,
        emoji: habit.emoji
      }));

    // Category distribution for pie chart
    const categoryCount = habits.reduce((acc, habit) => {
      acc[habit.category] = (acc[habit.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryData = Object.entries(categoryCount).map(([category, count], index) => ({
      name: category,
      population: count,
      color: [Colors.gold, Colors.success, '#FF6B6B', '#4ECDC4', '#45B7D1'][index % 5],
      legendFontColor: Colors.text,
      legendFontSize: 12,
    }));

    // Key metrics
    const totalCompletions = habits.reduce((sum, habit) => sum + habit.completedDates.length, 0);
    const maxStreak = Math.max(...habits.map(h => h.streak), 0);
    const activeHabits = habits.length;
    const successRate = totalCompletions > 0 ? Math.round((totalCompletions / (habits.length * 30)) * 100) : 0;

    return {
      dailyCompletions,
      habitStreaks,
      categoryData,
      totalCompletions,
      maxStreak,
      activeHabits,
      successRate,
      last7Days
    };
  }, [habits]);

  const chartConfig = {
    backgroundColor: Colors.background,
    backgroundGradientFrom: Colors.cardBackground,
    backgroundGradientTo: Colors.cardBackground,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(212, 175, 55, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(184, 184, 184, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: Colors.gold,
    },
  };

  const achievements = [
    {
      icon: Trophy,
      title: 'Total Completions',
      value: analyticsData.totalCompletions.toString(),
      subtitle: 'Habits completed',
      color: Colors.gold,
    },
    {
      icon: Flame,
      title: 'Best Streak',
      value: analyticsData.maxStreak.toString(),
      subtitle: 'Days in a row',
      color: '#FF6B6B',
    },
    {
      icon: Target,
      title: 'Active Habits',
      value: analyticsData.activeHabits.toString(),
      subtitle: user.isPremium ? 'Unlimited' : `${analyticsData.activeHabits}/6`,
      color: Colors.success,
    },
    {
      icon: TrendingUp,
      title: 'Success Rate',
      value: `${analyticsData.successRate}%`,
      subtitle: 'Last 30 days',
      color: '#4ECDC4',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Analytics</Text>
            <Text style={styles.subtitle}>Track your transformation journey</Text>
          </View>
          <QuickShare
            type="progress"
            data={{
              completedToday: analyticsData.totalCompletions,
              totalHabits: analyticsData.activeHabits,
              longestStreak: analyticsData.maxStreak,
              successRate: analyticsData.successRate,
            } as ShareStats}
            userName={user.name}
            isPremium={user.isPremium}
          />
        </View>

        {/* Achievement Cards */}
        <View style={styles.achievementsContainer}>
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            return (
              <View key={index} style={styles.achievementCard}>
                <LinearGradient
                  colors={[achievement.color + '20', achievement.color + '10']}
                  style={styles.achievementGradient}
                >
                  <IconComponent size={24} color={achievement.color} />
                  <Text style={styles.achievementValue}>{achievement.value}</Text>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementSubtitle}>{achievement.subtitle}</Text>
                  {/* Share button for significant achievements */}
                  {(achievement.title === 'Best Streak' && analyticsData.maxStreak >= 7) && (
                    <View style={styles.achievementShareButton}>
                      <QuickShare
                        type="achievement"
                        data={`${analyticsData.maxStreak}-day streak! 🔥`}
                        userName={user.name}
                        isPremium={user.isPremium}
                        style={styles.miniShareButton}
                      />
                    </View>
                  )}
                </LinearGradient>
              </View>
            );
          })}
        </View>

        {/* 7-Day Progress Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>7-Day Progress</Text>
          <LineChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [
                {
                  data: analyticsData.dailyCompletions.length > 0 
                    ? analyticsData.dailyCompletions 
                    : [0, 0, 0, 0, 0, 0, 0],
                },
              ],
            }}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Top Habit Streaks */}
        {analyticsData.habitStreaks.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Top Habit Streaks</Text>
            <BarChart
              data={{
                labels: analyticsData.habitStreaks.map(h => h.name),
                datasets: [
                  {
                    data: analyticsData.habitStreaks.map(h => h.streak),
                  },
                ],
              }}
              width={chartWidth}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              yAxisLabel=""
              yAxisSuffix=" days"
              showValuesOnTopOfBars
            />
          </View>
        )}

        {/* Category Distribution */}
        {analyticsData.categoryData.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Habit Categories</Text>
            <PieChart
              data={analyticsData.categoryData}
              width={chartWidth}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              style={styles.chart}
            />
          </View>
        )}

        {/* Premium Upgrade Prompt */}
        {!user.isPremium && (
          <View style={styles.upgradeContainer}>
            <LinearGradient
              colors={[Colors.gold + '20', Colors.gold + '10']}
              style={styles.upgradeCard}
            >
              <Award size={32} color={Colors.gold} />
              <Text style={styles.upgradeTitle}>Unlock Advanced Analytics</Text>
              <Text style={styles.upgradeSubtitle}>
                Get detailed insights, custom date ranges, and export capabilities with Premium
              </Text>
            </LinearGradient>
          </View>
        )}
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
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: 60,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  achievementCard: {
    width: (screenWidth - 52) / 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  achievementGradient: {
    padding: 20,
    alignItems: 'center',
  },
  achievementValue: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.text,
    marginTop: 12,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 4,
    textAlign: 'center',
  },
  achievementSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  chartContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
  upgradeContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  upgradeCard: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 12,
    textAlign: 'center',
  },
  upgradeSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  achievementShareButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  miniShareButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
});