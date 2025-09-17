export const Colors = {
  light: {
    primary: '#4CAF50',
    primaryDark: '#2E7D32',
    secondary: '#FFD700',
    accent: '#FF6B6B',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#333333',
    textSecondary: '#666666',
    textLight: '#999999',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
    
    // Health status colors
    excellent: '#4CAF50',
    good: '#8BC34A',
    fair: '#FFC107',
    poor: '#FF9800',
    critical: '#F44336',
    
    // Severity colors
    low: '#4CAF50',
    medium: '#FFC107',
    high: '#FF9800',
    critical: '#F44336',
    
    // Gradient colors
    gradientStart: '#4CAF50',
    gradientEnd: '#2E7D32',
    emergencyGradient: ['#F44336', '#D32F2F'],
    
    // Card colors
    cardBackground: '#FFFFFF',
    cardShadow: 'rgba(0, 0, 0, 0.1)',
    
    // Button colors
    buttonPrimary: '#4CAF50',
    buttonSecondary: '#E8F5E8',
    buttonEmergency: '#F44336',
    buttonDisabled: '#E0E0E0',
    
    // Input colors
    inputBackground: '#FFFFFF',
    inputBorder: '#E0E0E0',
    inputFocus: '#4CAF50',
    
    // Status colors
    online: '#4CAF50',
    offline: '#9E9E9E',
    pending: '#FFC107',
  },
  
  dark: {
    primary: '#66BB6A',
    primaryDark: '#388E3C',
    secondary: '#FFD54F',
    accent: '#FF8A80',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    textLight: '#808080',
    success: '#66BB6A',
    warning: '#FFD54F',
    error: '#EF5350',
    info: '#42A5F5',
    
    // Health status colors
    excellent: '#66BB6A',
    good: '#9CCC65',
    fair: '#FFD54F',
    poor: '#FFB74D',
    critical: '#EF5350',
    
    // Severity colors
    low: '#66BB6A',
    medium: '#FFD54F',
    high: '#FFB74D',
    critical: '#EF5350',
    
    // Gradient colors
    gradientStart: '#66BB6A',
    gradientEnd: '#388E3C',
    emergencyGradient: ['#EF5350', '#D32F2F'],
    
    // Card colors
    cardBackground: '#1E1E1E',
    cardShadow: 'rgba(0, 0, 0, 0.3)',
    
    // Button colors
    buttonPrimary: '#66BB6A',
    buttonSecondary: '#2E2E2E',
    buttonEmergency: '#EF5350',
    buttonDisabled: '#424242',
    
    // Input colors
    inputBackground: '#2E2E2E',
    inputBorder: '#424242',
    inputFocus: '#66BB6A',
    
    // Status colors
    online: '#66BB6A',
    offline: '#808080',
    pending: '#FFD54F',
  }
};

export const getHealthStatusColor = (status: string, isDark: boolean = false): string => {
  const colorMap = isDark ? Colors.dark : Colors.light;
  
  switch (status) {
    case 'excellent': return colorMap.excellent;
    case 'good': return colorMap.good;
    case 'fair': return colorMap.fair;
    case 'poor': return colorMap.poor;
    case 'critical': return colorMap.critical;
    default: return colorMap.textSecondary;
  }
};

export const getSeverityColor = (severity: string, isDark: boolean = false): string => {
  const colorMap = isDark ? Colors.dark : Colors.light;
  
  switch (severity) {
    case 'low': return colorMap.low;
    case 'medium': return colorMap.medium;
    case 'high': return colorMap.high;
    case 'critical': return colorMap.critical;
    default: return colorMap.textSecondary;
  }
};

