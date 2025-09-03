import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import colors, { typography, spacing, borderRadius } from '@/constants/colors';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  prefix?: string;
  suffix?: string;
  testID?: string;
}

const InputField = React.memo<InputFieldProps>((
  {
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    prefix,
    suffix,
    testID
  }
) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        {prefix && <Text style={styles.prefix}>{prefix}</Text>}
        <TextInput
          style={[styles.input, prefix && styles.inputWithPrefix, suffix && styles.inputWithSuffix]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          placeholderTextColor={colors.text.tertiary}
          testID={testID}
        />
        {suffix && <Text style={styles.suffix}>{suffix}</Text>}
      </View>
    </View>
  );
});

InputField.displayName = 'InputField';

export default InputField;

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[5],
  },
  label: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing[2],
    letterSpacing: typography.letterSpacing.wide,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.elevated,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border.light,
    paddingHorizontal: spacing[4],
    height: 64,
    shadowColor: colors.shadow.sm.shadowColor,
    shadowOffset: colors.shadow.sm.shadowOffset,
    shadowOpacity: colors.shadow.sm.shadowOpacity,
    shadowRadius: colors.shadow.sm.shadowRadius,
    elevation: colors.shadow.sm.elevation,
  },
  input: {
    flex: 1,
    fontSize: typography.size.lg,
    color: colors.text.primary,
    paddingVertical: 0,
    fontWeight: typography.weight.medium,
  },
  inputWithPrefix: {
    marginLeft: spacing[2],
  },
  inputWithSuffix: {
    marginRight: spacing[2],
  },
  prefix: {
    fontSize: typography.size.lg,
    color: colors.text.secondary,
    fontWeight: typography.weight.semibold,
  },
  suffix: {
    fontSize: typography.size.lg,
    color: colors.text.secondary,
    fontWeight: typography.weight.semibold,
  },
});