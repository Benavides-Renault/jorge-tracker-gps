import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MapPin, Phone, ChevronLeft, MessageCircle, CheckCircle, Info } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import Map from '@/components/Map';
import { toast } from 'sonner';
import { TrackingOrder } from '@/types';

interface TrackingDetails {
  status: 'en_curso' | 'completado' | 'cancelado';
  estimatedTime: number;
  distance?: number;
}

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'en_curso':
        return {
          label: 'En curso',
          className: 'bg-amber-100 text-amber-800 border-amber-200',
        };
      case 'completado':
        return {
          label: 'Completado',
          className: 'bg-green-100 text-green-800 border-green-200',
        };
      case 'cancelado':
        return {
          label: 'Cancelado',
          className: 'bg-red-100 text-red-800 border-red-200',
        };
      default:
        return {
          label: 'Desconocido',
          className: 'bg-gray-100 text-gray-800 border-gray-200',
        };
    }
  };

  const { label, className } = getStatusInfo();

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${className}`}>
      {label}
    </span>
  );
};

const TrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [trackingDetails, setTrackingDetails] = useState<TrackingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDriver, setIsDriver] = useState(false);
  const [showDriverControls, setShowDriverControls] = useState(false);
  const [isNearby, setIsNearby] = useState(false);

  useEffect(() => {
    const fetchOrder = () => {
      setLoading(true);
      
      const savedOrders = localStorage.getItem('trackingOrders');
      
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders) as TrackingOrder[];
        const foundOrder = parsedOrders.find(order => order.id === id);
        
        if (foundOrder) {
          setOrder(foundOrder);
          
          setTrackingDetails({
            status: foundOrder.status,
            estimatedTime: Math.floor(15 + Math.random() * 20),
            distance: parseFloat((0.5 + Math.random() * 1.5).toFixed(1))
          });
          
          if (Math.random() < 0.3) {
            setIsNearby(true);
          }
        }
      }
      
      setLoading(false);
    };
    
    fetchOrder();
    
    const timer = setInterval(fetchOrder, 30000);
    return () => clearInterval(timer);
  }, [id]);

  const handleMarkCompleted = () => {
    if (!order) return;
    
    const savedOrders = localStorage.getItem('trackingOrders');
    
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders) as TrackingOrder[];
      const updatedOrders = parsedOrders.map(o => 
        o.id === id 
          ? { ...o, status: 'completado', completedAt: new Date().toISOString() } 
          : o
      );
      
      localStorage.setItem('trackingOrders', JSON.stringify(updatedOrders));
      
      setOrder({
        ...order,
        status: 'completado',
        completedAt: new Date().toISOString()
      });
      
      if (trackingDetails) {
        setTrackingDetails({
          ...trackingDetails,
          status: 'completado'
        });
      }
      
      toast.success("Servicio marcado como completado");
    }
  };

  const handleSendWhatsApp = () => {
    if (!order) return;
    
    const phone = order.clientPhone.replace(/\D/g, '');
    const message = `Hola ${order.clientName}, soy ${order.driverName}, su servicio de asistencia. Estoy ${isNearby ? 'llegando a su ubicación' : 'en camino'}. Puede rastrear mi ubicación con el código: ${id}`;
    
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const toggleDriverMode = () => {
    setIsDriver(!isDriver);
    setShowDriverControls(!showDriverControls);
    toast.info(isDriver ? "Modo cliente activado" : "Modo conductor activado");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="mb-6 flex justify-between items-center">
            <Link 
              to="/track" 
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              Volver al rastreo
            </Link>
            
            <button
              onClick={toggleDriverMode}
              className="inline-flex items-center text-sm font-medium hover:text-primary transition-colors"
            >
              {isDriver ? "Cambiar a modo cliente" : "Cambiar a modo conductor"}
            </button>
          </div>
          
          {loading ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <div className="loading-dot w-3 h-3 bg-primary rounded-full"></div>
                <div className="loading-dot w-3 h-3 bg-primary rounded-full"></div>
                <div className="loading-dot w-3 h-3 bg-primary rounded-full"></div>
                <span className="ml-2 text-sm font-medium">Cargando información...</span>
              </div>
            </div>
          ) : order ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">Rastreo de Servicio</h1>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-mono">{id}</p>
                      {order && <StatusBadge status={order.status} />}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {isNearby && !isDriver && (
                      <a 
                        href={`tel:${order.driverPhone}`} 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-500/20 transition-colors"
                      >
                        <Phone size={18} />
                        <span>Llamar al conductor</span>
                      </a>
                    )}
                    
                    {!isDriver && (
                      <a 
                        href="tel:5551234567" 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                      >
                        <Phone size={18} />
                        <span>Llamar a emergencias</span>
                      </a>
                    )}
                  </div>
                </div>
                
                {isNearby && !isDriver && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <Info size={18} className="text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800">¡El conductor está a menos de 1 km!</p>
                      <p className="text-sm text-green-700">Puede contactar directamente al conductor para coordinar la asistencia.</p>
                    </div>
                  </div>
                )}
                
                {order && trackingDetails && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-card border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-secondary rounded-md">
                          <Clock size={18} className="text-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Tiempo estimado</p>
                          <p className="font-medium">{trackingDetails.estimatedTime} minutos</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-card border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-secondary rounded-md">
                          <MapPin size={18} className="text-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Destino</p>
                          <p className="font-medium">{order.destination}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-card border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-secondary rounded-md">
                          <Phone size={18} className="text-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Conductor</p>
                          <p className="font-medium">{order.driverName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {showDriverControls && order && order.status === 'en_curso' && (
                  <div className="bg-card border rounded-lg p-4 mb-6">
                    <h3 className="font-medium mb-3">Panel del Conductor</h3>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={handleMarkCompleted}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <CheckCircle size={18} />
                        <span>Marcar como Entregado</span>
                      </button>
                      
                      <button
                        onClick={handleSendWhatsApp}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <MessageCircle size={18} />
                        <span>Enviar WhatsApp al Cliente</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <Map 
                trackingId={id || ''} 
                showDriverControls={showDriverControls} 
                driverMode={isDriver}
                startCoordinates={order.startCoordinates}
                endCoordinates={order.endCoordinates}
                destination={order.destination}
              />
              
              <div className="mt-8 space-y-4">
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Detalles del Servicio</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Cliente:</p>
                      <p className="font-medium">{order.clientName}</p>
                    </div>
                    {isDriver && (
                      <div>
                        <p className="text-sm text-muted-foreground">Teléfono del Cliente:</p>
                        <p className="font-medium">{order.clientPhone}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Detalles:</p>
                      <p>{order.details || 'No hay detalles adicionales'}</p>
                    </div>
                    {order.comments && (
                      <div>
                        <p className="text-sm text-muted-foreground">Comentarios:</p>
                        <p>{order.comments}</p>
                      </div>
                    )}
                  </div>
                </div>
              
                <div className="text-center text-sm text-muted-foreground">
                  <p>
                    Esta página se actualiza automáticamente. No es necesario refrescar.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12 rounded-lg border bg-card p-8">
              <h2 className="text-2xl font-bold mb-2">ID de rastreo no encontrado</h2>
              <p className="text-muted-foreground mb-6">
                No se encontró ninguna orden con el ID: {id}
              </p>
              <Link 
                to="/track" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <ChevronLeft size={18} />
                <span>Volver al rastreo</span>
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <AppFooter />
    </div>
  );
};

export default TrackingPage;
