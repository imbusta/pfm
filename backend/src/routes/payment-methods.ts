import { Router, Request, Response } from 'express';
import PaymentMethodModel from '../models/PaymentMethod';
import { ApiResponse } from '../types';

const router = Router();

// GET /api/payment-methods - Get all payment methods
router.get('/', async (_req: Request, res: Response) => {
  try {
    const paymentMethods = await PaymentMethodModel.findAll();
    const response: ApiResponse = {
      success: true,
      data: paymentMethods,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch payment methods',
    });
  }
});

// GET /api/payment-methods/:id - Get single payment method
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid payment method ID',
      });
      return;
    }

    const paymentMethod = await PaymentMethodModel.findById(id);
    if (!paymentMethod) {
      res.status(404).json({
        success: false,
        error: 'Payment method not found',
      });
      return;
    }

    res.json({ success: true, data: paymentMethod });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch payment method',
    });
  }
});

// POST /api/payment-methods - Create new payment method
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Payment method name is required',
      });
      return;
    }

    const paymentMethod = await PaymentMethodModel.create(name);
    res.status(201).json({
      success: true,
      data: paymentMethod,
      message: 'Payment method created successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment method',
    });
  }
});

// PUT /api/payment-methods/:id - Update payment method
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid payment method ID',
      });
      return;
    }

    const { name } = req.body;
    if (!name || typeof name !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Payment method name is required',
      });
      return;
    }

    const paymentMethod = await PaymentMethodModel.update(id, name);
    if (!paymentMethod) {
      res.status(404).json({
        success: false,
        error: 'Payment method not found',
      });
      return;
    }

    res.json({
      success: true,
      data: paymentMethod,
      message: 'Payment method updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update payment method',
    });
  }
});

// DELETE /api/payment-methods/:id - Delete payment method
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid payment method ID',
      });
      return;
    }

    const deleted = await PaymentMethodModel.delete(id);
    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'Payment method not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Payment method deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete payment method',
    });
  }
});

export default router;
