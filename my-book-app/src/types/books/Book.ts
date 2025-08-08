// src/types/books/Book.ts
export type Book = {
    isbn: string;
    title: string;
    genreId: number;
    genre: string;
    publishedDate: string;
    synopsis: string;
    createdAt: string;
    userId: number;
    coverImagePath?: string;
};
