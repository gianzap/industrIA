import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AdminRoute() {
  const { isLogged, isAdmin } = useAuth();

  // Doppio controllo: prima loggato, poi admin
  if (!isLogged) return <Navigate to="/login" replace />;
  if (!isAdmin)  return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}