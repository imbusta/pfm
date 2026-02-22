import { useState, useEffect } from 'react';
import type { TransactionCreate, Category } from '../types';
import { categoriesApi } from '../api/client';

interface TransactionFormProps {
  onSubmit: (data: TransactionCreate) => Promise<void>;
  onCancel: () => void;
}

export default function TransactionForm({ onSubmit, onCancel }: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionCreate & { category?: string }>({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: 0,
    type: 'expense',
    category: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    categoriesApi.getAll().then(setCategories).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.description || formData.amount === 0) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        ...formData,
        amount: formData.type === 'expense' ? -Math.abs(formData.amount) : Math.abs(formData.amount),
      });
    } catch (err) {
      setError('Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-text-primary mb-4">New Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-danger/10 border border-danger text-danger p-3 rounded-lg">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date as string}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            >
              <option value="expense">💸 Expense</option>
              <option value="income">💰 Income</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            placeholder="e.g., Grocery shopping"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Category <span className="text-text-secondary text-xs">(optional)</span>
            </label>
            <select
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            >
              <option value="">Auto-detect</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark disabled:bg-text-secondary/50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
          >
            {loading ? 'Creating...' : 'Create Transaction'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border-2 border-gray-300 text-text-secondary rounded-lg hover:bg-background hover:border-text-secondary transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
