import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { io } from 'socket.io-client';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useBusinessStore } from '@/stores/businessStore';
import {
  TruckIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  MagnifyingGlassIcon,
  Bars3Icon
} from '@heroicons/react/24/solid';
import { PackageIcon, LogOut } from 'lucide-react';
import moment from 'moment';
import { useAuth } from '@/hooks/useAuth';
import NewDeliveryForm from './components/Deliveries/NewDeliveryForm';
import NewDriverForm from './components/DriversManagement/NewDriverForm';
import NewVehicleForm from './components/FleetManagement/NewVehicleForm';
import PricingCalculator from '@/components/pricing/PricingCalculator';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token JWT dynamiquement à chaque requête
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token') || 
                  localStorage.getItem('authToken') || 
                  localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fix Leaflet default icon
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Driver {
  driverId: string;
  name: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
  currentLocation?: {
    lat: number;
    lng: number;
  };
  currentDelivery?: string;
  todayDeliveries: number;
  rating: number;
}

interface Delivery {
  _id: string;
  deliveryId: string;
  orderId: string;
  clientName: string;
  clientPhone: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'in-transit' | 'delivered' | 'failed';
  pickupAddress: string;
  deliveryAddress: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  assignedDriver?: string;
  estimatedTime?: string;
  distance?: number;
  scheduledDate: string;
  createdAt: string;
}

interface TMSStats {
  totalDeliveries: number;
  completedToday: number;
  inProgress: number;
  pending: number;
  failed: number;
  activeDrivers: number;
  totalDrivers: number;
  avgDeliveryTime: number;
  onTimeRate: number;
}

interface TMSProDashboardProps {
  onNavigate?: (tab: string) => void;
}

