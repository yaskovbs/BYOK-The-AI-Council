import { AIModelConfig } from '@/types/council';
import Constants from 'expo-constants';

export const AI_MODELS: AIModelConfig[] = [
  {
    id: 'gemini',
    name: 'Gemini 3 Pro',
    role: 'Manager & Vision',
    color: '#4285f4',
    icon: '🧠',
    expertise: ['general', 'creative'],
  },
  {
    id: 'claude',
    name: 'Claude 4.5',
    role: 'Code King',
    color: '#ff6b35',
    icon: '👨‍💻',
    expertise: ['coding'],
  },
  {
    id: 'openai',
    name: 'OpenAI o1',
    role: 'Logic Master',
    color: '#10a37f',
    icon: '🧮',
    expertise: ['logic'],
  },
  {
    id: 'grok',
    name: 'Grok 3',
    role: 'News Expert',
    color: '#1da1f2',
    icon: '📰',
    expertise: ['news'],
  },
];

export const COUNCIL_CONFIG = {
  maxMessages: 100,
  thinkingDelay: 1000,
  animationDuration: 300,
};

// API Keys Configuration
export const API_KEYS = {
  gemini: Constants.expoConfig?.extra?.EXPO_PUBLIC_GEMINI_API_KEY || '',
  claude: Constants.expoConfig?.extra?.EXPO_PUBLIC_CLAUDE_API_KEY || '',
  openai: Constants.expoConfig?.extra?.EXPO_PUBLIC_OPENAI_API_KEY || '',
  grok: Constants.expoConfig?.extra?.EXPO_PUBLIC_GROK_API_KEY || '',
  openrouter: Constants.expoConfig?.extra?.EXPO_PUBLIC_OPENROUTER_API_KEY || '',
  scraperapi: Constants.expoConfig?.extra?.EXPO_PUBLIC_SCRAPERAPI_API_KEY || '',
};

// Google OAuth Configuration
export const GOOGLE_OAUTH = {
  clientId: Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '1059955046558-0s3mfdp6g427in9929jk7lanhltrsfd6.apps.googleusercontent.com',
};

// Firebase Configuration (Optional)
export const FIREBASE_CONFIG = {
  apiKey: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_APP_ID || '',
};

// Supabase Configuration (Primary Backend)
export const SUPABASE_CONFIG = {
  url: Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL || '',
  anonKey: Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
};
