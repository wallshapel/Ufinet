import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from '../types/JwtPayload';
import type { AuthContextType } from '../types/contexts/AuthContextType';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = () => {
            const storedToken = localStorage.getItem('token');

            if (!storedToken) return;

            try {
                const payload = jwtDecode<JwtPayload>(storedToken);
                const exp = payload.exp * 1000;

                if (Date.now() > exp) {
                    logout(); // token expirado
                } else {
                    setToken(storedToken);
                }
            } catch (error) {
                logout(); // token inválido o malformado
            }
        };

        initializeAuth();
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'token') {
                const newToken = event.newValue;

                if (!newToken) {
                    setToken(null);
                } else {
                    try {
                        const payload = jwtDecode<JwtPayload>(newToken);
                        const exp = payload.exp * 1000;
                        if (Date.now() > exp) {
                            logout();
                        } else {
                            setToken(newToken);
                        }
                    } catch {
                        logout();
                    }
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
    return context;
}
