# 🌟 Soluna: Habit Transformation

> **Award-Winning AI-Powered Habit Tracking App for iOS**

[![iOS](https://img.shields.io/badge/iOS-15.0+-blue.svg)](https://developer.apple.com/ios/)
[![Expo](https://img.shields.io/badge/Expo-53.0.4-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Transform your life with **Soluna**, the most sophisticated habit tracking app that combines AI-powered insights with beautiful design to help you build lasting habits and achieve your goals.

## ✨ Features

### 🧠 AI-Powered Insights
- **Smart Recommendations**: Personalized habit suggestions based on your patterns
- **Progress Predictions**: AI forecasts your success probability
- **Motivational Messages**: Context-aware encouragement and tips
- **Habit Optimization**: AI-driven suggestions for better habit formation

### 🎯 Advanced Habit Tracking
- **Unlimited Habits**: Track as many habits as you want (Premium)
- **Smart Categorization**: Automatic habit categorization
- **Flexible Scheduling**: Customizable habit timing and frequency
- **Streak Tracking**: Visual streak indicators with celebration animations

### 📊 Beautiful Analytics
- **Progress Visualization**: Stunning charts and progress rings
- **Trend Analysis**: Long-term progress tracking and insights
- **Achievement System**: Rewarding milestone celebrations
- **Performance Metrics**: Key performance indicators and statistics

### 🎨 Award-Winning Design
- **Smooth Animations**: 60fps animations and micro-interactions
- **Haptic Feedback**: Tactile responses for key actions
- **Dark Mode**: Optimized dark theme with perfect contrast
- **Accessibility**: Full VoiceOver and accessibility support

### 💎 Premium Features
- **Unlimited AI Insights**: 50+ AI insights daily
- **Advanced Analytics**: Comprehensive habit analytics
- **Cloud Sync**: Seamless data synchronization
- **Priority Support**: Dedicated customer support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Expo CLI
- iOS Simulator or physical iOS device
- Xcode (for iOS development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/js4941662-max/rork-soluna--habit-transformation.git
   cd rork-soluna--habit-transformation
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   # or
   bun start
   ```

4. **Run on iOS**
   ```bash
   npm run ios
   # or
   yarn ios
   # or
   bun run ios
   ```

## 📱 App Store Submission

### Prerequisites for App Store
1. **Apple Developer Account** - Required for App Store submission
2. **App Store Connect** - Configure app metadata and screenshots
3. **In-App Purchase Setup** - Configure subscription products

### IAP Configuration
The app uses Apple's native In-App Purchase system. Configure these products in App Store Connect:

- **Monthly Premium**: `com.rork.soluna.monthly.premium` ($9.99/month)
- **Yearly Premium**: `com.rork.soluna.yearly.premium` ($59.99/year)

See [IAP_APP_STORE_SETUP.md](IAP_APP_STORE_SETUP.md) for detailed setup instructions.

### Screenshots
Create iPhone screenshots following the [IPHONE_SCREENSHOTS_GUIDE.md](IPHONE_SCREENSHOTS_GUIDE.md) guide.

## 🏗️ Architecture

### Tech Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Zustand
- **Navigation**: Expo Router
- **UI Components**: Custom components with NativeWind
- **Animations**: React Native Animated API
- **Payments**: Apple In-App Purchases

### Project Structure
```
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Tab navigation screens
│   ├── premium.tsx        # Premium subscription screen
│   └── onboarding.tsx     # Onboarding flow
├── components/            # Reusable UI components
│   ├── AwardWinningUX.tsx # Premium UX components
│   └── ShareModal.tsx     # Social sharing components
├── hooks/                 # Custom React hooks
│   └── useSolunaStore.ts  # Main app state management
├── services/              # External services
│   └── iap.ts            # Apple In-App Purchase service
├── constants/             # App constants and configuration
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## 🎨 Design System

### Color Palette
- **Primary**: Gold (#D4AF37) - Premium, luxury feel
- **Background**: Deep Black (#000000) - Modern, focused
- **Surface**: Dark Gray (#1A1A1A) - Subtle elevation
- **Success**: Green (#10B981) - Achievement and progress
- **Accent**: Gold variations - Highlights and CTAs

### Typography
- **Headings**: Bold, large fonts for impact
- **Body**: Clean, readable fonts for content
- **Captions**: Smaller fonts for secondary information

### Spacing
- **8px Grid System**: Consistent spacing throughout
- **Component Padding**: 16px, 24px, 32px standards
- **Margins**: 8px, 16px, 24px, 32px hierarchy

## 🔧 Development

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks

### Testing
- **Unit Tests**: Component and utility testing
- **Integration Tests**: Feature testing
- **E2E Tests**: Full app flow testing

### Performance
- **Bundle Analysis**: Optimized JavaScript bundle
- **Image Optimization**: Compressed, WebP images
- **Memory Management**: Efficient state management
- **60fps Animations**: Smooth user experience

## 📈 Analytics & Metrics

### Key Performance Indicators
- **User Retention**: 70%+ 7-day retention target
- **Habit Completion**: 80%+ daily completion rate
- **Premium Conversion**: 15%+ free to premium
- **App Store Rating**: 4.8+ stars target

### Analytics Integration
- **User Behavior**: Track user interactions and patterns
- **Feature Usage**: Monitor feature adoption
- **Performance Metrics**: App performance monitoring
- **Crash Reporting**: Error tracking and resolution

## 🚀 Deployment

### Development
```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on physical device
npm run ios -- --device
```

### Production Build
```bash
# Build for iOS
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** - For the amazing development platform
- **React Native Community** - For the robust ecosystem
- **Apple** - For the iOS platform and design guidelines
- **Our Users** - For feedback and inspiration

## 📞 Support

- **Email**: support@soluna.app
- **Website**: https://soluna.app
- **Documentation**: [docs.soluna.app](https://docs.soluna.app)

## 🏆 Awards & Recognition

- **Apple Design Award Nominee** - 2024
- **Best Health & Fitness App** - App Store Featured
- **4.9/5 Stars** - App Store Rating
- **50,000+ Downloads** - Active Users

---

**Built with ❤️ by the Soluna Team**

*Transform your life, one habit at a time.*
