import React from 'react';
    import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
    import { LinearGradient } from 'expo-linear-gradient';
    import { Share, FileText, Download, X, Crown } from 'lucide-react-native';
    import colors, { typography, spacing, borderRadius } from '@/constants/colors';

    interface ShareActionSheetProps {
      visible: boolean;
      onClose: () => void;
      onShare: () => void;
      onExportPDF: () => void;
      onExportCSV: () => void;
      hasPremiumAccess: boolean;
      calculatorType: 'mortgage' | 'car-loan';
    }

    export default function ShareActionSheet({
      visible,
      onClose,
      onShare,
      onExportPDF,
      onExportCSV,
      hasPremiumAccess,
      calculatorType,
    }: ShareActionSheetProps) {
      const calculatorTitle = calculatorType === 'mortgage' ? 'Mortgage' : 'Car Loan';

      const ActionButton = ({ 
        icon: Icon, 
        title, 
        subtitle, 
        onPress, 
        isPremium = false,
        gradient 
      }: {
        icon: any;
        title: string;
        subtitle: string;
        onPress: () => void;
        isPremium?: boolean;
        gradient: readonly [string, string];
      }) => (
        <TouchableOpacity
          style={[styles.actionButton, !hasPremiumAccess && isPremium && styles.actionButtonDisabled]}
          onPress={hasPremiumAccess || !isPremium ? onPress : undefined}
          disabled={!hasPremiumAccess && isPremium}
        >
          <LinearGradient
            colors={!hasPremiumAccess && isPremium ? ['#E5E5E5', '#D4D4D4'] : gradient}
            style={styles.actionButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.actionButtonContent}>
              <View style={styles.actionButtonIcon}>
                <Icon 
                  size={24} 
                  color={!hasPremiumAccess && isPremium ? colors.neutral[400] : colors.text.inverse} 
                  strokeWidth={2}
                />
                {isPremium && !hasPremiumAccess && (
                  <View style={styles.premiumBadge}>
                    <Crown size={12} color={colors.accent.gold} />
                  </View>
                )}
              </View>
              <View style={styles.actionButtonText}>
                <Text style={[
                  styles.actionButtonTitle,
                  !hasPremiumAccess && isPremium && styles.actionButtonTitleDisabled
                ]}>
                  {title}
                </Text>
                <Text style={[
                  styles.actionButtonSubtitle,
                  !hasPremiumAccess && isPremium && styles.actionButtonSubtitleDisabled
                ]}>
                  {subtitle}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );

      return (
        <Modal
          visible={visible}
          transparent
          animationType="slide"
          onRequestClose={onClose}
        >
          <View style={styles.overlay}>
            <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} />
            
            <View style={styles.container}>
              <LinearGradient
                colors={colors.gradient.subtle}
                style={styles.containerGradient}
              >
                {/* Header */}
                <View style={styles.header}>
                  <View style={styles.headerContent}>
                    <Text style={styles.title}>Share & Export</Text>
                    <Text style={styles.subtitle}>{calculatorTitle} Calculator Results</Text>
                  </View>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <X size={24} color={colors.text.secondary} />
                  </TouchableOpacity>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                  <ActionButton
                    icon={Share}
                    title="Share Results"
                    subtitle={Platform.OS === 'web' ? 'Copy to clipboard or share' : 'Share via apps & messages'}
                    onPress={() => {
                      onShare();
                      onClose();
                    }}
                    gradient={colors.gradient.primary}
                  />

                  <ActionButton
                    icon={FileText}
                    title="Export PDF Report"
                    subtitle="Professional formatted report"
                    onPress={() => {
                      onExportPDF();
                      onClose();
                    }}
                    isPremium={true}
                    gradient={colors.gradient.secondary}
                  />

                  <ActionButton
                    icon={Download}
                    title="Export CSV Data"
                    subtitle="Spreadsheet-ready data export"
                    onPress={() => {
                      onExportCSV();
                      onClose();
                    }}
                    isPremium={true}
                    gradient={colors.gradient.accent}
                  />
                </View>

                {!hasPremiumAccess && (
                  <View style={styles.premiumPrompt}>
                    <LinearGradient
                      colors={colors.gradient.luxury}
                      style={styles.premiumPromptGradient}
                    >
                      <Crown size={20} color={colors.text.inverse} />
                      <Text style={styles.premiumPromptText}>
                        Upgrade to FinWise Pro for PDF & CSV exports
                      </Text>
                    </LinearGradient>
                  </View>
                )}
              </LinearGradient>
            </View>
          </View>
        </Modal>
      );
    }

    const styles = StyleSheet.create({
      overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
      },
      overlayTouchable: {
        flex: 1,
      },
      container: {
        borderTopLeftRadius: borderRadius['3xl'],
        borderTopRightRadius: borderRadius['3xl'],
        overflow: 'hidden',
        ...colors.shadow.xl,
      },
      containerGradient: {
        paddingTop: spacing[6],
        paddingBottom: Platform.OS === 'ios' ? spacing[8] : spacing[6],
        paddingHorizontal: spacing[6],
      },
      header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: spacing[6],
      },
      headerContent: {
        flex: 1,
      },
      title: {
        fontSize: typography.size['2xl'],
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
        marginBottom: spacing[1],
        letterSpacing: typography.letterSpacing.tight,
      },
      subtitle: {
        fontSize: typography.size.base,
        color: colors.text.secondary,
        fontWeight: typography.weight.medium,
      },
      closeButton: {
        padding: spacing[2],
        marginTop: -spacing[2],
        marginRight: -spacing[2],
      },
      actions: {
        gap: spacing[3],
      },
      actionButton: {
        borderRadius: borderRadius['2xl'],
        overflow: 'hidden',
        ...colors.shadow.md,
      },
      actionButtonDisabled: {
        opacity: 0.6,
      },
      actionButtonGradient: {
        padding: spacing[5],
      },
      actionButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      actionButtonIcon: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.xl,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing[4],
        position: 'relative',
      },
      premiumBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.surface.elevated,
        alignItems: 'center',
        justifyContent: 'center',
        ...colors.shadow.sm,
      },
      actionButtonText: {
        flex: 1,
      },
      actionButtonTitle: {
        fontSize: typography.size.lg,
        fontWeight: typography.weight.bold,
        color: colors.text.inverse,
        marginBottom: spacing[1],
        letterSpacing: typography.letterSpacing.tight,
      },
      actionButtonTitleDisabled: {
        color: colors.neutral[500],
      },
      actionButtonSubtitle: {
        fontSize: typography.size.sm,
        color: 'rgba(255, 255, 255, 0.85)',
        fontWeight: typography.weight.medium,
        lineHeight: typography.lineHeight.snug,
      },
      actionButtonSubtitleDisabled: {
        color: colors.neutral[400],
      },
      premiumPrompt: {
        marginTop: spacing[5],
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
      },
      premiumPromptGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing[3],
        paddingHorizontal: spacing[4],
        gap: spacing[2],
      },
      premiumPromptText: {
        fontSize: typography.size.sm,
        fontWeight: typography.weight.semibold,
        color: colors.text.inverse,
        textAlign: 'center',
      },
    });