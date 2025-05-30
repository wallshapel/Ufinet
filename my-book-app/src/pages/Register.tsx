import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/common/Spinner';
import type { RegisterForm, FormErrors } from '../types/RegisterForm';
import { registerUser } from '../api/authApi';
import axios from 'axios';

export default function Register() {
    const [form, setForm] = useState<RegisterForm>({
        username: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const validate = (): FormErrors => {
        const newErrors: FormErrors = {};

        if (!form.username.trim()) {
            newErrors.username = 'El nombre de usuario es obligatorio.';
        }

        if (!form.email.trim()) {
            newErrors.email = 'El correo electrónico es obligatorio.';
        } else if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(form.email)) {
            newErrors.email = 'Correo electrónico no válido.';
        }

        if (!form.password) {
            newErrors.password = 'La contraseña es obligatoria.';
        } else if (form.password.length < 6) {
            newErrors.password = 'Debe tener al menos 6 caracteres.';
        } else if (!/[A-Za-z]/.test(form.password)) {
            newErrors.password = 'Debe contener al menos una letra.';
        } else if (!/\d/.test(form.password)) {
            newErrors.password = 'Debe contener al menos un número.';
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

        try {
            await registerUser(form);
            navigate('/');
        } catch (error: any) {
            setLoading(false);
            setErrors({ general: error.message });
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50 text-blue-900">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-xl font-bold mb-6 text-center">Registro</h2>

                <input
                    name="username"
                    type="text"
                    placeholder="Nombre de usuario"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username}</p>}

                <input
                    name="email"
                    type="email"
                    placeholder="Correo electrónico"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-2 mt-4 border border-gray-300 rounded"
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}

                <input
                    name="password"
                    type="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full p-2 mt-4 border border-gray-300 rounded"
                />
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}

                {errors.general && <p className="text-sm text-red-600 mt-4 text-center">{errors.general}</p>}

                <button
                    type="submit"
                    className="w-full mt-6 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded"
                >
                    Crear cuenta
                </button>

                <div className="mt-4 text-center">
                    <span className="text-sm text-gray-700">¿Ya tienes una cuenta?</span>{' '}
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="text-blue-700 hover:underline font-medium text-sm"
                    >
                        Inicia sesión
                    </button>
                </div>
            </form>
        </div>
    );
}
