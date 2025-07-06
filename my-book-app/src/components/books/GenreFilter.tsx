import { useBookContext } from '../../context/BookContext';

export default function GenreFilter() {
    const { selectedGenre, setSelectedGenre, genres } = useBookContext();

    const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedGenre(value === '' ? '' : value);
    };

    return (
        <div>
            <label htmlFor="genre" className="mr-2 font-medium text-sm">
                Filter by gender:
            </label>
            <select
                id="genre"
                value={selectedGenre}
                onChange={handleGenreChange}
                className="p-2 border border-gray-300 rounded text-sm"
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
