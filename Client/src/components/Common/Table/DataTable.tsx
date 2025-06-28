import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import { Select } from "@Components/Common/ExportComponent";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pageSizes?: number[];
  initialPageSize?: number;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onPageChange?: (newPageIndex: number) => void; 
}

function DataTable<T extends object>({ data, columns, pageSizes = [5, 10, 20, 50], initialPageSize = 10, isLoading = false, isError = false, errorMessage, onRetry,onPageChange }: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: initialPageSize } },
  });

  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;
  const lastIndex = pageCount - 1;
  const pagesToShow = 7;

  const getDisplayPages = (): number[] => {
    if (pageCount <= pagesToShow) return Array.from({ length: pageCount }, (_, i) => i);
    const slots = pagesToShow - 1;
    let start = pageIndex - Math.floor(slots / 2);
    if (start < 0) start = 0;
    if (start + slots > lastIndex) start = lastIndex - slots;
    const dynamic = Array.from({ length: slots }, (_, i) => start + i);
    if (dynamic[0] > 0) dynamic[0] = -2;
    if (dynamic[dynamic.length - 1] < lastIndex - 1) dynamic[dynamic.length - 1] = -3;
    return [...dynamic, lastIndex];
  };

  const displayPages = getDisplayPages();
  const startRow = pageIndex * table.getState().pagination.pageSize + 1;
  const endRow = Math.min(startRow + table.getState().pagination.pageSize - 1, data.length);

return (
  <div className="bg-white shadow-sm border border-gray-200 overflow-visible rounded-xl">
    <div className="overflow-hidden overflow-x-auto shadow rounded-t-xl">
      <table className="min-w-full divide-y divide-gray-200 rounded-t-xl">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => {
                const isActions = header.id === "actions";
                return (
                  <th
                    key={header.id}
                    className={`px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                      isActions ? "w-16 text-center" : ""
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {isLoading ? (
            Array.from({ length: initialPageSize }).map((_, rowIdx) => (
              <tr key={`skeleton-${rowIdx}`} className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-25"}>
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-6 py-4">
                    <Skeleton height={16} />
                  </td>
                ))}
              </tr>
            ))
          ) : isError ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <FiAlertTriangle className="w-12 h-12 text-red-500" />
                  <p className="text-lg font-semibold text-red-600">
                    {errorMessage || "An error occurred while fetching data"}
                  </p>
                  {onRetry && (
                    <button
                      onClick={onRetry}
                      className="mt-2 inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition"
                    >
                      <FiRefreshCw className="w-4 h-4" />
                      <span>Retry</span>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ) : table.getRowModel().rows.length === 0 ? (
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
            table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={`transition-colors duration-150 hover:bg-gray-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-25"
                }`}
              >
                {row.getVisibleCells().map((cell) => {
                  const isActions = cell.column.id === "actions";
                  return (
                    <td
                      key={cell.id}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        isActions ? "w-16 text-center" : "text-gray-900"
                      }`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 z-0 rounded-b-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Show:</label>
            <Select
              value={table.getState().pagination.pageSize}
              onChange={(value) => table.setPageSize(Number(value))}
              options={pageSizes.map((size) => ({ label: `${size} rows`, value: size }))}
              className="w-30 px-3 py-1.5 text-sm bg-gray-50 text-gray-600"
            />
          </div>
          {data.length > 0 && (
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium text-gray-900">{startRow}</span> to{" "}
              <span className="font-medium text-gray-900">{endRow}</span> of{" "}
              <span className="font-medium text-gray-900">{data.length}</span> results
            </div>
          )}
        </div>
     
          <div className="flex items-center space-x-1">
            <button
              onClick={() => {
                table.setPageIndex(0);
                onPageChange?.(0);
              }}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="First page"
            >
              <FiChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                table.previousPage();
                onPageChange?.(Math.max(0, table.getState().pagination.pageIndex - 1));
              }}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-1">
              {displayPages.map((item, idx) => {
                if (item === -2 || item === -3) {
                  return (
                    <button
                      key={`${item}-${idx}`}
                      onClick={() => {
                        const target = item === -2 ? displayPages[1] - 1 : displayPages[displayPages.length - 2] + 1;
                        table.setPageIndex(target);
                        onPageChange?.(target);
                      }}
                      className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      ...
                    </button>
                  );
                }
                return (
                  <button
                    onClick={() => {
                      table.setPageIndex(item);
                      onPageChange?.(item);
                    }}
                    key={item}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      item === pageIndex
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {item + 1}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => {
                table.nextPage();
                onPageChange?.(Math.min(lastIndex, table.getState().pagination.pageIndex + 1));
              }}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Next page"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                table.setPageIndex(lastIndex);
                onPageChange?.(lastIndex);
              }}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Last page"
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
