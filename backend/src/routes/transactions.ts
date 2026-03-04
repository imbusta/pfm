import { Router, Request, Response } from 'express';
import TransactionModel from '../models/Transaction';
import BudgetModel from '../models/Budget';
import classifierService from '../services/classifier';
import { TransactionCreate } from '../types';

const router = Router();

// GET /api/transactions - Get all transactions
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 20);
    const offset = (page - 1) * limit;
    const { search, category, startDate, endDate } = req.query as Record<string, string | undefined>;

    const { rows, total } = await TransactionModel.findPaginated({ limit, offset, search, category, startDate, endDate });
    res.json({ success: true, data: rows, total, page, limit });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch transactions',
    });
  }
});

// GET /api/transactions/:id - Get single transaction
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid transaction ID',
      });
      return;
    }

    const transaction = await TransactionModel.findById(id);
    if (!transaction) {
      res.status(404).json({
        success: false,
        error: 'Transaction not found',
      });
      return;
    }
    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch transaction',
    });
  }
});

// POST /api/transactions - Create new transaction
router.post('/', async (req: Request, res: Response) => {
  try {
    const data: TransactionCreate = {
      ...req.body,
      date: new Date(req.body.date),
    };

    // Auto-classify if category not provided
    if (!data.category && data.description) {
      const classification = await classifierService.classifyTransaction(
        data.description,
        data.amount
      );
      data.category = classification.category;
      data.subcategory = classification.subcategory;
    }

    const transaction = await TransactionModel.create(data);

    const now = new Date();
    const txDate = transaction.date instanceof Date ? transaction.date : new Date(transaction.date);
    if (
      transaction.category_id &&
      transaction.type === 'expense' &&
      txDate.getFullYear() === now.getFullYear() &&
      txDate.getMonth() === now.getMonth()
    ) {
      await BudgetModel.recalculateTotalSpent(now.getFullYear(), now.getMonth() + 1, transaction.category_id);
    }

    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Transaction created successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create transaction',
    });
  }
});

// PUT /api/transactions/:id - Update transaction
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid transaction ID',
      });
      return;
    }

    const data: Partial<TransactionCreate> = {
      ...req.body,
      date: req.body.date ? new Date(req.body.date) : undefined,
    };

    const transaction = await TransactionModel.update(id, data);
    if (!transaction) {
      res.status(404).json({
        success: false,
        error: 'Transaction not found',
      });
      return;
    }

    if (transaction.category_id && transaction.type === 'expense') {
      const now = new Date();
      const txDate = transaction.date instanceof Date ? transaction.date : new Date(transaction.date);
      if (txDate.getFullYear() === now.getFullYear() && txDate.getMonth() === now.getMonth()) {
        await BudgetModel.recalculateTotalSpent(now.getFullYear(), now.getMonth() + 1, transaction.category_id);
      }
    }

    res.json({
      success: true,
      data: transaction,
      message: 'Transaction updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update transaction',
    });
  }
});

// DELETE /api/transactions/:id - Delete transaction
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid transaction ID',
      });
      return;
    }

    const transaction = await TransactionModel.findById(id);
    const deleted = await TransactionModel.delete(id);
    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'Transaction not found',
      });
      return;
    }

    if (transaction && transaction.category_id && transaction.type === 'expense') {
      const now = new Date();
      const txDate = new Date(transaction.date);
      if (txDate.getFullYear() === now.getFullYear() && txDate.getMonth() === now.getMonth()) {
        await BudgetModel.recalculateTotalSpent(now.getFullYear(), now.getMonth() + 1, transaction.category_id);
      }
    }

    res.json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete transaction',
    });
  }
});

// POST /api/transactions/batch - Create multiple transactions
router.post('/batch', async (req: Request, res: Response) => {
  try {
    const transactions = req.body.transactions || [];
    const created = [];

    for (const txData of transactions) {
      const data: TransactionCreate = {
        ...txData,
        date: new Date(txData.date),
      };

      // Auto-classify if needed
      if (!data.category && data.description) {
        const classification = await classifierService.classifyTransaction(
          data.description,
          data.amount
        );
        data.category = classification.category;
        data.subcategory = classification.subcategory;
      }

      const transaction = await TransactionModel.create(data);
      created.push(transaction);
    }

    res.status(201).json({
      success: true,
      data: created,
      message: `${created.length} transactions created successfully`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create transactions',
    });
  }
});

export default router;
