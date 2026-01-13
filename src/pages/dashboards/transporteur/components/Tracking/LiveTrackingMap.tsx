import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  MapPinIcon,
  TruckIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  XCircleIcon
} from '@heroicons/react/24/solid';
import moment from 'moment';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token dynamiquement
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token') || 
                localStorage.getItem('authToken') || 
                localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface DriverLocation {
  driverId: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  speed?: number;
  heading?: number;
  status: string;
  currentDelivery?: {
    deliveryId: string;
    clientName: string;
    destination: string;
    eta: Date;
  };
}

interface DeliveryTracking {
  deliveryId: string;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  destination: {
    street: string;
    city: string;
    lat?: number;
    lng?: number;
  };
  status: string;
  eta?: Date | undefined;
  driver?: {
    name: string;
    phone: string;
  };
  trackingHistory: Array<{
    location: {
      lat: number;
      lng: number;
    };
    timestamp: Date;
    speed?: number;
  }>;
}

const LiveTrackingMap: React.FC = () => {
  const [activeDrivers, setActiveDrivers] = useState<DriverLocation[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<DriverLocation | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryTracking | null>(null);
  const [center] = useState<[number, number]>([48.8566, 2.3522]); // Paris par défaut
  const [zoom] = useState(12);
  const [, setSocket] = useState<Socket | null>(null);

  // Fonction normale pour charger les chauffeurs actifs
  const loadActiveDrivers = async () => {
    try {
      const response = await apiClient.get('/tracking/drivers/active');
      if (response.data.success) {
        setActiveDrivers(response.data.drivers);
      }
    } catch (error) {
      // Silencieux - erreur non critique
      console.error('[Tracking] Erreur chargement chauffeurs:', error);
    }
  };

  // Initialiser WebSocket
  useEffect(() => {
    const socketInstance = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000', {
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('token')
      }
    });

    socketInstance.on('connect', () => {
      toast.success('Tracking temps réel activé');
    });

    socketInstance.on('driver:online', () => {
      loadActiveDrivers();
    });

    socketInstance.on('driver:offline', (data: { driverId: string }) => {
      setActiveDrivers(prev => prev.filter(d => d.driverId !== data.driverId));
    });

    socketInstance.on('delivery:location', (data: {
      deliveryId: string;
      driverId: string;
      location: { lat: number; lng: number };
      speed?: number;
      heading?: number;
      eta?: Record<string, unknown>;
      timestamp: Date;
    }) => {
      // Mettre à jour la position du chauffeur
      setActiveDrivers(prev => prev.map(driver => 
        driver.driverId === data.driverId
          ? {
              ...driver,
              location: data.location,
              speed: data.speed,
              heading: data.heading
            }
          : driver
      ));

      // Si c'est la livraison sélectionnée, mettre à jour
      if (selectedDelivery?.deliveryId === data.deliveryId) {
        setSelectedDelivery(prev => prev ? {
          ...prev,
          currentLocation: data.location,
          eta: data.eta?.estimatedArrival ? new Date(data.eta.estimatedArrival as string | number) : undefined
        } : null);
      }
    });

    socketInstance.on('delivery:started', () => {
      toast.success('Livraison démarrée');
    });

    socketInstance.on('delivery:arrived', () => {
      toast.success('Chauffeur arrivé à destination');
    });

    socketInstance.on('delivery:completed', () => {
      toast.success('Livraison complétée');
      loadActiveDrivers();
    });

    socketInstance.on('disconnect', () => {
      toast.error('Tracking déconnecté');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // selectedDelivery est accédé dans le closure, pas une vraie dépendance

  // Charger les chauffeurs au montage et périodiquement
  useEffect(() => {
    loadActiveDrivers();
    const interval = setInterval(loadActiveDrivers, 30000);
    return () => clearInterval(interval);
  }, []); // Pas de dépendances

  const handleDriverClick = (driver: DriverLocation) => {
    setSelectedDriver(driver);
  };

  const createTruckIcon = (color = '#3b82f6') => {
    return L.divIcon({
      className: 'custom-truck-icon',
      html: `
        <div style="
          background-color: ${color};
          border: 3px solid white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="24" height="24">
            <path d="M18 18.5a1.5 1.5 0 01-1.5-1.5 1.5 1.5 0 011.5-1.5 1.5 1.5 0 011.5 1.5 1.5 1.5 0 01-1.5 1.5m1.5-9l1.96 2.5H17V9.5M6 18.5A1.5 1.5 0 014.5 17 1.5 1.5 0 016 15.5 1.5 1.5 0 017.5 17 1.5 1.5 0 016 18.5M20 8h-3V4H3c-1.11 0-2 .89-2 2v11h2a3 3 0 003 3 3 3 0 003-3h6a3 3 0 003 3 3 3 0 003-3h2v-5l-3-4z"/>
          </svg>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Sidebar avec liste des chauffeurs */}
      <div className="lg:w-80 bg-white rounded-xl shadow-sm p-6 overflow-y-auto" style={{ maxHeight: '800px' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <TruckIcon className="h-5 w-5 mr-2 text-blue-600" />
            Chauffeurs actifs
          </h3>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            {activeDrivers.length} en ligne
          </span>
        </div>

        <div className="space-y-3">
          {activeDrivers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <TruckIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Aucun chauffeur en ligne</p>
            </div>
          ) : (
            activeDrivers.map((driver) => (
              <button
                key={driver.driverId}
                onClick={() => handleDriverClick(driver)}
                className={`w-full text-left border rounded-lg p-4 transition ${
                  selectedDriver?.driverId === driver.driverId
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <p className="font-semibold text-gray-900">{driver.name}</p>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      {driver.speed !== undefined && (
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span>{driver.speed} km/h</span>
                        </div>
                      )}
                      
                      {driver.currentDelivery && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Livraison en cours:</p>
                          <p className="font-medium text-gray-900 text-xs">
                            {driver.currentDelivery.clientName}
                          </p>
                          <p className="text-xs text-gray-600">
                            ETA: {moment(driver.currentDelivery.eta).format('HH:mm')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    driver.status === 'on_delivery' 
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {driver.status === 'on_delivery' ? 'En cours' : 'Disponible'}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Carte */}
      <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', minHeight: '600px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Markers des chauffeurs */}
          {activeDrivers.map((driver) => (
            <Marker
              key={driver.driverId}
              position={[driver.location.lat, driver.location.lng]}
              icon={createTruckIcon(
                driver.status === 'on_delivery' ? '#3b82f6' : '#10b981'
              )}
            >
              <Popup>
                <div className="p-2">
                  <p className="font-bold text-gray-900 mb-2">{driver.name}</p>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">
                      Statut: <span className="font-medium">
                        {driver.status === 'on_delivery' ? 'En livraison' : 'Disponible'}
                      </span>
                    </p>
                    {driver.speed !== undefined && (
                      <p className="text-gray-600">
                        Vitesse: <span className="font-medium">{driver.speed} km/h</span>
                      </p>
                    )}
                    {driver.currentDelivery && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-xs text-gray-500">Livraison:</p>
                        <p className="font-medium">{driver.currentDelivery.clientName}</p>
                        <p className="text-xs text-gray-600">
                          {driver.currentDelivery.destination}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Livraison sélectionnée */}
          {selectedDelivery && (
            <>
              {/* Position actuelle */}
              {selectedDelivery.currentLocation && (
                <Marker
                  position={[
                    selectedDelivery.currentLocation.lat,
                    selectedDelivery.currentLocation.lng
                  ]}
                  icon={createTruckIcon('#ef4444')}
                >
                  <Popup>
                    <div className="p-2">
                      <p className="font-bold text-gray-900 mb-2">Position actuelle</p>
                      {selectedDelivery.eta && (
                        <p className="text-sm text-gray-600">
                          ETA: {moment(selectedDelivery.eta).format('HH:mm')}
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Destination */}
              {selectedDelivery.destination.lat && selectedDelivery.destination.lng && (
                <Marker
                  position={[
                    selectedDelivery.destination.lat,
                    selectedDelivery.destination.lng
                  ]}
                >
                  <Popup>
                    <div className="p-2">
                      <p className="font-bold text-gray-900 mb-2">Destination</p>
                      <p className="text-sm text-gray-600">
                        {selectedDelivery.destination.street}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedDelivery.destination.city}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Historique du trajet */}
              {selectedDelivery.trackingHistory.length > 1 && (
                <Polyline
                  positions={selectedDelivery.trackingHistory.map(h => [
                    h.location.lat,
                    h.location.lng
                  ])}
                  pathOptions={{
                    color: '#3b82f6',
                    weight: 3,
                    opacity: 0.7
                  }}
                />
              )}
            </>
          )}
        </MapContainer>
      </div>

      {/* Info panel livraison sélectionnée */}
      {selectedDelivery && (
        <div className="lg:w-80 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Détails livraison</h3>
            <button
              onClick={() => setSelectedDelivery(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Statut</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedDelivery.status === 'delivered'
                  ? 'bg-green-100 text-green-800'
                  : selectedDelivery.status === 'in_transit'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {selectedDelivery.status === 'delivered' ? 'Livré' :
                 selectedDelivery.status === 'in_transit' ? 'En cours' :
                 selectedDelivery.status === 'arrived' ? 'Arrivé' : 'En attente'}
              </span>
            </div>

            {selectedDelivery.driver && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Chauffeur</p>
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <p className="font-medium text-gray-900">{selectedDelivery.driver.name}</p>
                </div>
                {selectedDelivery.driver.phone && (
                  <div className="flex items-center space-x-2 mt-1">
                    <PhoneIcon className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-600">{selectedDelivery.driver.phone}</p>
                  </div>
                )}
              </div>
            )}

            {selectedDelivery.eta && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Arrivée estimée</p>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5 text-blue-600" />
                  <p className="font-bold text-blue-600 text-lg">
                    {moment(selectedDelivery.eta).format('HH:mm')}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  dans {moment(selectedDelivery.eta).fromNow(true)}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500 mb-1">Destination</p>
              <div className="flex items-start space-x-2">
                <MapPinIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedDelivery.destination.street}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedDelivery.destination.city}
                  </p>
                </div>
              </div>
            </div>

            {selectedDelivery.trackingHistory.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Historique (dernières positions)</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedDelivery.trackingHistory.slice(-5).reverse().map((point, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-gray-600">
                        {moment(point.timestamp).format('HH:mm:ss')}
                      </span>
                      {point.speed !== undefined && (
                        <span className="text-gray-500">
                          {point.speed} km/h
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTrackingMap;
