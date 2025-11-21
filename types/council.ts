export type AIModel = 'gemini' | 'claude' | 'openai' | 'grok';

export type TaskType = 'coding' | 'logic' | 'news' | 'creative' | 'general';

export interface AIModelConfig {
  id: AIModel;
  name: string;
  role: string;
  color: string;
  icon: string;
  expertise: TaskType[];
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | AIModel;
  timestamp: number;
  modelUsed?: AIModel;
}

export interface CouncilState {
  activeModel: AIModel | null;
  isThinking: boolean;
  messages: Message[];
  taskType: TaskType | null;
}

export interface APIKeys {
  gemini?: string;
  claude?: string;
  openai?: string;
  grok?: string;
  firebase?: string;
}

export interface RobotCommand {
  type: 'move' | 'turn' | 'stop' | 'camera' | 'speak';
  value?: number | string;
}

export interface CodeFile {
  id: string;
  filename: string;
  content: string;
  language: string;
  filePath?: string;
  repoName?: string;
  isFromGithub: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GitHubRepo {
  id?: string;
  name: string;
  fullName: string;
  description?: string;
  url: string;
  private: boolean;
  language?: string;
  updatedAt: string;
}

export interface WebPage {
  id?: string;
  url: string;
  title: string;
  content: string;
  visitedAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  createdAt?: string;
}

export type PersonalityMode = 'butler' | 'buddy' | 'guard' | 'default';

export interface PersonalityConfig {
  id: PersonalityMode;
  name: string;
  description: string;
  icon: string;
  systemPrompt: string;
  color: string;
}

export interface UserPreferences {
  userId: string;
  theme: 'light' | 'dark' | 'auto';
  personality: PersonalityMode;
  language: 'en' | 'he';
  notificationsEnabled: boolean;
}
