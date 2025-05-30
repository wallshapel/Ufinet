import { createContext, useContext, useState, useEffect } from 'react';
import type { Book } from '../types/Book';
import { fetchPaginatedBooks } from '../api/bookApi';
import { getUserIdFromToken } from '../utils/decodeToken';

type BookContextType = {
    books: Book[];
    page: number;
    size: number;
    totalPages: number;
    setPage: (page: number) => void;
    setSize: (size: number) => void;
    refreshBooks: () => void;
    onDelete: (isbn: string) => void;
    onEdit: (book: Book) => void;
};

export const BookContext = createContext<BookContextType | null>(null);

export const useBookContext = () => {
    const context = useContext(BookContext);
    if (!context) throw new Error('useBookContext must be used within a BookContext.Provider');
    return context;
};

export function BookProvider({ children }: { children: React.ReactNode }) {
    const [books, setBooks] = useState<Book[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    const fetchBooks = async () => {
        const token = localStorage.getItem('token');
        const userId = token ? getUserIdFromToken(token) : null;
        if (userId === null) return;

        const data = await fetchPaginatedBooks(userId, page, size);
        setBooks(data.content);
        setTotalPages(data.totalPages);
    };

    useEffect(() => {
        fetchBooks();
    }, [page, size]);

    const onDelete = (isbn: string) => {
        setBooks((prev) => prev.filter((book) => book.isbn !== isbn));
    };

    const onEdit = (updated: Book) => {
        setBooks((prev) =>
            prev.map((book) => (book.isbn === updated.isbn ? updated : book))
        );
    };

    return (
        <BookContext.Provider
            value={{
                books,
                page,
                size,
                totalPages,
                setPage,
                setSize,
                refreshBooks: fetchBooks,
                onDelete,
                onEdit,
            }}
        >
            {children}
        </BookContext.Provider>
    );
}
