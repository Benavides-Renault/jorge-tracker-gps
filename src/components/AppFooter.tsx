
import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Phone, Shield, User, History, Share, Route } from 'lucide-react';

const AppFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-12 px-6 bg-secondary/50 border-t">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-4 max-w-xs">
            <div className="flex items-center gap-2">
              <Truck size={20} className="text-primary" />
              <span className="font-semibold text-lg">Baterías Costa Rica</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Servicio de rastreo en tiempo real para asistencia en carretera y grúas.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Navegación</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link to="/track" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Rastrear
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Shield size={14} />
                    <span>Administración</span>
                  </Link>
                </li>
                <li>
                  <Link to="/driver-login" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <User size={14} />
                    <span>Conductores</span>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Conductores</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/driver-login" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Route size={14} />
                    <span>Estoy en viaje</span>
                  </Link>
                </li>
                <li>
                  <Link to="/driver-login" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <History size={14} />
                    <span>Historial de viajes</span>
                  </Link>
                </li>
                <li>
                  <Link to="/driver-login" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Share size={14} />
                    <span>Compartir ubicación</span>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Contacto</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone size={14} />
                  <span>Emergencias: 555-123-4567</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Baterías Costa Rica. Todos los derechos reservados.
          </p>
          
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Términos y Condiciones
            </Link>
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacidad
            </Link>
            <Link to="/login" className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
              <Shield size={12} />
              <span>Área Administrativa</span>
            </Link>
            <Link to="/driver-login" className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
              <User size={12} />
              <span>Área de Conductores</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
