import type { Props } from "../../../types/paginations/PaginationProps";

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  size,
  onSizeChange,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row justify-between sm:justify-center items-center gap-3 sm:gap-6 mt-6 px-4 sm:px-8 w-full flex-wrap">
      {/* Size selector */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="size"
          className="text-sm text-gray-700 whitespace-nowrap"
        >
          Show:
        </label>
        <select
          id="size"
          value={size}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-sm w-20"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* Page navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className={`px-4 py-2 rounded text-white text-sm sm:text-base transition ${
            page === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-700 hover:bg-blue-800"
          }`}
        >
          Back
        </button>

        <span className="text-sm text-gray-800 whitespace-nowrap">
          Page {page + 1} of {totalPages}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className={`px-4 py-2 rounded text-white text-sm sm:text-base transition ${
            page >= totalPages - 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-700 hover:bg-blue-800"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
