import { createContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { CouncilState, Message, AIModel, TaskType, APIKeys } from '@/types/council';
import { openRouterService } from '@/services/openRouterService';

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

    try {
      // Prepare conversation context for the AI
      const previousMessages = state.messages
        .slice(-6) // Get last 6 messages for context (3 exchanges)
        .map(msg => `[${msg.sender.toUpperCase()}]: ${msg.text}`)
        .filter(text => !text.includes('This is a simulated response')); // Filter out old simulated responses

      // Set API key if available from apiKeys or environment
      const openRouterKey = apiKeys.openrouter || process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
      if (openRouterKey) {
        openRouterService.setApiKey(openRouterKey);
      }

      // Call OpenRouter for real AI response
      const result = await openRouterService.councilChat(
        selectedModel,
        text,
        previousMessages,
        taskType
      );

      if (result.error) {
        // Handle API errors gracefully with helpful messages
        const errorMessage = `[${selectedModel.toUpperCase()}]: ${result.error}`;
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: errorMessage,
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

        return;
      }

      if (result.data) {
        // Format the AI response with model identification
        const formattedResponse = `[${selectedModel.toUpperCase()}]: ${result.data.content || 'No response generated'}`;

        const aiMessage: Message = {
          id: result.data.id || (Date.now() + 1).toString(),
          text: formattedResponse,
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
      } else {
        // Fallback if no data received
        const fallbackMessage = `[${selectedModel.toUpperCase()}]: Unable to generate response at this time. Please check your OpenRouter API key.`;
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: fallbackMessage,
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
      }
    } catch (error: any) {
      // Handle unexpected errors
      console.error('[CouncilContext] Error sending message:', error);

      const errorMessage = `[SYSTEM]: An unexpected error occurred. Please try again.`;
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        sender: 'gemini', // Fallback to gemini for system messages
        timestamp: Date.now(),
        modelUsed: selectedModel,
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isThinking: false,
        activeModel: null,
      }));
    }
  }, [state.messages, apiKeys]);

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
