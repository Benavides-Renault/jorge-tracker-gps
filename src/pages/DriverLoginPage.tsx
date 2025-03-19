
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Lock, User, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { DriverCredentials } from '@/types';

const DriverLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Get the driver credentials from localStorage
    const driversData = localStorage.getItem('driverCredentials');
    
    if (driversData) {
      const drivers = JSON.parse(driversData) as DriverCredentials[];
      const driver = drivers.find(d => d.username === username && d.password === password);
      
      if (driver) {
        setTimeout(() => {
          // Set authenticated status in localStorage
          localStorage.setItem('driverAuthenticated', 'true');
          localStorage.setItem('driverName', driver.name);
          localStorage.setItem('driverPhone', driver.phone);
          localStorage.setItem('driverUsername', driver.username);
          
          toast.success('Inicio de sesión exitoso');
          navigate('/driver-dashboard');
          setLoading(false);
        }, 1000);
      } else {
        setTimeout(() => {
          toast.error('Credenciales incorrectas');
          setLoading(false);
        }, 1000);
      }
    } else {
      setTimeout(() => {
        toast.error('No hay conductores registrados en el sistema');
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <main className="flex-1 py-10 md:py-20">
        <div className="container px-4 md:px-6 mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border shadow-sm p-6"
          >
            <div className="mb-4">
              <Link 
                to="/" 
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" />
                Volver al inicio
              </Link>
            </div>
            
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <LogIn className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Acceso de Conductores</h1>
              <p className="text-muted-foreground mt-1">
                Ingresa tus credenciales para acceder al panel
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
                  <User size={16} />
                  <span>Nombre de Usuario</span>
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Ingresa tu nombre de usuario"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock size={16} />
                  <span>Contraseña</span>
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-primary text-primary-foreground rounded-md transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="loading-dot w-2 h-2 bg-current rounded-full"></div>
                    <div className="loading-dot w-2 h-2 bg-current rounded-full"></div>
                    <div className="loading-dot w-2 h-2 bg-current rounded-full"></div>
                    <span>Procesando...</span>
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </main>
      
      <AppFooter />
    </div>
  );
};

export default DriverLoginPage;
