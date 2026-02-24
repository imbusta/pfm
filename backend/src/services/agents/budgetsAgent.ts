import { Agent, tool } from '@openai/agents';
import { z } from 'zod';
import BudgetModel from '../../models/Budget';
import CategoryModel from '../../models/Category';

const BudgetsOutput = z.object({
    year: z.string(),
    month: z.string(),
    categories: z.array(z.object({
        category_id: z.number(),
        category_name: z.string(),
        amount: z.number(),
        total_spent: z.number().optional(),
    })),
    reasoning: z.string(),
});

const instructions = `
You are a personal finance assistant. You are an expert in personal finance and budgeting.
You will help the user to plan their monthly budgets and also help them to build future budgets for different goals the user might have. 
You will use the following tools to help the user:
- find_categories: to find all possible categories. Use it always before creating a new budget.
- get_current_month_budget: to get the budget for the current month if needed.
- get_future_budget: to get the budget for future months if needed.
- create_budget: to create a new budget for a future month.
- update_budget: to update an existing budget.
There is no need to use the tools in case you have all the information you need to answer the user's question.

When responding, fill each output field as follows:
- year: The year of the budget.
- month: The month of the budget.
- categories: The categories of the budget. This will be a list of objects with the following fields:
    - category_id: The id of the category.
    - category_name: The name of the category.
    - amount: The amount of the category.
    - total_spent: The total spent on the category. This will be optional and will be null if the total spent is not available.
- reasoning: The reasoning for the budget.
`

const get_current_month_budget_tool = tool({
    name: 'get_current_month_budget',
    description: 'Get the budget for the current month.',
    parameters: z.object({}),
    async execute() {
        const budget = await BudgetModel.findByYearMonth(new Date().getFullYear(), new Date().getMonth() + 1);
        return budget;
    },
});

const find_categories_tool = tool({
    name: 'find_categories',
    description: 'Find all possible categories.',
    parameters: z.object({}),
    async execute() {
        const categories = await CategoryModel.findAll();
        return categories;
    },
});

const create_budget_tool = tool({
    name: 'create_budget',
    description: 'Create a new budget for a given month.',
    parameters: z.object({
        year: z.number(),
        month: z.number(),
        categories: z.array(z.object({
            category_id: z.number(),
            category_name: z.string(),
            amount: z.number(),
        })),
    }),
    async execute({ year, month, categories }: { year: number, month: number, categories: { category_id: number, category_name: string, amount: number }[] }) {
        const budget = await BudgetModel.create(year, month);
        for (const category of categories) {
            await BudgetModel.addCategory(budget.id, category.category_id, category.amount);
        }
        const budgetWithCategories = await BudgetModel.findByYearMonth(year, month);    
        if (!budgetWithCategories) {
            throw new Error('Failed to create budget');
        }
        return budgetWithCategories;
    },
});

export const budgetsAgent = new Agent({
    name: 'Budgets Agent',
    instructions,
    tools: [
        get_current_month_budget_tool,
        create_budget_tool,
        find_categories_tool,
    ],
    model: 'gpt-4o-mini',
    outputType: BudgetsOutput,
});