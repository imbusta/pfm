import { Router } from 'express';
import transactionsRouter from './transactions';
import analyticsRouter from './analytics';
import budgetRouter from './budget';
import agentRouter from './agent';
import categoriesRouter from './categories';
import currenciesRouter from './currencies';
import paymentMethodsRouter from './payment-methods';

const router = Router();

// Mount sub-routers
router.use('/transactions', transactionsRouter);
router.use('/analytics', analyticsRouter);
router.use('/budget', budgetRouter);
router.use('/agent', agentRouter);
router.use('/categories', categoriesRouter);
router.use('/currencies', currenciesRouter);
router.use('/payment-methods', paymentMethodsRouter);

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
      categories: '/api/categories',
      currencies: '/api/currencies',
      paymentMethods: '/api/payment-methods',
    },
  });
});

export default router;
