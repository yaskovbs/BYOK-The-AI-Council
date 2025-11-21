import { createContext, useState, useCallback, ReactNode } from 'react';
import { CouncilState, Message, AIModel, TaskType, APIKeys } from '@/types/council';

interface CouncilContextType extends CouncilState {
  sendMessage: (text: string) => Promise<void>;
  setActiveModel: (model: AIModel | null) => void;
  clearMessages: () => void;
  apiKeys: APIKeys;
  setApiKeys: (keys: APIKeys) => void;
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

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isThinking: true,
    }));

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

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, aiMessage],
      isThinking: false,
      activeModel: null,
    }));
  }, []);

  const setActiveModel = useCallback((model: AIModel | null) => {
    setState(prev => ({ ...prev, activeModel: model }));
  }, []);

  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, messages: [] }));
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
      }}
    >
      {children}
    </CouncilContext.Provider>
  );
}
