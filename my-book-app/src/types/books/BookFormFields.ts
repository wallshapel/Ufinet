// src/types/books/BookFormFields.ts
export interface BookFormFields {
  isbn: string;
  title: string;
  genreId: string;
  publishedDate: string;
  synopsis: string;
  coverFile?: File | null;
}
