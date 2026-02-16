import { Router, Request, Response } from 'express';
import CurrencyModel from '../models/Currency';
import { ApiResponse } from '../types';

const router = Router();

// GET /api/currencies - Get all currencies
router.get('/', async (_req: Request, res: Response) => {
  try {
    const currencies = await CurrencyModel.findAll();
    const response: ApiResponse = {
      success: true,
      data: currencies,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch currencies',
    });
  }
});

// GET /api/currencies/:id - Get single currency
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid currency ID',
      });
      return;
    }

    const currency = await CurrencyModel.findById(id);
    if (!currency) {
      res.status(404).json({
        success: false,
        error: 'Currency not found',
      });
      return;
    }

    res.json({ success: true, data: currency });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch currency',
    });
  }
});

// POST /api/currencies - Create new currency
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, code } = req.body;

    if (!name || typeof name !== 'string' || !code || typeof code !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Currency name and code are required',
      });
      return;
    }

    const currency = await CurrencyModel.create(name, code);
    res.status(201).json({
      success: true,
      data: currency,
      message: 'Currency created successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create currency',
    });
  }
});

// PUT /api/currencies/:id - Update currency
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid currency ID',
      });
      return;
    }

    const { name, code } = req.body;
    if (!name || typeof name !== 'string' || !code || typeof code !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Currency name and code are required',
      });
      return;
    }

    const currency = await CurrencyModel.update(id, name, code);
    if (!currency) {
      res.status(404).json({
        success: false,
        error: 'Currency not found',
      });
      return;
    }

    res.json({
      success: true,
      data: currency,
      message: 'Currency updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update currency',
    });
  }
});

// DELETE /api/currencies/:id - Delete currency
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid currency ID',
      });
      return;
    }

    const deleted = await CurrencyModel.delete(id);
    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'Currency not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Currency deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete currency',
    });
  }
});

export default router;
