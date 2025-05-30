import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Books from '../pages/Books';
import NotFound from '../pages/NotFound';
import PrivateRoute from './PrivateRoute';
import { useAuth } from '../context/AuthContext';

function RootRedirect() {
    const { token } = useAuth();
    return <Navigate to={token ? '/books' : '/login'} replace />;
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RootRedirect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/books"
                    element={
                        <PrivateRoute>
                            <Books />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
