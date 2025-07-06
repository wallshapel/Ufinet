import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { LoginForm, FormErrors } from '../types/Login';
import { loginUser } from '../api/loginApi';
import Spinner from '../components/common/Spinner';


export default function Login() {
    const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
    const [errors, setErrors] = useState<FormErrors>({});
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const emailRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        emailRef.current?.focus();
    }, []);

    const validate = (): FormErrors => {
        const newErrors: FormErrors = {};

        if (!form.email.trim()) {
            newErrors.email = 'Mail is obligatory.';
        } else if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(form.email)) {
            newErrors.email = 'Correo no válido.';
        }

        if (!form.password) {
            newErrors.password = 'The password is mandatory.';
        } else if (form.password.length < 6) {
            newErrors.password = 'Must be at least 6 characters long.';
        }

        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const token = await loginUser(form);
            login(token);
            navigate('/books');
        } catch (error: any) {
            const backendMessage =
                error.response?.data?.message || error.response?.data?.error;

            setErrors({
                general: backendMessage || 'An unexpected error occurred',
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50 text-blue-900">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-xl font-bold mb-6 text-center">Login</h2>

                {errors.general && (
                    <p className="text-center text-red-600 text-sm mb-4">{errors.general}</p>
                )}

                <input
                    ref={emailRef}
                    name="email"
                    type="email"
                    placeholder="E-mail address"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full p-2 mt-4 border border-gray-300 rounded"
                />
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full mt-6 font-semibold py-2 rounded ${loading
                        ? 'bg-blue-300 cursor-not-allowed text-white'
                        : 'bg-blue-700 hover:bg-blue-800 text-white'
                        }`}
                >
                    Sign in
                </button>

                <div className="mt-4 text-center">
                    <span className="text-sm text-gray-700">Don't have an account?</span>{' '}
                    <button
                        type="button"
                        onClick={() => navigate('/register')}
                        className="text-blue-700 hover:underline font-medium text-sm"
                    >
                        Sign up
                    </button>
                </div>
            </form>
        </div>
    );
}