const TMSProDashboard: React.FC<TMSProDashboardProps> = ({ onNavigate }) => {
  const { logout } = useAuth();
  const { messages, professionals, marketplacePosts, fetchMarketplacePosts } = useBusinessStore();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [stats, setStats] = useState<TMSStats>({
    totalDeliveries: 0,
    completedToday: 0,
    inProgress: 0,
    pending: 0,
    failed: 0,
    activeDrivers: 0,
    totalDrivers: 0,
    avgDeliveryTime: 0,
    onTimeRate: 0
  });
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [draggedDelivery, setDraggedDelivery] = useState<Delivery | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDriverPanel, setShowDriverPanel] = useState(true);
  const [showDeliveryPanel, setShowDeliveryPanel] = useState(true);
  
  // États pour les modales de création
  const [showNewDeliveryForm, setShowNewDeliveryForm] = useState(false);
  const [showNewDriverForm, setShowNewDriverForm] = useState(false);
  const [showNewVehicleForm, setShowNewVehicleForm] = useState(false);
  const [showPricingCalculator, setShowPricingCalculator] = useState(false);
  
  const mapRef = useRef<L.Map | null>(null);

  // Initialiser WebSocket
  useEffect(() => {
    const socketInstance = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('authToken')
      }
    });

    socketInstance.on('connect', () => {
      toast.success('Tracking temps réel activé');
    });

    socketInstance.on('delivery:location', (data: { driverId: string; location: { lat: number; lng: number } }) => {
      // Mettre à jour position chauffeur
      setDrivers(prev => prev.map(d => 
        d.driverId === data.driverId
          ? { ...d, currentLocation: data.location }
          : d
      ));
    });

    socketInstance.on('delivery:status', (data: { deliveryId: string; status: string }) => {
      // Mettre à jour statut livraison
      setDeliveries(prev => prev.map(del => 
        del.deliveryId === data.deliveryId
          ? { ...del, status: data.status as Delivery['status'] }
          : del
      ));
      loadStats();
    });

    socketInstance.on('driver:status', (data: { driverId: string; status: string }) => {
      setDrivers(prev => prev.map(d => 
        d.driverId === data.driverId
          ? { ...d, status: data.status as Driver['status'] }
          : d
      ));
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Charger les données
  useEffect(() => {
    let isActive = true; // Pour éviter les updates si le composant est démonté
    
    // Chargement initial avec délai entre chaque requête pour éviter rate limiting
    const loadInitialData = async () => {
      if (!isActive) return;
      
      try {
        await loadStats();
        if (!isActive) return;
        await new Promise(resolve => setTimeout(resolve, 200)); // 200ms délai
        
        await loadDrivers();
        if (!isActive) return;
        await new Promise(resolve => setTimeout(resolve, 200));
        
        await loadDeliveries();
        if (!isActive) return;
        await new Promise(resolve => setTimeout(resolve, 200));
        
        fetchMarketplacePosts();
      } catch (error) {
        console.error('Erreur chargement initial:', error);
      }
    };

    loadInitialData();

    // Rafraîchir avec délais échelonnés (toutes les 30s)
    const interval = setInterval(() => {
      if (!isActive) return;
      
      loadStats();
      setTimeout(() => isActive && loadDrivers(), 1000);
      setTimeout(() => isActive && loadDeliveries(), 2000);
      setTimeout(() => isActive && fetchMarketplacePosts(), 3000);
    }, 30000);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chargement initial uniquement

  const loadDrivers = async () => {
    try {
      const response = await apiClient.get('/tracking/drivers/active');
      if (response.data.success) {
        setDrivers(Array.isArray(response.data.drivers) ? response.data.drivers : []);
      }
    } catch (error) {
      console.error('Erreur chargement chauffeurs:', error);
      setDrivers([]); // Fallback vers tableau vide
    }
  };

  const loadDeliveries = async () => {
    try {
      const response = await apiClient.get('/orders', {
        params: { role: 'transporteur' }
      });
      if (response.data) {
        // L'API peut retourner soit un tableau direct, soit un objet avec orders
        const deliveriesData = Array.isArray(response.data) 
          ? response.data 
          : (response.data.orders || response.data.data || []);
        setDeliveries(deliveriesData);
      }
    } catch (error) {
      console.error('Erreur chargement livraisons:', error);
      setDeliveries([]); // Fallback vers tableau vide
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiClient.get('/transporteur-tms/stats');
      console.log('📊 STATS API Response:', response.data);
      if (response.data) {
        // Adapter la structure de réponse du backend
        const data = response.data;
        const newStats = {
          totalDeliveries: data.deliveries?.total || 0,
          completedToday: data.deliveries?.completed || 0,
          inProgress: data.deliveries?.inTransit || 0,
          pending: data.deliveries?.pending || 0,
          failed: data.deliveries?.failed || 0,
          activeDrivers: data.drivers?.active || 0,
          totalDrivers: data.drivers?.total || 0,
          avgDeliveryTime: data.deliveries?.averageDeliveryTime || 0,
          onTimeRate: data.deliveries?.onTimeRate || 0
        };
        console.log('📊 STATS Transformed:', newStats);
        setStats(newStats);
      }
    } catch (error) {
      console.error('❌ Erreur chargement stats:', error);
    }
  };

  // Drag & Drop handlers
  const handleDragStart = (delivery: Delivery) => {
    setDraggedDelivery(delivery);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnDriver = async (driver: Driver) => {
    if (!draggedDelivery) return;

    try {
      const response = await apiClient.post('/transporteur-tms/assign-delivery', {
        deliveryId: draggedDelivery.deliveryId,
        driverId: driver.driverId
      });

      if (response.data.success) {
        toast.success(`✅ Livraison assignée à ${driver.name}`);
        loadDeliveries();
        loadDrivers();
        loadStats();
      }
    } catch {
      toast.error('❌ Erreur assignation');
    }

    setDraggedDelivery(null);
  };

  // Filtrer les livraisons
  const filteredDeliveries = Array.isArray(deliveries) ? deliveries.filter(del => {
    const matchesStatus = filterStatus === 'all' || del.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || del.priority === filterPriority;
    const matchesSearch = searchQuery === '' || 
      del.deliveryId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      del.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  }) : [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in-transit': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return 'Livrée';
      case 'in-transit': return 'En cours';
      case 'assigned': return 'Assignée';
      case 'pending': return 'En attente';
      case 'failed': return 'Échec';
      default: return status;
    }
  };

  const createDriverIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-driver-icon',
      html: `
        <div style="
          background-color: ${color};
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header avec Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <TruckIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TMS Pro - Dispatch Center</h1>
              <p className="text-sm text-gray-600">Gestion en temps réel des livraisons</p>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewDeliveryForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
            >
              ➕ Nouvelle Livraison
            </button>
            <button
              onClick={() => setShowNewDriverForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
            >
              👨‍✈️ Nouveau Chauffeur
            </button>
            <button
              onClick={() => setShowNewVehicleForm(true)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 font-medium"
            >
              🚗 Nouveau Véhicule
            </button>
            <div className="h-8 w-px bg-gray-300 mx-2"></div>
            <button
              onClick={() => onNavigate?.('planning')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              📅 Planning
            </button>
            <button
              onClick={() => onNavigate?.('tracking')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              🗺️ Tracking
            </button>
            <button
              onClick={() => onNavigate?.('invoicing')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              💰 Facturation
            </button>
            <button
              onClick={() => setShowPricingCalculator(true)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2 font-medium"
            >
              💵 Calculateur Tarif
            </button>
            <button
              onClick={() => onNavigate?.('analytics')}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              📊 Analytics
            </button>
            <button
              onClick={() => {
                loadDeliveries();
                loadDrivers();
                loadStats();
                toast.success('🔄 Données actualisées');
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              🔄 Actualiser
            </button>
            <div className="h-8 w-px bg-gray-300 mx-2"></div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-medium"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Stats rapides - CLIQUABLES */}
        <div className="flex items-center gap-6">
          {/* Nouveaux widgets temps réel - CLIQUABLES */}
          <button 
            onClick={() => {
              console.log('🔘 Click Messages');
              onNavigate?.('messages');
            }}
            className="text-center hover:bg-purple-50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <div className="text-2xl font-bold text-purple-600">{messages?.length || 0}</div>
            <div className="text-xs text-gray-600">💬 Messages</div>
          </button>
          <button 
            onClick={() => {
              console.log('🔘 Click Marketplace');
              onNavigate?.('marketplace');
            }}
            className="text-center hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <div className="text-2xl font-bold text-indigo-600">{marketplacePosts?.length || 0}</div>
            <div className="text-xs text-gray-600">🏪 Marketplace</div>
          </button>
          <button 
            onClick={() => {
              console.log('🔘 Click Pros');
              onNavigate?.('professionals');
            }}
            className="text-center hover:bg-teal-50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <div className="text-2xl font-bold text-teal-600">{professionals?.length || 0}</div>
            <div className="text-xs text-gray-600">👥 Pros</div>
          </button>
          <div className="h-8 w-px bg-gray-300"></div>
          {/* Stats TMS - CLIQUABLES */}
          <button 
            onClick={() => {
              console.log('🔘 Click En cours');
              onNavigate?.('deliveries');
            }}
            className="text-center hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-xs text-gray-600">En cours</div>
          </button>
          <button 
            onClick={() => {
              console.log('🔘 Click En attente');
              onNavigate?.('deliveries');
            }}
            className="text-center hover:bg-yellow-50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-xs text-gray-600">En attente</div>
          </button>
          <button 
            onClick={() => {
              console.log('🔘 Click Livrées');
              onNavigate?.('deliveries');
            }}
            className="text-center hover:bg-green-50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <div className="text-2xl font-bold text-green-600">{stats.completedToday}</div>
            <div className="text-xs text-gray-600">Livrées</div>
          </button>
          <button 
            onClick={() => {
              console.log('🔘 Click Chauffeurs');
              onNavigate?.('drivers');
            }}
            className="text-center hover:bg-purple-50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <div className="text-2xl font-bold text-purple-600">{stats.activeDrivers}/{stats.totalDrivers}</div>
            <div className="text-xs text-gray-600">Chauffeurs</div>
          </button>
          <button 
            onClick={() => {
              console.log('🔘 Click À l\'heure');
              onNavigate?.('analytics');
            }}
            className="text-center hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <div className="text-2xl font-bold text-indigo-600">{stats.onTimeRate}%</div>
            <div className="text-xs text-gray-600">À l'heure</div>
          </button>
          {stats.failed > 0 && (
            <button 
              onClick={() => {
                console.log('🔘 Click Échecs');
                onNavigate?.('deliveries');
              }}
              className="text-center hover:bg-red-50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <div className="text-xs text-gray-600">Échecs</div>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panneau Gauche - Chauffeurs */}
        {showDriverPanel && (
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900">🚚 Chauffeurs</h2>
                <button
                  onClick={() => setShowDriverPanel(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Bars3Icon className="h-5 w-5" />
                </button>
              </div>
              <div className="text-sm text-gray-600">
                {drivers.filter(d => d.status === 'available').length} disponibles
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {drivers.map(driver => (
                <div
                  key={driver.driverId}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDropOnDriver(driver)}
                  onClick={() => setSelectedDriver(driver)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                    selectedDriver?.driverId === driver.driverId
                      ? 'bg-blue-50 border-l-4 border-l-blue-600'
                      : 'hover:bg-gray-50'
                  } ${driver.status === 'available' ? 'opacity-100' : 'opacity-60'}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        driver.status === 'available' ? 'bg-green-500' :
                        driver.status === 'busy' ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`} />
                      <span className="font-medium text-gray-900">{driver.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <span className="text-sm font-medium">⭐ {driver.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4" />
                      {driver.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <TruckIcon className="h-4 w-4" />
                      {driver.todayDeliveries} livraisons aujourd'hui
                    </div>
                    {driver.currentDelivery && (
                      <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                        🚚 En livraison: {driver.currentDelivery}
                      </div>
                    )}
                  </div>

                  {driver.status === 'available' && (
                    <div className="mt-3 text-xs text-green-600 font-medium">
                      ✓ Disponible - Glissez une course ici
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Carte Centrale */}
        <div className="flex-1 relative z-0">
          <MapContainer
            center={[48.8566, 2.3522]}
            zoom={12}
            style={{ height: '100%', width: '100%', zIndex: 0 }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap'
            />

            {/* Markers Chauffeurs */}
            {drivers.map(driver => driver.currentLocation && (
              <Marker
                key={driver.driverId}
                position={[driver.currentLocation.lat, driver.currentLocation.lng]}
                icon={createDriverIcon(
                  driver.status === 'available' ? '#10b981' :
                  driver.status === 'busy' ? '#f59e0b' :
                  '#6b7280'
                )}
              >
                <Popup>
                  <div className="p-2">
                    <p className="font-bold text-gray-900">{driver.name}</p>
                    <p className="text-sm text-gray-600">{driver.phone}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Status: {driver.status === 'available' ? '✓ Disponible' : '🚚 En livraison'}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Markers Livraisons */}
            {filteredDeliveries.map(delivery => delivery.location && (
              <Marker
                key={delivery._id}
                position={[delivery.location.lat, delivery.location.lng]}
              >
                <Popup>
                  <div className="p-2">
                    <p className="font-bold text-gray-900">{delivery.clientName}</p>
                    <p className="text-sm text-gray-600">{delivery.deliveryAddress}</p>
                    <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${getStatusColor(delivery.status)}`}>
                      {getStatusLabel(delivery.status)}
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Toggle buttons */}
          {!showDriverPanel && (
            <button
              onClick={() => setShowDriverPanel(true)}
              className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-50"
            >
              <Bars3Icon className="h-5 w-5" />
              Chauffeurs
            </button>
          )}
          {!showDeliveryPanel && (
            <button
              onClick={() => setShowDeliveryPanel(true)}
              className="absolute top-4 right-4 bg-white rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-50"
            >
              <Bars3Icon className="h-5 w-5" />
              Livraisons
            </button>
          )}
        </div>

        {/* Panneau Droit - Livraisons */}
        {showDeliveryPanel && (
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900">📦 Livraisons</h2>
                <button
                  onClick={() => setShowDeliveryPanel(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Bars3Icon className="h-5 w-5" />
                </button>
              </div>

              {/* Recherche */}
              <div className="relative mb-3">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filtres */}
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">Tous statuts</option>
                  <option value="pending">En attente</option>
                  <option value="assigned">Assignées</option>
                  <option value="in-transit">En cours</option>
                  <option value="delivered">Livrées</option>
                </select>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">Toutes priorités</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">Haute</option>
                  <option value="normal">Normale</option>
                  <option value="low">Basse</option>
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredDeliveries.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <PackageIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Aucune livraison trouvée</p>
                </div>
              ) : (
                filteredDeliveries.map(delivery => (
                  <div
                    key={delivery._id}
                    draggable={delivery.status === 'pending'}
                    onDragStart={() => handleDragStart(delivery)}
                    onClick={() => setSelectedDelivery(delivery)}
                    className={`p-4 border-b border-gray-100 cursor-move transition-colors ${
                      selectedDelivery?._id === delivery._id
                        ? 'bg-blue-50 border-l-4 border-l-blue-600'
                        : 'hover:bg-gray-50'
                    } ${delivery.status === 'pending' ? 'hover:shadow-md' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="font-medium text-gray-900">#{delivery.deliveryId}</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs border ${getPriorityColor(delivery.priority)}`}>
                          {delivery.priority}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(delivery.status)}`}>
                        {getStatusLabel(delivery.status)}
                      </span>
                    </div>

                    <div className="text-sm space-y-1">
                      <div className="font-medium text-gray-900">{delivery.clientName}</div>
                      <div className="text-gray-600 flex items-start gap-2">
                        <MapPinIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{delivery.deliveryAddress}</span>
                      </div>
                      {delivery.assignedDriver && (
                        <div className="text-gray-600 flex items-center gap-2">
                          <UserIcon className="h-4 w-4" />
                          Assigné à: {drivers.find(d => d.driverId === delivery.assignedDriver)?.name || 'N/A'}
                        </div>
                      )}
                      {delivery.estimatedTime && (
                        <div className="text-gray-600 flex items-center gap-2">
                          <ClockIcon className="h-4 w-4" />
                          {moment(delivery.estimatedTime).format('HH:mm')}
                        </div>
                      )}
                    </div>

                    {delivery.status === 'pending' && (
                      <div className="mt-3 text-xs text-blue-600 font-medium">
                        🖱️ Glissez vers un chauffeur pour assigner
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modales de création */}
      {showNewDeliveryForm && (
        <NewDeliveryForm
          onClose={() => setShowNewDeliveryForm(false)}
          onSuccess={() => {
            loadDeliveries();
            loadStats();
          }}
        />
      )}
      
      {showNewDriverForm && (
        <NewDriverForm
          onClose={() => setShowNewDriverForm(false)}
          onSuccess={() => {
            loadDrivers();
            loadStats();
          }}
        />
      )}
      
      {showNewVehicleForm && (
        <NewVehicleForm
          onClose={() => setShowNewVehicleForm(false)}
          onSuccess={() => {
            toast.success('Véhicule créé! Rechargez pour voir les changements');
          }}
        />
      )}

      {/* Calculateur de tarification */}
      {showPricingCalculator && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowPricingCalculator(false)}
        >
          <div 
            className="relative max-w-7xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPricingCalculator(false)}
              className="absolute -top-4 -right-4 z-[60] bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-red-700 transition-colors shadow-2xl text-2xl font-bold border-4 border-white"
              title="Fermer"
            >
              ✕
            </button>
            <PricingCalculator />
          </div>
        </div>
      )}
    </div>
  );
};

export default TMSProDashboard;
