import { AIProvider, ChatMessage, ChatOptions } from './provider.js';
import { env } from '../../config/env.js';

export class GeminiProvider implements AIProvider {
  async chat(messages: ChatMessage[], systemPrompt: string, options?: ChatOptions): Promise<string> {
    if (!env.AI_API_KEY) {
      throw new Error('AI_API_KEY is missing');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.AI_API_KEY}`;
    
    // Convert generic chat messages to Gemini's format
    const contents = [];
    
    // Gemini doesn't use a 'system' role in the contents array in exactly the same way. 
    // The system prompt is passed at the model level (or as the first user message if system instructions aren't supported).
    // Using system_instruction field for gemini 2.0.
    
    for (const msg of messages) {
      if (msg.role === 'system') continue;
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    }

    const payload = {
      system_instruction: {
        parts: { text: systemPrompt }
      },
      contents: contents,
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxTokens ?? 1024,
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      throw new Error(`Gemini API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }
}
