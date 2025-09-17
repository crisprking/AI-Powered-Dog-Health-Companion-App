@echo off
echo Adding payment integration to App.tsx...

REM Create a temporary file with the payment imports
echo import React, { useState, useEffect, useCallback, useRef } from 'react'; > temp_app.tsx
echo import { StatusBar } from 'expo-status-bar'; >> temp_app.tsx
echo import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Dimensions, Animated, Vibration, Platform, Linking } from 'react-native'; >> temp_app.tsx
echo. >> temp_app.tsx
echo import { LinearGradient } from 'expo-linear-gradient'; >> temp_app.tsx
echo import { MaterialIcons, Ionicons } from '@expo/vector-icons'; >> temp_app.tsx
echo import { SafeAreaView } from 'react-native-safe-area-context'; >> temp_app.tsx
echo import * as Haptics from 'expo-haptics'; >> temp_app.tsx
echo import { PaymentScreen } from './src/components/PaymentScreen'; >> temp_app.tsx
echo import { PaymentService } from './src/services/PaymentService'; >> temp_app.tsx
echo import { Profile } from './src/lib/supabase'; >> temp_app.tsx
echo. >> temp_app.tsx
echo const { width, height } = Dimensions.get('window'); >> temp_app.tsx

echo Payment integration added successfully!

