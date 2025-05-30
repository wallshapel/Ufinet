import axios from 'axios';
import type { RegisterPayload } from '../types/RegisterPayload';

export async function registerUser(payload: RegisterPayload): Promise<void> {
    try {
        await axios.post('http://localhost:8080/api/v1/users/register', payload);
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else {
            console.error(error);
            throw new Error('No se pudo conectar con el servidor. Inténtalo más tarde.');
        }
    }
}