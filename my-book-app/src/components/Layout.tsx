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
        <div className="min-h-screen bg-white text-gray-900 flex flex-col">
            <header className="bg-blue-700 text-white p-4 shadow flex flex-wrap gap-y-2 justify-between items-center">
                <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold">My Book App</h1>
                <div className="flex items-center gap-4 text-sm">
                    {username && (
                        <span className="whitespace-nowrap truncate max-w-[120px] sm:max-w-[180px] lg:max-w-xs">
                            Welcome, {username}
                        </span>
                    )}
                    <button
                        onClick={handleLogout}
                        className="bg-white text-blue-700 px-3 py-1 rounded font-medium hover:bg-blue-100"
                    >
                        Log out
                    </button>
                </div>
            </header>

            <main className="flex-1 w-full px-4 py-6 sm:px-8 md:px-12 lg:px-16 xl:px-24 max-w-screen-xl mx-auto">
                {children}
            </main>
        </div>
    );
}
