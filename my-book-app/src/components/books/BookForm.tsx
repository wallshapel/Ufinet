import { useEffect, useState, Suspense, lazy } from 'react';
import { createBook } from '../../api/bookApi';
import { fetchGenresByUser } from '../../api/genreApi';
import { getUserIdFromToken } from '../../utils/decodeToken';
import type { Errors } from '../../types/books/BookErrors';
import type { Props } from '../../types/books/BookFormProps';
import type { Genre } from '../../types/genres/Genre';
import Spinner from '../common/Spinner';

const LazyGenreModal = lazy(() => import('./genres/GenreModal'));

export default function BookForm({ onAdd }: Props) {
    const [formData, setFormData] = useState({
        isbn: '',
        title: '',
        genreId: '',
        publishedDate: '',
        synopsis: '',
    });

    const [genres, setGenres] = useState<Genre[]>([]);
    const [errors, setErrors] = useState<Errors>({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const loadGenres = async () => {
            try {
                const data = await fetchGenresByUser();
                setGenres(data);
            } catch (error) {
                console.error('Error al cargar géneros:', error);
            }
        };
        loadGenres();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors: Errors = {};
        if (!formData.isbn.trim()) newErrors.isbn = 'El ISBN es obligatorio.';
        if (!formData.title.trim()) newErrors.title = 'El título es obligatorio.';
        if (!formData.genreId) newErrors.genreId = 'El género es obligatorio.';
        if (!formData.publishedDate) newErrors.publishedDate = 'La fecha es obligatoria.';
        if (!formData.synopsis.trim()) newErrors.synopsis = 'La sinopsis es obligatoria.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const token = localStorage.getItem('token');
        const userId = token ? getUserIdFromToken(token) : null;
        if (userId === null) {
            alert('Usuario no autenticado');
            return;
        }

        const bookToSend = {
            isbn: formData.isbn,
            title: formData.title,
            genreId: parseInt(formData.genreId),
            publishedDate: formData.publishedDate,
            synopsis: formData.synopsis,
            userId,
        };

        try {
            setLoading(true);
            const newBook = await createBook(bookToSend);
            onAdd(newBook);

            setFormData({
                isbn: '',
                title: '',
                genreId: '',
                publishedDate: '',
                synopsis: '',
            });

            setErrors({});
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error: any) {
            const status = error.response?.status;
            const data = error.response?.data;

            if (status === 409) {
                setErrors({ isbn: data.message || 'Libro duplicado' });
            } else if (status === 404) {
                alert(data.message || 'Usuario no encontrado');
            } else if (status === 400 && typeof data === 'object') {
                setErrors(data);
            } else {
                console.error('Error desconocido al crear libro:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <>
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm mb-4">
                    Libro agregado correctamente.
                </div>
            )}

            <form onSubmit={handleSubmit} className="mb-6 grid gap-4 max-w-2xl">

                {/* ISBN */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                    <div className="flex items-center gap-2">
                        <input
                            name="isbn"
                            type="text"
                            placeholder="ISBN"
                            value={formData.isbn}
                            onChange={handleChange}
                            className="p-2 border border-gray-300 rounded w-full"
                        />
                        <span className="text-red-600 text-lg">*</span>
                    </div>
                    {errors.isbn && <p className="text-red-600 text-sm mt-1">{errors.isbn}</p>}
                </div>

                {/* Título */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <div className="flex items-center gap-2">
                        <input
                            name="title"
                            type="text"
                            placeholder="Título"
                            value={formData.title}
                            onChange={handleChange}
                            className="p-2 border border-gray-300 rounded w-full"
                        />
                        <span className="text-red-600 text-lg">*</span>
                    </div>
                    {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Género + botón */}
                <div className="flex gap-2 items-end">
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
                        <div className="flex items-center gap-2">
                            <select
                                name="genreId"
                                value={formData.genreId}
                                onChange={handleChange}
                                className="p-2 border border-gray-300 rounded w-full"
                            >
                                <option value="">Selecciona un género</option>
                                {genres.map((genre) => (
                                    <option key={genre.id} value={genre.id}>
                                        {genre.name}
                                    </option>
                                ))}
                            </select>
                            <span className="text-red-600 text-lg">*</span>
                        </div>
                        {errors.genreId && <p className="text-red-600 text-sm mt-1">{errors.genreId}</p>}
                    </div>

                    <button
                        type="button"
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 h-[38px]"
                        onClick={() => setShowModal(true)}
                    >
                        +
                    </button>
                </div>

                {/* Fecha de publicación */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de publicación</label>
                    <div className="flex items-center gap-2">
                        <input
                            name="publishedDate"
                            type="date"
                            value={formData.publishedDate}
                            onChange={handleChange}
                            className="p-2 border border-gray-300 rounded w-full"
                        />
                        <span className="text-red-600 text-lg">*</span>
                    </div>
                    {errors.publishedDate && (
                        <p className="text-red-600 text-sm mt-1">{errors.publishedDate}</p>
                    )}
                </div>

                {/* Sinopsis */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sinopsis</label>
                    <div className="flex items-center gap-2">
                        <textarea
                            name="synopsis"
                            placeholder="Sinopsis"
                            value={formData.synopsis}
                            onChange={handleChange}
                            className="p-2 border border-gray-300 rounded resize-none w-full"
                        />
                        <span className="text-red-600 text-lg">*</span>
                    </div>
                    {errors.synopsis && (
                        <p className="text-red-600 text-sm mt-1">{errors.synopsis}</p>
                    )}
                </div>

                {/* Botón de envío */}
                <button
                    type="submit"
                    className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800"
                >
                    Agregar libro
                </button>
            </form>


            {showModal && (
                <Suspense fallback={<div>Cargando...</div>}>
                    <LazyGenreModal
                        onClose={() => setShowModal(false)}
                        onGenreCreated={(newGenreName) => {
                            const newGenre = {
                                id: Date.now(),
                                name: newGenreName,
                            };
                            setGenres((prev) => [...prev, newGenre]);
                            setFormData((prev) => ({
                                ...prev,
                                genreId: String(newGenre.id),
                            }));
                            setShowModal(false);
                        }}
                    />
                </Suspense>
            )}
        </>
    );
}
