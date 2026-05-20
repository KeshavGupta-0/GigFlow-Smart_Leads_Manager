import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);

    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(totalPages, 5);
      } else if (end === totalPages) {
        start = Math.max(1, totalPages - 4);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sm:px-6 mt-4 rounded-lg shadow-sm">
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="rounded-l-md border border-gray-300 dark:border-gray-600"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft size={16} />
            </Button>
            
            {getPageNumbers().map(num => (
              <Button
                key={num}
                variant={num === page ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onPageChange(num)}
                className={`border border-gray-300 dark:border-gray-600 ${num === page ? 'z-10' : ''}`}
              >
                {num}
              </Button>
            ))}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="rounded-r-md border border-gray-300 dark:border-gray-600"
            >
              <span className="sr-only">Next</span>
              <ChevronRight size={16} />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};
