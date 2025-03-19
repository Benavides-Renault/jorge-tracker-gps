
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  LogOut,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  Share2,
  History,
  Plus
} from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import DriverAuthGuard from '@/components/DriverAuthGuard';
import DriverTripHistory from '@/components/DriverTripHistory';
import { TrackingOrder } from '@/types';

const DriverDashboardPage = () => {
  const [orders, setOrders] = useState<TrackingOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<TrackingOrder[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [newTrackingId, setNewTrackingId] = useState('');
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'new'>('current');
  
  const navigate = useNavigate();
  const driverName = localStorage.getItem('driverName') || '';
  const driverPhone = localStorage.getItem('driverPhone') || '';

  // Load assigned orders from localStorage on component mount
  useEffect(() => {
    loadOrders();
    
    // Cleanup function to stop watching location
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [driverPhone]);
  
  const loadOrders = () => {
    const savedOrders = localStorage.getItem('trackingOrders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders) as TrackingOrder[];
      const driverOrders = parsedOrders.filter(order => 
        order.driverPhone === driverPhone && 
        order.status === 'en_curso'
      );
      setOrders(driverOrders);
      setFilteredOrders(driverOrders);
    }
  };

  const handleLogout = () => {
    if (isSharing) {
      stopSharingLocation();
    }
    
    localStorage.removeItem('driverAuthenticated');
    localStorage.removeItem('driverName');
    localStorage.removeItem('driverPhone');
    localStorage.removeItem('driverUsername');
    
    toast.success('Sesión cerrada correctamente');
    navigate('/driver-login');
  };

  const startSharingLocation = (orderId: string) => {
    if (navigator.geolocation) {
      toast.info("Iniciando compartir ubicación...");
      
      const newWatchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setIsSharing(true);
          
          // Here you would normally send this to a backend
          console.log(`Order ${orderId} - Location updated: ${latitude}, ${longitude}`);
          
          toast.success("Ubicación compartida correctamente", {
            id: "location-shared",
            duration: 2000
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Error al obtener la ubicación. Verifica los permisos de tu navegador.");
          setIsSharing(false);
        },
        { enableHighAccuracy: true }
      );
      
      setWatchId(newWatchId);
    } else {
      toast.error("Tu navegador no soporta geolocalización");
    }
  };

  const stopSharingLocation = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsSharing(false);
      toast.info("Has dejado de compartir tu ubicación");
    }
  };

  const handleShareLocation = (orderId: string) => {
    if (!isSharing) {
      startSharingLocation(orderId);
    } else {
      stopSharingLocation();
    }
  };

  const handleShareLocationLink = (orderId: string) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
          
          // Copy link to clipboard
          navigator.clipboard.writeText(googleMapsLink)
            .then(() => {
              toast.success("Enlace copiado al portapapeles");
            })
            .catch(() => {
              toast.error("Error al copiar el enlace");
            });
          
          // Open share dialog if available
          if (navigator.share) {
            navigator.share({
              title: 'Mi ubicación actual',
              text: 'Esta es mi ubicación actual para el servicio',
              url: googleMapsLink
            })
            .catch(error => console.log('Error sharing', error));
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Error al obtener la ubicación. Verifica los permisos de tu navegador.");
        }
      );
    } else {
      toast.error("Tu navegador no soporta geolocalización");
    }
  };

  const handleMarkCompleted = (id: string) => {
    const savedOrders = localStorage.getItem('trackingOrders');
    
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders) as TrackingOrder[];
      const updatedOrders = parsedOrders.map(order => 
        order.id === id 
          ? { ...order, status: 'completado' as 'completado', completedAt: new Date().toISOString() } 
          : order
      );
      
      localStorage.setItem('trackingOrders', JSON.stringify(updatedOrders));
      
      // Update local state
      const updatedLocalOrders = orders.filter(order => order.id !== id);
      setOrders(updatedLocalOrders);
      setFilteredOrders(updatedLocalOrders);
      
      toast.success(`Servicio ${id} marcado como completado`);
      
      // Stop sharing location if active
      if (isSharing) {
        stopSharingLocation();
      }
    }
  };

  const handleSendWhatsApp = (order: TrackingOrder) => {
    // Format phone number for WhatsApp
    const phone = order.clientPhone.replace(/\D/g, '');
    // Create message with Google Maps link if location is available
    let message = `Hola ${order.clientName}, soy ${driverName}, su servicio de asistencia para ${order.details}. Puede rastrear mi servicio con el código: ${order.id}`;
    
    // Add location if available
    if (currentLocation) {
      const googleMapsLink = `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`;
      message += `\n\nMi ubicación actual: ${googleMapsLink}`;
    }
    
    // Open WhatsApp with the message
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };
  
  const handleAddTrackingId = () => {
    if (!newTrackingId.trim()) {
      toast.error("Por favor ingrese un código de rastreo válido");
      return;
    }
    
    const savedOrders = localStorage.getItem('trackingOrders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders) as TrackingOrder[];
      const orderExists = parsedOrders.find(order => order.id === newTrackingId);
      
      if (!orderExists) {
        toast.error("Código de rastreo no encontrado");
        return;
      }
      
      if (orderExists.driverPhone !== driverPhone) {
        toast.error("Este código de rastreo no está asignado a usted");
        return;
      }
      
      if (orderExists.status !== 'en_curso') {
        toast.error("Este servicio ya no está activo");
        return;
      }
      
      toast.success("Código de rastreo verificado correctamente");
      setNewTrackingId('');
      setActiveTab('current');
      loadOrders();
    }
  };

  return (
    <DriverAuthGuard>
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        
        <main className="flex-1 container px-4 md:px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <Truck className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold">Panel del Conductor</h1>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {driverName}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-secondary text-sm hover:bg-secondary/80 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveTab('current')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'current' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                <Truck size={16} />
                <span>Servicios Actuales</span>
              </button>
              
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'history' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                <History size={16} />
                <span>Historial de Viajes</span>
              </button>
              
              <button
                onClick={() => setActiveTab('new')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'new' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                <Plus size={16} />
                <span>Nuevo Viaje</span>
              </button>
            </div>
            
            {isSharing && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                <div className="mt-1">
                  <Navigation size={20} className="text-green-600 animate-pulse" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-green-800">Compartiendo ubicación en tiempo real</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Tu ubicación está siendo compartida. Puedes detenerla en cualquier momento.
                  </p>
                  
                  <button
                    onClick={stopSharingLocation}
                    className="mt-2 px-3 py-1 text-sm rounded-md bg-white border border-green-300 text-green-600 hover:bg-green-50"
                  >
                    Detener
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'current' && (
              <div className="bg-card rounded-xl border shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-6">Servicios Asignados</h2>
                
                {filteredOrders.length > 0 ? (
                  <div className="space-y-4">
                    {filteredOrders.map(order => (
                      <div key={order.id} className="border rounded-lg p-4 hover:bg-secondary/10 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono font-medium">{order.id}</span>
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                En Curso
                              </span>
                            </div>
                            
                            <h3 className="font-medium">{order.clientName}</h3>
                            
                            <div className="mt-2 space-y-1">
                              <div className="flex items-start gap-2 text-sm">
                                <MapPin size={16} className="mt-0.5 text-muted-foreground" />
                                <span>{order.destination}</span>
                              </div>
                              
                              <div className="flex items-start gap-2 text-sm">
                                <Clock size={16} className="mt-0.5 text-muted-foreground" />
                                <span>Creado: {new Date(order.createdAt).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleShareLocation(order.id)}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${
                                isSharing ? 'bg-green-500 text-white' : 'bg-secondary text-foreground'
                              } text-sm hover:opacity-90 transition-colors`}
                            >
                              <Navigation size={16} />
                              <span>{isSharing ? 'Compartiendo' : 'Compartir Ubicación'}</span>
                            </button>
                            
                            <button
                              onClick={() => handleShareLocationLink(order.id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-secondary text-sm hover:bg-secondary/80 transition-colors"
                            >
                              <Share2 size={16} />
                              <span>Compartir Link</span>
                            </button>
                            
                            <button
                              onClick={() => handleSendWhatsApp(order)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-500 text-white text-sm hover:bg-green-600 transition-colors"
                            >
                              <MessageCircle size={16} />
                              <span>WhatsApp</span>
                            </button>
                            
                            <button
                              onClick={() => handleMarkCompleted(order.id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
                            >
                              <CheckCircle size={16} />
                              <span>Marcar Completado</span>
                            </button>
                          </div>
                        </div>
                        
                        {order.details && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm text-muted-foreground">Detalles del servicio:</p>
                            <p className="text-sm mt-1">{order.details}</p>
                          </div>
                        )}
                        
                        {order.comments && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm text-muted-foreground">Comentarios:</p>
                            <p className="text-sm mt-1">{order.comments}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No tienes servicios asignados actualmente.</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'history' && (
              <DriverTripHistory driverPhone={driverPhone} />
            )}
            
            {activeTab === 'new' && (
              <div className="bg-card rounded-xl border shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-6">Agregar Código de Rastreo</h2>
                
                <div className="max-w-md space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Ingrese el código de rastreo proporcionado por el administrador para iniciar un nuevo servicio.
                  </p>
                  
                  <div className="space-y-2">
                    <label htmlFor="trackingId" className="text-sm font-medium">
                      Código de Rastreo
                    </label>
                    <input
                      id="trackingId"
                      type="text"
                      value={newTrackingId}
                      onChange={(e) => setNewTrackingId(e.target.value)}
                      placeholder="Ej. ABC123"
                      className="w-full h-10 px-3 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  <button
                    onClick={handleAddTrackingId}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 active:scale-[0.98]"
                  >
                    <Plus size={16} />
                    <span>Agregar Servicio</span>
                  </button>
                  
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-medium mb-2">Compartir Ubicación Actual</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Comparta su ubicación actual con el cliente o el administrador.
                    </p>
                    
                    <button
                      onClick={() => handleShareLocationLink('')}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-sm font-medium transition-all hover:bg-secondary/80 active:scale-[0.98]"
                    >
                      <Share2 size={16} />
                      <span>Compartir Ubicación por Link</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </main>
        
        <AppFooter />
      </div>
    </DriverAuthGuard>
  );
};

export default DriverDashboardPage;
