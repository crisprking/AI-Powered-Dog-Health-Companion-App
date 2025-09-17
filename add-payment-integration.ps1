# PowerShell script to add payment integration to App.tsx

# Read the current App.tsx
$content = Get-Content App.tsx -Raw

# Add payment imports after the Haptics import
$content = $content -replace "import \* as Haptics from 'expo-haptics';", "import * as Haptics from 'expo-haptics';
import { PaymentScreen } from './src/components/PaymentScreen';
import { PaymentService } from './src/services/PaymentService';
import { Profile } from './src/lib/supabase';"

# Add payment state variables after the dailyGoal state
$content = $content -replace "  const \[dailyGoal, setDailyGoal\] = useState\(\{ walks: 2, meals: 3, play: 30, completed: 0 \}\);", "  const [dailyGoal, setDailyGoal] = useState({ walks: 2, meals: 3, play: 30, completed: 0 });
  const [showPaymentScreen, setShowPaymentScreen] = useState(false);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);"

# Update handlePremiumFeatures function
$content = $content -replace "  const handlePremiumFeatures = \(\) => \{
    if \(Platform\.OS === 'ios'\) \{
      Haptics\.impactAsync\(Haptics\.ImpactFeedbackStyle\.Heavy\);
    \}
    Alert\.alert\(
      '⭐ Premium Features',
      'Unlock advanced AI insights, unlimited vet consultations, and priority support!',
      \[
        \{ text: 'Upgrade Now', onPress: \(\) => console\.log\('Opening premium upgrade\.\.\.'\) \},
        \{ text: 'Learn More', onPress: \(\) => console\.log\('Showing premium features\.\.\.'\) \},
        \{ text: 'Cancel', style: 'cancel' \}
      \]
    \);
  \};", "  const handlePremiumFeatures = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    setShowPaymentScreen(true);
    addXP(5);
    pulseAnimationEffect();
  };"

# Add PaymentScreen component before the closing </SafeAreaView>
$content = $content -replace "      <StatusBar style=`"light`" />", "      <PaymentScreen
        visible={showPaymentScreen}
        onClose={() => setShowPaymentScreen(false)}
        onSubscriptionChange={(isPremium) => {
          setIsPremium(isPremium);
          setShowPaymentScreen(false);
        }}
      />
      <StatusBar style=`"light`" />"

# Write the updated content back to App.tsx
Set-Content App.tsx $content

Write-Host "Payment integration added successfully!"

