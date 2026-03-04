import { Agent, tool } from '@openai/agents';
import { z } from 'zod';
import TransactionModel from '../../models/Transaction';
import analyticsService from '../analytics';


const AnalyticsOutput = z.object({
    report: z.string(),
    recommendations: z.string(),
    actions: z.array(z.string()),
});

const instructions = `You are a personal finance analytics expert. You analyze financial data and provide clear, data-driven insights.

When responding, fill each output field as follows:
- report: A concise summary of the findings with specific numbers and dates.
- recommendations: 2-3 actionable recommendations based on the data, written as a paragraph.
- actions: A list of concrete next steps the user can take immediately.

Guidelines:
- Always include specific numbers and percentages from the data.
- Be encouraging but realistic.
- Explain financial concepts in simple terms.
- Base all analysis strictly on the data returned by your tools.`;


const calculate_summary_tool = tool({
    name: 'calculate_summary',
    description: 'Calculate the income, expense, and net amount summary for a given period. ' +
        'Pass start_date and end_date (YYYY-MM-DD) to target a specific range (e.g. a full calendar month). ' +
        'If omitted, defaults to the last 30 days. ' +
        'Always pass explicit dates when you want the result to be consistent with calculate_monthly_trends output.',
    parameters: z.object({
        start_date: z.string().nullable().describe('Start date in YYYY-MM-DD format, or null to use last 30 days'),
        end_date: z.string().nullable().describe('End date in YYYY-MM-DD format, or null to use today'),
    }),
    async execute({ start_date, end_date }: { start_date: string | null; end_date: string | null }) {
        const transactions = await TransactionModel.findAll();
        const endDate = end_date ? new Date(end_date) : new Date();
        const startDate = start_date ? new Date(start_date) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return analyticsService.calculateSummary(transactions, startDate, endDate);
    },
});

const calculate_category_breakdown_tool = tool({
    name: 'calculate_category_breakdown',
    description: 'Calculate the expense breakdown by category. ' +
        'Pass start_date and end_date (YYYY-MM-DD) to target a specific range (e.g. a full calendar month). ' +
        'If omitted (null), includes all transactions on record. ' +
        'Always pass explicit dates when you want the result to be consistent with calculate_monthly_trends output.',
    parameters: z.object({
        start_date: z.string().nullable().describe('Start date in YYYY-MM-DD format, or null for all time'),
        end_date: z.string().nullable().describe('End date in YYYY-MM-DD format, or null for all time'),
    }),
    async execute({ start_date, end_date }: { start_date: string | null; end_date: string | null }) {
        let transactions = await TransactionModel.findAll();
        if (start_date && end_date) {
            const from = new Date(start_date);
            const to = new Date(end_date);
            transactions = transactions.filter(t => t.date >= from && t.date <= to);
        }
        return analyticsService.calculateCategoryBreakdown(transactions);
    },
});

const calculate_monthly_trends_tool = tool({
    name: 'calculate_monthly_trends',
    description: 'Calculate month-by-month income and expense trends across all transactions on record.',
    parameters: z.object({}),
    async execute() {
        const transactions = await TransactionModel.findAll();
        return analyticsService.calculateMonthlyTrends(transactions);
    },
});

// const calculate_average_spending_tool = tool({
//     name: 'calculate_average_spending',
//     description: 'Calculate the average transaction spending amount, optionally filtered by category.',
//     parameters: z.object({ category: z.string().optional() }),
//     async execute({ category }: { category?: string }) {
//         const transactions = await TransactionModel.findAll();
//         return analyticsService.calculateAverageSpending(transactions, category);
//     },
// });

// const detect_anomalies_tool = tool({
//     name: 'detect_anomalies',
//     description: 'Detect unusually high or low transactions compared to the historical average, optionally filtered by category.',
//     parameters: z.object({ category: z.string().optional() }),
//     async execute({ category }: { category?: string }) {
//         const transactions = await TransactionModel.findAll();
//         return analyticsService.detectAnomalies(transactions, category);
//     },
// });


export const analyticsAgent = new Agent({
    name: 'Analytics Agent',
    instructions,
    tools: [
        calculate_summary_tool,
        calculate_category_breakdown_tool,
        calculate_monthly_trends_tool
    ],
    model: 'gpt-4o-mini',
    outputType: AnalyticsOutput,
});
