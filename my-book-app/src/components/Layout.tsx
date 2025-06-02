import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Props } from '../types/LayoutProps';
import { getUsernameFromToken } from '../utils/decodeToken';

export default function Layout({ children }: Props) {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const getUsername = (): string | null => {
        if (!token) return null;
        return getUsernameFromToken(token);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const username = getUsername();

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <header className="bg-blue-700 text-white p-4 shadow flex justify-between items-center">
                <h1 className="text-xl lg:text-4xl font-bold">My Book App</h1>
                <div className="flex items-center gap-4">
                    {username && (
                        <span className="text-sm whitespace-nowrap truncate max-w-[150px] lg:max-w-xs">
                            Bienvenido, {username}
                        </span>
                    )}
                    <button
                        onClick={handleLogout}
                        className="bg-white text-blue-700 px-3 py-1 rounded font-medium hover:bg-blue-100"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </header>
            <main className="p-4">{children}</main>
        </div>
    );
}
