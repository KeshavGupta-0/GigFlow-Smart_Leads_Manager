import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../ui/Button';

import { ILeadQuery, LeadStatus, LeadSource } from '../../types/lead.types';

interface LeadFiltersProps {
  filters: ILeadQuery;
  setFilter: <K extends keyof ILeadQuery>(key: K, value: ILeadQuery[K]) => void;
  resetFilters: () => void;
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({ filters, setFilter, resetFilters }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search leads by name or email..."
          value={filters.search || ''}
          onChange={(e) => setFilter('search', e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
        />
      </div>

      <div className="flex items-center gap-2">
        <select
          value={filters.status || ''}
          onChange={(e) => setFilter('status', (e.target.value as LeadStatus) || undefined)}
          className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent sm:text-sm text-gray-900 dark:text-gray-100"
        >
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
        </select>

        <select
          value={filters.source || ''}
          onChange={(e) => setFilter('source', (e.target.value as LeadSource) || undefined)}
          className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent sm:text-sm text-gray-900 dark:text-gray-100"
        >
          <option value="">All Sources</option>
          <option value="Website">Website</option>
          <option value="Instagram">Instagram</option>
          <option value="Referral">Referral</option>
        </select>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFilter('sort', filters.sort === 'asc' ? 'desc' : 'asc')}
          className="flex items-center gap-2 whitespace-nowrap"
          title="Sort by Created At"
        >
          <SlidersHorizontal size={16} />
          {filters.sort === 'asc' ? 'Oldest' : 'Latest'}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-gray-500 hover:text-gray-700"
          title="Reset Filters"
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );
};
