import { useState, Suspense, lazy, useEffect } from 'react';
import { getUserIdFromToken } from '../../utils/decodeToken';
import type { Book } from '../../types/books/Book';
import { useBookContext } from '../../context/BookContext';
import ImageModal from './ImageModal';
import { fetchBookByIsbnAndUserId, fetchProtectedBookCover, uploadBookCover } from '../../api/bookApi';
import CoverInput from '../common/CoverInput';

const LazyGenreModal = lazy(() => import('./genres/GenreModal'));

export default function BookTable() {
    const { books, onDelete, onEdit, genres, refreshGenres } = useBookContext();

    const [editingIsbn, setEditingIsbn] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Book> & { coverFile?: File }>({});
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedCover, setSelectedCover] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { setBooks } = useBookContext(); 

    const showTemporaryMessage = (text: string, type: 'success' | 'error' = 'success') => {
        if (!text) return;

        setMessage({ type, text });

        if (type === 'success') {
            setTimeout(() => setMessage(null), 3000);
        }
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

    const confirmEdit = async () => {
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
            createdAt: new Date().toISOString(),
        };

        try {
            await onEdit(updatedBook);

            if (editForm.coverFile) {
                try {
                    await uploadBookCover(isbn, editForm.coverFile);

                    // 🆕 Forzar recarga del libro actualizado para obtener coverImagePath correcto
                    const updated = await fetchBookByIsbnAndUserId(isbn);

                    setBooks((prev: Book[]) =>
                        prev.map((book: Book) =>
                            book.isbn === isbn ? updated : book
                        )
                    );

                } catch (error) {
                    console.error('Error al subir la portada:', error);
                    showTemporaryMessage('Libro editado, pero hubo un error al subir la portada.', 'error');
                }
            }

            setEditingIsbn(null);
            showTemporaryMessage('Libro editado correctamente.');
        } catch (error: any) {
            const backendError = error?.response?.data || error;
            if (typeof backendError === 'object') {
                const allMessages = Object.values(backendError).join('\n');
                showTemporaryMessage(allMessages, 'error');
            } else {
                showTemporaryMessage('Error al editar el libro.', 'error');
            }
        }

        setEditForm({});

    };

    const handleDelete = (isbn: string) => {
        onDelete(isbn);
        showTemporaryMessage('Libro eliminado correctamente.');
    };

    useEffect(() => {
        const getImage = async () => {
            if (!selectedCover) {
                setImageUrl(null);
                return;
            }

            const token = localStorage.getItem('token');
            const userId = token ? getUserIdFromToken(token) : null;

            if (!userId) {
                console.warn('Usuario no autenticado al intentar obtener portada');
                setImageUrl(null);
                return;
            }

            // Extraemos el ISBN del path recibido (ej. "1234567890/cover.jpg")
            const isbn = selectedCover.split('/')[0];

            try {
                const blobUrl = await fetchProtectedBookCover(userId, selectedCover);
                setImageUrl(blobUrl);
            } catch (error) {
                console.error('Error obteniendo imagen protegida', error);
                setImageUrl(null);
            }

            return () => {
                if (imageUrl) {
                    URL.revokeObjectURL(imageUrl);
                    setImageUrl(null);
                }
            };
        };

        getImage();
    }, [selectedCover]);

    return (
        <>
            <div className="overflow-x-auto">
                {message && (
                  <div
                    className={`${
                      message.type === 'success'
                        ? 'bg-green-100 border border-green-400 text-green-700'
                        : 'bg-red-100 border border-red-400 text-red-700'
                    } px-4 py-2 mb-4 rounded text-sm max-w-4xl`}
                  >
                    {message?.text || '⚠️ Ha ocurrido un error inesperado'}
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
                                <th className="px-4 py-2 border">Portada</th>
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

                                            <td className="px-4 py-2 border">
                                                <CoverInput
                                                    currentFile={editForm.coverFile}
                                                    onValidFileSelect={(file) =>
                                                        setEditForm((prev) => ({
                                                            ...prev,
                                                            coverFile: file,
                                                        }))
                                                    }
                                                    showError={(msg) => showTemporaryMessage(msg, 'error')}
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

                                            {/* Nueva columna: Portada */}
                                            <td className="px-4 py-2 border text-center">
                                                {book.coverImagePath ? (
                                                    <button
                                                        onClick={() => setSelectedCover(book.coverImagePath!)}
                                                        className="text-indigo-600 hover:underline text-sm"
                                                    >
                                                        Ver
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400 text-sm italic">Sin portada</span>
                                                )}
                                            </td>

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
            {selectedCover && imageUrl && (
                <ImageModal
                    src={imageUrl}
                    onClose={() => setSelectedCover(null)}
                />
            )}
        </>
    );
}
