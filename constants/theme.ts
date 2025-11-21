export const theme = {
  colors: {
    background: '#0a0e1a',
    backgroundLight: '#141824',
    surface: '#1a1f35',
    surfaceLight: '#252b42',
    
    primary: '#00d4ff',
    primaryDark: '#0099cc',
    secondary: '#7c3aed',
    accent: '#f472b6',
    
    gemini: '#4285f4',
    claude: '#ff6b35',
    openai: '#10a37f',
    grok: '#1da1f2',
    
    text: '#ffffff',
    textSecondary: '#9ca3af',
    textMuted: '#6b7280',
    
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    danger: '#dc3545',
    
    border: '#2d3548',
    shadow: 'rgba(0, 0, 0, 0.5)',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.37,
      shadowRadius: 7.49,
      elevation: 8,
    },
  },
};
