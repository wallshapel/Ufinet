import axios from 'axios';
import type { LoginForm } from '../types/Login';

export async function loginUser(payload: LoginForm): Promise<string> {
    const response = await axios.post('http://localhost:8080/api/v1/auth/login', payload);
    return response.data.token;
}