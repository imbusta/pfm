import Anthropic from '@anthropic-ai/sdk';
import config from '../config';

export class ClassifierService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: config.anthropicApiKey,
    });
  }

  async classifyTransaction(description: string, amount: number): Promise<{ category: string; subcategory?: string }> {
    try {
      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: `Classify this transaction into a category and subcategory:
Description: ${description}
Amount: $${amount}

Return ONLY a JSON object with "category" and "subcategory" fields. Use common financial categories like: Food, Transportation, Entertainment, Shopping, Bills, Healthcare, Income, etc.`,
        }],
      });

      const content = message.content[0];
      if (content.type === 'text') {
        const match = content.text.match(/\{[\s\S]*\}/);
        if (match) {
          return JSON.parse(match[0]);
        }
      }

      return { category: 'Uncategorized' };
    } catch (error) {
      console.error('Classification error:', error);
      return { category: 'Uncategorized' };
    }
  }

  async batchClassify(transactions: Array<{ description: string; amount: number }>): Promise<Array<{ category: string; subcategory?: string }>> {
    const results = await Promise.all(
      transactions.map(t => this.classifyTransaction(t.description, t.amount))
    );
    return results;
  }
}

export default new ClassifierService();
