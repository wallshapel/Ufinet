import { createContext, useContext, useState, useEffect } from 'react';
import type { Book } from '../types/Book';
import { fetchPaginatedBooks } from '../api/bookApi';
import { deleteBookByIsbn, updateBook } from '../api/bookApi';
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

export function BookProvider({ children, userId }: { children: React.ReactNode; userId: number }) {
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

    const onDelete = async (isbn: string) => {
        try {
            await deleteBookByIsbn(isbn);
            setBooks((prev) => prev.filter((book) => book.isbn !== isbn));
        } catch (error) {
            console.error('Error al eliminar el libro:', error);
        }
    };

    const onEdit = async (updated: Book) => {
        try {
            await updateBook(updated);
            setBooks((prev) =>
                prev.map((book) => (book.isbn === updated.isbn ? updated : book))
            );
        } catch (error) {
            console.error('Error al editar el libro:', error);
        }
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
