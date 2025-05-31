import type { Book } from "../books/Book";

export type BookContextType = {
    books: Book[];
    filteredBooks: Book[];
    page: number;
    size: number;
    totalPages: number;
    selectedGenre: string;
    setSelectedGenre: (genre: string) => void;
    setPage: (page: number) => void;
    setSize: (size: number) => void;
    refreshBooks: () => void;
    onDelete: (isbn: string) => void;
    onEdit: (book: Book) => void;
};
