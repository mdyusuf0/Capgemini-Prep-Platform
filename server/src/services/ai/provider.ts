export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
}

export interface AIProvider {
  chat(messages: ChatMessage[], systemPrompt: string, options?: ChatOptions): Promise<string>;
}

import { GeminiProvider } from './gemini.js';
import { OpenAIProvider } from './openai.js';
import { env } from '../../config/env.js';

export function getAIProvider(): AIProvider {
  const provider = env.AI_PROVIDER?.toLowerCase();
  
  if (provider === 'openai') {
    return new OpenAIProvider();
  }
  
  // Default to Gemini
  return new GeminiProvider();
}
