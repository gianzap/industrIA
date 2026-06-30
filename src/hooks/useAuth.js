import { useSelector } from 'react-redux';

// Custom hook: centralizza la lettura dei dati utente
// Invece di ripetere "useSelector(s => s.auth)" e ricalcolare
// isAdmin/isTechnician in ogni componente, lo facciamo una volta sola qui
export function useAuth() {
  const { user, isLogged, loading, error } = useSelector(s => s.auth);

  return {
    user,
    isLogged,
    loading,
    error,
    // Se l'utente esiste ed ha ruolo 'admin'
    isAdmin: user?.role === 'admin',
    // Tecnico O admin (l'admin ha tutti i permessi del tecnico)
    isTechnician: user?.role === 'technician' || user?.role === 'admin',
    // Nome completo pronto per la UI
    userName: user ? `${user.name} ${user.surname}` : '',
  };
}