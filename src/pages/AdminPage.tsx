import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Shield, 
  Plus, 
  ChevronRight, 
  Clipboard, 
  Check, 
  LogOut,
  FileDown,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Phone,
  MapPin,
  Trash,
  MessageCircle,
  Users,
  User,
  Truck
} from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import AuthGuard from '@/components/AuthGuard';
import { TrackingOrder, DriverCredentials } from '@/types';
import DemoTrackingComponent from '@/components/DemoTrackingComponent';

const AdminPage = () => {
  const [orders, setOrders] = useState<TrackingOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<TrackingOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isManagingDrivers, setIsManagingDrivers] = useState(false);
  const [isShowingDemo, setIsShowingDemo] = useState(false);
  const [drivers, setDrivers] = useState<DriverCredentials[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [newOrder, setNewOrder] = useState({
    clientName: '',
    clientPhone: '',
    clientPhoneCountryCode: '+506',
    driverName: '',
    driverPhone: '',
    driverPhoneCountryCode: '+506',
    destination: '',
    endCoordinates: '',
    details: '',
    comments: ''
  });
  const [newDriver, setNewDriver] = useState({
    name: '',
    phone: '',
    countryCode: '+506',
    username: '',
    password: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const savedOrders = localStorage.getItem('trackingOrders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders) as TrackingOrder[];
      setOrders(parsedOrders);
      setFilteredOrders(parsedOrders);
    }
    
    const savedDrivers = localStorage.getItem('driverCredentials');
    if (savedDrivers) {
      const parsedDrivers = JSON.parse(savedDrivers) as DriverCredentials[];
      setDrivers(parsedDrivers);
    }
  }, []);

  useEffect(() => {
    let result = [...orders];
    
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(term) || 
        order.clientName.toLowerCase().includes(term) ||
        order.driverName.toLowerCase().includes(term) ||
        order.destination.toLowerCase().includes(term)
      );
    }
    
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminUsername');
    toast.success('Sesión cerrada correctamente');
    navigate('/login');
  };

  const generateTrackingId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createNewOrder = () => {
    const trackingId = generateTrackingId();
    
    const newOrderData: TrackingOrder = {
      id: trackingId,
      clientName: newOrder.clientName,
      clientPhone: newOrder.clientPhone,
      clientPhoneCountryCode: newOrder.clientPhoneCountryCode,
      driverName: newOrder.driverName,
      driverPhone: newOrder.driverPhone,
      driverPhoneCountryCode: newOrder.driverPhoneCountryCode,
      destination: newOrder.destination,
      endCoordinates: newOrder.endCoordinates,
      details: newOrder.details,
      comments: newOrder.comments,
      status: 'en_curso',
      createdAt: new Date().toISOString()
    };
    
    const updatedOrders = [newOrderData, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('trackingOrders', JSON.stringify(updatedOrders));
    
    setNewOrder({
      clientName: '',
      clientPhone: '',
      clientPhoneCountryCode: '+506',
      driverName: '',
      driverPhone: '',
      driverPhoneCountryCode: '+506',
      destination: '',
      endCoordinates: '',
      details: '',
      comments: ''
    });
    setIsCreatingOrder(false);
    
    toast.success(`Orden creada con éxito! ID: ${trackingId}`);
    
    return trackingId;
  };

  const createNewDriver = () => {
    if (!newDriver.name || !newDriver.phone || !newDriver.username || !newDriver.password) {
      toast.error("Por favor complete todos los campos");
      return;
    }
    
    if (drivers.some(driver => driver.username === newDriver.username)) {
      toast.error("Este nombre de usuario ya existe");
      return;
    }
    
    const newDriverData: DriverCredentials = {
      name: newDriver.name,
      phone: newDriver.phone,
      countryCode: newDriver.countryCode,
      username: newDriver.username,
      password: newDriver.password
    };
    
    const updatedDrivers = [...drivers, newDriverData];
    setDrivers(updatedDrivers);
    localStorage.setItem('driverCredentials', JSON.stringify(updatedDrivers));
    
    setNewDriver({
      name: '',
      phone: '',
      countryCode: '+506',
      username: '',
      password: ''
    });
    
    toast.success(`Conductor ${newDriver.name} creado con éxito!`);
  };

  const deleteDriver = (username: string) => {
    if (window.confirm(`¿Estás seguro de eliminar al conductor con usuario ${username}?`)) {
      const updatedDrivers = drivers.filter(driver => driver.username !== username);
      setDrivers(updatedDrivers);
      localStorage.setItem('driverCredentials', JSON.stringify(updatedDrivers));
      toast.success("Conductor eliminado correctamente");
    }
  };

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(id);
    toast.success("Copiado al portapapeles");
    
    setTimeout(() => {
      setCopied(null);
    }, 2000);
  };

  const startDemo = (id: string) => {
    setIsShowingDemo(true);
    toast.info("Iniciando demostración...");
  };

  const markAsCompleted = (id: string) => {
    const updatedOrders = orders.map(order => 
      order.id === id 
        ? { ...order, status: 'completado' as 'completado', completedAt: new Date().toISOString() } 
        : order
    );
    
    setOrders(updatedOrders);
    localStorage.setItem('trackingOrders', JSON.stringify(updatedOrders));
    toast.success(`Orden ${id} marcada como completada`);
  };

  const deleteOrder = (id: string) => {
    if (window.confirm(`¿Estás seguro de eliminar la orden ${id}?`)) {
      const updatedOrders = orders.filter(order => order.id !== id);
      setOrders(updatedOrders);
      localStorage.setItem('trackingOrders', JSON.stringify(updatedOrders));
      toast.success(`Orden ${id} eliminada correctamente`);
    }
  };

  const downloadOrdersHistory = () => {
    const headers = [
      'ID', 'Cliente', 'Teléfono Cliente', 'Código País Cliente', 'Conductor', 
      'Teléfono Conductor', 'Código País Conductor', 'Destino', 'Coordenadas Destino', 
      'Detalles', 'Comentarios', 'Estado', 'Creado', 'Completado'
    ].join(',');
    
    const rows = orders.map(order => [
      order.id,
      `"${order.clientName}"`,
      order.clientPhone,
      order.clientPhoneCountryCode || '+506',
      `"${order.driverName}"`,
      order.driverPhone,
      order.driverPhoneCountryCode || '+506',
      `"${order.destination}"`,
      `"${order.destinationCoordinates || ''}"`,
      `"${order.details.replace(/"/g, '""')}"`,
      `"${order.comments.replace(/"/g, '""')}"`,
      order.status,
      new Date(order.createdAt).toLocaleString(),
      order.completedAt ? new Date(order.completedAt).toLocaleString() : ''
    ].join(','));
    
    const csvContent = [headers, ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `historial_ordenes_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Historial descargado correctamente');
  };

  const handleWhatsApp = (countryCode: string, phone: string) => {
    const formattedCode = countryCode.replace(/\+/g, '');
    const formattedPhone = phone.replace(/\D/g, '');
    const fullPhone = formattedCode + formattedPhone;
    window.open(`https://wa.me/${fullPhone}`, '_blank');
  };

  const handleChangeNewOrder = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'driverName') {
      const selectedDriver = drivers.find(driver => driver.name === value);
      if (selectedDriver) {
        setNewOrder(prev => ({ 
          ...prev, 
          [name]: value, 
          driverPhone: selectedDriver.phone,
          driverPhoneCountryCode: selectedDriver.countryCode || '+506'
        }));
      } else {
        setNewOrder(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setNewOrder(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleChangeNewDriver = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDriver(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchLocation = () => {
    if (!newOrder.destination) {
      toast.error("Por favor ingrese una dirección de destino");
      return;
    }
    
    toast.info("Buscando coordenadas...");
    
    const isPlusCode = /^[23456789CFGHJMPQRVWX]{4,}\+[23456789CFGHJMPQRVWX]{2,}/.test(newOrder.destination);
    
    setTimeout(() => {
      const mockCoordinates: Record<string, string> = {
        'San José': '9.9281,-84.0907',
        'Alajuela': '10.0162,-84.2149',
        'Cartago': '9.8644,-83.9194',
        'Heredia': '10.0027,-84.1166',
        'Liberia': '10.6345,-85.4377',
        'Limón': '9.9911,-83.0355',
        'Puntarenas': '9.9778,-84.8282',
        'XJFG+9C3 Atenas': '9.979833,-84.379333',
        'Atenas': '9.9799,-84.3784'
      };
      
      if (isPlusCode) {
        const lat = 9.979833;
        const lng = -84.379333;
        setNewOrder(prev => ({ 
          ...prev, 
          endCoordinates: `${lat},${lng}` 
        }));
        toast.success(`Coordenadas encontradas para el Plus Code`);
        return;
      }
      
      const foundCity = Object.keys(mockCoordinates).find(
        city => newOrder.destination.toLowerCase().includes(city.toLowerCase())
      );
      
      if (foundCity) {
        setNewOrder(prev => ({ ...prev, endCoordinates: mockCoordinates[foundCity] }));
        toast.success(`Coordenadas encontradas para ${foundCity}`);
      } else {
        const lat = 9.7489 + (Math.random() - 0.5) * 1;
        const lng = -84.0000 + (Math.random() - 0.5) * 1;
        setNewOrder(prev => ({ 
          ...prev, 
          endCoordinates: `${lat.toFixed(6)},${lng.toFixed(6)}` 
        }));
        toast.success("Coordenadas aproximadas generadas");
      }
    }, 1000);
  };

  const handlePasteCoordinates = () => {
    navigator.clipboard.readText()
      .then(text => {
        if (text) {
          setNewOrder(prev => ({ ...prev, endCoordinates: text }));
          toast.success("Coordenadas pegadas del portapapeles");
        } else {
          toast.error("No hay texto en el portapapeles");
        }
      })
      .catch(() => {
        toast.error("Error al acceder al portapapeles");
      });
  };

  const countryCodes = [
    { code: '+506', country: 'Costa Rica' },
    { code: '+502', country: 'Guatemala' },
    { code: '+503', country: 'El Salvador' },
    { code: '+504', country: 'Honduras' },
    { code: '+505', country: 'Nicaragua' },
    { code: '+507', country: 'Panamá' },
    { code: '+52', country: 'México' },
    { code: '+1', country: 'Estados Unidos/Canadá' }
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        
        <main className="flex-1 container px-4 md:px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold">Panel Administrativo</h1>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  Usuario: {localStorage.getItem('adminUsername') || 'Admin'}
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
            
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => {
                  setIsCreatingOrder(!isCreatingOrder);
                  setIsManagingDrivers(false);
                  setIsShowingDemo(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isCreatingOrder 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-foreground'
                } text-sm font-medium transition-all hover:opacity-90`}
              >
                <Plus size={16} />
                <span>Nueva Orden</span>
              </button>
              
              <button
                onClick={() => {
                  setIsManagingDrivers(!isManagingDrivers);
                  setIsCreatingOrder(false);
                  setIsShowingDemo(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isManagingDrivers 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-foreground'
                } text-sm font-medium transition-all hover:opacity-90`}
              >
                <Users size={16} />
                <span>Gestionar Conductores</span>
              </button>
              
              <button
                onClick={() => {
                  setIsShowingDemo(!isShowingDemo);
                  setIsCreatingOrder(false);
                  setIsManagingDrivers(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isShowingDemo 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-foreground'
                } text-sm font-medium transition-all hover:opacity-90`}
              >
                <Truck size={16} />
                <span>Demo de Rastreo</span>
              </button>
            </div>
            
            {isCreatingOrder && (
              <div className="bg-card rounded-xl border shadow-sm p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Nueva Orden de Rastreo</h2>
                  
                  <button
                    onClick={() => setIsCreatingOrder(false)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-secondary text-sm hover:bg-secondary/80 transition-colors"
                  >
                    <XCircle size={16} />
                    <span>Cancelar</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Información del Cliente</h3>
                    
                    <div className="space-y-2">
                      <label htmlFor="clientName" className="text-sm font-medium">
                        Nombre del Cliente
                      </label>
                      <input
                        id="clientName"
                        name="clientName"
                        type="text"
                        value={newOrder.clientName}
                        onChange={handleChangeNewOrder}
                        className="w-full h-10 px-3 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="clientPhone" className="text-sm font-medium">
                        Teléfono del Cliente
                      </label>
                      <div className="flex">
                        <select
                          name="clientPhoneCountryCode"
                          value={newOrder.clientPhoneCountryCode}
                          onChange={handleChangeNewOrder}
                          className="h-10 px-2 rounded-l-md border-y border-l focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                          {countryCodes.map(country => (
                            <option key={country.code} value={country.code}>
                              {country.code} ({country.country})
                            </option>
                          ))}
                        </select>
                        <input
                          id="clientPhone"
                          name="clientPhone"
                          type="tel"
                          value={newOrder.clientPhone}
                          onChange={handleChangeNewOrder}
                          className="flex-1 h-10 px-3 rounded-r-md border focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="8888-8888"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="destination" className="text-sm font-medium">
                        Destino
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="destination"
                          name="destination"
                          type="text"
                          value={newOrder.destination}
                          onChange={handleChangeNewOrder}
                          className="flex-1 h-10 px-3 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="Ej. San José, Costa Rica o XJFG+9C3 Atenas"
                          required
                        />
                        <button
                          onClick={handleSearchLocation}
                          className="px-3 py-1 bg-secondary rounded-md hover:bg-secondary/80 transition-colors"
                          type="button"
                        >
                          <Search size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Use direcciones, ciudades o códigos Plus (XJFG+9C3) de Google Maps
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="endCoordinates" className="text-sm font-medium">
                        Coordenadas de Destino
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="endCoordinates"
                          name="endCoordinates"
                          type="text"
                          value={newOrder.endCoordinates}
                          onChange={handleChangeNewOrder}
                          className="flex-1 h-10 px-3 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="9.9281,-84.0907"
                        />
                        <button
                          onClick={handlePasteCoordinates}
                          className="px-3 py-1 whitespace-nowrap text-sm bg-secondary rounded-md hover:bg-secondary/80 transition-colors"
                          type="button"
                        >
                          Pegar
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Las coordenadas pueden ser pegadas desde WhatsApp u otras aplicaciones
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Información del Conductor</h3>
                    
                    <div className="space-y-2">
                      <label htmlFor="driverName" className="text-sm font-medium">
                        Nombre del Conductor
                      </label>
                      <select
                        id="driverName"
                        name="driverName"
                        value={newOrder.driverName}
                        onChange={handleChangeNewOrder}
                        className="w-full h-10 px-3 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="">Seleccionar conductor</option>
                        {drivers.map((driver) => (
                          <option 
                            key={driver.username} 
                            value={driver.name}
                          >
                            {driver.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="driverPhone" className="text-sm font-medium">
                        Teléfono del Conductor
                      </label>
                      <div className="flex">
                        <select
                          name="driverPhoneCountryCode"
                          value={newOrder.driverPhoneCountryCode}
                          onChange={handleChangeNewOrder}
                          className="h-10 px-2 rounded-l-md border-y border-l focus:ring-2 focus:ring-primary focus:border-primary"
                          disabled={!!newOrder.driverName}
                        >
                          {countryCodes.map(country => (
                            <option key={country.code} value={country.code}>
                              {country.code} ({country.country})
                            </option>
                          ))}
                        </select>
                        <input
                          id="driverPhone"
                          name="driverPhone"
                          type="tel"
                          value={newOrder.driverPhone}
                          onChange={handleChangeNewOrder}
                          className="flex-1 h-10 px-3 rounded-r-md border focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="8888-8888"
                          readOnly={!!newOrder.driverName}
                          required
                        />
                      </div>
                      {newOrder.driverName && (
                        <p className="text-xs text-muted-foreground">
                          Teléfono auto-completado del conductor seleccionado
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="details" className="text-sm font-medium">
                        Detalles de la Entrega
                      </label>
                      <input
                        id="details"
                        name="details"
                        type="text"
                        value={newOrder.details}
                        onChange={handleChangeNewOrder}
                        className="w-full h-10 px-3 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <label htmlFor="comments" className="text-sm font-medium">
                      Comentarios Adicionales
                    </label>
                    <textarea
                      id="comments"
                      name="comments"
                      value={newOrder.comments}
                      onChange={handleChangeNewOrder}
                      className="w-full h-24 px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={createNewOrder}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 active:scale-[0.98]"
                  >
                    <Plus size={16} />
                    <span>Crear Orden</span>
                  </button>
                </div>
              </div>
            )}
            
            {isManagingDrivers && (
              <div className="bg-card rounded-xl border shadow-sm p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Gestión de Conductores</h2>
                  
                  <button
                    onClick={() => setIsManagingDrivers(false)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-secondary text-sm hover:bg-secondary/80 transition-colors"
                  >
                    <XCircle size={16} />
                    <span>Cerrar</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-medium mb-4">Registrar Nuevo Conductor</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="driverFormName" className="text-sm font-medium">
                          Nombre Completo
                        </label>
                        <input
                          id="driverFormName"
                          name="name"
                          type="text"
                          value={newDriver.name}
                          onChange={handleChangeNewDriver}
                          className="w-full h-10 px-3 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="driverFormPhone" className="text-sm font-medium">
                          Teléfono
                        </label>
                        <div className="flex">
                          <select
                            name="countryCode"
                            value={newDriver.countryCode}
                            onChange={handleChangeNewDriver}
                            className="h-10 px-2 rounded-l-md border-y border-l focus:ring-2 focus:ring-primary focus:border-primary"
                          >
                            {countryCodes.map(country => (
                              <option key={country.code} value={country.code}>
                                {country.code} ({country.country})
                              </option>
                            ))}
                          </select>
                          <input
                            id="driverFormPhone"
                            name="phone"
                            type="tel"
                            value={newDriver.phone}
                            onChange={handleChangeNewDriver}
                            className="flex-1 h-10 px-3 rounded-r-md border focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="8888-8888"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="driverFormUsername" className="text-sm font-medium">
                          Nombre de Usuario
                        </label>
                        <input
                          id="driverFormUsername"
                          name="username"
                          type="text"
                          value={newDriver.username}
                          onChange={handleChangeNewDriver}
                          className="w-full h-10 px-3 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="driverFormPassword" className="text-sm font-medium">
                          Contraseña
                        </label>
                        <input
                          id="driverFormPassword"
                          name="password"
                          type="password"
                          value={newDriver.password}
                          onChange={handleChangeNewDriver}
                          className="w-full h-10 px-3 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                      
                      <button
                        onClick={createNewDriver}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 active:scale-[0.98]"
                      >
                        <Plus size={16} />
                        <span>Registrar Conductor</span>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4">Conductores Registrados</h3>
                    
                    {drivers.length > 0 ? (
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-secondary/30 text-left">
                              <th className="px-4 py-3 text-sm font-medium">Nombre</th>
                              <th className="px-4 py-3 text-sm font-medium">Teléfono</th>
                              <th className="px-4 py-3 text-sm font-medium">Usuario</th>
                              <th className="px-4 py-3 text-sm font-medium">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {drivers.map((driver) => (
                              <tr key={driver.username} className="hover:bg-secondary/10">
                                <td className="px-4 py-3 text-sm">{driver.name}</td>
                                <td className="px-4 py-3 text-sm">{driver.countryCode || '+506'} {driver.phone}</td>
                                <td className="px-4 py-3 text-sm">{driver.username}</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleWhatsApp(driver.countryCode || '+506', driver.phone)}
                                      className="p-1.5 rounded-md hover:bg-secondary transition-colors text-primary"
                                      aria-label="Enviar WhatsApp"
                                    >
                                      <MessageCircle size={16} />
                                    </button>
                                    <button
                                      onClick={() => deleteDriver(driver.username)}
                                      className="p-1.5 rounded-md hover:bg-secondary transition-colors text-red-500"
                                      aria-label="Eliminar conductor"
                                    >
                                      <Trash size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground border rounded-lg">
                        <p>No hay conductores registrados</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {isShowingDemo && (
              <DemoTrackingComponent />
            )}
            
            {!isCreatingOrder && !isManagingDrivers && !isShowingDemo && (
              <div className="bg-card rounded-xl border shadow-sm p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Gestión de Órdenes</h2>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsCreatingOrder(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 active:scale-[0.98]"
                    >
                      <Plus size={16} />
                      <span>Nueva Orden</span>
                    </button>
                    
                    <button
                      onClick={downloadOrdersHistory}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-sm font-medium transition-all hover:bg-secondary/90 active:scale-[0.98]"
                    >
                      <FileDown size={16} />
                      <span>Descargar Historial</span>
                    </button>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">
                  Administre las órdenes de servicio y supervise el estado de cada entrega.
                </p>
              </div>
            )}
            
            {!isCreatingOrder && !isManagingDrivers && !isShowingDemo && (
              <div className="bg-card rounded-xl border shadow-sm p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Historial de Órdenes</h2>
                </div>
                
                <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Buscar por ID, cliente, conductor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full h-10 pl-9 pr-3 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Filtrar por:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="h-10 px-3 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="all">Todos</option>
                      <option value="en_curso">En Curso</option>
                      <option value="completado">Completados</option>
                      <option value="cancelado">Cancelados</option>
                    </select>
                  </div>
                </div>
                
                {filteredOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-secondary/30 text-left">
                          <th className="px-4 py-3 text-sm font-medium">ID</th>
                          <th className="px-4 py-3 text-sm font-medium">Cliente</th>
                          <th className="px-4 py-3 text-sm font-medium">Conductor</th>
                          <th className="px-4 py-3 text-sm font-medium">Destino</th>
                          <th className="px-4 py-3 text-sm font-medium">Estado</th>
                          <th className="px-4 py-3 text-sm font-medium">Fecha</th>
                          <th className="px-4 py-3 text-sm font-medium">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-secondary/10">
                            <td className="px-4 py-3 font-mono text-sm">{order.id}</td>
                            <td className="px-4 py-3 text-sm">{order.clientName}</td>
                            <td className="px-4 py-3 text-sm">{order.driverName}</td>
                            <td className="px-4 py-3 text-sm max-w-[200px] truncate">{order.destination}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.status === 'en_curso' 
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                  : order.status === 'completado' 
                                  ? 'bg-green-100 text-green-800 border border-green-200'
                                  : 'bg-red-100 text-red-800 border border-red-200'
                              }`}>
                                {order.status === 'en_curso' 
                                  ? 'En Curso' 
                                  : order.status === 'completado' 
                                  ? 'Completado'
                                  : 'Cancelado'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm whitespace-nowrap">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => copyToClipboard(order.id)}
                                  className="p-1.5 rounded-md hover:bg-secondary transition-colors"
                                  aria-label="Copiar al portapapeles"
                                >
                                  {copied === order.id ? <Check size={16} className="text-green-500" /> : <Clipboard size={16} />}
                                </button>
                                
                                {order.status === 'en_curso' && (
                                  <>
                                    <button
                                      onClick={() => markAsCompleted(order.id)}
                                      className="p-1.5 rounded-md hover:bg-secondary transition-colors text-green-600"
                                      aria-label="Marcar como completado"
                                    >
                                      <CheckCircle size={16} />
                                    </button>
                                    
                                    <button
                                      onClick={() => handleWhatsApp(order.clientPhone)}
                                      className="p-1.5 rounded-md hover:bg-secondary transition-colors text-primary"
                                      aria-label="Enviar WhatsApp"
                                    >
                                      <MessageCircle size={16} />
                                    </button>
                                    
                                    <button
                                      onClick={() => startDemo(order.id)}
                                      className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-xs font-medium hover:bg-secondary/80 transition-colors"
                                    >
                                      Demo
                                      <ChevronRight size={14} />
                                    </button>
                                  </>
                                )}
                                
                                <button
                                  onClick={() => deleteOrder(order.id)}
                                  className="p-1.5 rounded-md hover:bg-secondary transition-colors text-red-500"
                                  aria-label="Eliminar orden"
                                >
                                  <Trash size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No hay órdenes que coincidan con los filtros.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </main>
        
        <AppFooter />
      </div>
    </AuthGuard>
  );
};

export default AdminPage;
