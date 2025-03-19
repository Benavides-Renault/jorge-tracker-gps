
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, 
  Navigation, 
  CheckCircle, 
  Clock, 
  MapPin,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import { DemoTracking, Coordinates } from '@/types';
import Map from './Map';

const DemoTrackingComponent: React.FC = () => {
  const [demoConfig, setDemoConfig] = useState<DemoTracking>({
    startLocation: '',
    startCoordinates: '',
    endLocation: '',
    endCoordinates: '',
    speed: 60,
    status: 'no_iniciado'
  });
  
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [etaMinutes, setEtaMinutes] = useState<number | null>(null);
  const [demoProgress, setDemoProgress] = useState(0);
  const [trackingId, setTrackingId] = useState(`DEMO${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
  const [selectionMode, setSelectionMode] = useState<'start' | 'end' | null>(null);
  
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    
    if (isDemoActive && demoProgress < 100) {
      progressInterval = setInterval(() => {
        setDemoProgress(prev => {
          const newProgress = prev + 1;
          
          // Update status based on progress
          if (newProgress === 25) {
            setDemoConfig(prev => ({...prev, status: 'preparacion'}));
            toast.info("El vehículo está en preparación");
          } else if (newProgress === 50) {
            setDemoConfig(prev => ({...prev, status: 'en_ruta_recoger'}));
            toast.info("El vehículo está en ruta para recoger el equipo");
          } else if (newProgress === 75) {
            setDemoConfig(prev => ({...prev, status: 'ruta_entrega'}));
            toast.info("El vehículo está en ruta de entrega");
          } else if (newProgress === 100) {
            setDemoConfig(prev => ({...prev, status: 'entregado'}));
            toast.success("¡Producto entregado con éxito!");
            setIsDemoActive(false);
          }
          
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 1000);
    }
    
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isDemoActive, demoProgress]);
  
  const startDemo = () => {
    // Validate inputs
    if (!demoConfig.startCoordinates || !demoConfig.endCoordinates) {
      toast.error("Por favor seleccione ubicaciones de inicio y fin");
      return;
    }
    
    // Calculate mock ETA based on speed
    const mockDistance = 45; // km, just for demo
    const etaMin = Math.round((mockDistance / demoConfig.speed) * 60);
    setEtaMinutes(etaMin);
    
    // Start the demo
    setDemoConfig(prev => ({...prev, status: 'preparacion'}));
    setIsDemoActive(true);
    setDemoProgress(0);
    
    toast.success("Demo iniciado. Rastreando en tiempo real...");
  };
  
  const resetDemo = () => {
    setIsDemoActive(false);
    setDemoProgress(0);
    setEtaMinutes(null);
    setDemoConfig({
      startLocation: '',
      startCoordinates: '',
      endLocation: '',
      endCoordinates: '',
      speed: 60,
      status: 'no_iniciado'
    });
    setTrackingId(`DEMO${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
    toast.info("Demo reiniciado");
  };
  
  const handleLocationSelect = (coordinates: Coordinates, type: 'start' | 'end') => {
    const coordString = `${coordinates.lat},${coordinates.lng}`;
    
    if (type === 'start') {
      setDemoConfig(prev => ({
        ...prev, 
        startCoordinates: coordString,
        startLocation: `Ubicación seleccionada (${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)})`
      }));
    } else {
      setDemoConfig(prev => ({
        ...prev, 
        endCoordinates: coordString,
        endLocation: `Ubicación seleccionada (${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)})`
      }));
    }
    
    // Exit selection mode after selection
    setSelectionMode(null);
    toast.success(`Ubicación de ${type === 'start' ? 'origen' : 'destino'} seleccionada`);
  };
  
  const getStatusIcon = (status: DemoTracking['status']) => {
    switch(status) {
      case 'preparacion':
        return <Clock className="text-amber-500" />;
      case 'en_ruta_recoger':
        return <Truck className="text-blue-500" />;
      case 'ruta_entrega':
        return <Navigation className="text-indigo-500" />;
      case 'entregado':
        return <CheckCircle className="text-green-500" />;
      default:
        return <Clock className="text-gray-400" />;
    }
  };
  
  return (
    <div className="bg-card rounded-xl border shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Demostración de Rastreo</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4 lg:col-span-1">
          <h3 className="font-medium">Configuración de Demo</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Ubicación de Inicio
              </label>
              <div className="mt-1 flex items-center gap-2">
                <button
                  onClick={() => setSelectionMode('start')}
                  disabled={isDemoActive}
                  className="w-full flex items-center justify-between gap-2 h-10 px-3 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary bg-background hover:bg-secondary/30 disabled:opacity-50"
                >
                  <span className="truncate text-left">
                    {demoConfig.startLocation || "Seleccionar ubicación de inicio"}
                  </span>
                  <MapPin size={16} className="text-muted-foreground" />
                </button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">
                Ubicación de Destino
              </label>
              <div className="mt-1 flex items-center gap-2">
                <button
                  onClick={() => setSelectionMode('end')}
                  disabled={isDemoActive}
                  className="w-full flex items-center justify-between gap-2 h-10 px-3 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary bg-background hover:bg-secondary/30 disabled:opacity-50"
                >
                  <span className="truncate text-left">
                    {demoConfig.endLocation || "Seleccionar ubicación de destino"}
                  </span>
                  <MapPin size={16} className="text-muted-foreground" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="speed" className="text-sm font-medium">
                Velocidad Promedio (km/h)
              </label>
              <input
                id="speed"
                type="number"
                min="10"
                max="120"
                value={demoConfig.speed}
                onChange={(e) => setDemoConfig(prev => ({...prev, speed: parseInt(e.target.value) || 60}))}
                disabled={isDemoActive}
                className="w-full h-10 px-3 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <button
              onClick={startDemo}
              disabled={isDemoActive || !demoConfig.startCoordinates || !demoConfig.endCoordinates}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              <Truck size={16} />
              <span>Iniciar Demo</span>
            </button>
            
            <button
              onClick={resetDemo}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-sm font-medium transition-all hover:bg-secondary/90 active:scale-[0.98]"
            >
              Reiniciar
            </button>
          </div>
          
          <div className="space-y-4 border rounded-lg p-4">
            <h4 className="font-medium">Etapas del Envío</h4>
            
            <ul className="space-y-3">
              {[
                { id: 'preparacion', label: 'En Preparación' },
                { id: 'en_ruta_recoger', label: 'En Ruta a Recoger Equipo' },
                { id: 'ruta_entrega', label: 'Ruta de Entrega' },
                { id: 'entregado', label: 'Entregado' }
              ].map((stage) => {
                const isActive = demoConfig.status === stage.id;
                const isCompleted = 
                  (stage.id === 'preparacion' && ['preparacion', 'en_ruta_recoger', 'ruta_entrega', 'entregado'].includes(demoConfig.status)) ||
                  (stage.id === 'en_ruta_recoger' && ['en_ruta_recoger', 'ruta_entrega', 'entregado'].includes(demoConfig.status)) ||
                  (stage.id === 'ruta_entrega' && ['ruta_entrega', 'entregado'].includes(demoConfig.status)) ||
                  (stage.id === 'entregado' && demoConfig.status === 'entregado');
                
                return (
                  <li 
                    key={stage.id}
                    className={`flex items-center gap-3 py-2 px-3 rounded-md ${
                      isActive ? 'bg-primary/10' : ''
                    }`}
                  >
                    <div className={`p-1.5 rounded-full ${
                      isCompleted 
                        ? 'bg-green-100 text-green-600' 
                        : isActive 
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-secondary text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle size={18} />
                      ) : (
                        getStatusIcon(stage.id as DemoTracking['status'])
                      )}
                    </div>
                    <span className={`text-sm ${
                      isCompleted 
                        ? 'text-green-800 font-medium line-through' 
                        : isActive 
                        ? 'font-medium'
                        : 'text-muted-foreground'
                    }`}>
                      {stage.label}
                    </span>
                    {isActive && (
                      <span className="ml-auto text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full animate-pulse">
                        En progreso
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-4">
          {isDemoActive && (
            <div className="bg-secondary/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progreso de entrega</span>
                <span className="text-sm">{demoProgress}%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  style={{ width: `${demoProgress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${demoProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              {etaMinutes && (
                <p className="text-sm text-muted-foreground mt-2">
                  Tiempo estimado de llegada: {etaMinutes} minutos
                </p>
              )}
            </div>
          )}
          
          <div className="rounded-lg overflow-hidden border">
            <Map 
              trackingId={trackingId}
              startCoordinates={demoConfig.startCoordinates}
              endCoordinates={demoConfig.endCoordinates}
              destination={demoConfig.endLocation}
              onLocationSelect={selectionMode ? handleLocationSelect : undefined}
              selectionMode={selectionMode}
              centerCoordinates={{ lat: 9.7489, lng: -83.7534 }} // Costa Rica center
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoTrackingComponent;
