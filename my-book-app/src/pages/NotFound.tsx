import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-blue-50 text-blue-900 px-4">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-lg mb-6 text-center">
                The page you are looking for does not exist.
            </p>
            <button
                onClick={() => navigate('/')}
                className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded"
            >
                Back to top
            </button>
        </div>
    );
}
