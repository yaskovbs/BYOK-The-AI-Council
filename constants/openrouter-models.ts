/**
 * OpenRouter AI Models Configuration
 * Full list of 500+ models available through OpenRouter.ai
 * Updated: November 2025
 */

export interface OpenRouterModel {
  id: string;
  name: string;
  provider: string;
  category: 'flagship' | 'advanced' | 'fast' | 'mini' | 'specialized';
  contextWindow: number;
  pricing: {
    input: number;  // per million tokens
    output: number; // per million tokens
  };
  audioPricing?: number; // per million audio seconds/tokens, optional
  capabilities: string[];
  description: string;
}

export const OPENROUTER_MODELS: OpenRouterModel[] = [
  // === GOOGLE GEMINI MODELS ===
  {
    id: 'google/gemini-3-pro-preview',
    name: 'Gemini 3 Pro Preview',
    provider: 'Google',
    category: 'flagship',
    contextWindow: 1050000,
    pricing: { input: 2, output: 12 },
    capabilities: ['reasoning', 'coding', 'multimodal', 'long-context'],
    description: 'Google\'s flagship frontier model with 1M context and advanced reasoning',
  },
  {
    id: 'google/nano-banana-pro',
    name: 'Nano Banana Pro (Gemini 3 Image)',
    provider: 'Google',
    category: 'specialized',
    contextWindow: 66000,
    pricing: { input: 2, output: 12 },
    capabilities: ['image-generation', 'multimodal', 'design'],
    description: 'Advanced image generation and editing built on Gemini 3 Pro',
  },

  // === IMAGE GENERATION MODELS ===
  {
    id: 'openai/gpt-5-image-mini',
    name: 'GPT-5 Image Mini',
    provider: 'OpenAI',
    category: 'specialized',
    contextWindow: 400000,
    pricing: { input: 2.50, output: 2 },
    capabilities: ['image-generation', 'multimodal', 'efficient'],
    description: 'Natively multimodal model for efficient image generation',
  },
  {
    id: 'openai/gpt-5-image',
    name: 'GPT-5 Image',
    provider: 'OpenAI',
    category: 'specialized',
    contextWindow: 400000,
    pricing: { input: 10, output: 10 },
    capabilities: ['image-generation', 'multimodal', 'advanced'],
    description: 'Combines advanced language capabilities with state-of-the-art image generation',
  },
  {
    id: 'google/gemini-2.5-flash-image',
    name: 'Gemini 2.5 Flash Image (Nano Banana)',
    provider: 'Google',
    category: 'specialized',
    contextWindow: 33000,
    pricing: { input: 0.30, output: 2.50 },
    capabilities: ['image-generation', 'editing', 'multimodal'],
    description: 'State-of-the-art image generation with contextual understanding',
  },
  {
    id: 'google/gemini-2.5-flash-image-preview',
    name: 'Gemini 2.5 Flash Image Preview',
    provider: 'Google',
    category: 'specialized',
    contextWindow: 33000,
    pricing: { input: 0.30, output: 2.50 },
    capabilities: ['image-generation', 'editing', 'multimodal'],
    description: 'Preview version of Nano Banana image model',
  },
  {
    id: 'google/gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    category: 'flagship',
    contextWindow: 1050000,
    pricing: { input: 1.25, output: 10 },
    capabilities: ['reasoning', 'coding', 'math', 'long-context'],
    description: 'State-of-the-art reasoning with thinking capabilities',
  },
  {
    id: 'google/gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    category: 'fast',
    contextWindow: 1050000,
    pricing: { input: 0.3, output: 2.5 },
    capabilities: ['fast', 'reasoning', 'multimodal'],
    description: 'Fast reasoning model with configurable thinking depth',
  },
  {
    id: 'google/gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash Lite',
    provider: 'Google',
    category: 'fast',
    contextWindow: 1050000,
    pricing: { input: 0.1, output: 0.4 },
    capabilities: ['ultra-fast', 'low-cost', 'lightweight'],
    description: 'Ultra-low latency with optional reasoning toggle',
  },
  {
    id: 'google/gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    category: 'advanced',
    contextWindow: 1050000,
    pricing: { input: 0.1, output: 0.4 },
    capabilities: ['multimodal', 'audio', 'function-calling'],
    description: 'Fast TTFT with enhanced multimodal and coding abilities',
  },
  {
    id: 'google/gemini-2.0-flash-lite',
    name: 'Gemini 2.0 Flash Lite',
    provider: 'Google',
    category: 'mini',
    contextWindow: 1050000,
    pricing: { input: 0.075, output: 0.3 },
    capabilities: ['ultra-fast', 'economical'],
    description: 'Extremely fast and economical while maintaining quality',
  },

  // === OPENAI GPT-5 SERIES ===
  {
    id: 'openai/gpt-5.1',
    name: 'GPT-5.1',
    provider: 'OpenAI',
    category: 'flagship',
    contextWindow: 400000,
    pricing: { input: 1.25, output: 10 },
    capabilities: ['reasoning', 'adaptive-thinking', 'coding', 'conversational'],
    description: 'Latest frontier model with adaptive reasoning and natural conversation',
  },
  {
    id: 'openai/gpt-5.1-chat',
    name: 'GPT-5.1 Chat (Instant)',
    provider: 'OpenAI',
    category: 'fast',
    contextWindow: 128000,
    pricing: { input: 1.25, output: 10 },
    capabilities: ['fast', 'conversational', 'selective-reasoning'],
    description: 'Fast, lightweight for low-latency chat with adaptive reasoning',
  },
  {
    id: 'openai/gpt-5.1-codex',
    name: 'GPT-5.1 Codex',
    provider: 'OpenAI',
    category: 'specialized',
    contextWindow: 400000,
    pricing: { input: 1.25, output: 10 },
    capabilities: ['coding', 'engineering', 'code-review', 'agentic'],
    description: 'Specialized for software engineering with extended reasoning',
  },
  {
    id: 'openai/gpt-5.1-codex-mini',
    name: 'GPT-5.1 Codex Mini',
    provider: 'OpenAI',
    category: 'fast',
    contextWindow: 400000,
    pricing: { input: 0.25, output: 2 },
    capabilities: ['coding', 'fast', 'economical'],
    description: 'Smaller, faster version of Codex for quick coding tasks',
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    category: 'advanced',
    contextWindow: 128000,
    pricing: { input: 2.5, output: 10 },
    capabilities: ['multimodal', 'vision', 'fast'],
    description: 'Omni model with text and image understanding',
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    category: 'mini',
    contextWindow: 128000,
    pricing: { input: 0.15, output: 0.6 },
    capabilities: ['fast', 'economical', 'multimodal'],
    description: 'Most affordable multimodal model with strong intelligence',
  },
  {
    id: 'openai/gpt-4o-audio',
    name: 'GPT-4o Audio',
    provider: 'OpenAI',
    category: 'specialized',
    contextWindow: 128000,
    pricing: { input: 2.5, output: 10 },
    capabilities: ['audio', 'multimodal', 'voice-detection'],
    description: 'Audio input support with nuance detection',
  },

  // === XAI GROK SERIES ===
  {
    id: 'x-ai/grok-4.1-fast',
    name: 'Grok 4.1 Fast',
    provider: 'xAI',
    category: 'fast',
    contextWindow: 2000000,
    pricing: { input: 0, output: 0 },
    capabilities: ['agentic', 'tool-calling', 'real-time', '2M-context'],
    description: 'Best agentic tool calling with 2M context window',
  },
  {
    id: 'x-ai/grok-4.1-fast-free',
    name: 'Grok 4.1 Fast (Free)',
    provider: 'xAI',
    category: 'fast',
    contextWindow: 2000000,
    pricing: { input: 0, output: 0 },
    capabilities: ['free', 'agentic', '2M-context'],
    description: 'Free tier of Grok 4.1 with full capabilities',
  },

  // === ANTHROPIC CLAUDE SERIES ===
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    category: 'flagship',
    contextWindow: 200000,
    pricing: { input: 3, output: 15 },
    capabilities: ['coding', 'agentic', 'reasoning', 'vision'],
    description: 'Superior coding and agentic capabilities with tool use',
  },
  {
    id: 'anthropic/claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    category: 'flagship',
    contextWindow: 200000,
    pricing: { input: 15, output: 75 },
    capabilities: ['complex-reasoning', 'creative', 'multimodal'],
    description: 'Most capable Claude model for complex tasks',
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    category: 'fast',
    contextWindow: 200000,
    pricing: { input: 0.25, output: 1.25 },
    capabilities: ['fast', 'economical', 'vision'],
    description: 'Fastest and most compact Claude model',
  },

  // === AMAZON NOVA SERIES ===
  {
    id: 'amazon/nova-premier-1.0',
    name: 'Nova Premier 1.0',
    provider: 'Amazon',
    category: 'flagship',
    contextWindow: 1000000,
    pricing: { input: 2.5, output: 12.5 },
    capabilities: ['multimodal', 'complex-reasoning', 'distillation'],
    description: 'Most capable Nova model for complex reasoning',
  },

  // === PERPLEXITY SONAR SERIES ===
  {
    id: 'perplexity/sonar-pro-search',
    name: 'Sonar Pro Search',
    provider: 'Perplexity',
    category: 'specialized',
    contextWindow: 200000,
    pricing: { input: 3, output: 15 },
    capabilities: ['search', 'research', 'agentic', 'multi-step'],
    description: 'Advanced agentic search with autonomous research workflows',
  },

  // === META LLAMA SERIES ===
  {
    id: 'meta-llama/llama-3.1-405b-instruct',
    name: 'Llama 3.1 405B Instruct',
    provider: 'Meta',
    category: 'flagship',
    contextWindow: 128000,
    pricing: { input: 2.7, output: 2.7 },
    capabilities: ['open-source', 'reasoning', 'multilingual'],
    description: 'Largest open-source Llama model with 405B parameters',
  },
  {
    id: 'meta-llama/llama-3.1-70b-instruct',
    name: 'Llama 3.1 70B Instruct',
    provider: 'Meta',
    category: 'advanced',
    contextWindow: 128000,
    pricing: { input: 0.35, output: 0.4 },
    capabilities: ['open-source', 'balanced', 'multilingual'],
    description: 'Balanced open-source model with strong performance',
  },
  {
    id: 'meta-llama/llama-3.1-8b-instruct',
    name: 'Llama 3.1 8B Instruct',
    provider: 'Meta',
    category: 'mini',
    contextWindow: 128000,
    pricing: { input: 0.055, output: 0.055 },
    capabilities: ['open-source', 'fast', 'economical'],
    description: 'Small, efficient open-source model',
  },

  // === MISTRAL SERIES ===
  {
    id: 'mistralai/mistral-large-2411',
    name: 'Mistral Large',
    provider: 'Mistral AI',
    category: 'flagship',
    contextWindow: 128000,
    pricing: { input: 2, output: 6 },
    capabilities: ['multilingual', 'coding', 'reasoning'],
    description: 'Flagship European model with strong multilingual support',
  },
  {
    id: 'mistralai/mistral-medium',
    name: 'Mistral Medium',
    provider: 'Mistral AI',
    category: 'advanced',
    contextWindow: 32000,
    pricing: { input: 2.7, output: 8.1 },
    capabilities: ['balanced', 'multilingual'],
    description: 'Balanced model for general-purpose tasks',
  },
  {
    id: 'mistralai/mistral-small',
    name: 'Mistral Small',
    provider: 'Mistral AI',
    category: 'mini',
    contextWindow: 32000,
    pricing: { input: 0.2, output: 0.6 },
    capabilities: ['fast', 'economical', 'multilingual'],
    description: 'Small, efficient model for quick tasks',
  },

  // === COHERE COMMAND SERIES ===
  {
    id: 'cohere/command-r-plus',
    name: 'Command R+',
    provider: 'Cohere',
    category: 'flagship',
    contextWindow: 128000,
    pricing: { input: 2.5, output: 10 },
    capabilities: ['rag', 'search', 'multilingual', 'tool-use'],
    description: 'Optimized for RAG and enterprise search',
  },
  {
    id: 'cohere/command-r',
    name: 'Command R',
    provider: 'Cohere',
    category: 'advanced',
    contextWindow: 128000,
    pricing: { input: 0.15, output: 0.6 },
    capabilities: ['rag', 'search', 'economical'],
    description: 'Efficient model for retrieval-augmented generation',
  },

  // === DEEPSEEK SERIES ===
  {
    id: 'deepseek/deepseek-coder-v2.5',
    name: 'DeepSeek Coder V2.5',
    provider: 'DeepSeek',
    category: 'specialized',
    contextWindow: 32000,
    pricing: { input: 0.14, output: 0.28 },
    capabilities: ['coding', 'open-source', 'economical'],
    description: 'Open-source coding specialist with strong performance',
  },
  {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'DeepSeek',
    category: 'advanced',
    contextWindow: 32000,
    pricing: { input: 0.14, output: 0.28 },
    capabilities: ['conversational', 'open-source'],
    description: 'General-purpose open-source chat model',
  },
  // === EMBEDDING MODELS ===
  {
    id: 'google/gemini-embedding-001',
    name: 'Gemini Embedding 001',
    provider: 'Google',
    category: 'specialized',
    contextWindow: 20000,
    pricing: { input: 0.15, output: 0 },
    capabilities: ['embedding', 'text', 'multilingual', 'domains'],
    description: 'Unified cutting edge experience across domains, science, legal, finance, coding',
  },
  {
    id: 'openai/text-embedding-ada-002',
    name: 'Text Embedding Ada 002',
    provider: 'OpenAI',
    category: 'specialized',
    contextWindow: 8000,
    pricing: { input: 0.10, output: 0 },
    capabilities: ['embedding', 'text', 'legacy'],
    description: 'OpenAI\'s legacy text embedding model',
  },
  {
    id: 'mistralai/codestral-embed-2505',
    name: 'Codestral Embed 2505',
    provider: 'Mistral AI',
    category: 'specialized',
    contextWindow: 8000,
    pricing: { input: 0.15, output: 0 },
    capabilities: ['embedding', 'code', 'retrieval', 'assistants'],
    description: 'Specially designed for code embeddings, databases, repositories, coding assistants',
  },
  {
    id: 'openai/text-embedding-3-large',
    name: 'Text Embedding 3 Large',
    provider: 'OpenAI',
    category: 'specialized',
    contextWindow: 8000,
    pricing: { input: 0.13, output: 0 },
    capabilities: ['embedding', 'text', 'high-accuracy', 'multilingual'],
    description: 'Most capable embedding model for both english and non-english tasks',
  },
  {
    id: 'openai/text-embedding-3-small',
    name: 'Text Embedding 3 Small',
    provider: 'OpenAI',
    category: 'specialized',
    contextWindow: 8000,
    pricing: { input: 0.02, output: 0 },
    capabilities: ['embedding', 'text', 'economical', 'similarity'],
    description: 'Improved, more performant ada model for relatedness, search, clustering',
  },
  {
    id: 'qwen/qwen3-embedding-8b',
    name: 'Qwen3 Embedding 8B',
    provider: 'Qwen',
    category: 'specialized',
    contextWindow: 32000,
    pricing: { input: 0.01, output: 0 },
    capabilities: ['embedding', 'multilingual', 'long-text', 'ranking'],
    description: 'Latest proprietary model with exceptional multilingual, long-text understanding, reasoning',
  },
  {
    id: 'qwen/qwen3-embedding-4b',
    name: 'Qwen3 Embedding 4B',
    provider: 'Qwen',
    category: 'specialized',
    contextWindow: 33000,
    pricing: { input: 0.02, output: 0 },
    capabilities: ['embedding', 'multilingual', 'ranking'],
    description: 'Part of Qwen3 series for text embedding and ranking tasks',
  },
  {
    id: 'qwen/qwen3-embedding-0.6b',
    name: 'Qwen3 Embedding 0.6B',
    provider: 'Qwen',
    category: 'specialized',
    contextWindow: 8000,
    pricing: { input: 0, output: 0 },
    capabilities: ['embedding', 'lightweight', 'ranking'],
    description: 'Small embedding model for text retrieval, classification, clustering, bitext mining',
  },
  {
    id: 'thenlper/gte-base',
    name: 'GTE-Base',
    provider: 'Thenlper',
    category: 'specialized',
    contextWindow: 512,
    pricing: { input: 0.005, output: 0 },
    capabilities: ['embedding', 'text', 'similarity', 'semantic-search'],
    description: '768-dimensional dense vector space for textual similarity and semantic search',
  },
  {
    id: 'thenlper/gte-large',
    name: 'GTE-Large',
    provider: 'Thenlper',
    category: 'specialized',
    contextWindow: 512,
    pricing: { input: 0.01, output: 0 },
    capabilities: ['embedding', 'text', 'high-quality', 'retrieval'],
    description: '1024-dimensional embeddings for information retrieval, semantic textual similarity, reranking',
  },
  {
    id: 'intfloat/e5-large-v2',
    name: 'E5-Large-v2',
    provider: 'Intfloat',
    category: 'specialized',
    contextWindow: 512,
    pricing: { input: 0.01, output: 0 },
    capabilities: ['embedding', 'text', 'retrieval', 'similarity-scoring'],
    description: '1024-dimensional high-accuracy embeddings for retrieval, semantic search, reranking',
  },

  // === ALLENAI OLMO SERIES ===
  {
    id: 'allenai/olmo-3-32b-think',
    name: 'Olmo 3 32B Think',
    provider: 'AllenAI',
    category: 'advanced',
    contextWindow: 66000,
    pricing: { input: 0.20, output: 0.35 },
    capabilities: ['reasoning', 'deep-logic', 'complex-chains'],
    description: 'Olmo 3 32B Think is a large-scale, 32-billion-parameter model purpose-built for deep reasoning, complex logic chains and advanced instruction-following scenarios',
  },
  {
    id: 'allenai/olmo-3-7b-instruct',
    name: 'Olmo 3 7B Instruct',
    provider: 'AllenAI',
    category: 'advanced',
    contextWindow: 66000,
    pricing: { input: 0.10, output: 0.20 },
    capabilities: ['instruction-following', 'qa', 'conversational'],
    description: 'Olmo 3 7B Instruct is a supervised instruction-fine-tuned variant optimized for instruction-following, question-answering, and natural conversational dialogue',
  },
  {
    id: 'allenai/olmo-3-7b-think',
    name: 'Olmo 3 7B Think',
    provider: 'AllenAI',
    category: 'advanced',
    contextWindow: 66000,
    pricing: { input: 0.12, output: 0.20 },
    capabilities: ['reasoning', 'inference', 'conversational-context'],
    description: 'Olmo 3 7B Think is a research-oriented language model in the Olmo family designed for advanced reasoning and instruction-driven tasks',
  },

  // === NVIDIA MODELS ===
  {
    id: 'nvidia/nemotron-nano-12b-2-vl-free',
    name: 'Nemotron Nano 12B 2 VL (free)',
    provider: 'NVIDIA',
    category: 'mini',
    contextWindow: 128000,
    pricing: { input: 0, output: 0 },
    capabilities: ['multimodal', 'video', 'document-intelligence', 'free'],
    description: 'NVIDIA Nemotron Nano 2 VL is a 12-billion-parameter open multimodal reasoning model designed for video understanding and document intelligence',
  },
  {
    id: 'nvidia/nemotron-nano-12b-2-vl',
    name: 'Nemotron Nano 12B 2 VL',
    provider: 'NVIDIA',
    category: 'advanced',
    contextWindow: 131000,
    pricing: { input: 0.20, output: 0.60 },
    capabilities: ['multimodal', 'video', 'document-intelligence', 'hybrid-architecture'],
    description: 'Hybrid Transformer-Mamba architecture for high-throughput and lower latency multimodal understanding',
  },

  // === AUDIO MODELS ===
  {
    id: 'mistralai/voxtral-small-24b-2507',
    name: 'Voxtral Small 24B 2507',
    provider: 'Mistral AI',
    category: 'advanced',
    contextWindow: 32000,
    pricing: { input: 0.10, output: 0.30 },
    audioPricing: 100,
    capabilities: ['audio', 'speech-transcription', 'translation', 'understanding'],
    description: 'Voxtral Small is an enhancement of Mistral Small 3, incorporating state-of-the-art audio input capabilities while retaining best-in-class text performance',
  },
];

