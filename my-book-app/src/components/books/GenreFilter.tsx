import { useBookContext } from '../../context/BookContext';

export default function GenreFilter() {
    const { books, selectedGenre, setSelectedGenre } = useBookContext();

    const genres = Array.from(new Set(books.map((b) => b.genre))).sort();

    return (
        <div className="mb-4">
            <label htmlFor="genre" className="mr-2 font-medium text-sm">
                Filtrar por género:
            </label>
            <select
                id="genre"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="p-2 border border-gray-300 rounded text-sm"
            >
                <option value="">Todos</option>
                {genres.map((genre) => (
                    <option key={genre} value={genre}>
                        {genre}
                    </option>
                ))}
            </select>
        </div>
    );
}