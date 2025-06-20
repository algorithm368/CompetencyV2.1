import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pageSizes?: number[];
  initialPageSize?: number;
}

function DataTable<T extends object>({ data, columns, pageSizes = [5, 10, 20, 50], initialPageSize }: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: initialPageSize ? { pagination: { pageSize: initialPageSize } } : undefined,
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

  return (
    <div>
      <div className="overflow-x-auto shadow rounded-lg mb-4">
        <table className="min-w-full bg-white border border-gray-200 border-collapse">
          <thead className="bg-slate-100">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => {
                  const isActions = header.id === "actions";
                  return (
                    <th
                      key={header.id}
                      className={`px-4 py-2 text-left text-sm font-medium uppercase tracking-wider text-slate-700 border border-gray-200 ${isActions ? "w-12 text-center" : ""}`}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="bg-white hover:bg-gray-50"
              >
                {row.getVisibleCells().map((cell) => {
                  const isActions = cell.column.id === "actions";
                  return (
                    <td
                      key={cell.id}
                      className={`px-4 py-2 whitespace-nowrap text-sm text-slate-600 border border-gray-200 ${isActions ? "w-12 text-center" : ""}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <span className="mr-2 text-sm">Rows per page:</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="p-1 border rounded"
          >
            {pageSizes.map((size) => (
              <option
                key={size}
                value={size}
              >
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded disabled:opacity-50"
          >
            <FiChevronLeft />
          </button>
          {displayPages.map((item, idx) => {
            if (item === -2 || item === -3) {
              return (
                <button
                  key={`${item}-${idx}`}
                  onClick={() => {
                    const target = item === -2 ? displayPages[1] - 1 : displayPages[displayPages.length - 2] + 1;
                    table.setPageIndex(target);
                  }}
                  className="px-3 py-1 rounded hover:bg-gray-200"
                >
                  ...
                </button>
              );
            }
            return (
              <button
                key={item}
                onClick={() => table.setPageIndex(item)}
                className={`px-3 py-1 rounded ${item === pageIndex ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
              >
                {item + 1}
              </button>
            );
          })}

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded disabled:opacity-50"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
