import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from '../types/JwtPayload';

export function getUserIdFromToken(token: string): number | null {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.userId;
    } catch {
        return null;
    }
}