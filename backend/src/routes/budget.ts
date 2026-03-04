import { Router, Request, Response } from 'express';
import BudgetModel from '../models/Budget';
import GoalModel from '../models/Goal';
import TransactionModel from '../models/Transaction';
import plannerService from '../services/planner';

const router = Router();

// GET /api/budget - Get all budgets (optionally filtered by ?year=&month=)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { year, month } = req.query;
    if (year && month) {
      const budget = await BudgetModel.findByYearMonth(
        parseInt(year as string),
        parseInt(month as string)
      );
      res.json({ success: true, data: budget ? [budget] : [] });
    } else {
      const budgets = await BudgetModel.findAll();
      res.json({ success: true, data: budgets });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch budgets',
    });
  }
});

// POST /api/budget - Create budget { year, month }
router.post('/', async (req: Request, res: Response) => {
  try {
    const { year, month } = req.body;
    if (!year || !month) {
      res.status(400).json({ success: false, error: 'year and month are required' });
    } else {
      const budget = await BudgetModel.create(parseInt(year), parseInt(month));
      res.status(201).json({
        success: true,
        data: budget,
        message: 'Budget created successfully',
      });
    }
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

    res.json({ success: true, data: suggestions });
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
    const recommendations = plannerService.optimizeBudget(budgets);

    res.json({ success: true, data: recommendations });
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
      res.status(404).json({ success: false, error: 'Goal not found' });
      return;
    }

    const transactions = await TransactionModel.findAll();
    const plan = plannerService.planGoal(goal, transactions);

    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create goal plan',
    });
  }
});

// GET /api/budget/:id - Get budget by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const budget = await BudgetModel.findById(parseInt(req.params.id));
    if (!budget) {
      res.status(404).json({ success: false, error: 'Budget not found' });
    } else {
      res.json({ success: true, data: budget });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch budget',
    });
  }
});

// DELETE /api/budget/:id - Delete budget
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await BudgetModel.delete(parseInt(req.params.id));
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Budget not found' });
    } else {
      res.json({ success: true, message: 'Budget deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete budget',
    });
  }
});

// POST /api/budget/:id/categories - Add category to budget
router.post('/:id/categories', async (req: Request, res: Response) => {
  try {
    const budgetId = parseInt(req.params.id);
    const { category_id, amount } = req.body;
    if (!category_id || amount === undefined) {
      res.status(400).json({ success: false, error: 'category_id and amount are required' });
    } else {
      const category = await BudgetModel.addCategory(budgetId, parseInt(category_id), parseFloat(amount));
      res.status(201).json({ success: true, data: category });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add category',
    });
  }
});

// PUT /api/budget/:id/categories/:catId - Update budget category
router.put('/:id/categories/:catId', async (req: Request, res: Response) => {
  try {
    const catId = parseInt(req.params.catId);
    const { amount, total_spent } = req.body;
    const updated = await BudgetModel.updateCategory(catId, { amount, total_spent });
    if (!updated) {
      res.status(404).json({ success: false, error: 'Budget category not found' });
    } else {
      res.json({ success: true, data: updated });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update category',
    });
  }
});

// DELETE /api/budget/:id/categories/:catId - Remove category from budget
router.delete('/:id/categories/:catId', async (req: Request, res: Response) => {
  try {
    const catId = parseInt(req.params.catId);
    const deleted = await BudgetModel.removeCategory(catId);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Budget category not found' });
    } else {
      res.json({ success: true, message: 'Category removed successfully' });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove category',
    });
  }
});

export default router;
