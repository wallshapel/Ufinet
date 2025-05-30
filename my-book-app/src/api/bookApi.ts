import axios from 'axios';
import type { Book } from '../types/Book';
import { getUserIdFromToken } from '../utils/decodeToken';

type PaginatedResponse = {
    content: Book[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
};

export async function fetchPaginatedBooks(userId: number, page: number, size: number): Promise<PaginatedResponse> {
    const token = localStorage.getItem('token');

    const response = await axios.get<PaginatedResponse>('http://localhost:8080/api/v1/books', {
        params: { userId, page, size },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export async function createBook(book: Omit<Book, 'createdAt'>): Promise<Book> {
    const token = localStorage.getItem('token');

    if (!token) throw new Error('No token found');

    const response = await axios.post<Book>(
        'http://localhost:8080/api/v1/books',
        book,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );

    return response.data;
}