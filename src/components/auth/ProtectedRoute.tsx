import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, hasRole } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
}