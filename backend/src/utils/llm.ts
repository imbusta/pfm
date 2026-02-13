import Anthropic from '@anthropic-ai/sdk';
import config from '../config';

export class LLMClient {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: config.anthropicApiKey,
    });
  }

  async completion(prompt: string, systemPrompt?: string, maxTokens: number = 1024): Promise<string> {
    try {
      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: prompt,
        }],
      });

      const content = message.content[0];
      return content.type === 'text' ? content.text : '';
    } catch (error) {
      console.error('LLM error:', error);
      throw error;
    }
  }

  async jsonCompletion<T>(prompt: string, systemPrompt?: string): Promise<T | null> {
    try {
      const response = await this.completion(prompt, systemPrompt, 500);
      const match = response.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
      return null;
    } catch (error) {
      console.error('JSON completion error:', error);
      return null;
    }
  }
}

export default new LLMClient();
