import axios from 'axios';
import type { Book } from '../types/books/Book';
import { getUserIdFromToken } from '../utils/decodeToken';
import type { PaginatedResponse } from '../types/paginations/PaginatedResponse';

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

export async function deleteBookByIsbn(isbn: string): Promise<void> {
    const token = localStorage.getItem('token');
    const userId = token ? getUserIdFromToken(token) : null;
    if (!token || userId === null) throw new Error('Token inválido');

    await axios.delete(`http://localhost:8080/api/v1/books/${isbn}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: { userId },
    });
}

export async function updateBook(updatedBook: Book): Promise<void> {
    const token = localStorage.getItem('token');
    const userId = token ? getUserIdFromToken(token) : null;
    if (!token || userId === null) throw new Error('Token inválido');

    const bookWithUser = { ...updatedBook, userId };

    await axios.put('http://localhost:8080/api/v1/books', bookWithUser, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
