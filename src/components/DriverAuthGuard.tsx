
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface DriverAuthGuardProps {
  children: React.ReactNode;
}

const DriverAuthGuard: React.FC<DriverAuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('driverAuthenticated') === 'true';
    
    if (!isAuthenticated) {
      toast.error('Acceso denegado. Inicie sesión como conductor para continuar.', {
        id: 'driver-auth-redirect',
      });
      navigate('/driver-login');
    }
  }, [navigate]);
  
  return <>{children}</>;
};

export default DriverAuthGuard;
