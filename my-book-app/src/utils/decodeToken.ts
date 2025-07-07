import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/JwtPayload";

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

export function getAuthData(): { token: string; userId: number } {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token no encontrado");

  const userId = getUserIdFromToken(token);
  if (userId === null) throw new Error("Token inválido");

  return { token, userId };
}

export function getToken(): string {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token no encontrado");
  return token;
}
