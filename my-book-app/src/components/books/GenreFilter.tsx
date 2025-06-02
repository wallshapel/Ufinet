import { useEffect, useState } from 'react';
import { useBookContext } from '../../context/BookContext';
import { fetchGenresByUser } from '../../api/genreApi';
import type { Genre } from '../../types/genres/Genre';

export default function GenreFilter() {
    const { selectedGenre, setSelectedGenre } = useBookContext();
    const [genres, setGenres] = useState<Genre[]>([]);

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

    const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedGenre(value === "" ? "" : value);
    };

    return (
        <div className="mb-4">
            <label htmlFor="genre" className="mr-2 font-medium text-sm">
                Filtrar por género:
            </label>
            <select
                id="genre"
                value={selectedGenre}
                onChange={handleGenreChange}
                className="p-2 border border-gray-300 rounded text-sm"
            >
                <option value="">Todos</option>
                {genres.map((genre) => (
                    <option key={genre.id} value={genre.id.toString()}>
                        {genre.name}
                    </option>
                ))}
            </select>
        </div>
    );
}