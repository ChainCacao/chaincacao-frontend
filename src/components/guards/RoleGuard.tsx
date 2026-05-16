import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import type { Role } from '../../types/api';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallback?: string;
}

export default function RoleGuard({ children, allowedRoles, fallback = '/' }: RoleGuardProps) {
  const user = useAuthStore((s) => s.user);
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={fallback} replace />;
  }
  return <>{children}</>;
}
