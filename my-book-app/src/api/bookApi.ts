import axios from 'axios';
import type { Book } from '../types/books/Book';
import { getUserIdFromToken } from '../utils/decodeToken';
import type { PaginatedResponse } from '../types/paginations/PaginatedResponse';
import type { BookPayload } from '../types/books/BookPayload';
import type { BookUpdatePayload } from '../types/books/BookUpdatePayload';

export async function fetchPaginatedBooks(userId: number, page: number, size: number): Promise<PaginatedResponse> {
    const token = localStorage.getItem('token');

    const response = await axios.get<PaginatedResponse>(`http://localhost:8080/api/v1/books`, {
        params: { userId, page, size },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export async function createBook(book: BookPayload): Promise<Book> {
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

    try {
        await axios.delete(`http://localhost:8080/api/v1/books/${isbn}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { userId },
        });
    } catch (error: any) {
        const message = error.response?.data?.message || error.response?.data?.detail;

        if (error.response?.status === 404) {
            throw new Error(message || 'Libro o usuario no encontrado');
        } else if (error.response?.status === 400) {
            throw new Error(message || 'Petición incorrecta');
        } else {
            throw new Error('Error al intentar eliminar el libro');
        }
    }
}

export async function fetchBookByIsbnAndUserId(isbn: string): Promise<Book> {
    const token = localStorage.getItem('token');
    const userId = token ? getUserIdFromToken(token) : null;

    if (!token || userId === null) throw new Error('Token inválido');

    const response = await axios.get<Book>(`http://localhost:8080/api/v1/books/${isbn}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: { userId },
    });

    return response.data;
}

export async function updateBook(updatedBook: BookUpdatePayload): Promise<Book> {
    const token = localStorage.getItem('token');
    const userId = token ? getUserIdFromToken(token) : null;
    if (!token || userId === null) throw new Error('Token inválido');

    try {
        const bookWithUser = { ...updatedBook, userId };
        const response = await axios.patch<Book>(
            'http://localhost:8080/api/v1/books',
            bookWithUser,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error: any) {
        if (error.response?.data && typeof error.response.data === 'object') {
            throw error.response.data;
        }
        throw new Error('Error al actualizar el libro');
    }
}

export async function fetchBooksByGenre(
    userId: number,
    genreId: number,
    page: number,
    size: number
): Promise<PaginatedResponse> {
    const token = localStorage.getItem('token');

    if (!token || userId === null) throw new Error('Token inválido');

    const response = await axios.get<PaginatedResponse>(
        `http://localhost:8080/api/v1/books/user/${userId}/genre/${genreId}`,
        {
            params: { page, size },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}

export async function uploadBookCover(isbn: string, coverFile: File): Promise<void> {
    const token = localStorage.getItem('token');
    const userId = token ? getUserIdFromToken(token) : null;

    if (!token || userId === null) {
        throw new Error('Token inválido o usuario no autenticado');
    }

    const formData = new FormData();
    formData.append('file', coverFile);

    await axios.patch(
        `http://localhost:8080/api/v1/books/${isbn}/cover`,
        formData,
        {
            params: { userId },
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        }
    );
}

export async function fetchProtectedBookCover(userId: number, coverPath: string): Promise<string> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token no encontrado');

    const response = await axios.get(
        `http://localhost:8080/api/v1/books/cover?userId=${userId}&path=${encodeURIComponent(coverPath)}`,
        {
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return URL.createObjectURL(response.data);
}
