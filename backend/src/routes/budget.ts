import { Router, Request, Response } from 'express';
import BudgetModel from '../models/Budget';
import GoalModel from '../models/Goal';
import TransactionModel from '../models/Transaction';
import plannerService from '../services/planner';

const router = Router();

// GET /api/budget - Get all budgets
router.get('/', async (_req: Request, res: Response) => {
  try {
    const budgets = await BudgetModel.findAll();
    res.json({ success: true, data: budgets });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch budgets',
    });
  }
});

// POST /api/budget - Create budget
router.post('/', async (req: Request, res: Response) => {
  try {
    const budget = await BudgetModel.create({
      ...req.body,
      startDate: new Date(req.body.startDate),
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
    });

    res.status(201).json({
      success: true,
      data: budget,
      message: 'Budget created successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create budget',
    });
  }
});

// GET /api/budget/suggestions - Get budget suggestions
router.get('/suggestions', async (req: Request, res: Response) => {
  try {
    const { months = '3' } = req.query;
    const transactions = await TransactionModel.findAll();
    const suggestions = plannerService.suggestBudget(transactions, parseInt(months as string));

    res.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate suggestions',
    });
  }
});

// GET /api/budget/optimize - Get budget optimization recommendations
router.get('/optimize', async (_req: Request, res: Response) => {
  try {
    const budgets = await BudgetModel.findAll();
    const transactions = await TransactionModel.findAll();
    const recommendations = plannerService.optimizeBudget(budgets, transactions);

    res.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to optimize budget',
    });
  }
});

// GET /api/budget/goals - Get all goals
router.get('/goals', async (_req: Request, res: Response) => {
  try {
    const goals = await GoalModel.findAll();
    res.json({ success: true, data: goals });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch goals',
    });
  }
});

// POST /api/budget/goals - Create goal
router.post('/goals', async (req: Request, res: Response) => {
  try {
    const goal = await GoalModel.create({
      ...req.body,
      deadline: req.body.deadline ? new Date(req.body.deadline) : undefined,
    });

    res.status(201).json({
      success: true,
      data: goal,
      message: 'Goal created successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create goal',
    });
  }
});

// GET /api/budget/goals/:id/plan - Get goal plan
router.get('/goals/:id/plan', async (req: Request, res: Response) => {
  try {
    const goal = await GoalModel.findById(req.params.id);
    if (!goal) {
      res.status(404).json({
        success: false,
        error: 'Goal not found',
      });
      return;
    }

    const transactions = await TransactionModel.findAll();
    const plan = plannerService.planGoal(goal, transactions);

    res.json({
      success: true,
      data: plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create goal plan',
    });
  }
});

export default router;
