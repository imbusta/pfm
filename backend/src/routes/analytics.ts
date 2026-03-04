import { Router, Request, Response } from 'express';
import TransactionModel from '../models/Transaction';
import analyticsService from '../services/analytics';
import recurrenceService from '../services/recurrence';
import { ApiResponse } from '../types';

const router = Router();

// GET /api/analytics/summary - Get spending summary
router.get('/summary', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        error: 'startDate and endDate query parameters are required',
      });
      return;
    }

    const transactions = await TransactionModel.findAll();
    const summary = analyticsService.calculateSummary(
      transactions,
      new Date(startDate as string),
      new Date(endDate as string)
    );

    const response: ApiResponse = {
      success: true,
      data: summary,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate summary',
    });
  }
});

// GET /api/analytics/breakdown - Get category breakdown
router.get('/breakdown', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    let transactions = await TransactionModel.findAll();

    // Filter by date range if provided
    if (startDate && endDate) {
      transactions = transactions.filter(
        t => t.date >= new Date(startDate as string) && t.date <= new Date(endDate as string)
      );
    }

    const breakdown = analyticsService.calculateCategoryBreakdown(transactions);

    res.json({
      success: true,
      data: breakdown,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate breakdown',
    });
  }
});

// GET /api/analytics/trends - Get monthly trends
router.get('/trends', async (_req: Request, res: Response) => {
  try {
    const transactions = await TransactionModel.findAll();
    const trends = analyticsService.calculateMonthlyTrends(transactions);

    res.json({
      success: true,
      data: trends,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate trends',
    });
  }
});

// GET /api/analytics/recurring - Detect recurring transactions
router.get('/recurring', async (_req: Request, res: Response) => {
  try {
    const transactions = await TransactionModel.findAll();
    const patterns = recurrenceService.detectRecurring(transactions);

    res.json({
      success: true,
      data: patterns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to detect recurring transactions',
    });
  }
});

// GET /api/analytics/anomalies - Detect spending anomalies
router.get('/anomalies', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const transactions = await TransactionModel.findAll();
    const anomalies = analyticsService.detectAnomalies(
      transactions,
      category as string | undefined
    );

    res.json({
      success: true,
      data: anomalies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to detect anomalies',
    });
  }
});

export default router;
