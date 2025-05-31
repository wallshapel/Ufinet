import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Props } from '../types/PrivateRouteProps';

export default function PrivateRoute({ children }: Props) {
    const { token } = useAuth();

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
}
