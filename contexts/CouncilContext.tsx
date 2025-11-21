import { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CouncilState, Message, AIModel, TaskType, APIKeys, PersonalityMode } from '@/types/council';

interface CouncilContextType extends CouncilState {
  sendMessage: (text: string) => Promise<void>;
  setActiveModel: (model: AIModel | null) => void;
  clearMessages: () => void;
  apiKeys: APIKeys;
  setApiKeys: (keys: APIKeys) => void;
  personality: PersonalityMode;
  setPersonality: (mode: PersonalityMode) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const CouncilContext = createContext<CouncilContextType | undefined>(undefined);

export function CouncilProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CouncilState>({
    activeModel: null,
    isThinking: false,
    messages: [],
    taskType: null,
  });

  const [apiKeys, setApiKeys] = useState<APIKeys>({});
  const [personality, setPersonalityState] = useState<PersonalityMode>('default');
  const [theme, setThemeState] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem('council_messages');
      const savedKeys = await AsyncStorage.getItem('council_api_keys');
      const savedPersonality = await AsyncStorage.getItem('council_personality');
      const savedTheme = await AsyncStorage.getItem('council_theme');

      if (savedMessages) {
        const messages = JSON.parse(savedMessages);
        setState(prev => ({ ...prev, messages }));
      }
      if (savedKeys) {
        setApiKeys(JSON.parse(savedKeys));
      }
      if (savedPersonality) {
        setPersonalityState(savedPersonality as PersonalityMode);
      }
      if (savedTheme) {
        setThemeState(savedTheme as 'light' | 'dark');
      }
    } catch (error) {
      console.log('Error loading preferences:', error);
    }
  };

  const setPersonality = useCallback(async (mode: PersonalityMode) => {
    setPersonalityState(mode);
    try {
      await AsyncStorage.setItem('council_personality', mode);
    } catch (error) {
      console.log('Error saving personality:', error);
    }
  }, []);

  const setTheme = useCallback(async (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem('council_theme', newTheme);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  }, []);

  const detectTaskType = (text: string): TaskType => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('code') || lowerText.includes('program') || lowerText.includes('function')) {
      return 'coding';
    }
    if (lowerText.includes('news') || lowerText.includes('today') || lowerText.includes('latest')) {
      return 'news';
    }
    if (lowerText.includes('logic') || lowerText.includes('solve') || lowerText.includes('calculate')) {
      return 'logic';
    }
    if (lowerText.includes('create') || lowerText.includes('design') || lowerText.includes('imagine')) {
      return 'creative';
    }
    
    return 'general';
  };

  const selectBestModel = (taskType: TaskType): AIModel => {
    switch (taskType) {
      case 'coding':
        return 'claude';
      case 'logic':
        return 'openai';
      case 'news':
        return 'grok';
      case 'creative':
      case 'general':
      default:
        return 'gemini';
    }
  };

  const sendMessage = useCallback(async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: Date.now(),
    };

    const newMessages = [...state.messages, userMessage];
    setState(prev => ({
      ...prev,
      messages: newMessages,
      isThinking: true,
    }));

    try {
      await AsyncStorage.setItem('council_messages', JSON.stringify(newMessages));
    } catch (error) {
      console.log('Error saving messages:', error);
    }

    const taskType = detectTaskType(text);
    const selectedModel = selectBestModel(taskType);

    setState(prev => ({
      ...prev,
      activeModel: selectedModel,
      taskType,
    }));

    await new Promise(resolve => setTimeout(resolve, 2000));

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: `[${selectedModel.toUpperCase()}]: This is a simulated response. Connect your API keys in Settings to enable real AI responses.`,
      sender: selectedModel,
      timestamp: Date.now(),
      modelUsed: selectedModel,
    };

    const finalMessages = [...state.messages, userMessage, aiMessage];
    setState(prev => ({
      ...prev,
      messages: finalMessages,
      isThinking: false,
      activeModel: null,
    }));

    try {
      await AsyncStorage.setItem('council_messages', JSON.stringify(finalMessages));
    } catch (error) {
      console.log('Error saving messages:', error);
    }
  }, [state.messages]);

  const setActiveModel = useCallback((model: AIModel | null) => {
    setState(prev => ({ ...prev, activeModel: model }));
  }, []);

  const clearMessages = useCallback(async () => {
    setState(prev => ({ ...prev, messages: [] }));
    try {
      await AsyncStorage.removeItem('council_messages');
    } catch (error) {
      console.log('Error clearing messages:', error);
    }
  }, []);

  return (
    <CouncilContext.Provider
      value={{
        ...state,
        sendMessage,
        setActiveModel,
        clearMessages,
        apiKeys,
        setApiKeys,
        personality,
        setPersonality,
        theme,
        setTheme,
      }}
    >
      {children}
    </CouncilContext.Provider>
  );
}
