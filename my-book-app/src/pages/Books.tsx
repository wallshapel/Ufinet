import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import BookForm from '../components/books/BookForm';
import BookTable from '../components/books/BookTable';
import Pagination from '../components/books/Pagination';
import GenreFilter from '../components/books/GenreFilter';
import DeleteByIsbn from '../components/books/DeleteByIsbn';
import Spinner from '../components/common/Spinner';
import { useNavigate } from 'react-router-dom';
import { BookProvider, useBookContext } from '../context/BookContext';
import { getUserIdFromToken } from '../utils/decodeToken';

function BooksInner() {
    const { books, onDelete, page, size, totalPages, setPage, setSize, refreshBooks } = useBookContext();
    const [genre] = useState('');

    const filteredBooks = genre ? books.filter((b) => b.genre === genre) : books;

    return (
        <Layout>
            <h2 className="text-2xl font-bold mb-4">Mis libros</h2>
            <BookForm onAdd={refreshBooks} />
            <GenreFilter />
            <BookTable />
            <DeleteByIsbn books={filteredBooks} onDelete={onDelete} />
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

export default function Books() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userId = token ? getUserIdFromToken(token) : null;

    useEffect(() => {
        if (userId === null) {
            navigate('/login');
        }
    }, [userId, navigate]);

    if (userId === null) return <Spinner />;

    return (
        <BookProvider userId={userId}>
            <BooksInner />
        </BookProvider>
    );
}