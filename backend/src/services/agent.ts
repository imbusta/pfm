import Anthropic from '@anthropic-ai/sdk';
import config from '../config';
import { AgentRequest, AgentResponse } from '../types';
import analyticsService from './analytics';

export class AgentService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: config.anthropicApiKey,
    });
  }

  async chat(request: AgentRequest): Promise<AgentResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt(request.context);

      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: request.message,
        }],
      });

      const content = message.content[0];
      if (content.type === 'text') {
        return {
          message: content.text,
          suggestions: this.extractSuggestions(content.text),
        };
      }

      return {
        message: 'I apologize, but I could not process your request.',
      };
    } catch (error) {
      console.error('Agent error:', error);
      return {
        message: 'I encountered an error processing your request. Please try again.',
      };
    }
  }

  private buildSystemPrompt(context?: AgentRequest['context']): string {
    let prompt = `You are a helpful personal finance assistant. You help users understand their finances, create budgets, and achieve financial goals.

Be concise, clear, and actionable in your responses. When providing advice:
- Use specific numbers and examples from the user's data when available
- Provide 2-3 actionable suggestions
- Be encouraging but realistic
- Explain financial concepts in simple terms`;

    if (context) {
      if (context.transactions && context.transactions.length > 0) {
        const summary = analyticsService.calculateSummary(
          context.transactions,
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          new Date()
        );
        prompt += `\n\nRecent financial summary (last 30 days):
- Total income: $${summary.totalIncome.toFixed(2)}
- Total expenses: $${summary.totalExpenses.toFixed(2)}
- Net: $${summary.netAmount.toFixed(2)}
- Transactions: ${summary.transactionCount}`;

        const breakdown = analyticsService.calculateCategoryBreakdown(context.transactions);
        if (breakdown.length > 0) {
          prompt += `\n\nTop spending categories:`;
          breakdown.slice(0, 5).forEach(cat => {
            prompt += `\n- ${cat.category}: $${cat.amount.toFixed(2)} (${cat.percentage.toFixed(1)}%)`;
          });
        }
      }

      if (context.budgets && context.budgets.length > 0) {
        prompt += `\n\nActive budgets:`;
        context.budgets.forEach(b => {
          prompt += `\n- ${b.category}: $${b.amount}/${b.period}`;
        });
      }

      if (context.goals && context.goals.length > 0) {
        prompt += `\n\nActive goals:`;
        context.goals.forEach(g => {
          const progress = (g.currentAmount / g.targetAmount * 100).toFixed(1);
          prompt += `\n- ${g.name}: $${g.currentAmount}/$${g.targetAmount} (${progress}%)`;
        });
      }
    }

    return prompt;
  }

  private extractSuggestions(text: string): string[] {
    const suggestions: string[] = [];
    const lines = text.split('\n');

    lines.forEach(line => {
      const trimmed = line.trim();
      if (
        trimmed.match(/^[-•*]\s/) || // Bullet points
        trimmed.match(/^\d+\.\s/) // Numbered lists
      ) {
        suggestions.push(trimmed.replace(/^[-•*]\s/, '').replace(/^\d+\.\s/, ''));
      }
    });

    return suggestions.slice(0, 5); // Return up to 5 suggestions
  }
}

export default new AgentService();
