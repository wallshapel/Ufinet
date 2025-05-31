import { useState } from 'react';
import type { Book } from '../../types/books/Book';
import Spinner from '../common/Spinner';
import type { Props } from '../../types/DeleteByIsbnProps';

export default function DeleteByIsbn({ books, onDelete }: Props) {
    const [isbnInput, setIsbnInput] = useState('');
    const [bookFound, setBookFound] = useState<Book | null>(null);
    const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const showFeedback = (type: 'error' | 'success', message: string) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback(null), 3000);
    };

    const handleSearch = () => {
        setLoading(true);
        setTimeout(() => {
            const book = books.find((b) => b.isbn === isbnInput.trim());
            if (book) {
                setBookFound(book);
                showFeedback('success', 'Libro encontrado. Puedes eliminarlo o cancelar.');
            } else {
                setBookFound(null);
                showFeedback('error', 'No se encontró ningún libro con ese ISBN.');
            }
            setLoading(false);
        }, 500);
    };

    const handleDelete = () => {
        if (bookFound) {
            onDelete(bookFound.isbn);
            showFeedback('success', `Libro "${bookFound.title}" eliminado correctamente.`);
            setBookFound(null);
            setIsbnInput('');
        }
    };

    const handleCancel = () => {
        setIsbnInput('');
        setBookFound(null);
        setFeedback(null);
    };

    if (loading) return <Spinner />;

    return (
        <div className="mt-8 max-w-md">
            <h3 className="text-lg font-semibold mb-2">Buscar libro por ISBN</h3>

            <div className="flex items-center gap-2 mb-4">
                <input
                    type="text"
                    placeholder="ISBN del libro"
                    value={isbnInput}
                    onChange={(e) => setIsbnInput(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                >
                    Buscar
                </button>
            </div>

            {feedback && (
                <div
                    className={`px-4 py-2 mb-4 rounded text-sm ${feedback.type === 'error'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-green-100 text-green-800 border border-green-300'
                        }`}
                >
                    {feedback.message}
                </div>
            )}

            {bookFound && (
                <div className="border border-blue-200 rounded p-4 mb-4 bg-blue-50">
                    <p><strong>Título:</strong> {bookFound.title}</p>
                    <p><strong>Género:</strong> {bookFound.genre}</p>
                    <p><strong>Publicado:</strong> {bookFound.publishedDate}</p>
                    <p><strong>Sinopsis:</strong> {bookFound.synopsis}</p>

                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            Eliminar
                        </button>
                        <button
                            onClick={handleCancel}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
