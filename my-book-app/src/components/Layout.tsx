import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

type Props = {
    children: React.ReactNode;
};

export default function Layout({ children }: Props) {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const getEmailFromToken = (): string | null => {
        if (!token) return null;

        try {
            const payloadBase64 = token.split('.')[1];
            const payload = JSON.parse(atob(payloadBase64));
            return payload.sub || null;
        } catch (e) {
            return null;
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const email = getEmailFromToken();

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <header className="bg-blue-700 text-white p-4 shadow flex justify-between items-center">
                <h1 className="text-xl font-bold">My Book App</h1>
                <div className="flex items-center gap-4">
                    {email && <span className="text-sm">Bienvenido, {email}</span>}
                    <button
                        onClick={handleLogout}
                        className="bg-white text-blue-700 px-3 py-1 rounded font-medium hover:bg-blue-100"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </header>
            <main className="p-4">
                {children}
            </main>
        </div>
    );
}
