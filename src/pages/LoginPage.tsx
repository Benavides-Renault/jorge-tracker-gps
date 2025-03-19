
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Shield, Eye, EyeOff } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Check default credentials
    setTimeout(() => {
      if (username === 'Admin' && password === 'Admin123') {
        // Store auth state in localStorage
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminUsername', username);
        
        toast.success('Inicio de sesión exitoso');
        navigate('/admin');
      } else {
        toast.error('Credenciales incorrectas');
      }
      setIsLoading(false);
    }, 800);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-card border rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Acceso Administrativo</h1>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Ingrese sus credenciales para acceder al panel de administración.
            </p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Usuario
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-muted-foreground" />
                    ) : (
                      <Eye size={18} className="text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="loading-dot w-2 h-2 bg-current rounded-full"></div>
                    <div className="loading-dot w-2 h-2 bg-current rounded-full"></div>
                    <div className="loading-dot w-2 h-2 bg-current rounded-full"></div>
                  </div>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </form>
            
            <div className="mt-6 pt-6 border-t text-sm text-center">
              <p className="text-muted-foreground">
                Credenciales por defecto:
              </p>
              <p>Usuario: <span className="font-mono font-medium">Admin</span></p>
              <p>Contraseña: <span className="font-mono font-medium">Admin123</span></p>
            </div>
          </div>
        </motion.div>
      </main>
      
      <AppFooter />
    </div>
  );
};

export default LoginPage;
