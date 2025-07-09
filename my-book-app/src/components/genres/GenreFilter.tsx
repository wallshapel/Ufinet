import { useBookContext } from '../../context/BookContext';

export default function GenreFilter() {
    const { selectedGenre, setSelectedGenre, genres } = useBookContext();

    const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedGenre(value === '' ? '' : value);
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
            <label htmlFor="genre" className="font-medium text-sm whitespace-nowrap">
                Filter by genre:
            </label>
            <select
                id="genre"
                value={selectedGenre}
                onChange={handleGenreChange}
                className="p-2 border border-gray-300 rounded text-sm w-full sm:w-48"
            >
                <option value="">All</option>
                {genres.map((genre) => (
                    <option key={genre.id} value={genre.id.toString()}>
                        {genre.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
