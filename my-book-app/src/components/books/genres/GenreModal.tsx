import { useEffect, useRef, useState } from 'react';
import { createGenre } from '../../../api/genreApi';
import { getUserIdFromToken } from '../../../utils/decodeToken';
import Spinner from '../../common/Spinner';


interface Props {
    onClose: () => void;
    onGenreCreated: (genre: { id: number; name: string }) => void;
}

export default function GenreModal({ onClose, onGenreCreated }: Props) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
}, [onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('The gender name is mandatory.');
            return;
        }

        const token = localStorage.getItem('token');
        const userId = token ? getUserIdFromToken(token) : null;
        if (!token || userId === null) {
            setError('Unauthenticated user');
            return;
        }

        try {
            setLoading(true);
            const createdGenre = await createGenre({ name, userId });
            setSuccess(true);
            setTimeout(() => {
                onGenreCreated(createdGenre);
            }, 1000);
        } catch (err: any) {
            const status = err.response?.status;
            const data = err.response?.data;

            if (status === 409) {
                setError(data.message || 'Duplicate gender');
            } else if (status === 404) {
                setError(data.message || 'User not found');
            } else if (status === 400 && typeof data === 'object') {
                setError(data.detail || 'Malformed request');
            } else {
                setError('Unexpected error when creating the gender');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="fixed inset-0 bg-white bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-md">
                <h2 className="text-lg font-bold mb-4">New genre</h2>
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm mb-4 text-center">
                        Gender successfully created.
                    </div>
                )}

                {!success && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Gender name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError('');
                            }}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {error && <p className="text-red-600 text-sm">{error}</p>}

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-3 py-1 rounded bg-blue-700 text-white hover:bg-blue-800"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
