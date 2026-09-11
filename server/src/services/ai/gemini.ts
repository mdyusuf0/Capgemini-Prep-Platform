import { AIProvider, ChatMessage, ChatOptions } from './provider.js';
import { env } from '../../config/env.js';

export class GeminiProvider implements AIProvider {
  async chat(messages: ChatMessage[], systemPrompt: string, options?: ChatOptions): Promise<string> {
    const apiKey = env.GEMINI_API_KEY || env.AI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'Gemini API Key is missing. Please add GEMINI_API_KEY=your_key_here (or AI_API_KEY=your_key_here) to your .env file.'
      );
    }

    const model = env.GEMINI_MODEL || 'gemini-2.0-flash';
    let url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    // Convert generic chat messages to Gemini's format
    const contents = [];
    
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
        maxOutputTokens: options?.maxTokens ?? 2048,
      }
    };

    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    // Fallback if 2.0-flash is unavailable or region-restricted
    if (response.status === 404 && model !== 'gemini-1.5-flash') {
      const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      response = await fetch(fallbackUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }
}
