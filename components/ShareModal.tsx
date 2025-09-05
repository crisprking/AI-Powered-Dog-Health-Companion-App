import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Share2,
  X,
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle,
  Send,
  ExternalLink,
  Crown,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { shareContent, generateShareContent, trackShareEvent, type ShareableContent, type ShareStats } from '@/utils/sharing';
import type { Habit } from '@/types';

const { width } = Dimensions.get('window');

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  content: ShareableContent;
  userName: string;
  isPremium?: boolean;
}

interface ShareButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  color: string;
  onPress: () => void;
  isPremium?: boolean;
  requiresPremium?: boolean;
}

const ShareButton: React.FC<ShareButtonProps> = ({ 
  icon: Icon, 
  label, 
  color, 
  onPress, 
  isPremium = false, 
  requiresPremium = false 
}) => {
  const handlePress = useCallback(() => {
    if (requiresPremium && !isPremium) {
      Alert.alert(
        'Premium Feature',
        `${label} sharing is available for Premium users. Upgrade to unlock advanced sharing features!`,
        [
          { text: 'Maybe Later', style: 'cancel' },
          { text: 'Upgrade Now', onPress: () => {/* Navigate to premium */} },
        ]
      );
      return;
    }
    onPress();
  }, [requiresPremium, isPremium, onPress, label]);

  return (
    <TouchableOpacity style={styles.shareButton} onPress={handlePress} activeOpacity={0.8}>
      <LinearGradient
        colors={[color + '20', color + '10']}
        style={styles.shareButtonGradient}
      >
        <View style={styles.shareButtonContent}>
          <View style={[styles.shareButtonIcon, { backgroundColor: color }]}>
            <Icon size={20} color={colors.background} />
            {requiresPremium && !isPremium && (
              <View style={styles.premiumBadge}>
                <Crown size={12} color={colors.primary} />
              </View>
            )}
          </View>
          <Text style={styles.shareButtonLabel}>{label}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const ShareModal: React.FC<ShareModalProps> = ({ visible, onClose, content, userName, isPremium = false }) => {
  const [isSharing, setIsSharing] = useState<string | null>(null);

  const handleShare = useCallback(async (platform: keyof typeof shareContent, platformName: string) => {
    try {
      setIsSharing(platform);
      await shareContent[platform](content);
      trackShareEvent(platform, 'manual_share', userName);
      
      // Show success feedback
      if (Platform.OS !== 'web') {
        Alert.alert('Shared!', `Successfully shared to ${platformName}!`);
      }
      
      onClose();
    } catch (error) {
      console.error(`Failed to share to ${platformName}:`, error);
      Alert.alert('Share Failed', `Unable to share to ${platformName}. Please try again.`);
    } finally {
      setIsSharing(null);
    }
  }, [content, userName, onClose]);

  const shareButtons = [
    {
      icon: Twitter,
      label: 'Twitter',
      color: '#1DA1F2',
      platform: 'twitter' as const,
      requiresPremium: false,
    },
    {
      icon: Facebook,
      label: 'Facebook',
      color: '#4267B2',
      platform: 'facebook' as const,
      requiresPremium: false,
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      color: '#25D366',
      platform: 'whatsapp' as const,
      requiresPremium: false,
    },
    {
      icon: Send,
      label: 'Telegram',
      color: '#0088CC',
      platform: 'telegram' as const,
      requiresPremium: true,
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      color: '#0077B5',
      platform: 'linkedin' as const,
      requiresPremium: true,
    },
    {
      icon: ExternalLink,
      label: 'Reddit',
      color: '#FF4500',
      platform: 'reddit' as const,
      requiresPremium: true,
    },
  ];

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Share Your Progress</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Preview */}
          <View style={styles.previewContainer}>
            <LinearGradient
              colors={[colors.accent + '20', colors.primary + '20']}
              style={styles.previewCard}
            >
              <Text style={styles.previewTitle}>{content.title}</Text>
              <Text style={styles.previewMessage} numberOfLines={3}>
                {content.message}
              </Text>
              {content.hashtags && (
                <Text style={styles.previewHashtags}>
                  {content.hashtags.map(tag => `#${tag}`).join(' ')}
                </Text>
              )}
            </LinearGradient>
          </View>

          {/* Share Buttons */}
          <ScrollView style={styles.shareButtonsContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.shareButtonsGrid}>
              {shareButtons.map((button) => (
                <ShareButton
                  key={button.platform}
                  icon={button.icon}
                  label={button.label}
                  color={button.color}
                  onPress={() => handleShare(button.platform, button.label)}
                  isPremium={isPremium}
                  requiresPremium={button.requiresPremium}
                />
              ))}
            </View>

            {/* Native Share Button */}
            {Platform.OS !== 'web' && (
              <TouchableOpacity
                style={styles.nativeShareButton}
                onPress={() => handleShare('native', 'System Share')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.primary, colors.accent]}
                  style={styles.nativeShareGradient}
                >
                  <Share2 size={20} color={colors.background} />
                  <Text style={styles.nativeShareText}>More Options</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            {/* Premium Upgrade Prompt */}
            {!isPremium && (
              <View style={styles.premiumPrompt}>
                <LinearGradient
                  colors={[colors.primary + '20', colors.primary + '10']}
                  style={styles.premiumPromptGradient}
                >
                  <Crown size={24} color={colors.primary} />
                  <Text style={styles.premiumPromptTitle}>Unlock All Platforms</Text>
                  <Text style={styles.premiumPromptText}>
                    Get access to LinkedIn, Telegram, Reddit and advanced sharing features with Premium!
                  </Text>
                </LinearGradient>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// Quick Share Component for inline sharing
interface QuickShareProps {
  type: 'progress' | 'streak' | 'achievement' | 'recommendation';
  data?: any;
  userName: string;
  isPremium?: boolean;
  style?: any;
}

export const QuickShare: React.FC<QuickShareProps> = ({ 
  type, 
  data, 
  userName, 
  isPremium = false, 
  style 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [shareContent, setShareContent] = useState<ShareableContent | null>(null);

  const handleQuickShare = useCallback(() => {
    let content: ShareableContent;

    switch (type) {
      case 'progress':
        content = generateShareContent.dailyProgress(data as ShareStats, userName);
        break;
      case 'streak':
        content = generateShareContent.streakMilestone(data as Habit, userName);
        break;
      case 'achievement':
        content = generateShareContent.achievement(data as string, userName);
        break;
      case 'recommendation':
        content = generateShareContent.appRecommendation(userName);
        break;
      default:
        return;
    }

    setShareContent(content);
    setShowModal(true);
  }, [type, data, userName]);

  return (
    <>
      <TouchableOpacity
        style={[styles.quickShareButton, style]}
        onPress={handleQuickShare}
        activeOpacity={0.8}
      >
        <Share2 size={16} color={colors.accent} />
        <Text style={styles.quickShareText}>Share</Text>
      </TouchableOpacity>

      {shareContent && (
        <ShareModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          content={shareContent}
          userName={userName}
          isPremium={isPremium}
        />
      )}
    </>
  );
};

export default ShareModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  previewContainer: {
    marginBottom: 24,
  },
  previewCard: {
    padding: 16,
    borderRadius: 12,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  previewMessage: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  previewHashtags: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '500',
  },
  shareButtonsContainer: {
    flex: 1,
  },
  shareButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  shareButton: {
    width: (width - 64) / 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  shareButtonGradient: {
    padding: 16,
  },
  shareButtonContent: {
    alignItems: 'center',
  },
  shareButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  premiumBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  nativeShareButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  nativeShareGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  nativeShareText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  premiumPrompt: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  premiumPromptGradient: {
    padding: 20,
    alignItems: 'center',
  },
  premiumPromptTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  premiumPromptText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  quickShareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderRadius: 8,
    gap: 4,
  },
  quickShareText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.accent,
  },
});