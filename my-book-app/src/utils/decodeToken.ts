
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

export function getUsernameFromToken(token: string): string | null {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.username || null;
    } catch {
        return null;
    }
}
