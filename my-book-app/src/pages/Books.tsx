import { useState, useEffect } from 'react';
import { BookContext } from '../context/BookContext';
import Layout from '../components/Layout';
import type { Book } from '../types/Book';
import { fetchPaginatedBooks } from '../api/bookApi';
import BookForm from '../components/books/BookForm';
import BookTable from '../components/books/BookTable';
import Pagination from '../components/books/Pagination';
import GenreFilter from '../components/books/GenreFilter';
import DeleteByIsbn from '../components/books/DeleteByIsbn';
import { getUserIdFromToken } from '../utils/decodeToken';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/common/Spinner';

export default function Books() {
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [books, setBooks] = useState<Book[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [allBooks, setAllBooks] = useState<Book[]>([]);
    const [genre, setGenre] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userId = token ? getUserIdFromToken(token) : null;


    useEffect(() => {
        if (userId === null) {
            navigate('/login');
        }
    }, [userId, navigate]);

    useEffect(() => {
        const loadBooks = async () => {
            if (userId === null) return;

            try {
                setLoading(true);
                const data = await fetchPaginatedBooks(userId, page, size);
                setAllBooks(data.content);
                setTotalPages(data.totalPages);
            } catch (err) {
                console.error('Error al cargar libros paginados:', err);
            } finally {
                setTimeout(() => setLoading(false), 500);
            }
        };

        loadBooks();
    }, [userId, page, size]);

    useEffect(() => {
        if (!genre) {
            setBooks(allBooks);
        } else {
            setBooks(allBooks.filter((book) => book.genre === genre));
        }
    }, [genre, allBooks]);

    const handleAddBook = (data: {
        isbn: string;
        title: string;
        genre: string;
        publishedDate: string;
        synopsis: string;
    }) => {
        const token = localStorage.getItem('token');
        const userId = token ? getUserIdFromToken(token) : null;

        if (userId === null) return;

        const newBook: Book = {
            ...data,
            createdAt: new Date().toISOString(),
            userId,
        };

        setAllBooks([newBook, ...allBooks]);
    };

    const handleDeleteBook = (isbn: string) => {
        const updated = allBooks.filter((book) => book.isbn !== isbn);
        setAllBooks(updated);
    };

    const handleEditBook = (updatedBook: Book) => {
        const updated = allBooks.map((book) =>
            book.isbn === updatedBook.isbn ? updatedBook : book
        );
        setAllBooks(updated);
    };

    const genres = Array.from(new Set(allBooks.map((b) => b.genre))).sort();

    if (loading) return <Spinner />;

    return (
        <Layout>
            <h2 className="text-2xl font-bold mb-4">Mis libros</h2>
            <BookForm onAdd={handleAddBook} />
            <GenreFilter selected={genre} genres={genres} onChange={setGenre} />
            <BookContext.Provider value={{ books, onDelete: handleDeleteBook, onEdit: handleEditBook }}>
                <BookTable />
            </BookContext.Provider>
            <DeleteByIsbn books={books} onDelete={handleDeleteBook} />
            <Pagination
                page={page}
                size={size}
                totalPages={totalPages}
                onPageChange={setPage}
                onSizeChange={setSize}
            />
        </Layout>
    );
}
