
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    
    if (!isAuthenticated) {
      toast.error('Acceso denegado. Inicie sesión para continuar.', {
        id: 'auth-redirect',
      });
      navigate('/login');
    }
  }, [navigate]);
  
  return <>{children}</>;
};

export default AuthGuard;