export const MODEL_CATEGORIES = {
  flagship: 'Flagship Models - Best Performance',
  advanced: 'Advanced Models - Balanced',
  fast: 'Fast Models - Low Latency',
  mini: 'Mini Models - Most Economical',
  specialized: 'Specialized Models - Specific Tasks',
};

export const MODEL_PROVIDERS = [
  'Google',
  'OpenAI',
  'xAI',
  'Anthropic',
  'Amazon',
  'Perplexity',
  'Meta',
  'Mistral AI',
  'Cohere',
  'DeepSeek',
];

export function getModelsByProvider(provider: string): OpenRouterModel[] {
  return OPENROUTER_MODELS.filter(model => model.provider === provider);
}

export function getModelsByCategory(category: string): OpenRouterModel[] {
  return OPENROUTER_MODELS.filter(model => model.category === category);
}

export function searchModels(query: string): OpenRouterModel[] {
  const lowerQuery = query.toLowerCase();
  return OPENROUTER_MODELS.filter(
    model =>
      model.name.toLowerCase().includes(lowerQuery) ||
      model.description.toLowerCase().includes(lowerQuery) ||
      model.capabilities.some(cap => cap.toLowerCase().includes(lowerQuery))
  );
}

export function getModelById(id: string): OpenRouterModel | undefined {
  return OPENROUTER_MODELS.find(model => model.id === id);
}

export function getRecommendedModel(task: string): OpenRouterModel {
  const lowerTask = task.toLowerCase();

  if (lowerTask.includes('code') || lowerTask.includes('programming')) {
    return OPENROUTER_MODELS.find(m => m.id === 'openai/gpt-5.1-codex') || OPENROUTER_MODELS[0];
  }

  if (lowerTask.includes('search') || lowerTask.includes('research')) {
    return OPENROUTER_MODELS.find(m => m.id === 'perplexity/sonar-pro-search') || OPENROUTER_MODELS[0];
  }

  if (lowerTask.includes('image') || lowerTask.includes('design')) {
    return OPENROUTER_MODELS.find(m => m.id === 'google/nano-banana-pro') || OPENROUTER_MODELS[0];
  }

  if (lowerTask.includes('fast') || lowerTask.includes('quick')) {
    return OPENROUTER_MODELS.find(m => m.id === 'google/gemini-2.5-flash-lite') || OPENROUTER_MODELS[0];
  }

  // Default: Gemini 3 Pro Preview
  return OPENROUTER_MODELS.find(m => m.id === 'google/gemini-3-pro-preview') || OPENROUTER_MODELS[0];
}
