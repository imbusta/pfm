import type { TransactionFilters } from '../types';

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFilterChange: (filters: TransactionFilters) => void;
  availableCategories: string[];
}

export default function TransactionFilters({
  filters,
  onFilterChange,
  availableCategories,
}: TransactionFiltersProps) {
  const handleClearFilters = () => {
    onFilterChange({
      searchText: '',
      category: '',
      startDate: '',
      endDate: '',
    });
  };

  const hasActiveFilters =
    filters.searchText || filters.category || filters.startDate || filters.endDate;

  return (
    <div className="bg-surface rounded-lg shadow-md p-4 border border-gray-200 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-text-primary">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Search Description
          </label>
          <input
            type="text"
            value={filters.searchText}
            onChange={(e) => onFilterChange({ ...filters, searchText: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            placeholder="Search..."
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          >
            <option value="">All Categories</option>
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            End Date
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
