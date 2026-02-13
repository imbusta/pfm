import { Router } from 'express';
import transactionsRouter from './transactions';
import analyticsRouter from './analytics';
import budgetRouter from './budget';
import agentRouter from './agent';

const router = Router();

// Mount sub-routers
router.use('/transactions', transactionsRouter);
router.use('/analytics', analyticsRouter);
router.use('/budget', budgetRouter);
router.use('/agent', agentRouter);

// API info endpoint
router.get('/', (_req, res) => {
  res.json({
    name: 'Finance Copilot API',
    version: '1.0.0',
    endpoints: {
      transactions: '/api/transactions',
      analytics: '/api/analytics',
      budget: '/api/budget',
      agent: '/api/agent',
    },
  });
});

export default router;
