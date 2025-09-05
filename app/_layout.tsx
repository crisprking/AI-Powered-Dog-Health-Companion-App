import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SolunaProvider } from "@/hooks/useSolunaStore";
SplashScreen.preventAutoHideAsync();

// Optimized QueryClient configuration for maximum performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Reduced retries for faster failure handling
      staleTime: 10 * 60 * 1000, // 10 minutes - longer cache time
      gcTime: 15 * 60 * 1000, // 15 minutes - keep data in cache longer (v5 syntax)
      refetchOnWindowFocus: false, // Disable refetch on focus for better UX
      refetchOnReconnect: true, // Only refetch on network reconnect
      refetchOnMount: false, // Don't refetch on component mount if data exists
    },
    mutations: {
      retry: 1, // Single retry for mutations
    },
  },
});

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="onboarding" 
        options={{ 
          headerShown: false,
          gestureEnabled: false
        }} 
      />
      <Stack.Screen 
        name="premium" 
        options={{ 
          presentation: "modal",
          headerShown: true,
          title: "Upgrade to Premium"
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    const setup = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch {
        await SplashScreen.hideAsync();
      }
    };

    setup();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SolunaProvider>
          <RootLayoutNav />
        </SolunaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}