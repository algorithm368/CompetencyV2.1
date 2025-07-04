import React, { useState, useEffect, useCallback } from "react";
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import { Select } from "@Components/Common/ExportComponent";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface DataTableProps<T> {
  fetchPage: (pageIndex: number, pageSize: number) => Promise<{ data: T[]; total: number }>;
  columns: ColumnDef<T>[];
  pageSizes?: number[];
  initialPageSize?: number;
  initialPrefetchPages?: number;
  onPageChange?: (newPageIndex: number) => void;
  resetTrigger?: unknown;
}

function DataTable<T extends object>({ fetchPage, columns, pageSizes = [5, 10, 20, 50], initialPageSize = 10, initialPrefetchPages = 3, onPageChange, resetTrigger }: DataTableProps<T>) {
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [pageIndex, setPageIndex] = useState(0);
  const [cache, setCache] = useState<Record<number, T[]>>({});
  const [loadingPages, setLoadingPages] = useState<Set<number>>(new Set());
  const [errorPages, setErrorPages] = useState<Record<number, string>>({});
  const [totalRows, setTotalRows] = useState<number>(0);

  useEffect(() => {
    setCache({});
    setPageIndex(0);
  }, [resetTrigger]);

  const totalPages = Math.max(Math.ceil(totalRows / pageSize), 1);

  const table = useReactTable({
    data: cache[pageIndex] ?? [],
    columns,
    pageCount: totalPages,
    state: { pagination: { pageIndex, pageSize } },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      if (next.pageIndex !== pageIndex) {
        setPageIndex(next.pageIndex);
        onPageChange?.(next.pageIndex);
        if (!cache[next.pageIndex] && !loadingPages.has(next.pageIndex)) loadPage(next.pageIndex);
      }
      if (next.pageSize !== pageSize) {
        setPageSize(next.pageSize);
      }
    },
  });

  const loadPage = useCallback(
    async (idx: number) => {
      setLoadingPages((prev) => new Set(prev).add(idx));
      try {
        const result = await fetchPage(idx, pageSize);
        setCache((prev) => ({ ...prev, [idx]: result.data }));
        setTotalRows(result.total);
        setErrorPages((prev) => {
          const copy = { ...prev };
          delete copy[idx];
          return copy;
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error loading data";
        setErrorPages((prev) => ({ ...prev, [idx]: message }));
      } finally {
        setLoadingPages((prev) => {
          const copy = new Set(prev);
          copy.delete(idx);
          return copy;
        });
      }
    },
    [fetchPage, pageSize]
  );

  useEffect(() => {
    for (let i = 0; i < initialPrefetchPages && i < totalPages; i++) {
      if (!cache[i] && !loadingPages.has(i)) loadPage(i);
    }
  }, [initialPrefetchPages, totalPages, cache, loadingPages, loadPage]);

  const currentData = cache[pageIndex] ?? [];
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="bg-white shadow-sm border border-gray-200 overflow-visible rounded-xl">
      <div className="overflow-hidden overflow-x-auto shadow rounded-t-xl">
        <table className="min-w-full divide-y divide-gray-200 rounded-t-xl">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th key={header.id} className={`px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider ${header.id === "actions" ? "text-right" : "text-left"}`}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loadingPages.has(pageIndex) ? (
              Array.from({ length: pageSize }).map((_, rowIdx) => (
                <tr key={`skeleton-${rowIdx}`} className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-25"}>
                  {columns.map((_, colIdx) => (
                    <td key={colIdx} className="px-6 py-4">
                      <Skeleton height={16} />
                    </td>
                  ))}
                </tr>
              ))
            ) : errorPages[pageIndex] ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <FiAlertTriangle className="w-12 h-12 text-red-500" />
                    <p className="text-lg font-semibold text-red-600">{errorPages[pageIndex]}</p>
                    <button onClick={() => loadPage(pageIndex)} className="mt-2 inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition">
                      <FiRefreshCw className="w-4 h-4" />
                      <span>Retry</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : currentData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3 bg-gray-50 p-6 rounded-xl border border-dashed border-gray-200">
                    <FiAlertTriangle className="w-10 h-10 text-gray-400" />
                    <p className="text-base font-semibold text-gray-700">No data available</p>
                    <p className="text-sm text-gray-500">Try adjusting your filters or search keywords</p>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, idx) => (
                <tr key={row.id} className={`transition-colors duration-150 hover:bg-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-25"}`}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Show:</label>
              <Select
                value={pageSize}
                onChange={(val) => {
                  setPageSize(Number(val));
                  setCache({});
                  setPageIndex(0);
                }}
                options={pageSizes.map((s) => ({ label: `${s} rows`, value: s }))}
                className="w-30 px-3 py-1.5 text-sm bg-gray-50 text-gray-600"
              />
            </div>
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium text-gray-900">{totalRows === 0 ? 0 : startRow}</span> to <span className="font-medium text-gray-900">{endRow}</span> of{" "}
              <span className="font-medium text-gray-900">{totalRows}</span> results
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={pageIndex === 0}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={pageIndex === 0}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => table.setPageIndex(i)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${i === pageIndex ? "bg-blue-600 text-white shadow-sm" : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => table.nextPage()}
              disabled={pageIndex === totalPages - 1}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.setPageIndex(totalPages - 1)}
              disabled={pageIndex === totalPages - 1}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
