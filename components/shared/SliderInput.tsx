import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PlatformSlider from '@/components/shared/PlatformSlider';
import { typography, spacing, borderRadius } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';

interface SliderInputProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  minimumValue: number;
  maximumValue: number;
  step?: number;
  formatValue?: (value: number) => string;
  testID?: string;
  premium?: boolean;
}

const SliderInput = React.memo<SliderInputProps>((
  {
    label,
    value,
    onValueChange,
    minimumValue,
    maximumValue,
    step = 1,
    formatValue = (val) => val.toString(),
    testID
  }
) => {
  const { colors: themeColors, isDark } = useTheme();
  return (
    <View style={[
      styles.container,
      {
        backgroundColor: isDark 
          ? 'rgba(26, 26, 26, 0.8)' 
          : 'rgba(248, 250, 252, 0.8)',
        borderColor: isDark 
          ? 'rgba(255, 255, 255, 0.08)' 
          : 'rgba(0, 0, 0, 0.08)'
      }
    ]}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: themeColors.text.primary }]}>{label}</Text>
        <Text style={[styles.value, { color: themeColors.text.accent }]}>{formatValue(value)}</Text>
      </View>
      <PlatformSlider
        style={styles.slider}
        value={value}
        onValueChange={onValueChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        minimumTrackTintColor="#00E67A"
        maximumTrackTintColor={isDark 
          ? 'rgba(255, 255, 255, 0.15)' 
          : 'rgba(0, 0, 0, 0.15)'
        }
        thumbTintColor="#00E67A"
        testID={testID}
      />
      <View style={styles.range}>
        <Text style={[styles.rangeText, { color: themeColors.text.tertiary }]}>{formatValue(minimumValue)}</Text>
        <Text style={[styles.rangeText, { color: themeColors.text.tertiary }]}>{formatValue(maximumValue)}</Text>
      </View>
    </View>
  );
});

SliderInput.displayName = 'SliderInput';

export default SliderInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[8],
    padding: spacing[6],
    borderRadius: borderRadius['2xl'],
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    letterSpacing: typography.letterSpacing.normal,
  },
  value: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    letterSpacing: typography.letterSpacing.normal,
  },
  slider: {
    height: 60, // Even taller for better touch experience
    marginHorizontal: -spacing[1],
    marginVertical: spacing[2],
  },
  range: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing[2],
  },
  rangeText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.regular,
  },
});