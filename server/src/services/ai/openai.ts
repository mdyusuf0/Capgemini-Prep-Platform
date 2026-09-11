import { AIProvider, ChatMessage, ChatOptions } from './provider.js';
import { env } from '../../config/env.js';

export class OpenAIProvider implements AIProvider {
  async chat(messages: ChatMessage[], systemPrompt: string, options?: ChatOptions): Promise<string> {
    if (!env.AI_API_KEY) {
      throw new Error('AI_API_KEY is missing');
    }

    const url = 'https://api.openai.com/v1/chat/completions';
    
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const payload = {
      model: 'gpt-4o-mini',
      messages: formattedMessages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1024,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.AI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Error:', errorText);
      throw new Error(`OpenAI API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }
}
