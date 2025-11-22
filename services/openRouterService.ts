// OpenRouter.ai - Unified AI Model Access Service
// Connects to 100+ AI models through single API

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIRequest {
  model: string;
  messages: AIMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export interface AIResponse {
  id: string;
  model: string;
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  finish_reason?: string;
}

// OpenRouter model mappings for BYOK Council
export const OPENROUTER_MODELS = {
  // Gemini (Manager & Vision)
  gemini: 'google/gemini-pro-1.5',

  // Claude (Code King)
  claude: 'anthropic/claude-3.5-sonnet',

  // OpenAI (Logic Master)
  openai: 'openai/gpt-4o-mini',

  // Grok (News Expert)
  grok: 'x-ai/grok-2',

  // Additional models for expansion
  'gemini-ultra': 'google/gemini-pro',
  'claude-opus': 'anthropic/claude-3-opus',
  'gpt-4o': 'openai/gpt-4o',
  'llama-3': 'meta-llama/llama-3.1-405b-instruct',
  'mistral': 'mistralai/mistral-7b-instruct',
};

class OpenRouterService {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || '';
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chat(request: AIRequest): Promise<{ data: AIResponse | null; error: string | null }> {
    if (!this.apiKey) {
      return {
        data: null,
        error: 'OpenRouter API key not configured. Add your key in Settings.'
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://byokaicouncil.ai', // Replace with your domain
          'X-Title': 'BYOK AI Council',
        },
        body: JSON.stringify({
          model: request.model,
          messages: request.messages,
          temperature: request.temperature || 0.7,
          max_tokens: request.max_tokens || 2000,
          top_p: request.top_p || 0.9,
          frequency_penalty: request.frequency_penalty || 0,
          presence_penalty: request.presence_penalty || 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error?.message || `HTTP ${response.status}`;

        // Handle specific error cases
        if (response.status === 401) {
          return { data: null, error: 'Invalid API key. Check your OpenRouter key.' };
        }
        if (response.status === 429) {
          return { data: null, error: 'Rate limit exceeded. Try again later.' };
        }
        if (response.status === 402) {
          return { data: null, error: 'Insufficient credits. Top up your OpenRouter account.' };
        }

        return { data: null, error: errorMessage };
      }

      const data = await response.json();

      const aiResponse: AIResponse = {
        id: data.id,
        model: data.model,
        content: data.choices?.[0]?.message?.content || '',
        usage: data.usage,
        finish_reason: data.choices?.[0]?.finish_reason,
      };

      return { data: aiResponse, error: null };

    } catch (error: any) {
      console.warn('[OpenRouter] API request failed:', error);

      if (error.message?.includes('fetch')) {
        return { data: null, error: 'Network error. Check internet connection.' };
      }

      return { data: null, error: error.message || 'Unknown error occurred' };
    }
  }

  // Helper method to get model name for BYOK council
  getModelName(councilModel: string): string | null {
    return OPENROUTER_MODELS[councilModel as keyof typeof OPENROUTER_MODELS] || null;
  }

  // Method for council routing with optimized parameters
  async councilChat(
    councilModel: string,
    message: string,
    context?: string[],
    taskType?: string
  ): Promise<{ data: AIResponse | null; error: string | null }> {

    const openRouterModel = this.getModelName(councilModel);
    if (!openRouterModel) {
      return {
        data: null,
        error: `Model '${councilModel}' not found in OpenRouter mappings`
      };
    }

    // Build optimized messages based on task type
    const messages: AIMessage[] = [];

    // Add system context based on task type and council role
    const systemContexts = {
      gemini: 'You are Gemini, the wise manager and vision specialist in the AI Council. Provide strategic oversight and creative vision.',
      claude: 'You are Claude, the coding expert in the AI Council. Focus on technical implementation and code quality.',
      openai: 'You are the OpenAI Logic Master, specialized in reasoning and mathematical precision.',
      grok: 'You are Grok, the news and real-time information expert with a helpful and truthful approach.',
    };

    const systemMessage = systemContexts[councilModel as keyof typeof systemContexts];

    if (systemMessage) {
      messages.push({
        role: 'system',
        content: systemMessage + ' Respond with competence in your domain and collaborative insight.'
      });
    }

    // Add conversation context if available
    if (context && context.length > 0) {
      const contextText = context.slice(-3).join('\n'); // Last 3 messages for context
      messages.push({
        role: 'system',
        content: `Recent conversation context:\n${contextText}`
      });
    }

    // Add task-specific instructions
    if (taskType) {
      const taskInstructions = {
        coding: 'Provide clean, efficient, and well-documented code with best practices.',
        logic: 'Use step-by-step reasoning and precise mathematical or logical analysis.',
        news: 'Include current, factual information with reliable sources when possible.',
        creative: 'Be imaginative and innovative while maintaining practical applicability.',
        general: 'Provide balanced, comprehensive responses with multiple perspectives.',
      };

      const taskInstruction = taskInstructions[taskType as keyof typeof taskInstructions];
      if (taskInstruction) {
        messages.push({
          role: 'system',
          content: taskInstruction
        });
      }
    }

    // Add user message
    messages.push({
      role: 'user',
      content: message
    });

    // Optimize parameters based on task type
    const modelParams = {
      temperature: taskType === 'creative' ? 0.9 : taskType === 'logic' ? 0.3 : 0.7,
      max_tokens: taskType === 'coding' ? 3000 : taskType === 'creative' ? 2500 : 2000,
    };

    return this.chat({
      model: openRouterModel,
      messages,
      ...modelParams,
    });
  }

  // Get available models from OpenRouter
  async getAvailableModels(): Promise<{ data: any[] | null; error: string | null }> {
    if (!this.apiKey) {
      return { data: null, error: 'API key required' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        return { data: null, error: `HTTP ${response.status}` };
      }

      const data = await response.json();
      return { data: data.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  // Check API key validity and credits
  async checkAuth(): Promise<{ data: { valid: boolean; credits?: number } | null; error: string | null }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/key`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        return {
          data: {
            valid: true,
            credits: data.credits
          },
          error: null
        };
      } else if (response.status === 401) {
        return {
          data: { valid: false },
          error: 'Invalid API key'
        };
      } else {
        return {
          data: null,
          error: `Auth check failed: ${response.status}`
        };
      }
    } catch (error: any) {
      return {
        data: null,
        error: `Network error: ${error.message}`
      };
    }
  }
}

export const openRouterService = new OpenRouterService();
export default openRouterService;
