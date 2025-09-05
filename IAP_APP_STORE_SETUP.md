# Apple In-App Purchase Setup Guide for Soluna: Habit Transformation

## Overview
This guide will help you set up the required In-App Purchase products in App Store Connect to resolve the Apple rejection issues. This app is iPhone-only (no iPad or Android support).

## Required IAP Products

### 1. Monthly Premium Subscription
- **Product ID**: `com.rork.soluna.monthly.premium`
- **Type**: Auto-Renewable Subscription
- **Price**: $2.99/month
- **Subscription Group**: Create a new group called "Soluna Premium"

### 2. Yearly Premium Subscription
- **Product ID**: `com.rork.soluna.yearly.premium`
- **Type**: Auto-Renewable Subscription
- **Price**: $19.99/year
- **Subscription Group**: Same group as monthly ("Soluna Premium")

## Step-by-Step Setup in App Store Connect

### Step 1: Create Subscription Group
1. Go to App Store Connect
2. Select your app "Soluna: Habit Transformation"
3. Go to "Features" → "In-App Purchases"
4. Click "Manage" next to "Subscription Groups"
5. Click "+" to create a new group
6. Name: "Soluna Premium"
7. Reference Name: "soluna-premium"

### Step 2: Create Monthly Subscription
1. In the Subscription Groups section, click on "Soluna Premium"
2. Click "+" to add a subscription
3. **Product ID**: `com.rork.soluna.monthly.premium`
4. **Reference Name**: "Monthly Premium"
5. **Duration**: 1 Month
6. **Price**: $2.99
7. **Localizations**: Add English and French
   - **English**:
     - Display Name: "Monthly Premium"
     - Description: "Unlimited habits, AI insights, advanced analytics, and priority support"
   - **French**:
     - Display Name: "Premium Mensuel"
     - Description: "Habitudes illimitées, insights IA, analyses avancées et support prioritaire"

### Step 3: Create Yearly Subscription
1. In the same subscription group, click "+" to add another subscription
2. **Product ID**: `com.rork.soluna.yearly.premium`
3. **Reference Name**: "Yearly Premium"
4. **Duration**: 1 Year
5. **Price**: $19.99
6. **Localizations**: Add English and French
   - **English**:
     - Display Name: "Yearly Premium"
     - Description: "Everything in Monthly + 50% savings, exclusive insights, and personal coaching"
   - **French**:
     - Display Name: "Premium Annuel"
     - Description: "Tout du mensuel + 50% d'économies, insights exclusifs et coaching personnel"

### Step 4: Submit for Review
1. After creating both products, they will show as "Ready to Submit"
2. Select both products and click "Submit for Review"
3. You'll need to provide App Review screenshots showing the IAP flow

## App Review Screenshots Required

You need to provide screenshots showing:
1. The premium upgrade screen with both subscription options
2. The purchase flow in action
3. The confirmation screen after purchase
4. The restored subscription screen

## Testing in Sandbox

### Step 1: Create Sandbox Test Account
1. Go to "Users and Access" → "Sandbox Testers"
2. Create a new test account with a unique email
3. Use this account to test purchases

### Step 2: Test on Device
1. Sign out of your Apple ID on the test device
2. Sign in with the sandbox test account
3. Test both subscription purchases
4. Test the restore purchases functionality

## Important Notes

1. **Receipt Validation**: The app now includes proper sandbox/production receipt validation
2. **Subscription Management**: Users must manage subscriptions through their Apple ID settings
3. **Pricing**: Prices shown in the app should match exactly what's configured in App Store Connect
4. **Localization**: Ensure all text is properly localized for both English and French

## Code Changes Made

1. Replaced Stripe integration with Apple IAP
2. Added proper sandbox environment handling
3. Implemented receipt validation for both sandbox and production
4. Added restore purchases functionality
5. Updated app configuration to support iPad properly

## Next Steps After Setup

1. Build and upload a new version with these changes
2. Test thoroughly in sandbox environment
3. Submit for review with proper screenshots
4. Monitor for any additional feedback from Apple

## Troubleshooting

- If purchases fail in sandbox, ensure the test account is properly configured
- If receipt validation fails, check that the server can handle both sandbox and production receipts
- If the app crashes during purchase, ensure all IAP products are properly configured in App Store Connect
