
import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar,
  CheckCircle,
  MapPin,
  User,
  Phone,
  Route
} from 'lucide-react';
import { TrackingOrder } from '@/types';

interface DriverTripHistoryProps {
  driverPhone: string;
}

const DriverTripHistory: React.FC<DriverTripHistoryProps> = ({ driverPhone }) => {
  const [completedTrips, setCompletedTrips] = useState<TrackingOrder[]>([]);
  
  useEffect(() => {
    // Get completed trips for this driver from localStorage
    const savedOrders = localStorage.getItem('trackingOrders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders) as TrackingOrder[];
      const driverCompletedOrders = parsedOrders.filter(order => 
        order.driverPhone === driverPhone && 
        order.status === 'completado'
      );
      
      // Sort by completed date (newest first)
      driverCompletedOrders.sort((a, b) => {
        if (!a.completedAt || !b.completedAt) return 0;
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      });
      
      setCompletedTrips(driverCompletedOrders);
    }
  }, [driverPhone]);
  
  if (completedTrips.length === 0) {
    return (
      <div className="bg-card rounded-xl border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Historial de Viajes</h2>
        <div className="text-center py-10 text-muted-foreground">
          <p>No tienes viajes completados en tu historial.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-card rounded-xl border shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Historial de Viajes</h2>
      
      <div className="space-y-4">
        {completedTrips.map(trip => {
          // Calculate approximate travel time (random for demo)
          const travelHours = Math.floor(Math.random() * 2) + 1;
          const travelMinutes = Math.floor(Math.random() * 50) + 10;
          
          // Calculate approximate distance (random for demo)
          const distanceKm = Math.floor(Math.random() * 80) + 20;
          
          return (
            <div key={trip.id} className="border rounded-lg p-4 hover:bg-secondary/10 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="font-medium">Servicio Completado</span>
                    <span className="font-mono text-xs bg-secondary/50 px-2 py-0.5 rounded">
                      {trip.id}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm mt-2">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar size={14} />
                      <span>
                        {trip.completedAt ? new Date(trip.completedAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock size={14} />
                      <span>
                        {trip.completedAt ? new Date(trip.completedAt).toLocaleTimeString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium">{distanceKm} km</div>
                  <div className="text-sm text-muted-foreground">
                    {travelHours}h {travelMinutes}min
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <User size={16} className="mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Cliente</div>
                      <div className="text-sm">{trip.clientName}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Phone size={16} className="mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Teléfono</div>
                      <div className="text-sm">{trip.clientPhone}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Destino</div>
                      <div className="text-sm">{trip.destination}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Route size={16} className="mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Detalles</div>
                      <div className="text-sm">{trip.details || 'Sin detalles'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DriverTripHistory;
