import { Navigate } from 'react-router-dom';
import { tokenStorage } from '../../services/http';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: string;
}

export default function AuthGuard({ children, fallback = '/' }: AuthGuardProps) {
  const token = tokenStorage.get();
  if (!token) {
    return <Navigate to={fallback} replace />;
  }
  return <>{children}</>;
}
