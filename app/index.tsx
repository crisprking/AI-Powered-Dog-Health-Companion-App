import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSoluna } from '@/hooks/useSolunaStore';
import Colors from '@/constants/colors';

export default function IndexScreen() {
  const { user, isLoading } = useSoluna();

  useEffect(() => {
    if (!isLoading) {
      if (!user.hasCompletedOnboarding) {
        router.replace('/onboarding');
      } else {
        router.replace('/home');
      }
    }
  }, [isLoading, user.hasCompletedOnboarding]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.gold} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});