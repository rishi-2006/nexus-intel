import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 0,
  totalPages = 1,
  onPageChange,
  totalItems,
  pageSize = 10,
}) => {
  if (totalPages <= 1 && (!totalItems || totalItems <= pageSize)) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(0, currentPage - 2);
    let end = Math.min(totalPages - 1, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(0, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`min-w-[36px] h-9 px-3 rounded-lg text-xs font-mono font-medium transition-colors ${
            currentPage === i
              ? 'bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-900/40 border border-cyan-400/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
          }`}
        >
          {i + 1}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-2 text-xs text-slate-400 font-mono">
      <div>
        {totalItems !== undefined ? (
          <span>
            Showing <strong className="text-white">{currentPage * pageSize + 1}</strong> to{' '}
            <strong className="text-white">
              {Math.min((currentPage + 1) * pageSize, totalItems)}
            </strong>{' '}
            of <strong className="text-white">{totalItems}</strong> entries
          </span>
        ) : (
          <span>Page {currentPage + 1} of {totalPages}</span>
        )}
      </div>

      <div className="flex items-center space-x-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-0.5" />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-1">{renderPageNumbers()}</div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4 ml-0.5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
