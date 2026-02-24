import { Agent, run } from '@openai/agents';
import { z } from 'zod';
import { AgentRequest, AgentResponse } from '../../types';
import { analyticsAgent } from './analyticsAgent';
import { budgetsAgent } from './budgetsAgent';


const PlannerOutput = z.object({
    message: z.string(),
    suggestions: z.array(z.string()),
});

const instructions = `You are a personal finance planning assistant. Your role is to help users understand their finances, create budgets, and achieve financial goals.

You have access to an analyticsExpert tool that retrieves and analyzes the user's actual transaction data. Delegate to it whenever the user asks about spending patterns, summaries, trends, anomalies, or category breakdowns.

Before calling the analyticsExpert tool, check if the user's question is enough information to answer without the tool. If so, answer the question directly.
Don't make assumptions about the user's financial situation. If you need more information, ask the user for clarification.

Fill each output field as follows:
- message: Your main response — clear, concise, and grounded in the user's actual data. Use specific numbers when available.
- suggestions: A list of 2–5 concrete, actionable suggestions. Each item must be a single standalone sentence.

Guidelines:
- Don't make assumptions.
- For significant financial decisions, note your confidence level and mention alternatives.
- Apply conservative financial guidance: focus on stability and risk reduction over aggressive growth.`;


export class PlannerAgent {
    private agent;

    constructor() {
        this.agent = new Agent({
            name: 'Planner Agent',
            instructions,
            tools: [
                budgetsAgent.asTool({
                    toolName: 'budgetsExpert',
                    toolDescription: 'Retrieves and analyzes the user\'s financial data. Use this for any question about budgets and goals.',
                }),
                analyticsAgent.asTool({
                    toolName: 'analyticsExpert',
                    toolDescription: 'Retrieves and analyzes the user\'s financial data. Use this If you need more information about spending, income, trends, categories, or anomalies.',
                }),
            ],
            model: 'gpt-4o-mini',
            outputType: PlannerOutput,
        });
    }

    async chat(request: AgentRequest): Promise<AgentResponse> {
        try {
            const input = request.context
                ? this.buildContextMessage(request.message, request.context)
                : request.message;

            const result = await run(this.agent, input);
            const output = result.finalOutput;

            return {
                message: output?.message ?? 'I apologize, but I could not process your request.',
                suggestions: output?.suggestions ?? [],
            };
        } catch (error) {
            console.error('Planner agent error:', error);
            return {
                message: 'I encountered an error processing your request. Please try again.',
            };
        }
    }

    private buildContextMessage(userMessage: string, context: AgentRequest['context']): string {
        const parts: string[] = [];

        if (context?.budgets && context.budgets.length > 0) {
            parts.push('Active budgets:');
            context.budgets.forEach(b => {
                const monthName = new Date(b.year, b.month - 1).toLocaleString('default', { month: 'long' });
                const categories = b.categories
                    .map(bc => {
                        const name = bc.category_name ?? `Category ${bc.category_id}`;
                        return `${name}: $${bc.total_spent}/$${bc.amount}`;
                    })
                    .join(', ');
                parts.push(`- ${monthName} ${b.year}: ${categories}`);
            });
        }

        if (context?.goals && context.goals.length > 0) {
            parts.push('Active goals:');
            context.goals.forEach(g => {
                const progress = ((g.currentAmount / g.targetAmount) * 100).toFixed(1);
                parts.push(`- ${g.name}: $${g.currentAmount}/$${g.targetAmount} (${progress}%)`);
            });
        }

        if (parts.length === 0) return userMessage;

        return `[User financial context]\n${parts.join('\n')}\n\n[User question]\n${userMessage}`;
    }
}

export default new PlannerAgent();
