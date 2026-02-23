import { Router, Request, Response } from 'express';
import plannerAgent from '../services/agents/plannerAgent';
import TransactionModel from '../models/Transaction';
import BudgetModel from '../models/Budget';
import GoalModel from '../models/Goal';
import { AgentRequest } from '../types';

const router = Router();

// POST /api/agent/chat - Chat with AI agent
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, includeContext = false } = req.body;

    if (!message) {
      res.status(400).json({
        success: false,
        error: 'Message is required',
      });
      return;
    }

    const request: AgentRequest = { message };

    if (includeContext) {
      const [transactions, budgets, goals] = await Promise.all([
        TransactionModel.findAll(),
        BudgetModel.findAll(),
        GoalModel.findAll(),
      ]);

      request.context = {
        transactions: transactions.slice(-100),
        budgets,
        goals,
      };
    }

    const response = await plannerAgent.chat(request);

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process chat request',
    });
  }
});

// POST /api/agent/analyze - Analyze specific transactions or categories
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { category, startDate, endDate, question } = req.body;

    let transactions = await TransactionModel.findAll();

    if (category) {
      transactions = transactions.filter(t => t.category_name === category);
    }
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      transactions = transactions.filter(t => t.date >= start && t.date <= end);
    }

    const request: AgentRequest = {
      message: question || 'Analyze these transactions and provide insights.',
      context: { transactions },
    };

    const response = await plannerAgent.chat(request);

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze',
    });
  }
});

export default router;
