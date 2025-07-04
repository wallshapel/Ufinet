import axios from 'axios';
import type { Genre } from '../types/genres/Genre';
import { getUserIdFromToken } from '../utils/decodeToken';
import type { NewGenre } from '../types/genres/NewGenre';

export async function fetchGenresByUser(): Promise<Genre[]> {
    const token = localStorage.getItem('token');
    const userId = token ? getUserIdFromToken(token) : null;

    if (!token || userId === null) throw new Error('Token inválido');

    const response = await axios.get<Genre[]>(
        `http://localhost:8080/api/v1/genres/user/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}

export async function createGenre(data: NewGenre): Promise<{ id: number; name: string }> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token inválido');

    const response = await axios.post(
        'http://localhost:8080/api/v1/genres',
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );

    return response.data;
}
