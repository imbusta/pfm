import { useEffect, useState } from 'react';
import { transactionsApi } from '../api/client';
import type { Transaction, TransactionCreate } from '../types';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionsApi.getAll();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: TransactionCreate) => {
    try {
      await transactionsApi.create(data);
      await loadTransactions();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create transaction:', error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await transactionsApi.delete(id);
      await loadTransactions();
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Transaction'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <TransactionForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : (
        <TransactionList transactions={transactions} onDelete={handleDelete} />
      )}
    </div>
  );
}
