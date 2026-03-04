import { useEffect, useState, useCallback } from 'react';
import { transactionsApi, categoriesApi } from '../api/client';
import type { Transaction, TransactionCreate, TransactionFilters } from '../types';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import TransactionFiltersComponent from '../components/TransactionFilters';

const PAGE_SIZE = 20;

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState<TransactionFilters>({
    searchText: '',
    category: '',
    startDate: '',
    endDate: '',
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const loadTransactions = useCallback(async (page: number, f: TransactionFilters) => {
    try {
      setLoading(true);
      const result = await transactionsApi.getAll({
        page,
        limit: PAGE_SIZE,
        search: f.searchText || undefined,
        category: f.category || undefined,
        startDate: f.startDate || undefined,
        endDate: f.endDate || undefined,
      });
      setTransactions(result.data);
      setTotalCount(result.total);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    categoriesApi.getAll()
      .then((cats) => setAvailableCategories(cats.map((c) => c.name).sort()))
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadTransactions(currentPage, filters);
  }, [currentPage, filters, loadTransactions]);

  const handleFilterChange = (newFilters: TransactionFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleCreate = async (data: TransactionCreate) => {
    try {
      await transactionsApi.create(data);
      setShowForm(false);
      await loadTransactions(currentPage, filters);
    } catch (error) {
      console.error('Failed to create transaction:', error);
      throw error;
    }
  };

  const handleEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setShowForm(false);
  };

  const handleUpdate = async (data: TransactionCreate) => {
    if (!editingTransaction) return;
    try {
      await transactionsApi.update(editingTransaction.id, data);
      setEditingTransaction(null);
      await loadTransactions(currentPage, filters);
    } catch (error) {
      console.error('Failed to update transaction:', error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await transactionsApi.delete(id);
      await loadTransactions(currentPage, filters);
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Transactions</h1>
        {!editingTransaction && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-all shadow-sm hover:shadow-md font-medium"
          >
            {showForm ? '✕ Cancel' : '+ Add Transaction'}
          </button>
        )}
      </div>

      {showForm && !editingTransaction && (
        <div className="mb-6">
          <TransactionForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {editingTransaction && (
        <div className="mb-6">
          <TransactionForm
            initialData={editingTransaction}
            onSubmit={handleUpdate}
            onCancel={() => setEditingTransaction(null)}
          />
        </div>
      )}

      <TransactionFiltersComponent
        filters={filters}
        onFilterChange={handleFilterChange}
        availableCategories={availableCategories}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-text-secondary">Loading...</div>
        </div>
      ) : (
        <>
          <TransactionList
            transactions={transactions}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-text-secondary hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>
              <span className="text-sm text-text-secondary">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-text-secondary hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
