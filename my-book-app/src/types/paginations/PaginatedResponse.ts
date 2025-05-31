import type { Book } from "../books/Book";

export type PaginatedResponse = {
    content: Book[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
};