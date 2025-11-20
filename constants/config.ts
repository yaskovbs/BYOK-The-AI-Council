import { AIModelConfig } from '@/types/council';

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
