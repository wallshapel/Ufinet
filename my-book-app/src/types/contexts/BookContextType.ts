import type { Book } from "../books/Book";
import type { BookUpdatePayload } from "../books/BookUpdatePayload";
import type { Genre } from "../genres/Genre";

export type BookContextType = {
    books: Book[];
    page: number;
    size: number;
    totalPages: number;
    selectedGenre: string;
    setSelectedGenre: (genre: string) => void;
    setPage: (page: number) => void;
    setSize: (size: number) => void;
    refreshBooks: () => void;
    onDelete: (isbn: string) => void;
    onEdit: (book: BookUpdatePayload) => void;
    loading: boolean;
    genres: Genre[];
    setGenres: (genres: Genre[]) => void;
    refreshGenres: () => Promise<void>;
};
