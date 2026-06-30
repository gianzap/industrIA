import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute() {
  const { isLogged } = useAuth();

  // Se NON è loggato, redirect a /login
  // "replace" sostituisce la entry nella cronologia del browser
  // (così il tasto "indietro" non torna alla pagina protetta)
  if (!isLogged) return <Navigate to="/login" replace />;

  // Outlet renderizza la rotta figlia definita nel router
  // (es. <DashboardPage />, <MachinesPage />, ecc.)
  return <Outlet />;
}