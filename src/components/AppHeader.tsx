
import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Battery } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  className?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ className }) => {
  return (
    <header className={cn("w-full py-4 px-6 flex items-center justify-between bg-background/90 backdrop-blur-md z-50 border-b", className)}>
      <Link 
        to="/" 
        className="flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        aria-label="Go to homepage"
      >
        <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-md">
          <Battery size={20} className="text-white" />
        </div>
        <span className="font-semibold text-xl">Baterías Costa Rica</span>
      </Link>
      
      <nav className="hidden md:flex items-center gap-8">
        <Link 
          to="/" 
          className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
        >
          Inicio
        </Link>
        <Link 
          to="/track" 
          className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
        >
          Rastrear
        </Link>
      </nav>
      
      <div className="flex items-center gap-4">
        <Link
          to="/track"
          className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 active:scale-[0.98]"
        >
          Rastrear Servicio
        </Link>
      </div>
    </header>
  );
};

export default AppHeader;
