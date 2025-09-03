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
      const IconComponent = 
        icon === 'calculator' ? Calculator :
        icon === 'mortgage' ? Home :
        Car;
      
      return (
        <Animated.View 
          style={[
            styles.iconContainer, 
            focused && styles.iconContainerActive
          ]} 
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
            strokeWidth={focused ? 2.8 : 2.2}
            style={{
              zIndex: 10,
              position: 'relative'
            }}
          />
          {focused && (
            <View style={styles.iconGlow} />
          )}
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
              fontSize: 13,
              fontWeight: '700',
              marginTop: spacing[1],
              letterSpacing: 0.4,
            },
            tabBarItemStyle: {
              paddingVertical: spacing[2],
              paddingHorizontal: spacing[3],
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
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius['2xl'],
        position: 'relative',
        marginBottom: 8,
      },
      iconContainerActive: {
        transform: [{ scale: 1.05 }],
      },
      iconGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: borderRadius['2xl'],
        shadowColor: colors.shadow.lg.shadowColor,
        shadowOffset: colors.shadow.lg.shadowOffset,
        shadowOpacity: colors.shadow.lg.shadowOpacity,
        shadowRadius: colors.shadow.lg.shadowRadius,
        elevation: colors.shadow.lg.elevation,
      },
      iconGlow: {
        position: 'absolute',
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        borderRadius: borderRadius['2xl'] + 2,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        zIndex: -1,
      },
    });