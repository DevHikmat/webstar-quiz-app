import { Navigate } from 'react-router-dom';
import { UserRole } from '../types/enum.type';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/services/authService';

interface Props {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: !!localStorage.getItem('token'), 
    retry: 1, 
  });

  if (isLoading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
