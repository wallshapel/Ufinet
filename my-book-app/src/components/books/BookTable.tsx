import { useState, useContext } from 'react';
import type { Book } from '../../types/Book';
// BookContext is only used between Books.tsx and BookTable.tsx.
// Other components use props explicitly.
import { BookContext } from '../../context/BookContext';

export default function BookTable() {
    const context = useContext(BookContext);
    if (!context) throw new Error('BookContext must be used within a BookContext.Provider');

    const { books, onDelete, onEdit } = context;

    const [editingIsbn, setEditingIsbn] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Book>>({});
    const [message, setMessage] = useState<string | null>(null);

    const showTemporaryMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(null), 3000);
    };

    const startEdit = (book: Book) => {
        setEditingIsbn(book.isbn);
        setEditForm(book);
    };

    const cancelEdit = () => {
        setEditingIsbn(null);
        setEditForm({});
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const confirmEdit = () => {
        if (!editForm.isbn || !editForm.title || !editForm.genre || !editForm.publishedDate || !editForm.synopsis) {
            showTemporaryMessage('Faltan campos obligatorios para editar.');
            return;
        }

        onEdit(editForm as Book);
        setEditingIsbn(null);
        showTemporaryMessage('Libro editado correctamente.');
    };

    const handleDelete = (isbn: string) => {
        onDelete(isbn);
        showTemporaryMessage('Libro eliminado correctamente.');
    };

    return (
        <div className="overflow-x-auto">
            {message && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 mb-4 rounded text-sm max-w-4xl">
                    {message}
                </div>
            )}

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="px-4 py-2 border">ISBN</th>
                        <th className="px-4 py-2 border">Título</th>
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
                                        <input
                                            name="genre"
                                            value={editForm.genre || ''}
                                            onChange={handleEditChange}
                                            className="p-1 border rounded w-full"
                                        />
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
                                        <button onClick={confirmEdit} className="text-green-600 text-sm hover:underline">Guardar</button>
                                        <button onClick={cancelEdit} className="text-gray-600 text-sm hover:underline">Cancelar</button>
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
        </div>
    );
}
