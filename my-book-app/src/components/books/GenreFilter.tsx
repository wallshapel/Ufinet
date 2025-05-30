type Props = {
    selected: string;
    genres: string[];
    onChange: (genre: string) => void;
};

export default function GenreFilter({ selected, genres, onChange }: Props) {
    return (
        <div className="mb-4">
            <label htmlFor="genre" className="mr-2 font-medium text-sm">
                Filtrar por género:
            </label>
            <select
                id="genre"
                value={selected}
                onChange={(e) => onChange(e.target.value)}
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
