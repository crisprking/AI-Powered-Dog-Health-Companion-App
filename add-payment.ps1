# Read the current App.tsx
$content = Get-Content App.tsx -Raw

# Add payment imports
$content = $content -replace "import \* as Haptics from 'expo-haptics';", "import * as Haptics from 'expo-haptics';
import { PaymentScreen } from './src/components/PaymentScreen';
import { PaymentService } from './src/services/PaymentService';
import { Profile } from './src/lib/supabase';"

# Add payment state variables
$content = $content -replace "  const \[dailyGoal, setDailyGoal\] = useState\(\{ walks: 2, meals: 3, play: 30, completed: 0 \}\);", "  const [dailyGoal, setDailyGoal] = useState({ walks: 2, meals: 3, play: 30, completed: 0 });
  const [showPaymentScreen, setShowPaymentScreen] = useState(false);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);"

# Fix useEffect dependency
$content = $content -replace "  }, \[startHeartbeatAnimation\]\);", "  }, []);"

# Update handlePremiumFeatures
$content = $content -replace "    Alert\.alert\(\s*'⭐ Premium Features',\s*'Unlock advanced AI insights, unlimited vet consultations, and priority support!',\s*\[\s*\{ text: 'Upgrade Now', onPress: \(\) => console\.log\('Opening premium upgrade\.\.\.'\) \},\s*\{ text: 'Learn More', onPress: \(\) => console\.log\('Showing premium features\.\.\.'\) \},\s*\{ text: 'Cancel', style: 'cancel' \}\s*\]\s*\);", "    setShowPaymentScreen(true);
    addXP(5);
    pulseAnimationEffect();"

# Add PaymentScreen component
$content = $content -replace "      <StatusBar style=`"light`" />", "      <PaymentScreen
        visible={showPaymentScreen}
        onClose={() => setShowPaymentScreen(false)}
        onSubscriptionChange={(isPremium) => {
          setIsPremium(isPremium);
          setShowPaymentScreen(false);
        }}
      />
      <StatusBar style=`"light`" />"

# Write the updated content
Set-Content App.tsx $content -Encoding UTF8

Write-Host "Payment integration added successfully!"

