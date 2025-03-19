
export interface TrackingOrder {
  id: string;
  clientName: string;
  clientPhone: string;
  clientPhoneCountryCode: string;
  driverName: string;
  driverPhone: string;
  driverPhoneCountryCode: string;
  destination: string;
  startCoordinates?: string;
  endCoordinates?: string;
  details?: string;
  comments?: string;
  status: 'en_curso' | 'completado' | 'cancelado';
  createdAt: string;
  completedAt?: string;
}

export interface DriverLocation {
  id: string;
  lat: number;
  lng: number;
  speed: number;
  timestamp: string;
}

export interface DriverCredentials {
  username: string;
  password: string;
  name: string;
  phone: string;
  countryCode: string;
}

export interface DemoTracking {
  startLocation: string;
  startCoordinates: string;
  endLocation: string;
  endCoordinates: string;
  speed: number;
  status: 'no_iniciado' | 'preparacion' | 'en_ruta_recoger' | 'ruta_entrega' | 'entregado';
}

export interface Coordinates {
  lat: number;
  lng: number;
}
