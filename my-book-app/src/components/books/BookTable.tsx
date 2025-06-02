import { useState, Suspense, lazy } from 'react';
import { getUserIdFromToken } from '../../utils/decodeToken';
import type { Book } from '../../types/books/Book';
import { useBookContext } from '../../context/BookContext';

const LazyGenreModal = lazy(() => import('./genres/GenreModal'));

export default function BookTable() {
    const { books, onDelete, onEdit, genres, refreshGenres } = useBookContext();

    const [editingIsbn, setEditingIsbn] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Book>>({});
    const [message, setMessage] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const showTemporaryMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(null), 3000);
    };

    const startEdit = (book: Book) => {
        const matchingGenre = genres.find((g) => g.name === book.genre);
        const genreId = matchingGenre ? matchingGenre.id : book.genreId;

        setEditingIsbn(book.isbn);
        setEditForm({
            isbn: book.isbn,
            title: book.title,
            genreId,
            publishedDate: book.publishedDate,
            synopsis: book.synopsis,
        });
    };

    const cancelEdit = () => {
        setEditingIsbn(null);
        setEditForm({});
    };

    const handleEditChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setEditForm({
            ...editForm,
            [name]: name === 'genreId' ? parseInt(value, 10) : value,
        });
    };

    const confirmEdit = () => {
        const { isbn, title, genreId, publishedDate, synopsis } = editForm;

        if (!isbn || !title || !genreId || !publishedDate || !synopsis) {
            showTemporaryMessage('Faltan campos obligatorios para editar.');
            return;
        }

        const token = localStorage.getItem('token');
        const userId = token ? getUserIdFromToken(token) : null;

        if (!userId) {
            showTemporaryMessage('Usuario no autenticado');
            return;
        }

        const genreName = genres.find((g) => g.id === genreId)?.name || '';

        const updatedBook: Book = {
            isbn,
            title,
            genreId,
            genre: genreName,
            publishedDate,
            synopsis,
            userId,
            createdAt: new Date().toISOString(), // ⚠️ Puedes reemplazar esto si tienes una mejor fuente
        };

        onEdit(updatedBook);
        setEditingIsbn(null);
        showTemporaryMessage('Libro editado correctamente.');
    };

    const handleDelete = (isbn: string) => {
        onDelete(isbn);
        showTemporaryMessage('Libro eliminado correctamente.');
    };

    return (
        <>
            <div className="overflow-x-auto">
                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 mb-4 rounded text-sm max-w-4xl">
                        {message}
                    </div>
                )}

                {books.length === 0 ? (
                    <div className="text-center text-gray-600 mt-4">
                        No hay libros disponibles para mostrar.
                    </div>
                ) : (
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="px-4 py-2 border">ISBN</th>
                                <th className="px-4 py-2 border">Títulos</th>
                                <th className="px-4 py-2 border">Género</th>
                                <th className="px-4 py-2 border">Publicado</th>
                                <th className="px-4 py-2 border">Sinopsis</th>
                                <th className="px-4 py-2 border">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book: Book) => (
                                <tr key={book.isbn} className="hover:bg-blue-50">
                                    <td className="px-4 py-2 border">{book.isbn}</td>

                                    {editingIsbn === book.isbn ? (
                                        <>
                                            <td className="px-4 py-2 border">
                                                <input
                                                    name="title"
                                                    value={editForm.title || ''}
                                                    onChange={handleEditChange}
                                                    className="p-1 border rounded w-full"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        name="genreId"
                                                        value={editForm.genreId || ''}
                                                        onChange={handleEditChange}
                                                        className="p-1 border rounded w-full"
                                                    >
                                                        <option value="">Selecciona un género</option>
                                                        {genres.map((g) => (
                                                            <option key={g.id} value={g.id}>
                                                                {g.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowModal(true)}
                                                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-xs"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <input
                                                    name="publishedDate"
                                                    type="date"
                                                    value={editForm.publishedDate || ''}
                                                    onChange={handleEditChange}
                                                    className="p-1 border rounded w-full"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <textarea
                                                    name="synopsis"
                                                    value={editForm.synopsis || ''}
                                                    onChange={handleEditChange}
                                                    className="p-1 border rounded w-full resize-none"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border space-x-2">
                                                <button
                                                    onClick={confirmEdit}
                                                    className="text-green-600 text-sm hover:underline"
                                                >
                                                    Guardar
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="text-gray-600 text-sm hover:underline"
                                                >
                                                    Cancelar
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-4 py-2 border">{book.title}</td>
                                            <td className="px-4 py-2 border">{book.genre}</td>
                                            <td className="px-4 py-2 border">{book.publishedDate}</td>
                                            <td className="px-4 py-2 border">{book.synopsis}</td>
                                            <td className="px-4 py-2 border space-x-2">
                                                <button
                                                    onClick={() => startEdit(book)}
                                                    className="text-blue-700 text-sm hover:underline"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(book.isbn)}
                                                    className="text-red-600 text-sm hover:underline"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <Suspense fallback={<div>Cargando...</div>}>
                    <LazyGenreModal
                        onClose={() => setShowModal(false)}
                        onGenreCreated={async (newGenre) => {
                            await refreshGenres();
                            setEditForm((prev) => ({
                                ...prev,
                                genreId: newGenre.id,
                            }));
                            setShowModal(false);
                        }}
                    />
                </Suspense>
            )}
        </>
    );
}
