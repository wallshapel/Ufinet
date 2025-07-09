import { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import BookForm from '../components/bookForm/BookForm';
import BookTable from '../components/bookTable/bookTable/BookTable';
import Pagination from '../components/bookTable/pagination/Pagination';
import GenreFilter from '../components/genres/GenreFilter';
import DeleteByIsbn from '../components/deleteByIsbn/DeleteByIsbn';
import Spinner from '../components/common/Spinner';
import { useNavigate } from 'react-router-dom';
import { BookProvider, useBookContext } from '../context/BookContext';
import { getUserIdFromToken } from '../utils/decodeToken';

function BooksInner() {
    const { books, onDelete, page, size, totalPages, setPage, setSize, refreshBooks } = useBookContext();

    return (
        <Layout>
            <h2 className="text-2xl font-bold mb-4">New</h2>
            <BookForm onAdd={refreshBooks} />
            <div className="flex items-start gap-x-2 md:gap-x-8 mt-8">
                <GenreFilter />
                <DeleteByIsbn books={books} onDelete={onDelete} />
            </div>
            <BookTable />
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
        <BookProvider>
            <BooksInner />
        </BookProvider>
    );
}