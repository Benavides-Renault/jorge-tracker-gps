
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Info, Navigation, AlertTriangle, MapPin, Share2, Search } from 'lucide-react';
import { Coordinates } from '@/types';

interface MapProps {
  trackingId: string;
  showDriverControls?: boolean;
  driverMode?: boolean;
  startCoordinates?: string;
  endCoordinates?: string;
  destination?: string;
  onLocationSelect?: (coordinates: Coordinates, type: 'start' | 'end') => void;
  selectionMode?: 'start' | 'end' | null;
  centerCoordinates?: Coordinates;
}

const Map: React.FC<MapProps> = ({ 
  trackingId, 
  showDriverControls = false, 
  driverMode = false,
  startCoordinates,
  endCoordinates,
  destination,
  onLocationSelect,
  selectionMode = null,
  centerCoordinates
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [sharingLocation, setSharingLocation] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [googleMapsLink, setGoogleMapsLink] = useState<string | null>(null);
  const [wazeLink, setWazeLink] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  const parseCoordinates = (coordString?: string): Coordinates | null => {
    if (!coordString) return null;
    
    try {
      const decimalMatch = coordString.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
      if (decimalMatch) {
        return {
          lat: parseFloat(decimalMatch[1]),
          lng: parseFloat(decimalMatch[2])
        };
      }
      
      const dmsMatch = coordString.match(/(\d+)°(\d+)'([\d.]+)"([NS])\s+(\d+)°(\d+)'([\d.]+)"([EW])/);
      if (dmsMatch) {
        const latDeg = parseInt(dmsMatch[1]);
        const latMin = parseInt(dmsMatch[2]);
        const latSec = parseFloat(dmsMatch[3]);
        const latDir = dmsMatch[4];
        
        const lngDeg = parseInt(dmsMatch[5]);
        const lngMin = parseInt(dmsMatch[6]);
        const lngSec = parseFloat(dmsMatch[7]);
        const lngDir = dmsMatch[8];
        
        let lat = latDeg + (latMin / 60) + (latSec / 3600);
        if (latDir === 'S') lat = -lat;
        
        let lng = lngDeg + (lngMin / 60) + (lngSec / 3600);
        if (lngDir === 'W') lng = -lng;
        
        return { lat, lng };
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing coordinates:', error);
      return null;
    }
  };

  const createMapLinks = (coords: Coordinates) => {
    const googleLink = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
    setGoogleMapsLink(googleLink);
    
    const wazeLink = `https://waze.com/ul?ll=${coords.lat},${coords.lng}&navigate=yes`;
    setWazeLink(wazeLink);
    
    return { googleLink, wazeLink };
  };

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (typeof window.google === 'undefined') {
        console.log('Loading Google Maps script...');
        const script = document.createElement('script');
        // Use a different API key that is configured properly
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDLgweko5T4LHy35gPKm1nmziRK1GrI6CD&libraries=places&callback=initMap`;
        script.async = true;
        script.defer = true;
        
        // Define the callback globally so Google Maps can find it
        window.initMap = () => {
          console.log('Google Maps script loaded, initializing map...');
          initializeMap();
        };
        
        script.onerror = () => {
          console.error('Failed to load Google Maps script');
          toast.error('Error al cargar Google Maps');
        };
        
        document.head.appendChild(script);
      } else {
        console.log('Google Maps already loaded, initializing map...');
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!mapRef.current) {
        console.error('Map container ref not available');
        return;
      }

      try {
        const center = centerCoordinates ? 
          centerCoordinates : 
          { lat: 9.7489, lng: -83.7534 }; // Costa Rica default

        const mapOptions: google.maps.MapOptions = {
          center,
          zoom: 10,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
        };

        console.log('Creating new Google Map instance...');
        const map = new google.maps.Map(mapRef.current, mapOptions);
        googleMapRef.current = map;

        if (inputRef.current) {
          console.log('Initializing search box...');
          const searchBox = new google.maps.places.SearchBox(inputRef.current);
          searchBoxRef.current = searchBox;
          
          map.addListener('bounds_changed', () => {
            if (searchBox && map.getBounds()) {
              searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
            }
          });

          searchBox.addListener('places_changed', () => {
            const places = searchBox.getPlaces();
            if (!places || places.length === 0) {
              console.log('No places found from search');
              return;
            }

            markers.forEach(marker => marker.setMap(null));
            setMarkers([]);

            const bounds = new google.maps.LatLngBounds();
            const newMarkers: google.maps.Marker[] = [];

            places.forEach(place => {
              if (!place.geometry || !place.geometry.location) {
                console.log('Place has no geometry or location');
                return;
              }

              const marker = new google.maps.Marker({
                map,
                title: place.name,
                position: place.geometry.location,
                animation: google.maps.Animation.DROP
              });
              
              newMarkers.push(marker);

              if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
              } else {
                bounds.extend(place.geometry.location);
              }

              if (selectionMode && onLocationSelect) {
                const coords: Coordinates = {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng()
                };
                console.log(`Selected ${selectionMode} location:`, coords);
                onLocationSelect(coords, selectionMode);
              }
            });

            setMarkers(newMarkers);
            map.fitBounds(bounds);
          });
        }

        if (selectionMode && onLocationSelect) {
          console.log(`Map in ${selectionMode} selection mode`);
          map.addListener('click', (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
              const coords: Coordinates = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
              };
              
              markers.forEach(marker => marker.setMap(null));
              
              const marker = new google.maps.Marker({
                position: event.latLng,
                map,
                animation: google.maps.Animation.DROP
              });
              
              setMarkers([marker]);
              console.log(`Selected ${selectionMode} location on map:`, coords);
              onLocationSelect(coords, selectionMode);
            }
          });
        }

        console.log('Creating directions renderer...');
        const directionsRendererInstance = new google.maps.DirectionsRenderer({
          map,
          suppressMarkers: false,
          preserveViewport: false,
          polylineOptions: {
            strokeColor: '#ea384c',
            strokeWeight: 5,
            strokeOpacity: 0.7
          }
        });
        setDirectionsRenderer(directionsRendererInstance);
        
        updateMapWithCoordinates(map, directionsRendererInstance);
          
        setMapLoaded(true);
        console.log('Map initialization complete');
      } catch (error) {
        console.error('Error initializing map:', error);
        toast.error('Error al inicializar el mapa');
      }
    };

    console.log('Starting map load process...');
    loadGoogleMapsScript();
    
    // Add global window type declaration
    window.initMap = initializeMap;
    
    return () => {
      markers.forEach(marker => marker.setMap(null));
      // Clean up global callback
      delete window.initMap;
    };
  }, [centerCoordinates, selectionMode]);

  // Declare initMap on the window object
  useEffect(() => {
    // TypeScript declaration for the window object
    declare global {
      interface Window {
        initMap: () => void;
      }
    }
  }, []);

  useEffect(() => {
    if (mapLoaded && googleMapRef.current && directionsRenderer) {
      console.log('Updating map with coordinates...');
      updateMapWithCoordinates(googleMapRef.current, directionsRenderer);
    }
  }, [startCoordinates, endCoordinates, mapLoaded]);

  const updateMapWithCoordinates = (
    map: google.maps.Map, 
    directionsRendererInstance: google.maps.DirectionsRenderer
  ) => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
    
    const start = parseCoordinates(startCoordinates);
    const end = parseCoordinates(endCoordinates);
    
    console.log('Parsed coordinates:', { start, end });
    
    if (start && end) {
      console.log('Both start and end coordinates available, calculating route...');
      calculateAndDisplayRoute(
        start, 
        end, 
        directionsRendererInstance
      );
    } 
    else {
      console.log('Only partial coordinates available, showing markers...');
      const newMarkers: google.maps.Marker[] = [];
      const bounds = new google.maps.LatLngBounds();
      
      if (start) {
        console.log('Adding start marker at:', start);
        const startMarker = new google.maps.Marker({
          position: start,
          map,
          title: 'Punto de inicio',
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
          }
        });
        newMarkers.push(startMarker);
        bounds.extend(start);
      }
      
      if (end) {
        console.log('Adding end marker at:', end);
        const endMarker = new google.maps.Marker({
          position: end,
          map,
          title: destination || 'Destino',
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
          }
        });
        newMarkers.push(endMarker);
        bounds.extend(end);
      }
      
      if (newMarkers.length > 0) {
        map.fitBounds(bounds);
        if (newMarkers.length === 1) {
          map.setZoom(15);
        }
      }
      
      setMarkers(newMarkers);
      
      directionsRendererInstance.setMap(null);
      directionsRendererInstance.setMap(map);
      directionsRendererInstance.setDirections({ routes: [] } as google.maps.DirectionsResult);
    }
  };

  const calculateAndDisplayRoute = (
    start: Coordinates,
    end: Coordinates,
    directionsRenderer: google.maps.DirectionsRenderer
  ) => {
    console.log('Calculating route between:', start, 'and', end);
    const directionsService = new google.maps.DirectionsService();
    
    directionsService.route({
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING
    }, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        console.log('Route calculation successful');
        directionsRenderer.setDirections(response);
        
        createMapLinks(end);
        
        if (response && response.routes.length > 0) {
          const route = response.routes[0];
          if (route.legs.length > 0) {
            const leg = route.legs[0];
            const speed = leg.distance.value / (leg.duration.value / 3600);
            setCurrentSpeed(Math.round(speed));
            console.log('Calculated average speed:', Math.round(speed), 'km/h');
          }
        }
      } else {
        console.error('Directions request failed:', status);
        toast.error('Error al calcular la ruta');
      }
    });
  };

  const simulateLocation = () => {
    const lat = 9.9281 + (Math.random() - 0.5) * 0.1;
    const lng = -84.0907 + (Math.random() - 0.5) * 0.1;
    const speed = Math.floor(Math.random() * 60);
    
    setCurrentSpeed(speed);
    setCurrentLocation({ lat, lng });
    
    createMapLinks({ lat, lng });

    if (googleMapRef.current && driverMode && markers.length === 0) {
      const currentMarker = new google.maps.Marker({
        position: { lat, lng },
        map: googleMapRef.current,
        title: 'Mi ubicación',
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        },
        animation: google.maps.Animation.BOUNCE
      });
      
      setMarkers([currentMarker]);
      googleMapRef.current.panTo({ lat, lng });
    }
  };

  useEffect(() => {
    if (!driverMode && !startCoordinates && !endCoordinates && !selectionMode) {
      simulateLocation();
      
      const interval = setInterval(() => {
        simulateLocation();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [driverMode, startCoordinates, endCoordinates, selectionMode]);

  const handleShareLocation = () => {
    if (!sharingLocation) {
      if (navigator.geolocation) {
        setSharingLocation(true);
        toast.success("Compartiendo ubicación en tiempo real");
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { longitude, latitude, speed } = position.coords;
            const coords = { lat: latitude, lng: longitude };
            setCurrentLocation(coords);
            setCurrentSpeed(speed ? Math.floor(speed * 3.6) : Math.floor(Math.random() * 60));
            
            createMapLinks(coords);
            
            if (googleMapRef.current) {
              markers.forEach(marker => marker.setMap(null));
              
              const currentMarker = new google.maps.Marker({
                position: coords,
                map: googleMapRef.current,
                title: 'Mi ubicación actual',
                icon: {
                  url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                },
                animation: google.maps.Animation.BOUNCE
              });
              
              setMarkers([currentMarker]);
              googleMapRef.current.panTo(coords);
              googleMapRef.current.setZoom(15);
              
              console.log(`Order ${trackingId} - Location updated: ${latitude}, ${longitude}`);
            }
          },
          (error) => {
            console.error('Error getting location:', error);
            toast.error("Error al obtener tu ubicación");
            setSharingLocation(false);
          },
          { 
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
        
        const id = navigator.geolocation.watchPosition(
          (position) => {
            const { longitude, latitude, speed } = position.coords;
            const coords = { lat: latitude, lng: longitude };
            setCurrentLocation(coords);
            setCurrentSpeed(speed ? Math.floor(speed * 3.6) : Math.floor(Math.random() * 60));
            
            createMapLinks(coords);
            
            if (googleMapRef.current) {
              markers.forEach(marker => marker.setMap(null));
              
              const currentMarker = new google.maps.Marker({
                position: coords,
                map: googleMapRef.current,
                title: 'Mi ubicación actual',
                icon: {
                  url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                },
                animation: google.maps.Animation.BOUNCE
              });
              
              setMarkers([currentMarker]);
              googleMapRef.current.panTo(coords);
              
              console.log(`Order ${trackingId} - Location updated: ${latitude}, ${longitude}`);
            }
          },
          (error) => {
            console.error('Error tracking location:', error);
            toast.error("Error al rastrear tu ubicación");
            setSharingLocation(false);
          },
          { 
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
        
        setWatchId(id);
      } else {
        toast.error("Tu navegador no soporta geolocalización");
      }
    } else {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
      }
      setSharingLocation(false);
      toast.info("Has dejado de compartir tu ubicación");
    }
  };

  const handleOpenGoogleMaps = () => {
    if (googleMapsLink) {
      window.open(googleMapsLink, '_blank');
    } else {
      toast.error("No hay información de ubicación disponible");
    }
  };

  const handleOpenWaze = () => {
    if (wazeLink) {
      window.open(wazeLink, '_blank');
    } else {
      toast.error("No hay información de ubicación disponible");
    }
  };

  const handleShareGoogleMapsLink = () => {
    if (googleMapsLink) {
      if (navigator.share) {
        navigator.share({
          title: 'Ubicación de seguimiento',
          text: `Rastreo de servicio ${trackingId}`,
          url: googleMapsLink
        })
        .then(() => toast.success("Enlace compartido"))
        .catch(err => {
          console.error('Error sharing:', err);
          navigator.clipboard.writeText(googleMapsLink)
            .then(() => toast.success("Enlace copiado al portapapeles"))
            .catch(() => toast.error("Error al copiar el enlace"));
        });
      } else {
        navigator.clipboard.writeText(googleMapsLink)
          .then(() => toast.success("Enlace copiado al portapapeles"))
          .catch(() => toast.error("Error al copiar el enlace"));
      }
    } else {
      toast.error("No hay información de ubicación disponible");
    }
  };

  return (
    <div className="relative w-full h-[400px] md:h-[600px] rounded-xl overflow-hidden border shadow-sm bg-gray-100">
      {selectionMode && (
        <div className="absolute top-4 left-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-md shadow-md border">
          <div className="flex items-center gap-2">
            <Search size={18} className="text-primary" />
            <input
              ref={inputRef}
              type="text"
              placeholder={`Buscar ${selectionMode === 'start' ? 'origen' : 'destino'} en Costa Rica...`}
              className="flex-1 border-0 bg-transparent focus:outline-none text-sm"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Busca una dirección o haz clic en el mapa para seleccionar ubicación
          </p>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ display: "block" }}
      ></div>
      
      {showDriverControls && (
        <div className="absolute top-4 left-4 right-4 px-4 py-3 bg-background/80 backdrop-blur-md rounded-lg shadow-md border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleShareLocation}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${
                  sharingLocation 
                    ? 'bg-green-500 text-white' 
                    : 'bg-primary text-primary-foreground'
                } font-medium transition-all hover:opacity-90 active:scale-[0.98]`}
              >
                <Navigation size={16} />
                <span>{sharingLocation ? 'Compartiendo ubicación' : 'Compartir mi ubicación'}</span>
              </button>
              
              {!sharingLocation && (
                <div className="flex items-center gap-1 text-xs text-amber-600">
                  <AlertTriangle size={14} />
                  <span>Necesario para rastreo</span>
                </div>
              )}
            </div>
            
            {sharingLocation && currentLocation && (
              <div className="text-sm font-medium">
                Velocidad actual: {currentSpeed} km/h
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 right-4 px-4 py-3 bg-background/80 backdrop-blur-md rounded-lg shadow-md border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">ID de rastreo</p>
            <p className="font-mono font-medium">{trackingId}</p>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Velocidad promedio</p>
            <p className="font-medium">{currentSpeed} km/h</p>
          </div>
        </div>
      </div>
      
      {googleMapsLink && !selectionMode && (
        <div className="absolute left-4 right-4 bottom-20 flex flex-wrap justify-center gap-2">
          <button
            onClick={handleOpenGoogleMaps}
            className="flex items-center justify-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md transition-all hover:bg-primary/90 text-sm"
          >
            <MapPin size={16} />
            <span>Google Maps</span>
          </button>
          
          <button
            onClick={handleOpenWaze}
            className="flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-md transition-all hover:bg-blue-600 text-sm"
          >
            <Navigation size={16} />
            <span>Waze</span>
          </button>
          
          <button
            onClick={handleShareGoogleMapsLink}
            className="flex items-center justify-center gap-2 px-3 py-1.5 bg-secondary text-foreground rounded-md transition-all hover:bg-secondary/80 text-sm"
          >
            <Share2 size={16} />
            <span>Compartir</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Map;
