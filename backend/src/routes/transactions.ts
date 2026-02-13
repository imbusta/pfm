import { Router, Request, Response } from 'express';
import TransactionModel from '../models/Transaction';
import classifierService from '../services/classifier';
import { TransactionCreate, ApiResponse } from '../types';

const router = Router();

// GET /api/transactions - Get all transactions
router.get('/', async (_req: Request, res: Response) => {
  try {
    const transactions = await TransactionModel.findAll();
    const response: ApiResponse = {
      success: true,
      data: transactions,
    };
    res.json(response);
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
    const transaction = await TransactionModel.findById(req.params.id);
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
    const data: Partial<TransactionCreate> = {
      ...req.body,
      date: req.body.date ? new Date(req.body.date) : undefined,
    };

    const transaction = await TransactionModel.update(req.params.id, data);
    if (!transaction) {
      res.status(404).json({
        success: false,
        error: 'Transaction not found',
      });
      return;
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
    const deleted = await TransactionModel.delete(req.params.id);
    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'Transaction not found',
      });
      return;
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
