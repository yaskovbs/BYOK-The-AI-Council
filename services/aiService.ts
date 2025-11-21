import { API_KEYS } from '@/constants/config';
import { AIModel } from '@/types/council';

interface AIServiceConfig {
  model: AIModel;
  prompt: string;
  apiKey?: string;
}

interface AIResponse {
  text: string;
  error: string | null;
}

export const aiService = {
  async sendMessage(config: AIServiceConfig): Promise<AIResponse> {
    const { model, prompt, apiKey } = config;

    try {
      switch (model) {
        case 'gemini':
          return await this.callGemini(prompt, apiKey || API_KEYS.gemini);
        case 'claude':
          return await this.callClaude(prompt, apiKey || API_KEYS.claude);
        case 'openai':
          return await this.callOpenAI(prompt, apiKey || API_KEYS.openai);
        case 'grok':
          return await this.callGrok(prompt, apiKey || API_KEYS.grok);
        default:
          return { text: '', error: 'Unknown AI model' };
      }
    } catch (error: any) {
      return { text: '', error: error.message || 'AI service error' };
    }
  },

  async callGemini(prompt: string, apiKey: string): Promise<AIResponse> {
    if (!apiKey || apiKey === 'your_gemini_api_key') {
      return { 
        text: '', 
        error: 'Please add your Gemini API key in Settings' 
      };
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
      return { text, error: null };
    } catch (error: any) {
      return { text: '', error: `Gemini: ${error.message}` };
    }
  },

  async callClaude(prompt: string, apiKey: string): Promise<AIResponse> {
    if (!apiKey || apiKey === 'your_claude_api_key') {
      return { 
        text: '', 
        error: 'Please add your Claude API key in Settings' 
      };
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4096,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.content?.[0]?.text || 'No response';
      return { text, error: null };
    } catch (error: any) {
      return { text: '', error: `Claude: ${error.message}` };
    }
  },

  async callOpenAI(prompt: string, apiKey: string): Promise<AIResponse> {
    if (!apiKey || apiKey === 'your_openai_api_key') {
      return { 
        text: '', 
        error: 'Please add your OpenAI API key in Settings' 
      };
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 4096,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || 'No response';
      return { text, error: null };
    } catch (error: any) {
      return { text: '', error: `OpenAI: ${error.message}` };
    }
  },

  async callGrok(prompt: string, apiKey: string): Promise<AIResponse> {
    if (!apiKey || apiKey === 'your_grok_api_key') {
      return { 
        text: '', 
        error: 'Please add your Grok API key in Settings' 
      };
    }

    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'grok-beta',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 4096,
        }),
      });

      if (!response.ok) {
        throw new Error(`Grok API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || 'No response';
      return { text, error: null };
    } catch (error: any) {
      return { text: '', error: `Grok: ${error.message}` };
    }
  },

  async callOpenRouter(prompt: string, model: string): Promise<AIResponse> {
    if (!API_KEYS.openrouter) {
      return { 
        text: '', 
        error: 'OpenRouter API key not configured' 
      };
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEYS.openrouter}`,
          'HTTP-Referer': 'https://theaicouncil.app',
          'X-Title': 'The AI Council',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 4096,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || 'No response';
      return { text, error: null };
    } catch (error: any) {
      return { text: '', error: `OpenRouter: ${error.message}` };
    }
  },

  determineTaskType(prompt: string): AIModel {
    const lowerPrompt = prompt.toLowerCase();

    if (
      lowerPrompt.includes('code') ||
      lowerPrompt.includes('function') ||
      lowerPrompt.includes('debug') ||
      lowerPrompt.includes('fix') ||
      lowerPrompt.includes('implement')
    ) {
      return 'claude';
    }

    if (
      lowerPrompt.includes('calculate') ||
      lowerPrompt.includes('solve') ||
      lowerPrompt.includes('logic') ||
      lowerPrompt.includes('math')
    ) {
      return 'openai';
    }

    if (
      lowerPrompt.includes('news') ||
      lowerPrompt.includes('latest') ||
      lowerPrompt.includes('current') ||
      lowerPrompt.includes('today')
    ) {
      return 'grok';
    }

    return 'gemini';
  },
};
