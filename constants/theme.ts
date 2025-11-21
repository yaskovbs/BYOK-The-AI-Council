// Modern Dark Theme with Gradients
export const theme = {
  colors: {
    // Primary colors
    primary: '#00D9FF',
    primaryDark: '#0099CC',
    primaryLight: '#33E0FF',
    
    // Background colors
    background: '#0A0E27',
    surface: '#151932',
    surfaceLight: '#1E2340',
    
    // Text colors
    text: '#FFFFFF',
    textSecondary: '#A0AEC0',
    textMuted: '#64748B',
    
    // UI colors
    border: '#2D3748',
    error: '#FF4757',
    success: '#2ED573',
    warning: '#FFA502',
    info: '#00D9FF',
    
    // AI Model colors
    gemini: '#4285F4',
    claude: '#E06C75',
    openai: '#10A37F',
    grok: '#FFA500',
    
    // Gradients
    gradientStart: '#00D9FF',
    gradientEnd: '#8B5CF6',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
  
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#00D9FF',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  
  animations: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
};

export type Theme = typeof theme;
