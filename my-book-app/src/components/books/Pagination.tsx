import type { Props } from "../../types/paginations/PaginationProps";

export default function Pagination({ page, totalPages, onPageChange, size, onSizeChange }: Props) {
    return (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mt-6 px-2">
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
                <label htmlFor="size" className="text-sm text-gray-700 whitespace-nowrap">
                    Mostrar:
                </label>
                <select
                    id="size"
                    value={size}
                    onChange={(e) => onSizeChange(Number(e.target.value))}
                    className="border border-gray-300 rounded p-1 text-sm w-16"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 0}
                    className={`px-3 py-1 sm:px-4 sm:py-2 rounded text-white text-sm sm:text-base ${page === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-700 hover:bg-blue-800'
                        }`}
                >
                    Anterior
                </button>

                <span className="text-sm text-gray-700 whitespace-nowrap">
                    Página {page + 1} de {totalPages}
                </span>

                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages - 1}
                    className={`px-3 py-1 sm:px-4 sm:py-2 rounded text-white text-sm sm:text-base ${page >= totalPages - 1
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-700 hover:bg-blue-800'
                        }`}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}