import request from 'supertest';
import app from '../src/app';

describe('Transactions API', () => {
  describe('GET /api/transactions', () => {
    it('should return empty array initially', async () => {
      const response = await request(app).get('/api/transactions');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

  describe('POST /api/transactions', () => {
    it('should create a new transaction', async () => {
      const transaction = {
        date: new Date().toISOString(),
        description: 'Test transaction',
        amount: 100,
        type: 'expense',
      };

      const response = await request(app)
        .post('/api/transactions')
        .send(transaction);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.description).toBe(transaction.description);
    });

    it('should auto-classify transaction if category not provided', async () => {
      const transaction = {
        date: new Date().toISOString(),
        description: 'Grocery shopping at Whole Foods',
        amount: 75,
        type: 'expense',
      };

      const response = await request(app)
        .post('/api/transactions')
        .send(transaction);

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('category');
    });
  });

  describe('GET /api/transactions/:id', () => {
    it('should return 404 for non-existent transaction', async () => {
      const response = await request(app).get('/api/transactions/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
