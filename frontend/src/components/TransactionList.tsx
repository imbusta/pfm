import type { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-surface rounded-lg shadow-md p-6 text-center text-text-secondary border border-gray-200">
        No transactions yet. Add your first transaction to get started.
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg shadow-md overflow-hidden border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-background">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-surface divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-background transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                {new Date(transaction.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary font-medium">
                {transaction.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                {transaction.category || 'Uncategorized'}
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                  transaction.type === 'income' ? 'text-success' : 'text-danger'
                }`}
              >
                {transaction.type === 'income' ? '+' : '-'}$
                {Math.abs(transaction.amount).toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="text-danger hover:text-danger-dark font-medium transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
