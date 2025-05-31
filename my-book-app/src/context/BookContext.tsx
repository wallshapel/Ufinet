import { createContext, useContext, useState, useEffect } from 'react';
import type { Book } from '../types/books/Book';
import { fetchPaginatedBooks } from '../api/bookApi';
import { deleteBookByIsbn, updateBook } from '../api/bookApi';
import { getUserIdFromToken } from '../utils/decodeToken';
import type { BookContextType } from '../types/contexts/BookContextType';

export const BookContext = createContext<BookContextType | null>(null);

export const useBookContext = () => {
    const context = useContext(BookContext);
    if (!context) throw new Error('useBookContext must be used within a BookContext.Provider');
    return context;
};

export function BookProvider({ children }: { children: React.ReactNode; userId: number }) {
    const [books, setBooks] = useState<Book[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchBooks = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const userId = token ? getUserIdFromToken(token) : null;
        if (userId === null) {
            setLoading(false);
            return;
        }

        try {
            const data = await fetchPaginatedBooks(userId, page, size);
            setBooks(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error al obtener los libros:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [page, size]);

    const filteredBooks = selectedGenre
        ? books.filter((b) => b.genre === selectedGenre)
        : books;

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
                filteredBooks,
                page,
                size,
                totalPages,
                selectedGenre,
                setSelectedGenre,
                setPage,
                setSize,
                refreshBooks: fetchBooks,
                onDelete,
                onEdit,
                loading,
            }}
        >
            {children}
        </BookContext.Provider>
    );
}