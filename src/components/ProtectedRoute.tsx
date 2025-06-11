import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import type { RootState } from '../store';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
    const { user } = useSelector((state: RootState) => state.user);

    console.log('ProtectedRoute Debug:', {
        user,
        requireAdmin,
        userRole: user?.role
    });

    if (!user) {
        console.log('No user found, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && user.role !== 'admin') {
        console.log(' User is not admin, redirecting to unauthorized');
        return <Navigate to="/unauthorized" replace />;
    }

    console.log(' Access granted');
    return <>{children}</>;
};

export default ProtectedRoute;