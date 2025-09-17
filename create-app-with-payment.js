const fs = require('fs');

// Read the current App.tsx
let content = fs.readFileSync('App.tsx', 'utf8');

// Add payment imports after Haptics import
content = content.replace(
  "import * as Haptics from 'expo-haptics';",
  "import * as Haptics from 'expo-haptics';\nimport { PaymentScreen } from './src/components/PaymentScreen';\nimport { PaymentService } from './src/services/PaymentService';\nimport { Profile } from './src/lib/supabase';"
);

// Add payment state variables after dailyGoal
content = content.replace(
  "  const [dailyGoal, setDailyGoal] = useState({ walks: 2, meals: 3, play: 30, completed: 0 });",
  "  const [dailyGoal, setDailyGoal] = useState({ walks: 2, meals: 3, play: 30, completed: 0 });\n  const [showPaymentScreen, setShowPaymentScreen] = useState(false);\n  const [userProfile, setUserProfile] = useState<Profile | null>(null);"
);

// Fix the useEffect dependency issue
content = content.replace(
  "  }, [startHeartbeatAnimation]);",
  "  }, []);"
);

// Update handlePremiumFeatures function
content = content.replace(
  /  const handlePremiumFeatures = \(\) => \{\s*if \(Platform\.OS === 'ios'\) \{\s*Haptics\.impactAsync\(Haptics\.ImpactFeedbackStyle\.Heavy\);\s*\}\s*Alert\.alert\(\s*'⭐ Premium Features',\s*'Unlock advanced AI insights, unlimited vet consultations, and priority support!',\s*\[\s*\{ text: 'Upgrade Now', onPress: \(\) => console\.log\('Opening premium upgrade\.\.\.'\) \},\s*\{ text: 'Learn More', onPress: \(\) => console\.log\('Showing premium features\.\.\.'\) \},\s*\{ text: 'Cancel', style: 'cancel' \}\s*\]\s*\);\s*\};/s,
  `  const handlePremiumFeatures = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    setShowPaymentScreen(true);
    addXP(5);
    pulseAnimationEffect();
  };`
);

// Add PaymentScreen component before StatusBar
content = content.replace(
  "      <StatusBar style=\"light\" />",
  `      <PaymentScreen
        visible={showPaymentScreen}
        onClose={() => setShowPaymentScreen(false)}
        onSubscriptionChange={(isPremium) => {
          setIsPremium(isPremium);
          setShowPaymentScreen(false);
        }}
      />
      <StatusBar style="light" />`
);

// Fix the duplicate metric style by removing the second one
content = content.replace(
  /  metric: \{\s*alignItems: 'center',\s*flex: 1,\s*\},/,
  ""
);

// Write the updated content
fs.writeFileSync('App.tsx', content);

console.log('Payment integration added successfully!');

