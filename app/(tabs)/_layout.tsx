import { Tabs } from "expo-router";
import React from "react";
import { Calculator, Car, Home } from "lucide-react-native";
import { View, StyleSheet, Platform, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import colors, { spacing, borderRadius } from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";

interface TabIconProps {
  color: string;
  focused: boolean;
  size?: number;
  icon: 'calculator' | 'mortgage' | 'car-loan';
  gradient: readonly [string, string];
  testID: string;
}

const TabIcon: React.FC<TabIconProps> = ({ color, focused, size = 22, icon, gradient, testID }) => {
  const IconComponent = icon === 'calculator' ? Calculator : icon === 'mortgage' ? Home : Car;

  return (
    <Animated.View
      style={[styles.iconContainer, focused && styles.iconContainerActive]}
      testID={testID}
    >
      {focused && (
        <LinearGradient
          colors={gradient}
          style={styles.iconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}
      <IconComponent
        color={focused ? colors.text.inverse : color}
        size={size}
        strokeWidth={focused ? 2.6 : 2.2}
        style={{ zIndex: 10, position: 'relative' }}
      />
    </Animated.View>
  );
};

export default function TabLayout() {
  const { colors: themeColors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00E67A',
        tabBarInactiveTintColor: '#737373',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: themeColors.surface.elevated,
          borderTopWidth: 0,
          paddingTop: spacing[4],
          paddingBottom: Platform.OS === 'ios' ? spacing[10] : spacing[6],
          paddingHorizontal: spacing[5],
          height: Platform.OS === 'ios' ? 104 : 84,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.2,
          shadowRadius: 24,
          elevation: 8,
          borderTopLeftRadius: borderRadius['3xl'],
          borderTopRightRadius: borderRadius['3xl'],
          position: 'absolute',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: spacing[1],
          letterSpacing: 0.3,
        },
        tabBarItemStyle: {
          paddingVertical: spacing[2],
          paddingHorizontal: spacing[2],
          marginHorizontal: spacing[1],
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Calculator",
          tabBarAccessibilityLabel: 'Open Home',
          tabBarIcon: (props) => (
            <TabIcon
              {...props}
              icon="calculator"
              gradient={['#00E67A', '#00D166']}
              testID="tab-calculator-icon"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="mortgage"
        options={{
          title: "Mortgage",
          tabBarAccessibilityLabel: 'Mortgage Calculator',
          tabBarIcon: (props) => (
            <TabIcon
              {...props}
              icon="mortgage"
              gradient={['#00E67A', '#00D166']}
              testID="tab-mortgage-icon"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="car-loan"
        options={{
          title: "Car Loan",
          tabBarAccessibilityLabel: 'Car Loan Calculator',
          tabBarIcon: (props) => (
            <TabIcon
              {...props}
              icon="car-loan"
              gradient={['#5B6FE8', '#6B5B95']}
              testID="tab-car-loan-icon"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    position: 'relative',
    marginBottom: 2,
  },
  iconContainerActive: {
    transform: [{ scale: 1.03 }],
  },
  iconGradient: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    borderRadius: borderRadius.md,
    shadowColor: colors.shadow.sm.shadowColor,
    shadowOffset: colors.shadow.sm.shadowOffset,
    shadowOpacity: colors.shadow.sm.shadowOpacity,
    shadowRadius: colors.shadow.sm.shadowRadius,
    elevation: colors.shadow.sm.elevation,
  },
});