import { createContext, useContext, useState, useEffect } from 'react';
import type { Book } from '../types/books/Book';
import type { Genre } from '../types/genres/Genre';
import type { BookContextType } from '../types/contexts/BookContextType';
import type { BookUpdatePayload } from '../types/books/BookUpdatePayload';
import {
    fetchPaginatedBooks,
    deleteBookByIsbn,
    updateBook,
    fetchBooksByGenre,
} from '../api/bookApi';
import { fetchGenresByUser } from '../api/genreApi';
import { getUserIdFromToken } from '../utils/decodeToken';

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
    const [selectedGenre, setSelectedGenre] = useState('');
    const [loading, setLoading] = useState(false);
    const [genres, setGenres] = useState<Genre[]>([]);

    const fetchBooks = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const userId = token ? getUserIdFromToken(token) : null;
        if (userId === null) {
            setLoading(false);
            return;
        }

        try {
            const data = selectedGenre
                ? await fetchBooksByGenre(userId, Number(selectedGenre), page, size)
                : await fetchPaginatedBooks(userId, page, size);

            setBooks(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error al obtener los libros:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGenres = async () => {
        const token = localStorage.getItem('token');
        const userId = token ? getUserIdFromToken(token) : null;
        if (userId === null) return;

        try {
            const data = await fetchGenresByUser();
            setGenres(data);
        } catch (error) {
            console.error('Error al cargar géneros:', error);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [page, size, selectedGenre]);

    useEffect(() => {
        fetchGenres();
    }, []);

    const onDelete = async (isbn: string) => {
        try {
            await deleteBookByIsbn(isbn);
            const updatedBooks = books.filter((book) => book.isbn !== isbn);
            setBooks(updatedBooks);

            if (updatedBooks.length === 0 && page > 0) { // Si la página queda vacía y no es la primera, retrocede una página
                setPage(page - 1);
            } else {
                await fetchBooks();
            }
        } catch (error) {
            console.error('Error al eliminar el libro:', error);
        }
    };

    const onEdit = async (updated: BookUpdatePayload) => {
        try {
            await updateBook(updated);
            setBooks((prev) =>
                prev.map((book) =>
                    book.isbn === updated.isbn ? { ...book, ...updated } : book
                )
            );
        } catch (error) {
            console.error('Error al editar el libro:', error);
            throw error;
        }
    };

    return (
        <BookContext.Provider
            value={{
                books,
                setBooks,
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
                genres,
                setGenres,
                refreshGenres: fetchGenres,
            }}
        >
            {children}
        </BookContext.Provider>
    );
}
