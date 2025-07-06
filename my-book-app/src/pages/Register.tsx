import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/common/Spinner';
import type { RegisterForm, FormErrors } from '../types/RegisterForm';
import { registerUser } from '../api/authApi';

export default function Register() {
    const [form, setForm] = useState<RegisterForm>({
        username: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const userNameRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        userNameRef.current?.focus();
    }, []);

    const validate = (): FormErrors => {
        const newErrors: FormErrors = {};

        if (!form.username.trim())
            newErrors.username = 'The user name is mandatory.';

        if (!form.email.trim())
            newErrors.email = 'The e-mail address is compulsory.';
        else if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(form.email))
            newErrors.email = 'Invalid e-mail address.';

        if (!form.password)
            newErrors.password = 'The password is mandatory.';
        else if (form.password.length < 6)
            newErrors.password = 'Must be at least 6 characters long.';
        else if (!/[A-Za-z]/.test(form.password))
            newErrors.password = 'Must contain at least one letter.';
        else if (!/\d/.test(form.password))
            newErrors.password = 'Must contain at least one number.';

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

        try {
            await registerUser(form);
            setLoading(false);
            navigate('/');
        } catch (error: any) {
            console.error(error);
            setLoading(false);
            setErrors({
                general: error.message || 'Could not connect to the server. Please try again later.'
            });
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50 text-blue-900">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-xl font-bold mb-6 text-center">Register</h2>

                <input
                    ref={userNameRef}
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username}</p>}

                <input
                    name="email"
                    type="email"
                    placeholder="E-mail address"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-2 mt-4 border border-gray-300 rounded"
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

                {errors.general && <p className="text-sm text-red-600 mt-4 text-center">{errors.general}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full mt-6 font-semibold py-2 rounded ${loading
                        ? 'bg-blue-300 cursor-not-allowed text-white'
                        : 'bg-blue-700 hover:bg-blue-800 text-white'
                        }`}
                >
                    Create an account
                </button>

                <div className="mt-4 text-center">
                    <span className="text-sm text-gray-700">Already have an account?</span>{' '}
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="text-blue-700 hover:underline font-medium text-sm"
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}
