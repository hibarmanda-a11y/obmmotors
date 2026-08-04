'use client';

import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

const MAKES = ['All Makes', 'Mercedes-Benz', 'Porsche', 'BMW', 'Audi', 'Tesla', 'Lamborghini', 'Lucid', 'Chevrolet', 'Hyundai', 'Ford', 'Toyota', 'Nissan'];
const CONDITIONS = ['All Conditions', 'New', 'Used', 'Certified Pre-Owned'];
const FUEL_TYPES = ['All Fuel Types', 'Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];
const PRICE_RANGES = ['All Prices', 'Under $50,000', '$50,000-$100,000', '$100,000-$200,000', 'Over $200,000'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

/**
 * Car filters sidebar/panel component
 * @param {object} filters - Current filter values
 * @param {Function} onFilterChange - Callback when a filter changes
 * @param {string} searchTerm - Current search term
 * @param {Function} onSearchChange - Callback when search changes
 * @param {string} sortBy - Current sort value
 * @param {Function} onSortChange - Callback when sort changes
 * @param {Function} onClear - Callback to clear all filters
 */
export default function CarFilters({
  filters = {},
  onFilterChange,
  searchTerm = '',
  onSearchChange,
  sortBy = 'newest',
  onSortChange,
  onClear,
}) {
  const hasActiveFilters =
    searchTerm ||
    (filters.make && filters.make !== 'All Makes') ||
    (filters.condition && filters.condition !== 'All Conditions') ||
    (filters.fuelType && filters.fuelType !== 'All Fuel Types') ||
    (filters.priceRange && filters.priceRange !== 'All Prices');

  const selectClass =
    'w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-blue-500 transition-colors duration-200';

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <FaFilter className="text-blue-600 w-4 h-4" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors"
          >
            <FaTimes className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      {onSearchChange && (
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
            Search
          </label>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Make, model, keyword..."
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Sort */}
      {onSortChange && (
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
            Sort By
          </label>
          <select value={sortBy} onChange={(e) => onSortChange(e.target.value)} className={selectClass}>
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Make */}
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
          Make
        </label>
        <select
          value={filters.make || ''}
          onChange={(e) => onFilterChange?.({ ...filters, make: e.target.value })}
          className={selectClass}
        >
          {MAKES.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
          Price Range
        </label>
        <select
          value={filters.priceRange || ''}
          onChange={(e) => onFilterChange?.({ ...filters, priceRange: e.target.value })}
          className={selectClass}
        >
          {PRICE_RANGES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Condition */}
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
          Condition
        </label>
        <select
          value={filters.condition || ''}
          onChange={(e) => onFilterChange?.({ ...filters, condition: e.target.value })}
          className={selectClass}
        >
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
          Fuel Type
        </label>
        <select
          value={filters.fuelType || ''}
          onChange={(e) => onFilterChange?.({ ...filters, fuelType: e.target.value })}
          className={selectClass}
        >
          {FUEL_TYPES.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
