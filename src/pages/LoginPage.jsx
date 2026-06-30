import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  const { isLogged } = useAuth();
  const navigate = useNavigate();

  // Se l'utente è GIÀ loggato e arriva su /login,
  // lo mandiamo direttamente alla dashboard
  useEffect(() => {
    if (isLogged) navigate('/dashboard');
  }, [isLogged]);

  return (
    <div className="min-h-screen bg-scada-bg flex items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}