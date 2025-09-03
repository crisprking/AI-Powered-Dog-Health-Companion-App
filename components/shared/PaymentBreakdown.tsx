import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import colors, { typography, spacing, borderRadius } from '@/constants/colors';

interface PaymentBreakdownProps {
  breakdown: {
    principal: number;
    interest: number;
    taxes?: number;
    insurance?: number;
    pmi?: number;
    hoa?: number;
  };
  total: number;
}

const { width } = Dimensions.get('window');
const chartSize = Math.min(width - 80, 280);
const radius = chartSize / 2 - 40;
const circumference = 2 * Math.PI * radius;

const PaymentBreakdown = React.memo<PaymentBreakdownProps>(({ breakdown, total }) => {
  const segments = [
    { label: 'Principal', value: breakdown.principal, color: colors.primary[500] },
    { label: 'Interest', value: breakdown.interest, color: colors.accent.amber },
    ...(breakdown.taxes ? [{ label: 'Taxes', value: breakdown.taxes, color: colors.accent.emerald }] : []),
    ...(breakdown.insurance ? [{ label: 'Insurance', value: breakdown.insurance, color: '#8B5CF6' }] : []),
    ...(breakdown.pmi ? [{ label: 'PMI', value: breakdown.pmi, color: '#EF4444' }] : []),
    ...(breakdown.hoa ? [{ label: 'HOA', value: breakdown.hoa, color: '#F97316' }] : []),
  ];

  let cumulativePercentage = 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Breakdown</Text>
      
      <View style={styles.chartContainer}>
        <Svg width={chartSize} height={chartSize}>
          {segments.map((segment, index) => {
            const percentage = (segment.value / total) * 100;
            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
            
            cumulativePercentage += percentage;
            
            return (
              <Circle
                key={index}
                cx={chartSize / 2}
                cy={chartSize / 2}
                r={radius}
                fill="transparent"
                stroke={segment.color}
                strokeWidth={20}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${chartSize / 2} ${chartSize / 2})`}
              />
            );
          })}
        </Svg>
        
        <View style={styles.centerText}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            ${total.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </Text>
        </View>
      </View>

      <View style={styles.legend}>
        {segments.map((segment, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: segment.color }]} />
            <Text style={styles.legendLabel}>{segment.label}</Text>
            <Text style={styles.legendValue}>
              ${segment.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
});

PaymentBreakdown.displayName = 'PaymentBreakdown';

export default PaymentBreakdown;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.elevated,
    borderRadius: borderRadius['2xl'],
    padding: spacing[6],
    marginBottom: spacing[6],
    ...colors.shadow.md,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[6],
    letterSpacing: typography.letterSpacing.tight,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[8],
    position: 'relative',
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalLabel: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
  totalValue: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.black,
    color: colors.text.primary,
    letterSpacing: typography.letterSpacing.tight,
  },
  legend: {
    gap: spacing[4],
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[2],
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: borderRadius.base,
    marginRight: spacing[3],
  },
  legendLabel: {
    flex: 1,
    fontSize: typography.size.base,
    color: colors.text.primary,
    fontWeight: typography.weight.medium,
  },
  legendValue: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
});