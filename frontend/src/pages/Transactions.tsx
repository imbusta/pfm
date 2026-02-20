import { useEffect, useState, useMemo } from 'react';
import { transactionsApi } from '../api/client';
import type { Transaction, TransactionCreate, TransactionFilters } from '../types';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import TransactionFiltersComponent from '../components/TransactionFilters';

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>({
    searchText: '',
    category: '',
    startDate: '',
    endDate: '',
  });

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

  // Extract available categories from transactions
  const availableCategories = useMemo(() => {
    const categories = transactions
      .map((t) => t.category_name)
      .filter((c): c is string => !!c);
    return Array.from(new Set(categories)).sort();
  }, [transactions]);

  // Filter transactions based on current filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Filter by search text (case-insensitive description match)
      if (
        filters.searchText &&
        !transaction.description.toLowerCase().includes(filters.searchText.toLowerCase())
      ) {
        return false;
      }

      // Filter by category
      if (filters.category && transaction.category_name !== filters.category) {
        return false;
      }

      // Filter by date range
      const txDate = new Date(transaction.date);
      if (filters.startDate && txDate < new Date(filters.startDate)) {
        return false;
      }
      if (filters.endDate && txDate > new Date(filters.endDate)) {
        return false;
      }

      return true;
    });
  }, [transactions, filters]);

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Transactions</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-all shadow-sm hover:shadow-md font-medium"
        >
          {showForm ? '✕ Cancel' : '+ Add Transaction'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <TransactionForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {!loading && (
        <TransactionFiltersComponent
          filters={filters}
          onFilterChange={setFilters}
          availableCategories={availableCategories}
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-text-secondary">Loading...</div>
        </div>
      ) : (
        <TransactionList transactions={filteredTransactions} onDelete={handleDelete} />
      )}
    </div>
  );
}
