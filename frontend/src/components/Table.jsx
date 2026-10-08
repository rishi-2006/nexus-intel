import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export const Table = ({
  columns,
  data,
  sortField,
  sortDirection,
  onSort,
  onRowClick,
  emptyMessage = 'No records found in current view.',
  loading = false,
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-mono text-xs uppercase tracking-wider">
            {columns.map((col) => (
              <th
                key={col.key || col.header}
                onClick={() => col.sortable && onSort && onSort(col.key)}
                className={`py-3.5 px-4 font-semibold ${
                  col.sortable ? 'cursor-pointer select-none hover:text-cyan-400 transition-colors' : ''
                } ${col.headerClassName || ''}`}
              >
                <div className="flex items-center space-x-1.5">
                  <span>{col.header}</span>
                  {col.sortable && (
                    <span className="text-slate-500">
                      {sortField === col.key ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 hover:text-slate-300" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-mono">Retrieving intelligence records...</span>
                </div>
              </td>
            </tr>
          ) : data && data.length > 0 ? (
            data.map((row, rowIdx) => (
              <tr
                key={row.id || rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors ${
                  onRowClick ? 'cursor-pointer hover:bg-slate-800/50' : 'hover:bg-slate-800/20'
                } ${rowIdx % 2 === 1 ? 'bg-slate-950/20' : ''}`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key || col.header}
                    className={`py-3.5 px-4 text-slate-300 ${col.cellClassName || ''}`}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="py-10 text-center text-slate-500 text-sm">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
